import * as React from 'react';
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ShareModal from '../components/ShareModal';
import CommentsSection from '../components/CommentsSection';
import DataRoom from '../components/DataRoom';
import { api } from '../services/api';
import {
    ArrowLeft,
    Share2,
    Download,
    Maximize2,
    LayoutGrid,
    MessageSquare,
    Send,
    DownloadCloud,
    FileText,
    Table,
    CheckCircle2,
    Calendar,
    ChevronRight,
    Search,
    Bookmark,
    Star,
    X,
    TrendingUp
} from 'lucide-react';

const PitchDeckView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const startupName = location.state?.startupName || 'Startup';

    const [pitch, setPitch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewingUrl, setViewingUrl] = useState(null);

    const handleDecision = async (decision) => {
        try {
            await api.recordDecision(id, decision);
            alert(`Marked as ${decision}`);
            // Refresh pitch status locally
            setPitch(prev => ({ ...prev, status: decision === 'In Review' ? 'under_review' : prev.status }));
        } catch (error) {
            console.error('Decision failed:', error);
            alert('Failed to record decision');
        }
    };

    const handleAddToWatchlist = async () => {
        try {
            if (!pitch?.startup_id) return;
            await api.addToWatchlist(pitch.startup_id);
            alert("Added to watchlist!");
        } catch (e) {
            console.error(e);
            alert("Failed to add to watchlist");
        }
    };

    React.useEffect(() => {
        const fetchPitchData = async () => {
            try {
                // Use the dedicated getPitch by ID endpoint
                const found = await api.getPitch(id);

                // Check if user has uploaded a deck via Log Investment
                let investmentDeckUrl = null;
                try {
                    const myInvestments = await api.getInvestments();
                    const matchingInv = myInvestments.find(inv =>
                        inv.startup_name?.toLowerCase() === found.company_name?.toLowerCase()
                    );
                    if (matchingInv && matchingInv.document_url) {
                        investmentDeckUrl = matchingInv.document_url;
                    }
                } catch (err) {
                    console.warn("Could not check investment deck", err);
                }

                if (found) {
                    setPitch(found);

                    // Use investment deck if official one is missing or dummy
                    let urlToUse = found.pitch_file_url;
                    if (!urlToUse || urlToUse.includes('dummy')) {
                        if (investmentDeckUrl) urlToUse = investmentDeckUrl;
                    }

                    if (urlToUse) {
                        let fullUrl = urlToUse;
                        if (!urlToUse.startsWith('http')) {
                            // Assume backend is on port 8000 for local dev if URL is relative
                            // Adjust this logic if your deployed env is different
                            const backendHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                                ? 'http://localhost:8000'
                                : ''; // In prod, relative URL usually works if served from same domain

                            fullUrl = `${backendHost}${urlToUse.startsWith('/') ? '' : '/'}${urlToUse}`;
                        }

                        const ext = fullUrl.split('.').pop().toLowerCase();
                        if (['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'].includes(ext)) {
                            setViewingUrl(`https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`);
                        } else {
                            setViewingUrl(fullUrl);
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchPitchData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center font-['Plus Jakarta Sans']">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-200 font-bold animate-pulse">Loading Pitch Deck...</p>
            </div>
        </div>
    );

    if (!pitch) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Plus Jakarta Sans']">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-200">
                    <Search className="text-slate-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Pitch Not Found</h2>
                <p className="text-slate-500">The pitch you are looking for does not exist or has been removed.</p>
                <button
                    onClick={() => navigate('/browse')}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                >
                    Back to Browse
                </button>
            </div>
        </div>
    );

    const pitchData = {
        name: pitch?.company_name || startupName,
        fullName: pitch?.title || `${startupName} Pitch Deck`,
        round: pitch?.stage || 'Series A',
        updateTime: pitch?.created_at ? new Date(pitch.created_at).toLocaleDateString() : 'Recently updated',
        version: 'v1.0',
        matchScore: pitch?.match_score ? `${pitch.match_score}%` : '95%',
        location: pitch?.location || 'Remote',
        sector: pitch?.industry || 'Technology',
        description: pitch?.description || 'Revolutionary technology.',
        tags: pitch?.tags ? pitch.tags.split(',') : ['Innovative', 'Scalable'],
        ask: {
            raising: pitch?.raising_amount || '$1,000,000',
            valuationCap: pitch?.valuation || 'TBD',
            runway: '18 Months',
            committed: '20%'
        },
        dataRoom: [], // In real app would fetch separately
        comments: []
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus Jakarta Sans']">
            {/* Main Content Area */}
            <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">

                {/* Header Actions */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                            <ArrowLeft size={20} className="text-slate-600" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-slate-900 leading-tight">{pitchData.fullName}</h1>
                                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md border border-blue-100">
                                    {pitchData.round}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mt-1">
                                Last updated: {pitchData.updateTime} • Version {pitchData.version}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsShareModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                        >
                            <Share2 size={16} />
                            Share
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-sm">
                            <Download size={16} />
                            Download Deck
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Viewer & Comments */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Deck Viewer */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="aspect-[16/9] bg-slate-100 relative border-b border-slate-200">
                                {viewingUrl ? (
                                    <iframe
                                        src={viewingUrl}
                                        className="w-full h-full border-none"
                                        title="Pitch Deck Viewer"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                                        <div className="space-y-4 max-w-md">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm">
                                                <FileText className="text-slate-400" size={24} />
                                            </div>
                                            <h2 className="text-xl font-bold text-slate-900">
                                                {pitchData.name} Presentation
                                            </h2>
                                            <p className="text-slate-500 text-sm">
                                                The founder hasn't uploaded the pitch deck yet.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Viewer Controls */}
                            <div className="px-6 py-3 bg-white flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Presentation Mode</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-50"><Maximize2 size={18} /></button>
                                </div>
                            </div>
                        </div>

                        {/* Real Comments Section */}
                        <CommentsSection pitchId={id} />
                    </div>

                    {/* Right Column: Info Panel */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Company Summary */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center font-bold text-white text-2xl shadow-sm">
                                    {(pitchData.name || 'S').charAt(0)}
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                                    <TrendingUp size={14} className="text-emerald-600" />
                                    <span className="text-xs font-bold">{pitchData.matchScore} Match</span>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-1">{pitchData.name}</h2>
                                <p className="text-sm font-medium text-slate-500">{pitchData.location} • {pitchData.sector}</p>
                            </div>

                            <p className="text-sm text-slate-600 leading-relaxed">
                                {pitchData.description}
                            </p>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {pitchData.tags.map(tag => (
                                    <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg border border-slate-100">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 mt-4">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleDecision('In Review')}
                                        className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm flex items-center justify-center gap-2"
                                    >
                                        <Star size={16} className="text-amber-500" />
                                        Review
                                    </button>
                                    <button
                                        onClick={() => handleAddToWatchlist()}
                                        className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition-all text-sm flex items-center justify-center gap-2"
                                    >
                                        <Bookmark size={16} />
                                        Watchlist
                                    </button>
                                </div>
                                <button
                                    onClick={() => navigate(`/schedule-meeting/${id}`)}
                                    className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all text-sm"
                                >
                                    Schedule Deep Dive
                                </button>
                            </div>
                        </div>

                        {/* The Ask */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Financial Summary</h4>
                            </div>
                            <div className="p-6 space-y-4">
                                {Object.entries(pitchData.ask).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-500 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1')}
                                        </span>
                                        <span className={`text-sm font-bold ${key === 'committed' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Real Data Room */}
                        <DataRoom pitchId={id} isOwner={false} />

                    </div>
                </div>
                {/* Share Modal */}
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    startupName={pitchData.name}
                />
            </div>
        </div>
    );
};

export default PitchDeckView;

