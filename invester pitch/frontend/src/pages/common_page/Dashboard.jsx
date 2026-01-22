import * as React from 'react';
import { DollarSign, Briefcase, Activity, TrendingUp, Search, Bell, Download, Plus, Sparkles, Loader2, Filter, MoreHorizontal, ChevronRight, Settings, Star, Zap, Users, Eye, MessageSquare } from 'lucide-react';
import StatCard from '../../components/StatCard';
import ActionRegistry from '../../components/ActionRegistry';
import { api } from '../../services/api';
import { aiService } from '../../services/aiService';
import { Link } from 'react-router-dom';

const StartupDashboard = ({ user }) => {
    const [myPitches, setMyPitches] = React.useState([]);
    const [investors, setInvestors] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [insight, setInsight] = React.useState(null);
    const [loadingInsight, setLoadingInsight] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [pitchesData, investorsData] = await Promise.all([
                    api.getMyPitches(),
                    api.getAllInvestors()
                ]);
                setMyPitches(pitchesData);
                setInvestors(investorsData);
            } catch (error) {
                console.error("Failed to load startup data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const generateInsight = async () => {
        setLoadingInsight(true);
        try {
            // Mock AI insight for now or call specific endpoint
            await new Promise(r => setTimeout(r, 1500));
            setInsight("Based on your sector (HealthTech), we recommend targeting investors offering Series A funding in the US market. Investors like 'Nexus Ventures' have recently increased allocation in this domain.");
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingInsight(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
                <p className="text-sm font-medium text-slate-500">Loading your dashboard...</p>
            </div>
        );
    }

    // Calculated Stats
    const totalViews = myPitches.reduce((sum, p) => sum + (p.views || 0), 0) + 124; // Mock + Real
    const interestedInvestors = investors.length > 5 ? 5 : investors.length; // Mock logic
    const activeDiscussions = 3;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Startup Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1 text-base">
                        Overview for <span className="text-slate-900 font-medium">{user?.email?.split('@')[0]}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={generateInsight}
                        disabled={loadingInsight}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 border border-slate-900 rounded-xl text-sm font-medium text-white hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loadingInsight ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} className="text-yellow-300" />}
                        AI Insights
                    </button>
                    <Link to="/create-pitch" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-xl text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20">
                        <Plus size={18} />
                        New Pitch
                    </Link>
                </div>
            </div>

            {insight && (
                <div className="bg-slate-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-600 rounded-lg">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <h2 className="font-semibold text-sm uppercase tracking-wide opacity-80">Strategic Advice</h2>
                            </div>
                            <button onClick={() => setInsight(null)} className="text-slate-400 hover:text-white transition-colors text-sm">Dismiss</button>
                        </div>
                        <p className="text-slate-200 leading-relaxed text-base font-medium">
                            {insight}
                        </p>
                    </div>
                </div>
            )}

            {/* Stats HUD */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Pitch Views" value={totalViews.toString()} trend="+45 since last week" isPositive={true} icon={<Eye size={20} />} />
                <StatCard label="Interested Investors" value={interestedInvestors.toString()} trend="2 new this week" isPositive={true} icon={<Users size={20} className="text-blue-500" />} />
                <StatCard label="Active Discussions" value={activeDiscussions.toString()} trend="On track" icon={<MessageSquare size={20} className="text-emerald-500" />} />
                <StatCard label="Profile Strength" value="85%" trend="Top 10%" isPositive={true} icon={<Activity size={20} className="text-amber-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* My Pitches */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">My Pitches</h2>
                    </div>

                    {myPitches.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Briefcase size={24} />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No pitches yet</h3>
                            <p className="text-slate-500 mt-1 mb-6 max-w-sm mx-auto">Create your first pitch deck to start attracting investors.</p>
                            <Link to="/create-pitch" className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
                                <Plus size={18} /> Create Pitch
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {myPitches.map((pitch) => (
                                <div key={pitch.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                                    <div className="w-full md:w-48 h-32 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center text-slate-400 font-medium border border-slate-200">
                                        {pitch.pitch_file_url ? "PDF/File" : "No Preview"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{pitch.title}</h3>
                                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{pitch.description}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${pitch.status === 'funded' ? 'bg-emerald-100 text-emerald-700' :
                                                    pitch.status === 'active' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-600'
                                                }`}>
                                                {pitch.status || 'Draft'}
                                            </span>
                                        </div>
                                        <div className="mt-4 flex items-center gap-6 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <DollarSign size={16} className="text-slate-400" />
                                                <span>Target: <span className="font-semibold text-slate-900">${pitch.raising_amount}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users size={16} className="text-slate-400" />
                                                <span>Equity: <span className="font-semibold text-slate-900">{pitch.equity_percentage}%</span></span>
                                            </div>
                                        </div>
                                        <div className="mt-5 pt-4 border-t border-slate-50 flex gap-3">
                                            <Link to={`/pitch/${pitch.id}`} className="text-sm font-medium text-blue-600 hover:underline">View Details</Link>
                                            <span className="text-slate-300">|</span>
                                            <span className="text-sm text-slate-500">Created on {new Date(pitch.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Sidebar: Investors */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Top Investors</h2>
                            <Link to="/browse-investors" className="text-xs font-medium text-blue-600 hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {investors.slice(0, 5).map((inv) => (
                                <div key={inv.id} className="flex items-center gap-4 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        {inv.user_id}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-slate-900 truncate">Investor #{inv.id}</h4>
                                        <p className="text-xs text-slate-500 truncate">{inv.investment_focus || 'General Tech'}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-blue-600 text-xs font-medium px-2 py-1 bg-blue-50 rounded-md">Connect</button>
                                    </div>
                                </div>
                            ))}
                            {investors.length === 0 && (
                                <p className="text-sm text-slate-400 italic">No investors found.</p>
                            )}
                        </div>
                    </div>

                    <div className="flex-1">
                        <ActionRegistry />
                    </div>
                </div>
            </div>
        </div>
    );
};

const InvestorDashboard = ({ user }) => {
    const [startups, setStartups] = React.useState([]);
    const [investments, setInvestments] = React.useState([]);
    const [watchlist, setWatchlist] = React.useState([]);
    const [insight, setInsight] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [loadingInsight, setLoadingInsight] = React.useState(false);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [pitchesData, investmentsData, watchlistData] = await Promise.all([
                    api.getPitchFeed(),
                    api.getInvestments(),
                    api.getWatchlist()
                ]);

                // Mapping API data
                const rawStartups = pitchesData.length > 0 ? pitchesData : [];
                const mappedStartups = rawStartups.map((pitch) => ({
                    id: pitch.id.toString(),
                    name: pitch.company_name || 'Unknown',
                    sector: pitch.industry || 'Unknown',
                    stage: pitch.stage || 'Seed',
                    location: pitch.location || 'Remote',
                    matchScore: pitch.match_score || 0,
                    description: pitch.description || '',
                    fundingAsk: pitch.raising_amount || 'N/A',
                    valuation: 'TBD',
                    tags: [], // Could be parsed if string
                    logo: (pitch.company_name || 'S').charAt(0),
                    status: 'New'
                }));

                setStartups(mappedStartups);
                setInvestments(investmentsData);
                setWatchlist(watchlistData);

            } catch (e) {
                console.error('Failed to fetch dashboard data', e);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const generateInsight = async () => {
        setLoadingInsight(true);
        try {
            const portfolioForInsight = investments.length > 0 ? investments : startups;
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
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
                <p className="text-sm font-medium text-slate-500">Loading dashboard...</p>
            </div>
        );
    }

    const totalInvestments = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const activeDeals = startups.filter(s => s.matchScore > 80).length;
    const deployableCapital = "$2.4M";
    const portfolioRoi = "+18.4%";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Investor Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1 text-base">
                        Welcome back, <span className="text-slate-900 font-medium">{user?.email?.split('@')[0] || 'Investor'}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/export-reports" className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                        <Download size={18} />
                        Exports
                    </Link>
                    <button
                        onClick={generateInsight}
                        disabled={loadingInsight}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 border border-slate-900 rounded-xl text-sm font-medium text-white hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loadingInsight ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} className="text-yellow-300" />}
                        AI Insights
                    </button>
                    <Link to="/log-investment" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-xl text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20">
                        <Plus size={18} />
                        Log Investment
                    </Link>
                </div>
            </div>

            {insight && (
                <div className="bg-slate-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-600 rounded-lg">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <h2 className="font-semibold text-sm uppercase tracking-wide opacity-80">Market Intelligence</h2>
                            </div>
                            <button onClick={() => setInsight(null)} className="text-slate-400 hover:text-white transition-colors text-sm">Dismiss</button>
                        </div>
                        <p className="text-slate-200 leading-relaxed text-base font-medium">
                            {insight}
                        </p>
                    </div>
                </div>
            )}

            {/* Stats HUD */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total AUM" value={`$${(totalInvestments / 1000000).toFixed(1)}M`} trend="+12.4% vs last month" isPositive={true} icon={<Briefcase size={20} />} />
                <StatCard label="Top Matches" value={activeDeals.toString()} trend="High Potential" icon={<Zap size={20} className="text-amber-500" />} />
                <StatCard label="Available Capital" value={deployableCapital} trend="Allocated" icon={<DollarSign size={20} className="text-emerald-500" />} />
                <StatCard label="Portfolio ROI" value={portfolioRoi} trend="Outperforming Market" isPositive={true} icon={<TrendingUp size={20} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: New Pitches */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Recommended Opportunities</h2>
                        <Link to="/browse" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1">
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {startups.slice(0, 4).map((startup) => (
                            <div key={startup.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col">
                                <div className="h-40 bg-slate-900 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-slate-900"></div>
                                    <div className="absolute top-5 left-5 w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-slate-900 text-xl shadow-lg">
                                        {startup.logo}
                                    </div>
                                    <div className="absolute top-5 right-5 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm">
                                        {startup.matchScore}% Match
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="font-bold text-slate-900 text-lg mb-1">{startup.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">{startup.sector} • {startup.stage}</p>
                                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
                                        {startup.description}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-slate-50">
                                        <Link to={`/pitch/${startup.id}`} state={{ startupName: startup.name }} className="block w-full text-center py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-blue-600 transition-colors">
                                            View Pitch
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Right: Sidebar */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shrink-0">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Watchlist</h2>
                            <Link to="/watchlist" className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                <Settings size={16} />
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {watchlist.slice(0, 4).map((item, idx) => (
                                <div key={item.id} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors -mx-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 text-sm group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                            {(item.startup_name || 'S').charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">{item.startup_name}</h4>
                                            <p className="text-xs text-slate-500 font-medium">{item.stage}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-slate-300 hover:text-amber-400 transition-colors">
                                        <Star size={16} fill="currentColor" />
                                    </button>
                                </div>
                            ))}
                            {watchlist.length === 0 && <p className="text-sm text-slate-400">Your watchlist is empty.</p>}
                        </div>
                    </div>

                    <div className="flex-1 min-h-0">
                        <ActionRegistry />
                    </div>
                </div>
            </div>

            {/* Asset Performance Table - Full Width */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Portfolio Performance</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Real-time valuation updates</p>
                    </div>
                    <Link to="/portfolio" className="px-5 py-2 bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors">
                        View All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invested</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {investments.slice(0, 3).map((inv, idx) => (
                                <tr key={inv.id || idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                                                {inv.startup_name?.charAt(0) || 'S'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{inv.startup_name}</p>
                                                <p className="text-xs text-slate-500">{inv.round || 'Seed'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-slate-900">${inv.amount?.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-500">{inv.date ? new Date(inv.date).toLocaleDateString() : '01/01/2024'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${idx % 2 === 0 ? 'bg-emerald-500 w-[85%]' : 'bg-blue-500 w-[60%]'}`}></div>
                                            </div>
                                            <span className={`text-xs font-bold ${idx % 2 === 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
                                                {idx % 2 === 0 ? '+32.4%' : '+18.2%'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {investments.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400 italic">No investments yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

const Dashboard = () => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await api.getMe();
                setUser(userData);
            } catch (e) {
                console.error("Failed to load user profile", e);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-['Plus Jakarta Sans']">
                <Loader2 className="animate-spin text-blue-600 mb-3" size={40} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto font-['Plus Jakarta Sans'] text-slate-900">
            {user?.role === 'startup' ? (
                <StartupDashboard user={user} />
            ) : (
                <InvestorDashboard user={user} />
            )}
        </div>
    );
};

export default Dashboard;
