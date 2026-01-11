// Use import * as React to ensure JSX intrinsic elements are recognized
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Added TrendingUp to the imports
import { Search, Plus, Filter, ChevronDown, ExternalLink, MessageCircle, FileText, LayoutGrid, LayoutList, TrendingUp, Loader2 } from 'lucide-react';
import { api } from '../services/api';

const Portfolio = () => {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        capitalDeployed: '$0',
        activeStartups: 0,
        portfolioGrowth: '0%',
        avgEquity: '0%'
    });

    useEffect(() => {
        fetchInvestments();
    }, []);

    const fetchInvestments = async () => {
        try {
            setLoading(true);
            const data = await api.getInvestments();

            const mappedInvestments = data.map((inv) => ({
                id: inv.id.toString(),
                name: inv.startup_name,
                sector: 'Tech', // Backend doesn't provide this on Investment, maybe fetch startup details or just placeholder
                stage: inv.round,
                location: 'Remote',
                matchScore: 0,
                description: inv.notes || '',
                fundingAsk: 'N/A',
                valuation: 'N/A',
                tags: [],
                logo: inv.startup_name.charAt(0),
                status: inv.status === 'Active' ? 'On Track' : 'Needs Attention',
                investedAmount: `$${inv.amount.toLocaleString()}`,
                currentValue: `$${(inv.amount * 1.2).toLocaleString()}`, // Mock growth
                growth: '+20%', // Mock
                reviewStatus: 'Completed'
            }));
            setInvestments(mappedInvestments);

            // Calculate Stats
            const totalInvested = mappedInvestments.reduce((sum, inv) => {
                const amount = parseFloat(inv.investedAmount.replace(/[^0-9.-]+/g, ""));
                return sum + (isNaN(amount) ? 0 : amount);
            }, 0);

            setStats({
                capitalDeployed: totalInvested.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
                activeStartups: mappedInvestments.length,
                portfolioGrowth: '+22%', // Mock calculation or derive from current value
                avgEquity: '8.5%' // Mock or derive
            });

        } catch (err) {
            console.error('Failed to fetch investments', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Portfolio</h1>
                    <p className="text-slate-500 mt-1">Managing 12 active investments across 4 sectors.</p>
                </div>
                <Link to="/log-investment" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-semibold text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                    <Plus size={18} />
                    Add Investment
                </Link>
            </div>

            {/* Grid Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Capital Deployed', value: stats.capitalDeployed, trend: '+15%', icon: <FileText /> },
                    { label: 'Active Startups', value: stats.activeStartups, trend: '+2 New', icon: <Plus /> },
                    { label: 'Portfolio Growth', value: stats.portfolioGrowth, trend: '+4%', icon: <TrendingUp size={22} /> },
                    { label: 'Avg. Equity Stake', value: stats.avgEquity, trend: 'Stable', icon: <LayoutGrid /> }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                {stat.icon}
                            </div>
                            {stat.trend && (
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
                            )}
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Search & Tabs */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 max-w-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search companies, founders..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        />
                    </div>
                    {['All Industries', 'Stage: All', 'Status: Active'].map(f => (
                        <button key={f} className="whitespace-nowrap flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50">
                            {f} <ChevronDown size={14} />
                        </button>
                    ))}
                </div>
                <div className="flex bg-white border border-slate-200 rounded-xl shadow-sm">
                    <button className="p-2 text-blue-600 bg-slate-50 rounded-l-xl border-r border-slate-200"><LayoutGrid size={20} /></button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-r-xl"><LayoutList size={20} /></button>
                </div>
            </div>

            {/* Grid of Portfolio Cards */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                </div>
            ) : investments.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">No active investments found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {investments.map((startup, idx) => (
                        <div key={`${startup.id}-${idx}`} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="p-8 flex-1">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-500/30">
                                            {startup.logo}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">{startup.name}</h3>
                                            <p className="text-xs text-slate-500 font-medium">{startup.location}</p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${startup.status === 'On Track' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${startup.status === 'On Track' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                        {startup.status}
                                    </div>
                                </div>

                                <div className="flex gap-2 mb-8">
                                    <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100 uppercase tracking-widest">{startup.sector}</span>
                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100 uppercase tracking-widest">{startup.stage}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-8 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Invested</p>
                                        <p className="text-lg font-bold text-slate-900">{startup.investedAmount}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Oct 2022</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Current Value</p>
                                        <p className="text-lg font-bold text-slate-900">{startup.currentValue}</p>
                                        <p className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
                                            <TrendingUp size={10} /> {startup.growth}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-blue-50/30 rounded-xl border border-blue-100/30">
                                        <MessageCircle size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Latest Update</p>
                                            <p className="text-xs text-slate-600 leading-relaxed font-medium italic">"Reached milestone ahead of schedule..."</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 p-2 bg-slate-50/30">
                                <Link to={`/pitch/${startup.id}`} state={{ startupName: startup.name }} className="py-3 flex flex-col items-center gap-1 hover:bg-white transition-colors group/btn">
                                    <ExternalLink size={18} className="text-slate-400 group-hover/btn:text-blue-600" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Profile</span>
                                </Link>
                                <Link to={`/pitch/${startup.id}`} state={{ startupName: startup.name }} className="py-3 flex flex-col items-center gap-1 hover:bg-white transition-colors group/btn">
                                    <FileText size={18} className="text-slate-400 group-hover/btn:text-blue-600" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Deck</span>
                                </Link>
                                <Link to="/messages" state={{ conversationStart: startup.name }} className="py-3 flex flex-col items-center gap-1 hover:bg-white transition-colors group/btn">
                                    <MessageCircle size={18} className="text-slate-400 group-hover/btn:text-blue-600" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Msg</span>
                                </Link>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card */}
                    <Link to="/log-investment" className="rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 hover:border-blue-400 hover:bg-blue-50/30 transition-all group bg-white/50 min-h-[400px]">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all mb-4">
                            <Plus size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Add New Investment</h3>
                        <p className="text-sm text-slate-500">Track a new startup in your portfolio</p>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Portfolio;
