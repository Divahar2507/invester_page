import * as React from 'react';
import { useState, useEffect } from 'react';
import { Rocket, ShoppingCart, TestTube, Cpu, Trash2, Eye, History, Loader2, Zap } from 'lucide-react';
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
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-1">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Watchlist Management</h1>
                <p className="text-slate-500 text-lg">Track promising startups and manage your potential investments.</p>
            </div>

            <div className="flex items-center gap-3 py-4">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-slate-900">Active Watchlist</h2>
                <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{watchlist.length} Startups</span>
            </div>

            <div className="space-y-4">
                {watchlist.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
                    >
                        <div className="flex items-center gap-6 flex-1">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50`}>
                                <Rocket size={24} className="text-blue-600" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.startup_name}</h3>
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase">
                                        {item.stage}
                                    </span>
                                    <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase">
                                        {item.industry}
                                    </span>
                                </div>
                            </div>

                            <div className="px-12">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Added On</p>
                                <p className="text-sm font-bold text-slate-600">
                                    {new Date(item.added_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
                                <History size={18} />
                                Log Interaction
                            </button>
                            {/* Link to PitchDeckView using startup_id? Or does pitch match ID? 
                                Typically Pitchview uses PitchID. We stored StartupID in watchlist.
                                We might need to fetch PitchID or just link to profile.
                                For now, I'll link to /pitch/deck/{startup_id} if routing allows, or assume we can navigate.
                                The existing mock routed to `/pitch/${item.id}`.
                                I'll route to `/pitch/${item.startup_id}` assuming we handle it later or modify routing to look up pitch by startup.
                                Checking routes, PitchDeckView uses :id. Is that Pitch ID or Startup ID?
                                In Pitch.py, get_pitch(id) gets by Pitch.id.
                                Watchlist stores StartupID. Startup has many pitches?
                                Ideally Watchlist should store PitchID if it tracks a pitch, or StartupID if validation.
                                The User Requirement "Add this startup to watchlist" implies Startup.
                                But viewing pitch deck requires pitch ID.
                                For now, I will use startup_id as placeholder link, but real app might need logic to find 'active' pitch.
                            */}
                            <button className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" onClick={() => handleRemove(item.startup_id)}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {watchlist.length === 0 && (
                <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                        <Rocket size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Your watchlist is empty</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm leading-relaxed">
                        Start exploring pitches and add startups to your watchlist to track their progress.
                    </p>
                    <Link to="/browse-pitches" className="inline-block mt-6 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                        Browse Pitches
                    </Link>
                </div>
            )}
        </div>
    );
};



export default WatchlistManagement;
