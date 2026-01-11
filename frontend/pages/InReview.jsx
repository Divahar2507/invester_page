import * as React from 'react';
import { Search, ChevronRight, MessageCircle, MoreVertical, Star, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const InReview = () => {
    const [startups, setStartups] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [me, pitches, connections] = await Promise.all([
                api.getMe(),
                api.getPitchFeed(),
                api.getMyConnections()
            ]);

            // Filter pitches that are in my connections
            const myPartnerIds = new Set();
            connections.forEach(c => {
                // Identify partner
                const partnerId = c.requester_id === me.id ? c.receiver_id : c.requester_id;
                myPartnerIds.add(partnerId);
            });

            const connectedPitches = pitches.filter(p => myPartnerIds.has(p.startup_user_id));

            // Map to view model
            const mapped = connectedPitches.map(p => ({
                id: p.id,
                name: p.company_name,
                stage: p.stage,
                description: p.description,
                logo: (p.company_name || 'S').charAt(0),
                reviewStatus: 'Screening', // Default status for connected deals
                reviewProgress: p.match_score || 60
            }));

            setStartups(mapped);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
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
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">In Review Pitches</h1>
                    <p className="text-slate-500 mt-1">Manage active deal flow and track diligence progress.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm">
                    Download Pipeline Report
                </button>
            </div>

            {/* Pipeline Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Reviews', value: startups.length.toString(), color: 'blue' },
                    { label: 'Waiting on Founder', value: Math.floor(startups.length / 3).toString(), color: 'orange' },
                    { label: 'Avg. Review Time', value: '5 days', color: 'purple' }
                ].map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{card.label}</p>
                            <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-full bg-${card.color}-50 flex items-center justify-center text-${card.color}-600`}>
                            <Star size={20} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, founder..."
                            className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">All</button>
                        <button className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">Screening</button>
                        <button className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">Diligence</button>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {startups.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            No deals currently in review. Connect with startups to add them here.
                        </div>
                    ) : (
                        startups.map((startup) => (
                            <div key={startup.id} className="p-6 flex items-center gap-6 hover:bg-slate-50/50 transition-colors">
                                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-600 text-xl">
                                    {startup.logo}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-900">{startup.name}</h3>
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">{startup.stage}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 line-clamp-2">{startup.description}</p>
                                </div>

                                <div className="w-64 space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                                        <span className="text-slate-400">Status: {startup.reviewStatus}</span>
                                        <span className="text-blue-600">{startup.reviewProgress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${startup.reviewProgress}%` }}></div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                        <MessageCircle size={12} />
                                        <span className="truncate">"Initial screening in progress..."</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link to={`/pitch/${startup.id}`} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-sm whitespace-nowrap">
                                        {startup.reviewProgress > 80 ? 'Finalize Decision' : 'Continue Review'}
                                    </Link>
                                    <div className="flex gap-1">
                                        {/* <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><Star size={18} /></button> */}
                                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><XCircle size={18} /></button>
                                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><MoreVertical size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        )))}
                </div>
            </div>
        </div>
    );
};

export default InReview;
