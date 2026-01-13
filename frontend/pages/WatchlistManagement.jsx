import * as React from 'react';
import { useState, useEffect } from 'react';
import { Rocket, ShoppingCart, TestTube, Cpu, Trash2, Eye, History, Loader2, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const WatchlistManagement = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWatchlist();
    }, []);

    const loadWatchlist = async () => {
        try {
            const data = await api.getWatchlist();
            setWatchlist(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (startupId) => {
        if (!confirm('Remove from watchlist?')) return;
        try {
            await api.removeFromWatchlist(startupId);
            setWatchlist(prev => prev.filter(i => i.startup_id !== startupId));
        } catch (error) {
            console.error(error);
            alert('Failed to remove');
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white font-['Plus Jakarta Sans']">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="animate-spin text-blue-600" size={60} strokeWidth={3} />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] animate-pulse">Syncing Active Watchlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 font-['Plus Jakarta Sans']">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Watchlist</h1>
                    <p className="text-slate-500 mt-1 text-base">Track high-potential ventures for future investment.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Watched</span>
                        <span className="text-2xl font-bold text-slate-900 leading-none">{watchlist.length}</span>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <Eye size={20} />
                    </div>
                </div>
            </div>

            {watchlist.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Eye size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Your watchlist is empty</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Browse the feed to find and track startups that match your investment thesis.
                    </p>
                    <Link to="/browse" className="inline-block mt-8 px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-sm">
                        Browse Startups
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {watchlist.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
                        >
                            <div className="h-32 bg-slate-900 relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-slate-900"></div>
                                <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-slate-900 text-xl shadow-lg">
                                    {(item.startup_name || 'S').charAt(0)}
                                </div>
                                <button
                                    onClick={() => handleRemove(item.startup_id)}
                                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-rose-500/90 rounded-lg text-white transition-all backdrop-blur-sm"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{item.startup_name}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">{item.stage}</span>
                                    <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg border border-slate-100">{item.industry}</span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-medium text-slate-500">Added on</p>
                                        <p className="text-sm font-semibold text-slate-700">{new Date(item.added_at).toLocaleDateString()}</p>
                                    </div>
                                    <Link
                                        to={`/pitch/${item.startup_id || item.id}`}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-900 hover:text-white transition-all"
                                    >
                                        View Details
                                        <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WatchlistManagement;

