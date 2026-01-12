import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, ChevronDown, Star, X, TrendingUp, Sparkles, Loader2, FileText, MessageCircle, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { aiService } from '../services/aiService';
import CommentsSection from '../components/CommentsSection';
import MeetingScheduler from '../components/MeetingScheduler';
import DataRoom from '../components/DataRoom';

const BrowsePitches = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid');
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyzingId, setAnalyzingId] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [filters, setFilters] = useState({ industry: 'All', stage: 'All' });
    const [searchQuery, setSearchQuery] = useState("");

    // Selected Pitch for Modal
    const [selectedPitch, setSelectedPitch] = useState(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPitches();
        }, 500); // 500ms debounce for search
        return () => clearTimeout(timeoutId);
    }, [filters, searchQuery]);

    const fetchPitches = async () => {
        try {
            setLoading(true);
            // Pass searchQuery to backend
            const data = await api.getPitchFeed(filters.industry, filters.stage, searchQuery);

            const mappedStartups = data.map((pitch) => ({
                id: pitch.id.toString(),
                userId: pitch.startup_user_id,
                startupId: pitch.startup_id,
                name: pitch.company_name || 'Unknown Company',
                sector: pitch.industry || 'Unknown',
                stage: pitch.stage || 'Seed',
                location: pitch.location || 'Remote',
                matchScore: pitch.match_score || 70,
                description: pitch.description || 'No description provided.',
                fundingAsk: pitch.raising_amount || 'N/A',
                valuation: pitch.valuation || 'TBD',
                tags: [pitch.industry, pitch.stage].filter(Boolean),
                logo: (pitch.company_name || 'S').charAt(0),
                status: pitch.status,
                connectionStatus: pitch.connection_status || 'not_connected'
            }));

            setStartups(mappedStartups);
        } catch (err) {
            console.error('Failed to fetch pitches:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddToWatchlist = async (startupId) => {
        try {
            await api.addToWatchlist(startupId);
            alert("Added to watchlist!");
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
        }
    };

    const handleDecision = async (pitchId, decision) => {
        try {
            await api.recordDecision(pitchId, decision);
            alert(`Marked as ${decision}`);

            // If In Review, update local state status
            if (decision === 'In Review') {
                setStartups(prev => prev.map(s => s.id === pitchId ? { ...s, status: 'under_review' } : s));
            }
        } catch (error) {
            console.error('Decision failed:', error);
            alert('Failed to record decision');
        }
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

    // -- Modal Content for Pitch Details --
    const renderPitchModal = () => {
        if (!selectedPitch) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl relative animate-in fade-in zoom-in duration-300 my-8">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10 rounded-t-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white text-2xl uppercase shadow-md">
                                {selectedPitch.logo}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedPitch.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-md uppercase tracking-wide">{selectedPitch.sector}</span>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-md uppercase tracking-wide">{selectedPitch.stage}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedPitch(null)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content Scrollable */}
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 max-h-[80vh] overflow-y-auto">

                        {/* Left Column: Pitch Info & Data Room */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Summary */}
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">About the Startup</h3>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {selectedPitch.description}
                                </p>
                            </section>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Funding Ask</p>
                                    <p className="text-xl font-bold text-gray-900">{selectedPitch.fundingAsk}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Valuation</p>
                                    <p className="text-xl font-bold text-gray-900">{selectedPitch.valuation}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Match Score</p>
                                    <p className="text-xl font-bold text-blue-600">{selectedPitch.matchScore}%</p>
                                </div>
                            </div>

                            {/* Actions Toolbar */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => handleDecision(selectedPitch.id, 'In Review')}
                                    className="flex-1 py-3 bg-yellow-100 text-yellow-800 rounded-xl font-bold hover:bg-yellow-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Star size={18} />
                                    Mark In Review
                                </button>
                                <button
                                    onClick={() => handleDecision(selectedPitch.id, 'Invest')}
                                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <TrendingUp size={18} />
                                    Express Interest
                                </button>
                                <button
                                    onClick={() => handleDecision(selectedPitch.id, 'Decline')}
                                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Decline
                                </button>
                            </div>

                            {/* Data Room */}
                            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-gray-50">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <FileText className="text-blue-600" size={20} />
                                        Data Room (Pitch Deck & Docs)
                                    </h3>
                                </div>
                                <div className="p-0">
                                    <DataRoom pitchId={selectedPitch.id} />
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Social & Meeting */}
                        <div className="space-y-6">
                            {/* Meeting Scheduler */}
                            <section>
                                <MeetingScheduler
                                    startupId={selectedPitch.userId}
                                    startupName={selectedPitch.name}
                                    pitchId={selectedPitch.id}
                                />
                            </section>

                            {/* Comments */}
                            <section>
                                <CommentsSection pitchId={selectedPitch.id} />
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Browse Pitches</h1>
                    <p className="text-slate-500 mt-2 text-lg">Discover high-potential startups matched to your thesis.</p>
                </div>
                {/* View Toggles could go here */}
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

            {/* Main Detail Modal */}
            {renderPitchModal()}

            {/* Filters & Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4 sticky top-4 z-20">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search by company, industry, or tags..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
                    <select
                        className="bg-transparent font-semibold text-slate-600 focus:outline-none cursor-pointer"
                        onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                    >
                        <option value="All">All Industries</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Education">Education</option>
                    </select>
                </div>
            </div>

            {/* Pitches Grid */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                </div>
            ) : startups.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No pitches found</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {startups.map((startup, idx) => (
                        <div
                            key={`${startup.id}-${idx}`}
                            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                            onClick={() => setSelectedPitch(startup)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white text-xl uppercase shadow-md group-hover:scale-110 transition-transform">
                                        {startup.logo}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{startup.name}</h3>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{startup.sector}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                                        <TrendingUp size={14} />
                                        <span>{startup.matchScore}%</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3 h-20">
                                {startup.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {startup.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-500 text-xs font-semibold rounded-lg">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 mb-4">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Funding Ask</p>
                                    <p className="text-sm font-bold text-slate-900">{startup.fundingAsk}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Stage</p>
                                    <p className="text-sm font-bold text-slate-900">{startup.stage}</p>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg">
                                View Full Pitch Deck
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowsePitches;
