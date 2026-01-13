import * as React from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    Rocket,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-['Plus Jakarta Sans'] text-slate-900">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm">
                            <TrendingUp size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">InvestorHub</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
                        <a href="#about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">About</a>
                        <a href="#success" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Stories</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Login
                            </Link>
                        </div>

                        <div className="relative group">
                            <Link to="/register/investor" className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-sm active:scale-95 text-sm">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        The Future of Fundraising is Here
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Connect with Visionary Founders & <span className="text-blue-600">Elite Investors.</span>
                    </h1>

                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        The private network bridging the gap between world-changing startups and smart capital.
                        Data-driven matching, seamless deal flow, and automated diligence.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Link to="/register/startup" className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                            I'm a Founder <ArrowRight size={18} />
                        </Link>
                        <Link to="/register/investor" className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2">
                            I'm an Investor
                        </Link>
                    </div>
                </div>
            </div>

            {/* Split Cards Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Founder Card */}
                    <Link to="/register/startup" className="group relative rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                        <div className="bg-slate-50 h-64 overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" alt="Founders" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <Rocket className="mb-2" size={32} />
                                <h3 className="text-2xl font-bold">For Founders</h3>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Create your data room, track investor interest, and close your round faster with streamlined tools.
                            </p>
                            <span className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                Start Fundraising <ArrowRight size={16} />
                            </span>
                        </div>
                    </Link>

                    {/* Investor Card */}
                    <Link to="/register/investor" className="group relative rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                        <div className="bg-slate-50 h-64 overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2670&auto=format&fit=crop"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" alt="Investors" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <TrendingUp className="mb-2" size={32} />
                                <h3 className="text-2xl font-bold">For Investors</h3>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Access vetted deal flow, manage your portfolio, and connect with other syndicates.
                            </p>
                            <span className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                Browse Startups <ArrowRight size={16} />
                            </span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">$500M+</div>
                        <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Capital Raised</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">2,000+</div>
                        <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Active Startups</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">850+</div>
                        <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Vetted Investors</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">45 Days</div>
                        <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Avg. Close Time</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-white text-center border-t border-slate-200">
                <div className="flex items-center justify-center gap-2 mb-6 text-slate-900">
                    <div className="bg-blue-600 w-6 h-6 rounded-md flex items-center justify-center">
                        <TrendingUp size={14} className="text-white" />
                    </div>
                    <span className="font-bold text-lg">InvestorHub</span>
                </div>
                <p className="text-slate-500 text-sm">© 2024 InvestorHub Inc. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
