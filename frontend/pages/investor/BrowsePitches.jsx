import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, ChevronDown, Star, X, TrendingUp, Sparkles, Loader2, FileText, MessageCircle, Calendar, Bookmark, Zap, MapPin, ChevronRight, Eye } from 'lucide-react';
import { api } from '../../services/api';
import { aiService } from '../../services/aiService';
import CommentsSection from '../../components/CommentsSection';
import MeetingScheduler from '../../components/MeetingScheduler';
import DataRoom from '../../components/DataRoom';

const BrowsePitches = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid');
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyzingId, setAnalyzingId] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [filters, setFilters] = useState({ industry: 'All', stage: 'All' });
    const [sortBy, setSortBy] = useState("newest");
    const [searchQuery, setSearchQuery] = useState("");

    // Selected Pitch for Modal
    const [selectedPitch, setSelectedPitch] = useState(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPitches();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [filters, searchQuery, sortBy]);

    const fetchPitches = async () => {
        try {
            setLoading(true);
            const data = await api.getPitchFeed(filters.industry, filters.stage, searchQuery, 'active', sortBy);

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
                tags: [pitch.industry, pitch.stage, ...(pitch.tags ? pitch.tags.split(',') : [])].filter(Boolean),
                logo: (pitch.company_name || 'S').charAt(0),
                status: pitch.status,
                connectionStatus: pitch.connection_status || 'not_connected'
            }));
            setStartups(mappedStartups);
        } catch (err) {
            console.error('Failed to fetch pitches:', err);
            setStartups([]);
        } finally {
            setLoading(false);
        }
    };

    // Search Handler
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddToWatchlist = async (startupId) => {
        if (!startupId || startupId.toString().startsWith('d')) {
            alert("This is a demo startup. Real watchlist functionality is available for live pitches.");
            return;
        }
        try {
            await api.addToWatchlist(startupId);
            alert("Added to watchlist!");
        } catch (e) {
            console.error(e);
            alert("Failed to add to watchlist");
        }
    };

    const handleDecision = async (pitchId, decision) => {
        if (!pitchId || pitchId.toString().startsWith('d')) {
            alert("This is a demo pitch. In Review and Decline actions are available for live pitches.");
            return;
        }
        try {
            await api.recordDecision(pitchId, decision);
            alert(`Marked as ${decision}`);
            if (decision === 'In Review') {
                // Remove from local feed if we are only viewing active ones
                setStartups(prev => prev.filter(s => s.id !== pitchId));
                setSelectedPitch(null);
                navigate('/in-review');
            }
        } catch (error) {
            console.error('Decision failed:', error);
            if (error.message && error.message.includes('403')) {
                alert('Permission Denied: Only Investors can perform this action.');
            } else {
                alert('Failed to record decision. Please try again.');
            }
        }
    };

    // -- Modal Content for Pitch Details --
    const renderPitchModal = () => {
        if (!selectedPitch) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 font-['Plus Jakarta Sans']">
                <div className="bg-white rounded-xl w-[98vw] h-[98vh] max-w-none shadow-2xl relative overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-2xl shadow-md">
                                {selectedPitch.logo}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{selectedPitch.name}</h2>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">{selectedPitch.sector}</span>
                                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100">{selectedPitch.stage}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedPitch(null)}
                            className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Content Scrollable */}
                    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* Left Column: Pitch Info & Data Room */}
                            <div className="lg:col-span-8 space-y-8">
                                {/* Summary */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">About the Startup</h3>
                                    <p className="text-slate-600 leading-relaxed text-lg font-medium">
                                        "{selectedPitch.description}"
                                    </p>
                                </div>

                                {/* Key Metrics */}
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Funding Ask</p>
                                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{selectedPitch.fundingAsk}</p>
                                    </div>
                                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Valuation</p>
                                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{selectedPitch.valuation}</p>
                                    </div>
                                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Match Score</p>
                                        <p className="text-2xl font-bold text-blue-600 tracking-tight text-emerald-600">{selectedPitch.matchScore}%</p>
                                    </div>
                                </div>

                                {/* Actions Toolbar */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleDecision(selectedPitch.id, 'In Review')}
                                        className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <Star size={16} className="text-amber-500" />
                                        Mark In Review
                                    </button>
                                    <button
                                        onClick={() => handleAddToWatchlist(selectedPitch.startupId || selectedPitch.id)}
                                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <Bookmark size={16} />
                                        Add to Watchlist
                                    </button>
                                    <button
                                        onClick={() => handleDecision(selectedPitch.id, 'Decline')}
                                        className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
                                    >
                                        Decline
                                    </button>
                                </div>

                                <button
                                    onClick={() => navigate('/messages', { state: { conversationStart: selectedPitch.name } })}
                                    className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={16} className="text-blue-500" />
                                    Message Founder
                                </button>

                                {/* Data Room */}
                                <DataRoom pitchId={selectedPitch.id} />
                            </div>

                            {/* Right Column: Social & Meeting */}
                            <div className="lg:col-span-4 space-y-6">
                                <MeetingScheduler
                                    startupId={selectedPitch.userId}
                                    startupName={selectedPitch.name}
                                    pitchId={selectedPitch.id}
                                />
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    <CommentsSection pitchId={selectedPitch.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 bg-white min-h-screen font-['Plus Jakarta Sans'] animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Browse Pitches</h1>
                    <p className="text-slate-500 mt-1 text-base">Discover high-potential startups matching your investment criteria.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}><Grid size={20} /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}><List size={20} /></button>
                </div>
            </div>

            {/* Main Detail Modal */}
            {renderPitchModal()}

            {/* Filters & Search Module */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-4 sticky top-4 z-30">
                <div className="relative w-full lg:max-w-lg">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by name, industry, or technology..."
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto ml-auto">
                    <select
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2.5 cursor-pointer"
                        onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                        value={filters.industry}
                    >
                        <option value="All">All Sectors</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Clean Technology">CleanTech</option>
                    </select>
                    <select
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2.5 cursor-pointer"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="funding_high">Funding: High to Low</option>
                        <option value="funding_low">Funding: Low to High</option>
                    </select>
                </div>
            </div>

            {/* Pitches Module */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p className="text-sm font-medium text-slate-500">Loading pitches...</p>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                    {startups.map((startup, idx) => (
                        <div
                            key={`${startup.id}-${idx}`}
                            className={`bg-white rounded-2xl border border-slate-200 flex flex-col group hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer duration-300 overflow-hidden ${viewMode === 'list' ? 'flex-row items-center p-4' : 'p-0'}`}
                            onClick={() => setSelectedPitch(startup)}
                        >
                            {viewMode === 'grid' && (
                                <div className="h-40 bg-slate-900 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-slate-900"></div>
                                    <div className="absolute top-5 left-5 w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-slate-900 text-xl shadow-lg">
                                        {startup.logo}
                                    </div>
                                    <div className="absolute top-5 right-5 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm">
                                        {startup.matchScore}% Match
                                    </div>
                                </div>
                            )}

                            <div className={`p-6 ${viewMode === 'list' ? 'flex-1 py-0' : ''}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{startup.name}</h3>
                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{startup.stage}</span>
                                </div>

                                <p className="text-slate-600 text-sm font-medium mb-4 leading-relaxed line-clamp-2">
                                    {startup.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {startup.tags?.slice(0, 3).map(tag => (
                                        <span key={tag} className="px-2.5 py-1 bg-slate-50 text-xs font-medium text-slate-500 rounded-lg border border-slate-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                    <div>
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Ask</p>
                                        <p className="text-sm font-bold text-slate-900">{startup.fundingAsk}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Location</p>
                                        <p className="text-sm font-medium text-slate-700 flex items-center justify-end gap-1">
                                            <MapPin size={14} className="text-slate-400" /> {startup.location}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {viewMode === 'grid' && (
                                <div className="p-4 pt-0 mt-auto flex gap-2">
                                    <button
                                        className="flex-1 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-900 hover:text-white transition-all"
                                        onClick={(e) => { e.stopPropagation(); setSelectedPitch(startup); }}
                                    >
                                        View Details
                                    </button>
                                    <button
                                        className="w-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                                        title="Save to Watchlist"
                                        onClick={(e) => { e.stopPropagation(); handleAddToWatchlist(startup.startupId || startup.id); }}
                                    >
                                        <Bookmark size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowsePitches;

