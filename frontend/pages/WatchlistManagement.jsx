import * as React from 'react';
import { Rocket, ShoppingCart, TestTube, Cpu, Trash2, Eye, History, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const WatchlistManagement = () => {
    const watchlistData = [
        {
            id: 1,
            name: 'AeroTech Solutions',
            stage: 'Series B',
            matchScore: '92%',
            icon: <Rocket size={24} className="text-indigo-600" />,
            iconBg: 'bg-indigo-50',
            color: 'indigo'
        },
        {
            id: 2,
            name: 'MarketX',
            stage: 'Seed',
            matchScore: '88%',
            icon: <ShoppingCart size={24} className="text-orange-600" />,
            iconBg: 'bg-orange-50',
            color: 'orange'
        },
        {
            id: 3,
            name: 'BioGen Labs',
            stage: 'Pre-Seed',
            matchScore: '75%',
            icon: <TestTube size={24} className="text-emerald-600" />,
            iconBg: 'bg-emerald-50',
            color: 'emerald'
        },
        {
            id: 4,
            name: 'SynthAI',
            stage: 'Seed',
            matchScore: '85%',
            icon: <Cpu size={24} className="text-purple-600" />,
            iconBg: 'bg-purple-50',
            color: 'purple'
        }
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-1">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Watchlist Management</h1>
                <p className="text-slate-500 text-lg">Track promising startups and manage your potential investments.</p>
            </div>

            <div className="flex items-center gap-3 py-4">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-slate-900">Active Watchlist</h2>
                <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{watchlistData.length} Startups</span>
            </div>

            <div className="space-y-4">
                {watchlistData.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
                    >
                        <div className="flex items-center gap-6 flex-1">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                                {item.icon}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.name}</h3>
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase">
                                        {item.stage}
                                    </span>
                                </div>
                            </div>

                            <div className="px-12">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Match Score</p>
                                <p className={`text-lg font-bold ${parseInt(item.matchScore) > 85 ? 'text-emerald-500' : 'text-slate-600'}`}>
                                    {item.matchScore}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
                                <History size={18} />
                                Log Interaction
                            </button>
                            <Link to={`/pitch/${item.id}`} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                                <Eye size={18} />
                                View Deck
                            </Link>
                            <button className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {watchlistData.length === 0 && (
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
