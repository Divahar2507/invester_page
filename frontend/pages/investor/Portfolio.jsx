import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, ChevronDown, ExternalLink, MessageCircle, FileText, LayoutGrid, LayoutList, TrendingUp, Loader2, Star, Zap, Briefcase } from 'lucide-react';
import { api } from '../../services/api';

const Portfolio = () => {
    const [activeTab, setActiveTab] = useState('investments');
    const [connections, setConnections] = useState([]);
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        capitalDeployed: '$0',
        activeStartups: 0,
        portfolioGrowth: '0%',
        avgEquity: '0%'
    });

    const fetchInvestments = async () => {
        try {
            setLoading(true);
            const data = await api.getInvestments();

            const mappedInvestments = data.map((inv) => ({
                id: inv.id.toString(),
                name: inv.startup_name,
                sector: 'Technology',
                stage: inv.round,
                location: 'Remote',
                matchScore: 92,
                description: inv.notes || 'No notes provided.',
                fundingAsk: 'N/A',
                valuation: 'N/A',
                tags: ['Portfolio'],
                logo: (inv.startup_name || 'S').charAt(0),
                status: inv.status === 'Active' ? 'Trending Up' : 'Needs Review',
                investedAmount: `$${inv.amount.toLocaleString()}`,
                currentValue: `$${(inv.amount * 1.25).toLocaleString()}`, // Dummy logic for now
                growth: inv.equity_stake ? `${inv.equity_stake}% Equity` : '+25%', // Showing equity if available
                reviewStatus: 'Completed',
                documentUrl: inv.document_url // Store document URL for use
            }));

            // Use API data
            if (mappedInvestments.length === 0) {
                setInvestments([]);
                // Keep default zero stats or set explicitly to 0
                setStats({
                    capitalDeployed: '$0',
                    activeStartups: 0,
                    portfolioGrowth: '0%',
                    avgEquity: '0%'
                });
            } else {
                setInvestments(mappedInvestments);
                const statsData = await api.getInvestmentStats();
                setStats({
                    capitalDeployed: statsData.capital_deployed,
                    activeStartups: statsData.active_startups,
                    portfolioGrowth: statsData.portfolio_growth,
                    avgEquity: statsData.avg_equity
                });
            }

        } catch (err) {
            console.error('Failed to fetch investments', err);
            setInvestments([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchConnections = async () => {
        try {
            setLoading(true);
            const data = await api.getMyConnections();
            setConnections(data);
        } catch (err) {
            console.error('Failed to fetch connections', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'investments') {
            fetchInvestments();
        } else {
            fetchConnections();
        }
    }, [activeTab]);

    const handleAcceptRequest = async (connId) => {
        try {
            await api.respondToRequest(connId, 'accept');
            fetchConnections();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 font-['Plus Jakarta Sans'] animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Portfolio</h1>
                    <p className="text-slate-500 mt-1 text-base">Track your investments and network connections.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('investments')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'investments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Investments
                    </button>
                    <button
                        onClick={() => setActiveTab('connections')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'connections' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Connections ({connections.length})
                    </button>
                </div>
            </div>

            {activeTab === 'investments' ? (
                <>
                    {/* Stats HUD */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Deployed Capital', value: stats.capitalDeployed, trend: '+12.5%', icon: <Briefcase size={20} /> },
                            { label: 'Active Startups', value: stats.activeStartups, trend: '+3 QTD', icon: <Star size={20} /> },
                            { label: 'Portfolio Growth', value: stats.portfolioGrowth, trend: 'Strong', icon: <TrendingUp size={20} /> },
                            { label: 'Avg. Equity', value: stats.avgEquity, trend: 'Target Met', icon: <Zap size={20} /> }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                        <div className="text-slate-400 bg-slate-50 p-2 rounded-lg">{stat.icon}</div>
                                    </div>
                                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{stat.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative flex-1 w-full lg:max-w-lg">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search portfolio..."
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <Link
                            to="/log-investment"
                            state={{ startupName: '' }}
                            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 rounded-xl text-sm font-medium text-white hover:bg-slate-800 shadow-sm transition-all whitespace-nowrap"
                        >
                            <Plus size={18} />
                            Log New Investment
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-blue-600" size={40} />
                            <p className="text-sm font-medium text-slate-500">Loading portfolio...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {investments.map((startup, idx) => (
                                <div key={`${startup.id}-${idx}`} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
                                    <div className="h-40 bg-slate-900 relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900"></div>
                                        <div className="absolute top-5 left-5 w-14 h-14 bg-white rounded-xl flex items-center justify-center font-bold text-slate-900 text-2xl shadow-lg">
                                            {startup.logo}
                                        </div>
                                        <div className="absolute top-5 right-5 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm">
                                            {startup.status}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1">
                                        <h3 className="font-bold text-slate-900 text-xl mb-1">{startup.name}</h3>
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="text-xs font-medium text-slate-500">{startup.sector}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="text-xs font-medium text-blue-600">{startup.stage}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">Capital Invested</p>
                                                <p className="text-lg font-bold text-slate-900">{startup.investedAmount}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500 font-medium mb-1">Current Value</p>
                                                <p className="text-lg font-bold text-slate-900">{startup.currentValue}</p>
                                                <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center justify-end gap-1">
                                                    <TrendingUp size={12} /> {startup.growth}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100">
                                        <Link to={`/investment/${startup.id}`} className="py-3 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
                                            <ExternalLink size={18} className="text-slate-400 mb-1" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">View</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (startup.documentUrl) {
                                                    const url = startup.documentUrl.startsWith('http')
                                                        ? startup.documentUrl
                                                        : `http://localhost:8000${startup.documentUrl}`;
                                                    window.open(url, '_blank');
                                                } else {
                                                    alert("No documents uploaded for this investment.");
                                                }
                                            }}
                                            className="py-3 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer w-full"
                                        >
                                            <FileText size={18} className="text-slate-400 mb-1" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Docs</span>
                                        </button>
                                        <Link to="/messages" state={{ conversationStart: startup.name }} className="py-3 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
                                            <MessageCircle size={18} className="text-slate-400 mb-1" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Chat</span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:max-w-4xl mx-auto">
                        {connections.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <Zap size={40} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500 font-medium">No network connections found.</p>
                            </div>
                        ) : (
                            connections.map((conn) => (
                                <div key={conn.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                            {(conn.requester_name || 'U').charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">{conn.requester_name}</h3>
                                            <p className="text-sm font-medium text-slate-500 mt-0.5">{conn.requester_role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${conn.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' :
                                            conn.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-500'
                                            }`}>
                                            {conn.status}
                                        </div>

                                        {conn.status === 'accepted' && (
                                            <Link to="/messages" state={{ conversationStart: conn.requester_name }} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                                                Message
                                            </Link>
                                        )}
                                        {conn.status === 'pending' && (
                                            <button
                                                onClick={() => handleAcceptRequest(conn.id)}
                                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                                            >
                                                Accept Request
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;

