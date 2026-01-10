import * as React from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    Rocket,
    Users,
    ChevronRight,
    Github,
    Twitter,
    Search,
    Zap,
    BarChart3,
    ShieldCheck,
    PieChart,
    Database
} from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <TrendingUp size={20} className="text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tight">Portal</span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <a href="#platform" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Platform</a>
                        <a href="#success" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Success Stories</a>
                        <a href="#pricing" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
                        <Link to="/register" className="px-6 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 text-sm">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 relative px-6 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <h1 className="text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]">
                        Connect, Collaborate, <br />
                        and <span className="text-blue-600">Fund the Future</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
                        The complete ecosystem for fundraising. We bridge the gap between visionary founders and world-class investors.
                    </p>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[1200px] h-[600px] opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3)_0%,transparent_70%)]"></div>
                    <div className="grid grid-cols-12 h-full w-full pointer-events-none">
                        {[...Array(144)].map((_, i) => (
                            <div key={i} className="border-[0.5px] border-slate-200 w-full h-full"></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Role Cards Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 translate-y-12 animate-in fade-in fill-mode-forwards duration-1000 delay-300">

                    {/* For Startups */}
                    <div className="group bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                        <div className="aspect-[16/10] relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1522071823991-b1ae650a0c9e?q=80&w=2070&auto=format&fit=crop"
                                alt="Founders collaborating"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-8 bg-black/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2">
                                <Rocket size={18} className="text-white" />
                                <span className="text-sm font-black text-white uppercase tracking-widest">For Startups</span>
                            </div>
                        </div>
                        <div className="p-10 space-y-8">
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Build data-driven pitch decks with AI and get matched directly with investors looking for your specific metrics.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold flex items-center gap-2 border border-blue-100">
                                    <Zap size={14} /> AI Pitch Builder
                                </span>
                                <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold flex items-center gap-2 border border-blue-100">
                                    <BarChart3 size={14} /> Smart Analytics
                                </span>
                                <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold flex items-center gap-2 border border-blue-100">
                                    <ShieldCheck size={14} /> Validated Feedback
                                </span>
                            </div>
                            <Link to="/register" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 text-lg leading-none active:scale-95">
                                Start Fundraising <ChevronRight size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* For Investors */}
                    <div className="group bg-slate-50 rounded-[40px] border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                        <div className="aspect-[16/10] relative overflow-hidden bg-white/50">
                            <div className="p-8 h-full flex items-center justify-center">
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bbb65216f78d?q=80&w=2070&auto=format&fit=crop"
                                    alt="Analytics dashboard"
                                    className="w-full h-full object-contain rounded-2xl border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/0 to-transparent"></div>
                            <div className="absolute bottom-6 left-8 bg-black/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2">
                                <BarChart3 size={18} className="text-white" />
                                <span className="text-sm font-black text-white uppercase tracking-widest">For Investors</span>
                            </div>
                        </div>
                        <div className="p-10 space-y-8">
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Discover the next unicorn with vetted deal flow. Manage your portfolio and collaborate with founders directly.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold flex items-center gap-2 border border-purple-100 uppercase tracking-tight">
                                    <PieChart size={14} /> Deal Flow
                                </span>
                                <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold flex items-center gap-2 border border-purple-100 uppercase tracking-tight">
                                    <ShieldCheck size={14} /> Vetted Startups
                                </span>
                                <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold flex items-center gap-2 border border-purple-100 uppercase tracking-tight">
                                    <Database size={14} /> Portfolio Mgmt
                                </span>
                            </div>
                            <Link to="/login" className="w-full py-5 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-lg leading-none active:scale-95 shadow-sm">
                                Find Startups <Search size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-20 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Trusted by 500+ top innovators and firms</h5>
                    <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-24 grayscale opacity-40">
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter"><TrendingUp size={24} /> Velocity</div>
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter self-start mt-1">▲ Pyramid</div>
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter align-middle">⊕ GlobalVC</div>
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter align-bottom">◓ Sprout</div>
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter"><TrendingUp size={24} className="rotate-90" /> Apex</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-20 pb-10 border-t border-slate-50 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 pb-20">
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                                <TrendingUp size={16} className="text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tight">Portal</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed">
                            Empowering the next generation of founders and investors to build the future together.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h6 className="text-xs font-black uppercase tracking-widest text-slate-900">Platform</h6>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">For Startups</a></li>
                            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">For Investors</a></li>
                            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h6 className="text-xs font-black uppercase tracking-widest text-slate-900">Company</h6>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">About Us</a></li>
                            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Careers</a></li>
                            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h6 className="text-xs font-black uppercase tracking-widest text-slate-900">Legal</h6>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-bold text-slate-400">
                        © 2024 Portal Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-slate-400">
                        <a href="#" className="hover:text-blue-600 transition-colors"><Twitter size={18} /></a>
                        <a href="#" className="hover:text-slate-900 transition-colors"><Github size={18} /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
