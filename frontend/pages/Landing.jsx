import * as React from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    Rocket,
    ArrowRight,
    Users,
    Zap,
    Globe,
    Shield,
    CheckCircle2
} from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-indigo-500 selection:text-white overflow-x-hidden">

            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
                <div className="absolute top-[20%] left-[30%] w-[20%] h-[20%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow delay-2000"></div>
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0f172a]/70 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-indigo-500 to-blue-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <TrendingUp size={20} className="text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">Portal<span className="text-indigo-500">.</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Features</a>
                        <a href="#about" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">About</a>
                        <a href="#success" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Stories</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <button className="px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                                Login <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            {/* Login Dropdown */}
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#1e293b] rounded-2xl shadow-2xl border border-white/10 p-2 opacity-0 invisble group-hover:opacity-100 group-hover:visible hover:opacity-100 hover:visible transition-all transform origin-top-right translate-y-2">
                                <Link to="/login/startup" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group/item">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-colors">
                                        <Rocket size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">Startup Login</p>
                                        <p className="text-[10px] text-slate-500">For Founders</p>
                                    </div>
                                </Link>
                                <Link to="/login/investor" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group/item mt-1">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover/item:bg-blue-500 group-hover/item:text-white transition-colors">
                                        <TrendingUp size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">Investor Login</p>
                                        <p className="text-[10px] text-slate-500">For Backers</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="relative group">
                            <button className="px-6 py-2.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-xl shadow-white/5 active:scale-95 text-sm">
                                Get Started
                            </button>
                            {/* Get Started Dropdown */}
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#1e293b] rounded-2xl shadow-2xl border border-white/10 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible hover:opacity-100 hover:visible transition-all transform origin-top-right translate-y-2">
                                <Link to="/register/startup" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group/item">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-colors">
                                        <Rocket size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">I'm a Founder</p>
                                        <p className="text-[10px] text-slate-500">Raise Capital</p>
                                    </div>
                                </Link>
                                <Link to="/register/investor" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group/item mt-1">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover/item:bg-blue-500 group-hover/item:text-white transition-colors">
                                        <TrendingUp size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">I'm an Investor</p>
                                        <p className="text-[10px] text-slate-500">Find Deals</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-8 mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-slate-400 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-5 duration-1000">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            The Future of Fundraising
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                            Where Visionaries <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400">Meet Capital.</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                            The private network bridging the gap between world-changing startups and elite investors. Smart matching, seamless scaling.
                        </p>
                    </div>

                    {/* Split Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500">

                        {/* Founder Card */}
                        <Link to="/register/startup" className="group relative h-[400px] rounded-[40px] overflow-hidden border border-white/10 transition-all duration-500 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] to-[#0f172a]"></div>
                            <img src="https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070&auto=format&fit=crop"
                                className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" alt="Founder" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent"></div>

                            <div className="absolute bottom-0 left-0 p-10 w-full">
                                <div className="mb-4 inline-flex p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
                                    <Rocket size={24} />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2">For Founders</h3>
                                <p className="text-slate-400 font-medium group-hover:text-slate-200 transition-colors">
                                    Showcase your pitch, track analytics, and close rounds faster with AI-driven insights.
                                </p>
                                <div className="mt-8 flex items-center gap-2 text-indigo-400 font-bold group-hover:translate-x-2 transition-transform">
                                    Start Fundraising <ArrowRight size={18} />
                                </div>
                            </div>
                        </Link>

                        {/* Investor Card */}
                        <Link to="/register/investor" className="group relative h-[400px] rounded-[40px] overflow-hidden border border-white/10 transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] to-[#0f172a]"></div>
                            <img src="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2070&auto=format&fit=crop"
                                className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" alt="Investor" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent"></div>

                            <div className="absolute bottom-0 left-0 p-10 w-full">
                                <div className="mb-4 inline-flex p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500">
                                    <TrendingUp size={24} />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2">For Investors</h3>
                                <p className="text-slate-400 font-medium group-hover:text-slate-200 transition-colors">
                                    Access vetted deal flow, collaborate with partners, and manage your portfolio.
                                </p>
                                <div className="mt-8 flex items-center gap-2 text-blue-400 font-bold group-hover:translate-x-2 transition-transform">
                                    Browse Startups <ArrowRight size={18} />
                                </div>
                            </div>
                        </Link>

                    </div>
                </div>
            </main>

            {/* Stats Section */}
            <section className="py-24 border-t border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <div className="space-y-2">
                        <div className="text-4xl font-black text-white">$500M+</div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Capital Raised</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-4xl font-black text-white">2,000+</div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Startups</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-4xl font-black text-white">850+</div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Vetted Investors</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-4xl font-black text-white">45 Days</div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Avg. Close Time</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 text-center">
                <p className="text-slate-600 text-sm">© 2024 Portal Inc. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
