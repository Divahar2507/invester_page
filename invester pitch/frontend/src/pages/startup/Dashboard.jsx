import * as React from 'react';
import { Briefcase, Activity, Search, Sparkles, Loader2, Filter, MoreHorizontal, ChevronRight, Settings, Star, Zap, Users, Eye, MessageSquare, DollarSign, Plus, Bell, Clock, FileText, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const StartupDashboard = ({ user }) => {
    const [myPitches, setMyPitches] = React.useState([]);
    const [investors, setInvestors] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

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
        <div className="space-y-8 animate-in fade-in duration-500 font-sans text-slate-900">
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
                </div>
            </div>

            {/* Greeting Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                        Good morning, {user?.full_name?.split(' ')[0] || 'Founder'}
                    </h1>
                    <p className="text-slate-500 font-medium">Here is your startup's daily brief and pitch performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Online
                    </span>
                    <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                        {currentDate}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Pitches"
                    value={totalPitches}
                    icon={<Briefcase size={22} className="text-blue-600" />}
                    bgClass="bg-blue-50"
                    trend="+20%"
                />
                <StatCard
                    label="Investor Views"
                    value={totalViews}
                    icon={<Eye size={22} className="text-purple-600" />}
                    bgClass="bg-purple-50"
                    trend="+12%"
                />
                <StatCard
                    label="Match Score"
                    value={`${matchScore}%`}
                    icon={<Zap size={22} className="text-orange-600" />}
                    bgClass="bg-orange-50"
                    trend="+5%"
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
                                            // Placeholder for thumbnail
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
                    {/* Match Opportunities */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900">Match Opportunities</h2>
                            <Link to="/browse-investors" className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <ChevronRight size={20} />
                            </Link>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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

                    {/* Recent Activity */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
                        <div className="space-y-6 pl-2">
                            {/* Mock Activity Data - In real app, fetch from notifications/activity log */}
                            {[
                                { text: 'John Doe commented on slide 4 of "Series A Deck"', time: '10 min ago', active: true },
                                { text: 'New match found: TechStar Accelerator', time: '2 hours ago', active: false },
                                { text: 'You uploaded "Financials_2023.xlsx"', time: 'Yesterday', active: false },
                            ].map((activity, i) => (
                                <div key={i} className="relative pl-6 border-l-2 border-slate-200 last:border-0 pb-1">
                                    <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${activity.active ? 'bg-blue-600 ring-2 ring-blue-100' : 'bg-slate-300'}`}></div>
                                    <p className="text-sm font-medium text-slate-800 leading-snug">
                                        {activity.text.split(':').map((part, idx) => idx === 0 && activity.text.includes(':') ? <span key={idx} className="font-bold">{part}:</span> : part)}
                                    </p>
                                    <span className="text-xs text-slate-400 mt-1 block">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Blue Promo Card */}
                    <div className="bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-500/30">
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 text-white">
                                <Rocket size={20} />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Boost your visibility</h3>
                            <p className="text-blue-100 text-sm mb-4 leading-relaxed">Get featured on the main investor dashboard for 2x more views.</p>
                            <button className="w-full py-2.5 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors">
                                Upgrade Plan
                            </button>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, bgClass, trend }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${bgClass}`}>
                {icon}
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <Sparkles size={8} fill="currentColor" /> {trend}
            </span>
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        </div>
    </div>
);

export default StartupDashboard;
