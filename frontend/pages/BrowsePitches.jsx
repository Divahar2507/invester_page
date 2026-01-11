
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, ChevronDown, Star, X, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { aiService } from '../services/aiService';

const BrowsePitches = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid');
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyzingId, setAnalyzingId] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [filters, setFilters] = useState({ industry: 'All', stage: 'All' });

    useEffect(() => {
        fetchPitches();
    }, [filters]);

    const fetchPitches = async () => {
        try {
            setLoading(true);
            const data = await api.getPitchFeed(filters.industry, filters.stage);

            // Map backend response to frontend Startup type
            const mappedStartups = data.map((pitch) => ({
                id: pitch.id.toString(),
                userId: pitch.startup_user_id,
                startupId: pitch.startup_id, // Added for Watchlist
                name: pitch.company_name || 'Unknown Company',
                sector: pitch.industry || 'Unknown',
                stage: pitch.stage || 'Seed',
                location: 'Remote', // Placeholder
                matchScore: pitch.match_score || 70,
                description: pitch.description || 'No description provided.',
                fundingAsk: pitch.raising_amount || 'N/A',
                valuation: pitch.valuation || 'TBD', // Backend might need to add this field
                tags: [pitch.industry, pitch.stage].filter(Boolean),
                logo: (pitch.company_name || 'S').charAt(0),
                status: pitch.status === 'funded' ? 'On Track' : 'New'
            }));

            setStartups(mappedStartups);

            // Fetch connection statuses
            const startupsWithStatus = await Promise.all(mappedStartups.map(async (s) => {
                try {
                    const statusData = await api.checkConnectionStatus(s.userId);
                    return { ...s, connectionStatus: statusData.status };
                } catch (e) {
                    return { ...s, connectionStatus: 'not_connected' };
                }
            }));
            setStartups(startupsWithStatus);

        } catch (err) {
            console.error('Failed to fetch pitches:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToWatchlist = async (startupId) => {
        try {
            const res = await api.addToWatchlist(startupId);
            if (res.message) alert(res.message);
        } catch (e) {
            console.error(e);
            alert("Failed to add to watchlist");
        }
    };

    const handleConnect = async (startup) => {
        try {
            await api.sendConnectionRequest(startup.userId);
            setStartups(prev => prev.map(s => s.id === startup.id ? { ...s, connectionStatus: 'pending' } : s));
        } catch (e) {
            console.error('Connection request failed:', e);
            // alert("Failed to send request"); // Optional
        }
    };

    const handleMessage = (startup) => {
        navigate('/messages', { state: { conversationStart: startup.name } });
    };

    const runAnalysis = async (startup) => {
        setAnalyzingId(startup.id);
        try {
            const result = await aiService.analyzeStartup(startup);
            setAnalysisResult({ id: startup.id, text: result });
        } catch (e) {
            console.error(e);
        } finally {
            setAnalyzingId(null);
        }
    };

    if (loading && startups.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">New Pitches to Review</h1>
                <p className="text-slate-500 mt-1">Discover high-potential startups matched to your investment criteria.</p>
            </div>

            {/* Analysis Modal Overlay */}
            {analysisResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
                            <div className="flex items-center gap-3 text-indigo-600">
                                <Sparkles size={24} />
                                <h2 className="text-xl font-bold">AI Strategic Analysis</h2>
                            </div>
                            <button onClick={() => setAnalysisResult(null)} className="p-2 hover:bg-white rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-8 max-h-[60vh] overflow-y-auto">
                            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm">{analysisResult.text}</p>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button onClick={() => setAnalysisResult(null)} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Close Deep Dive</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search startups..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 shadow-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>
            </div>

            {/* Pitches Grid */}
            {startups.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">No pitches found matching your criteria.</p>
                </div>
            ) : (
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {startups.map((startup, idx) => (
                        <div key={`${startup.id}-${idx}`} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col">
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white text-lg uppercase">
                                            {startup.logo}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">{startup.name}</h3>
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{startup.sector}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleAddToWatchlist(startup.startupId); }}
                                            className="p-1 text-slate-300 hover:text-yellow-400 transition-colors"
                                            title="Add to Watchlist"
                                        >
                                            <Star size={20} />
                                        </button>
                                        <div className="flex items-center gap-1 text-blue-600 font-bold">
                                            <TrendingUp size={16} />
                                            <span>{startup.matchScore}%</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                                    {startup.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {startup.tags.map(tag => (
                                        <span key={tag} className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-500 text-xs font-semibold rounded-lg">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Funding Ask</p>
                                        <p className="text-sm font-bold text-slate-900">{startup.fundingAsk}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Valuation</p>
                                        <p className="text-sm font-bold text-slate-900">{startup.valuation}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Connection & Actions Area */}
                            <div className="px-4 pb-4 flex flex-col gap-3">
                                {/* Connection Status Button */}
                                {startup.connectionStatus === 'accepted' ? (
                                    <button onClick={() => handleMessage(startup)} className="w-full py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-200 transition-colors flex items-center justify-center gap-2">
                                        {/* <MessageCircle size={16} /> */}
                                        Message
                                    </button>
                                ) : startup.connectionStatus === 'pending' ? (
                                    <button disabled className="w-full py-2 bg-slate-100 text-slate-400 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                                        {/* <Clock size={16} /> */}
                                        Request Sent
                                    </button>
                                ) : (
                                    <button onClick={() => handleConnect(startup)} className="w-full py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                                        {/* <UserPlus size={16} /> */}
                                        Connect
                                    </button>
                                )}

                                <div className="flex gap-2">
                                    <Link to={`/pitch/${startup.id}`} state={{ startupName: startup.name }} className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors text-center">
                                        Pitch Deck
                                    </Link>
                                    <button
                                        onClick={() => runAnalysis(startup)}
                                        disabled={analyzingId === startup.id}
                                        className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {analyzingId === startup.id ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                        Deep Dive
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export default BrowsePitches;
