import * as React from 'react';
import { Search, ChevronRight, MessageCircle, MoreVertical, Star, XCircle, Loader2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const InReview = () => {
    const [startups, setStartups] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const dummyStartups = [
        { id: 'd1', name: 'BioLife Systems', stage: 'Series A', description: 'Next-gen CRISPR therapeutics.', logo: 'B', reviewStatus: 'Diligence', reviewProgress: 85 },
        { id: 'd2', name: 'EcoCharge AI', stage: 'Seed', description: 'AI-driven energy management.', logo: 'E', reviewStatus: 'Screening', reviewProgress: 40 }
    ];

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [me, pitches] = await Promise.all([
                api.getMe(),
                api.getPitchFeed(null, null, '', 'under_review')
            ]);

            const mapped = pitches.map(p => ({
                id: p.id,
                name: p.company_name,
                stage: p.stage,
                description: p.description,
                logo: (p.company_name || 'S').charAt(0),
                reviewStatus: 'Screening',
                reviewProgress: p.match_score || 60
            }));

            // Use dummy data if empty
            setStartups(mapped.length > 0 ? mapped : dummyStartups);
        } catch (e) {
            console.error(e);
            setStartups(dummyStartups);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white font-['Plus Jakarta Sans']">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="animate-spin text-blue-600" size={60} strokeWidth={3} />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] animate-pulse">Syncing Active Pipelines...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 font-['Plus Jakarta Sans']">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Due Diligence</h1>
                    <p className="text-slate-500 mt-1 text-base">Manage startups currently under review and screening.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
                    <Star size={16} className="text-blue-500" />
                    Export Report
                </button>
            </div>

            {/* Pipeline Aggregates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Under Review', value: startups.length.toString(), color: 'blue', desc: 'Active diligence cycles' },
                    { label: 'Awaiting Info', value: '2', color: 'orange', desc: 'Pending founder response' },
                    { label: 'Avg. Time', value: '8.4d', color: 'indigo', desc: 'Average decision time' }
                ].map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full group pb-8">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{card.value}</p>
                        </div>
                        <p className="text-xs font-medium text-slate-400 mt-4">{card.desc}</p>
                    </div>
                ))}
            </div>

            {/* Pipeline Table Module */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4">
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search pipeline..."
                            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button className="px-6 py-1.5 text-xs font-bold bg-white text-slate-900 rounded-lg shadow-sm transition-all">Active</button>
                        <button className="px-6 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 rounded-lg transition-all">Archive</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Startup</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {startups.map((startup) => (
                                <tr key={startup.id} className="hover:bg-slate-50 transition-all duration-200">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-600 text-lg">
                                                {startup.logo}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-slate-900 text-base">{startup.name}</h3>
                                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md border border-blue-100">{startup.stage}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-xs">{startup.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-48 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-blue-600">{startup.reviewProgress}% Complete</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${startup.reviewProgress}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            <span className="text-xs font-semibold text-slate-700">{startup.reviewStatus}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link to={`/pitch/${startup.id}`} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all shadow-sm">
                                                Review
                                            </Link>
                                            <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><XCircle size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InReview;

