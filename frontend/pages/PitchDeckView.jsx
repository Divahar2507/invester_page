import * as React from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShareModal from '../components/ShareModal';
import {
    ArrowLeft,
    Share2,
    Download,
    Maximize2,
    LayoutGrid,
    MessageSquare,
    Send,
    Bookmark,
    DownloadCloud,
    FileText,
    Table,
    CheckCircle2,
    Calendar,
    ChevronRight,
    Search
} from 'lucide-react';

const PitchDeckView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const pitchData = {
        name: 'EcoCharge',
        fullName: 'EcoCharge Pitch Deck',
        round: 'Series A',
        updateTime: 'Updated 2 days ago',
        version: 'v2.4',
        matchScore: '95%',
        location: 'San Francisco, CA',
        sector: 'CleanTech',
        description: 'Revolutionary solid-state battery technology increasing EV range by 40% with sustainable materials.',
        tags: ['B2B', 'Hardware', 'Manufacturing'],
        ask: {
            raising: '$5,000,000',
            valuationCap: '$25M',
            runway: '18 Months',
            committed: '$2.1M (42%)'
        },
        dataRoom: [
            { name: 'Financial Model.pdf', size: '2.4 MB', date: 'Added Oct 20', type: 'pdf' },
            { name: 'Cap Table.xlsx', size: '1.1 MB', date: 'Added Oct 18', type: 'excel' }
        ],
        comments: [
            {
                id: 1,
                author: 'John Doe',
                initials: 'JD',
                role: 'Lead Investor',
                time: '2h ago',
                content: 'Can we get more granularity on the unit economics here? The 40% margin assumption seems optimistic compared to current lithium-ion benchmarks.',
                avatarBg: 'bg-purple-100 text-purple-600'
            },
            {
                id: 2,
                author: 'Mike Evans',
                initials: 'ME',
                role: 'Analyst',
                time: '45m ago',
                content: 'Agreed. Also, does this timeline account for the new factory setup in Nevada?',
                avatarBg: 'bg-blue-100 text-blue-600'
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Main Content Area */}
            <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">

                {/* Header Actions */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-slate-600" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-slate-900 leading-tight">{pitchData.fullName}</h1>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tabular-nums">
                                    {pitchData.round}
                                </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5 tracking-tight">
                                {pitchData.updateTime} • {pitchData.version}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsShareModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
                        >
                            <Share2 size={18} />
                            Share
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                            <Download size={18} />
                            Download PDF
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Viewer & Comments */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Deck Viewer */}
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                            <div className="aspect-[16/9] bg-gradient-to-br from-slate-900 to-slate-800 relative flex items-center justify-center overflow-hidden">
                                {/* Slide Content Mockup */}
                                <div className="text-center space-y-6 max-w-2xl px-8 relative z-10">
                                    <h2 className="text-5xl font-black text-white tracking-tight leading-tight">
                                        Revolutionizing Energy Storage
                                    </h2>
                                    <p className="text-xl text-slate-300 font-medium">
                                        EcoCharge's solid-state technology delivers 40% more range, 3x faster charging, and 100% recyclability.
                                    </p>
                                </div>
                                <div className="absolute top-6 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-white border border-white/20">
                                    EC
                                </div>
                                {/* Mesh Gradient Overlay */}
                                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_35%,rgba(59,130,246,0.5)_0%,transparent_50%)]"></div>
                            </div>

                            {/* Viewer Controls */}
                            <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slide 4 of 15</span>
                                    <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="w-[26%] h-full bg-blue-600 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><LayoutGrid size={20} /></button>
                                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Maximize2 size={20} /></button>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden">
                            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3 text-slate-900">
                                    <MessageSquare size={18} className="text-blue-600" />
                                    <h3 className="font-bold">Comments on Slide 4</h3>
                                </div>
                                <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">2 Unresolved</span>
                            </div>

                            <div className="p-8 space-y-8">
                                {pitchData.comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${comment.avatarBg}`}>
                                            {comment.initials}
                                        </div>
                                        <div className="flex-1 space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-900">{comment.author}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{comment.role}</span>
                                                <span className="text-[10px] text-slate-300 ml-auto">{comment.time}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Add a comment on this slide..."
                                        className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info Panel */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Company Summary */}
                        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-lg shadow-slate-200/50 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xl">
                                    EC
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                                    <CheckCircle2 size={12} className="fill-emerald-600 text-white" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{pitchData.matchScore} Match</span>
                                </div>
                            </div>

                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{pitchData.name}</h1>
                                <p className="text-sm font-semibold text-slate-400 mt-1">{pitchData.location} • {pitchData.sector}</p>
                            </div>

                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                {pitchData.description}
                            </p>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {pitchData.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-lg uppercase border border-slate-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => navigate(`/schedule-meeting/${id}`)}
                                    className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 text-sm"
                                >
                                    Schedule Meeting
                                </button>
                                <button className="p-3.5 border border-slate-200 rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors">
                                    <Bookmark size={20} />
                                </button>
                            </div>
                        </div>

                        {/* The Ask */}
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden">
                            <div className="px-8 py-4 border-b border-slate-100 bg-slate-50/30">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">The Ask</h4>
                            </div>
                            <div className="p-8 space-y-6">
                                {Object.entries(pitchData.ask).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-400 uppercase tracking-tight capitalize">
                                            {key.replace(/([A-Z])/g, ' $1')}
                                        </span>
                                        <span className={`text-sm font-black ${key === 'committed' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Data Room */}
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden">
                            <div className="px-8 py-4 border-b border-slate-100 bg-slate-50/30">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Room</h4>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {pitchData.dataRoom.map((file, idx) => (
                                    <div key={idx} className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                                        <div className={`p-2.5 rounded-xl ${file.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                            {file.type === 'pdf' ? <FileText size={20} /> : <Table size={20} />}
                                        </div>
                                        <div className="flex-1 space-y-0.5">
                                            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{file.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{file.size} • {file.date}</p>
                                        </div>
                                        <DownloadCloud size={18} className="text-slate-300 group-hover:text-slate-500 transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                startupName={pitchData.name}
            />
        </div>
    );
};

export default PitchDeckView;
