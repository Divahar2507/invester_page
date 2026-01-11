import * as React from 'react';
import { DollarSign, Briefcase, Activity, TrendingUp, Search, Bell, Download, Plus, Sparkles, Loader2, Filter, MoreHorizontal, ChevronRight, Settings } from 'lucide-react';
import StatCard from '../components/StatCard';
import { api } from '../services/api';
import { aiService } from '../services/aiService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [startups, setStartups] = React.useState([]);
    const [investments, setInvestments] = React.useState([]);
    const [watchlist, setWatchlist] = React.useState([]);
    const [user, setUser] = React.useState(null);
    const [insight, setInsight] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [loadingInsight, setLoadingInsight] = React.useState(false);

    React.useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [userData, pitchesData, investmentsData, watchlistData] = await Promise.all([
                api.getMe(),
                api.getPitchFeed(),
                api.getInvestments(),
                api.getWatchlist()
            ]);

            setUser(userData);
            setWatchlist(watchlistData);

            const mappedStartups = pitchesData.map((pitch) => ({
                id: pitch.id.toString(),
                name: pitch.company_name || 'Unknown',
                sector: pitch.industry || 'Unknown',
                stage: pitch.stage || 'Seed',
                location: 'Remote',
                matchScore: pitch.match_score || 0,
                description: pitch.description || '',
                fundingAsk: pitch.raising_amount || 'N/A',
                valuation: 'TBD',
                tags: [],
                logo: (pitch.company_name || 'S').charAt(0),
                status: 'New'
            }));
            setStartups(mappedStartups);
            setInvestments(investmentsData);

        } catch (e) {
            console.error('Failed to fetch dashboard data', e);
        } finally {
            setLoading(false);
        }
    };

    const generateInsight = async () => {
        setLoadingInsight(true);
        try {
            // Use actual investments for insight if available, otherwise fetched startups
            const portfolioForInsight = investments.length > 0 ? investments : startups;
            // Need to map investments to Startup type if using that, but aiService might be flexible or we map on the fly
            // For now, let's just pass startups as a proxy for "market check" if portfolio is empty,
            // or map investments to minimal Startup objects.

            // Let's stick to using the 'startups' (Feed) for market insight as "Emerging Trends"
            const res = await aiService.getMarketInsight(startups);
            setInsight(res);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingInsight(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    // Calculate Stats
    const totalInvestments = investments.length;
    // Mock logic for active deals (maybe matching pitches?)
    const activeDeals = startups.filter(s => s.matchScore > 80).length;
    const deployableCapital = "$2.4M"; // Hardcoded for now until backend keeps track of fund
    const portfolioRoi = "+18%"; // Hardcoded

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.email?.split('@')[0] || 'Investor'}</h1>
                    <p className="text-slate-500 mt-1">Here is your investment overview for {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/export-reports"
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
                    >
                        <Download size={18} />
                        Export Report
                    </Link>
                    <Link to="/log-investment" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-semibold text-white hover:bg-blue-700 shadow-md transition-all active:scale-95">
                        <Plus size={18} />
                        Log Investment
                    </Link>
                </div>
            </div>

            {insight && (
                <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={20} className="text-indigo-200" />
                            <h2 className="font-bold text-lg">AI Strategic Insight</h2>
                        </div>
                        <p className="text-indigo-50 leading-relaxed text-sm whitespace-pre-line">{insight}</p>
                        <button onClick={() => setInsight(null)} className="mt-4 text-xs font-bold text-indigo-200 hover:text-white uppercase tracking-widest">Dismiss</button>
                    </div>
                    <Sparkles className="absolute -bottom-8 -right-8 text-white/10 w-48 h-48 group-hover:scale-110 transition-transform" />
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Investments" value={totalInvestments.toString()} trend="+2 this quarter" isPositive={true} icon={<Briefcase size={22} />} />
                <StatCard label="High Match Pitches" value={activeDeals.toString()} trend="Need review" icon={<Activity size={22} />} />
                <StatCard label="Deployable Capital" value={deployableCapital} trend="Of $5M fund" icon={<DollarSign size={22} />} />
                <StatCard label="Portfolio ROI" value={portfolioRoi} trend="+3.2% vs last year" isPositive={true} icon={<TrendingUp size={22} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">New Pitches to Review</h2>
                        <Link to="/browse" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {startups.slice(0, 2).map((startup) => (
                            <div key={startup.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                                <div className="h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 relative">
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-blue-700">
                                        {startup.matchScore}% Match
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-600 uppercase">
                                            {startup.logo}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{startup.name}</h3>
                                            <p className="text-xs text-slate-500 uppercase font-semibold">{startup.sector} • {startup.stage}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                                        {startup.description}
                                    </p>
                                    <Link to={`/pitch/${startup.id}`} state={{ startupName: startup.name }} className="block w-full text-center py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors">
                                        Review Deck
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {startups.length === 0 && (
                            <div className="col-span-2 text-center py-10 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                No new pitches available.
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">Watchlist</h2>
                            <Link to="/watchlist" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Manage</Link>
                        </div>
                        <div className="space-y-4">
                            {watchlist.slice(0, 5).map((item, idx) => (
                                <div key={item.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center font-bold text-xs`}>
                                            {(item.startup_name || 'S').charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">{item.startup_name}</h4>
                                            <p className="text-[10px] text-slate-500 font-medium">Added {new Date(item.added_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">{item.stage}</span>
                                </div>
                            ))}
                            {watchlist.length === 0 && <p className="text-slate-500 text-sm p-2">No items in watchlist.</p>}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h2>
                        <div className="space-y-6">
                            {[
                                { user: 'TechNova', action: 'updated Q3 financials', time: '2 hours ago' },
                                { user: 'GreenEnergy', action: 'replied to your comment', time: '5 hours ago' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                                    <div>
                                        <p className="text-sm text-slate-600 leading-tight">
                                            <span className="font-bold text-slate-900">{item.user}</span> {item.action}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* My Portfolio Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Portfolio</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Tracking {investments.length} active investments</p>
                    </div>
                    <Link to="/portfolio" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all group">
                        View Full Portfolio
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 uppercase tracking-widest">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400">Company</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400">Invested</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400">Last Update</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 text-right">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {investments.slice(0, 3).map((inv, idx) => (
                                <tr key={inv.id || idx} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xs">
                                                {inv.startup_name?.charAt(0) || 'S'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{inv.startup_name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{inv.round || 'Seed'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-700">${inv.amount?.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-semibold text-slate-500">{inv.date ? new Date(inv.date).toLocaleDateString() : 'Nov 22, 2023'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${idx % 2 === 0 ? 'bg-emerald-500 w-[85%]' : 'bg-blue-500 w-[60%]'}`}></div>
                                            </div>
                                            <span className={`text-[10px] font-bold ${idx % 2 === 0 ? 'text-emerald-500' : 'text-blue-600'}`}>
                                                {idx % 2 === 0 ? '+12.4%' : '+4.2%'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {investments.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Briefcase className="text-slate-200 mb-2" size={32} />
                                            <p className="text-slate-400 text-sm font-bold italic">No portfolio data available yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
