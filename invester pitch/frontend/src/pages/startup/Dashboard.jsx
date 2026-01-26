import * as React from 'react';
import { Briefcase, Activity, Search, Sparkles, Loader2, Filter, MoreHorizontal, ChevronRight, Settings, Star, Zap, Users, Eye, MessageSquare, DollarSign, Plus, Bell, Clock, FileText, Rocket, ArrowRight, ShieldCheck, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const StartupDashboard = ({ user }) => {
    const [myPitches, setMyPitches] = React.useState([]);
    const [investors, setInvestors] = React.useState([]);
    const [incomingRequests, setIncomingRequests] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [pitchesData, investorsData, requestsData] = await Promise.all([
                    api.getMyPitches(),
                    api.getAllInvestors(),
                    api.getIncomingConnectionRequests()
                ]);
                setMyPitches(pitchesData);
                setInvestors(investorsData);
                setIncomingRequests(requestsData);
            } catch (error) {
                console.error("Failed to load startup data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleRespondToRequest = async (connectionId, action) => {
        try {
            await api.respondToConnectionRequest(connectionId, action);
            setIncomingRequests(prev => prev.filter(r => r.id !== connectionId));
            if (action === 'accept') {
                alert("Connection accepted!");
            }
        } catch (error) {
            console.error("Failed to respond to request", error);
            alert("Action failed.");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-sm font-medium text-slate-500">Loading your dashboard...</p>
            </div>
        );
    }

    // Calculated Stats based on real data where possible
    const totalPitches = myPitches.length;
    const totalViews = myPitches.reduce((sum, p) => sum + (p.views || 0), 0) + 128; // Base + Real
    // Mock match score based on profile completion or random for now
    const matchScore = 85;

    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans text-slate-900 pb-20">
            {/* Top Bar with Search & Actions (Mobile/Desktop) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search pitches, investors, or files..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-4 self-end md:self-auto">
                    <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                    </button>
                    <Link to="/create-pitch" className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        <Plus size={18} />
                        Create New Pitch
                    </Link>
                    <Link
                        to="/plans"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-bold text-sm tracking-tight hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/40 active:scale-95"
                    >
                        Enter Pro Terminal <ArrowRight size={18} />
                    </Link>
                </div>
            </div>

            {/* Greeting Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-blue-500/20">
                            <Sparkles size={10} fill="white" /> Infinite Pro
                        </div>
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">Startup Edition</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                        Good morning, {user?.full_name?.split(' ')[0] || 'Founder'}
                    </h1>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-lg">
                        Welcome to your unified terminal. Your pitches are currently reaching <span className="text-blue-600 font-bold">128+</span> strategic partners.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-3 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full text-xs font-bold text-slate-600">
                            Online
                        </span>
                        <span className="px-3 py-1.5 bg-slate-50 rounded-full text-xs font-bold text-slate-600">
                            {currentDate}
                        </span>
                    </div>
                </div>
            </div>

            {/* PREMIUM UTILITIES: NEW SECTION */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Zap size={22} className="text-blue-600 fill-blue-600/10" /> Premium Utilities
                    </h2>
                    <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline uppercase tracking-widest">Configure Terminal</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-[32px] border border-blue-100 hover:border-blue-500/40 transition-all shadow-sm hover:shadow-xl cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-xl group-hover:bg-blue-600/10 transition-colors"></div>
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <Rocket className="text-white w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2">AI Pitch Scan</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Let our algorithmic core review your deck for strategic gaps before sending.</p>
                        <div className="mt-6 flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest">
                            Analyze Now <ArrowRight size={14} />
                        </div>
                    </div>

                    <div className="group bg-gradient-to-br from-white to-indigo-50/30 p-8 rounded-[32px] border border-indigo-100 hover:border-indigo-500/40 transition-all shadow-sm hover:shadow-xl cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-xl group-hover:bg-indigo-600/10 transition-colors"></div>
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                            <Network className="text-white w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2">Global Reach</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Instantly feature your pitch on the terminal of 1,200+ global venture partners.</p>
                        <div className="mt-6 flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-widest">
                            Enable Outreach <ArrowRight size={14} />
                        </div>
                    </div>

                    <div className="group bg-slate-900 p-8 rounded-[32px] border border-slate-800 hover:border-blue-500/40 transition-all shadow-xl cursor-pointer relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                            <ShieldCheck className="text-white w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black text-white mb-2 italic">Priority Terminal</h4>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed">Get 3x more visibility by placing your startup in the mandatory morning feed.</p>
                        <div className="mt-6 flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest">
                            Claim Placement <ArrowRight size={14} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Active Pitches"
                    value={totalPitches}
                    icon={<Briefcase size={22} className="text-blue-600" />}
                    bgClass="bg-blue-50"
                    trend="+2 new today"
                />
                <StatCard
                    label="Partner Intelligence"
                    value={totalViews}
                    icon={<Eye size={22} className="text-purple-600" />}
                    bgClass="bg-purple-50"
                    trend="High Signal"
                />
                <StatCard
                    label="Algorithmic Match"
                    value={`${matchScore}%`}
                    icon={<Zap size={22} className="text-orange-600" />}
                    bgClass="bg-orange-50"
                    trend="Top 10%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Recent Pitches */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Recent Pitches</h2>
                        <Link to="/my-pitches" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {myPitches.length > 0 ? (
                            myPitches.slice(0, 3).map((pitch) => (
                                <div key={pitch.id} className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5">
                                    <div className="w-full md:w-40 h-28 bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden flex-shrink-0">
                                        {pitch.pitch_file_url && !pitch.pitch_file_url.includes('dummy') ? (
                                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs text-slate-400 font-bold">PDF</div>
                                        ) : (
                                            <Briefcase className="text-slate-300" size={32} />
                                        )}
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur rounded text-[10px] font-bold text-slate-700 uppercase tracking-wide shadow-sm">
                                            {pitch.status === 'active' ? 'v3.0' : 'Draft'}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-bold text-slate-900 truncate pr-4">{pitch.title}</h3>
                                                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{pitch.description}</p>
                                        </div>
                                        <div className="flex items-center gap-6 mt-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${pitch.status === 'active' ? 'bg-amber-100 text-amber-700' :
                                                pitch.status === 'funded' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {pitch.status === 'active' ? 'Editing' : pitch.status || 'Draft'}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                <Eye size={14} />
                                                {10 + (pitch.views || 0)}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 ml-auto">
                                                <Clock size={14} />
                                                {new Date(pitch.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
                                <p className="text-slate-500 font-medium">No pitches created yet.</p>
                                <Link to="/create-pitch" className="text-blue-600 font-bold text-sm mt-2 inline-block">Create your first pitch</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    {/* Incoming Connection Requests */}
                    {incomingRequests.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Connection Requests</h2>
                                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{incomingRequests.length}</span>
                            </div>
                            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden ring-1 ring-blue-50">
                                {incomingRequests.map((req) => (
                                    <div key={req.id} className="p-4 border-b border-slate-50 last:border-0 bg-blue-50/10">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                                                {req.requester_name?.charAt(0) || 'I'}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-slate-900 truncate">{req.requester_name}</h4>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{req.requester_role}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleRespondToRequest(req.id, 'accept')}
                                                className="flex-1 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleRespondToRequest(req.id, 'reject')}
                                                className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                                Ignore
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Match Opportunities */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900">Match Opportunities</h2>
                            <Link to="/browse-investors" className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <ChevronRight size={20} />
                            </Link>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-left">
                            {investors.slice(0, 3).map((investor, idx) => {
                                const matchPercent = [98, 89, 75][idx] || 60 + (investor.id * 7) % 30; // Mock match %
                                return (
                                    <div key={investor.id} className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                {investor.investor_name?.charAt(0) || 'I'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-slate-900 truncate">{investor.investor_name}</h4>
                                                <p className="text-xs text-slate-500 truncate">{investor.firm_name || 'Angel Investor'}</p>
                                                <div className="flex items-center justify-between mt-3">
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                        <Sparkles size={10} fill="currentColor" /> {matchPercent}% Match
                                                    </span>
                                                    <button className="text-blue-600 text-xs font-bold hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors">
                                                        Connect
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Blue Promo Card: ENHANCED */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/40">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-white backdrop-blur-md">
                                <Rocket size={24} />
                            </div>
                            <h3 className="font-black text-2xl mb-2 leading-tight">Scale to <br />Infinity.</h3>
                            <p className="text-blue-100 text-sm mb-8 leading-relaxed font-medium">Get featured on the mandatory morning terminal for 4x more partner eyes.</p>
                            <button className="w-full py-4 bg-white text-blue-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-50 transition-all active:scale-95 shadow-lg shadow-black/10">
                                Enter Pro Terminal
                            </button>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, bgClass, trend }) => (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between h-full hover:shadow-lg transition-all group">
        <div className="flex items-start justify-between mb-6">
            <div className={`p-4 rounded-2xl ${bgClass} group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                {trend}
            </span>
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">{label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        </div>
    </div>
);

export default StartupDashboard;
