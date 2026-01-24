import * as React from 'react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Infinity,
    ArrowRight,
    Users,
    ShieldCheck,
    Rocket,
    TrendingUp,
    CheckCircle2,
    Zap,
    Globe,
    Lock,
    X,
    MessageSquare,
    PieChart,
    BarChart3,
    ArrowUpRight,
    Layout,
    Cpu,
    Network
} from 'lucide-react';

const Landing = () => {
    const [showSelection, setShowSelection] = useState(false);
    const [searchParams] = useSearchParams();
    const view = searchParams.get('view'); // 'investor' or 'startup'

    // If a specific view is requested, we can show a simplified version or just the specific hero
    const isInvestorView = view === 'investor';
    const isStartupView = view === 'startup';

    return (
        <div className="min-h-screen bg-white font-['Plus Jakarta Sans'] text-slate-900 overflow-x-hidden">

            {/* Modal for Get Started Selection */}
            {showSelection && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden relative shadow-2xl">
                        <button
                            onClick={() => setShowSelection(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-slate-400" />
                        </button>

                        <div className="p-12 text-center">
                            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Create Your Account</h2>
                            <p className="text-slate-500 mb-10">Select your role to join the InfiniteTechAI ecosystem.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Link
                                    to="/register/investor"
                                    className="p-8 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group text-left"
                                >
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <TrendingUp size={24} />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-2">I'm an Investor</h4>
                                    <p className="text-sm text-slate-500">Access vetted deal flow and manage your AI portfolio.</p>
                                </Link>

                                <Link
                                    to="/register/startup"
                                    className="p-8 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group text-left"
                                >
                                    <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Rocket size={24} />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-2">I'm a Founder</h4>
                                    <p className="text-sm text-slate-500">Showcase your startup and connect with smart capital.</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Dark/Light Split Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex h-20 px-8 items-center justify-between border-b border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <Infinity className="text-blue-500 w-8 h-8" />
                    <span className="text-xl font-black tracking-tighter text-white uppercase mix-blend-difference">INFINITETECHAI</span>
                </div>

                <div className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-tight text-white mix-blend-difference">
                    <a href="#about" className="hover:text-blue-500 transition-colors">About</a>
                    <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
                    <a href="#stories" className="hover:text-blue-500 transition-colors">Stories</a>
                    <Link
                        to={isStartupView ? "/login/startup" : isInvestorView ? "/login/investor" : "/login"}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                    >
                        Sign In
                    </Link>
                </div>
            </nav>

            {/* Unified Hero */}
            <div className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-slate-50 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">The Global Standard for Private Markets</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                        Capital Meets <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Innovation.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl text-slate-500 font-medium leading-relaxed">
                        The all-in-one operating system for founders to raise capital and investors to deploy it with algorithmic precision.
                    </p>

                    {/* Role Toggle / Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                        <div className="p-1.5 bg-white border border-slate-200 rounded-2xl shadow-lg flex items-center">
                            <Link
                                to="/register/startup"
                                className="px-8 py-3 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-2"
                            >
                                <Rocket size={16} /> I'm a Founder
                            </Link>
                            <Link
                                to="/register/investor"
                                className="px-8 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-2"
                            >
                                <TrendingUp size={16} /> I'm an Investor
                            </Link>
                        </div>
                    </div>

                    <div className="pt-12 flex items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Simple Trust indicators */}
                        <span className="text-sm font-bold text-slate-400">Trusted by modern teams at</span>
                        <div className="flex gap-6 font-black text-lg text-slate-300">
                            <span>ACME Inc</span>
                            <span>Global.vc</span>
                            <span>Nebula AI</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Dashboard Section (New) */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <div className="space-y-2">
                            <div className="text-5xl font-black text-blue-600 tracking-tighter">$2.4B</div>
                            <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Capital Deployed</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-5xl font-black text-slate-900 tracking-tighter">850+</div>
                            <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Vetted Investors</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-5xl font-black text-blue-600 tracking-tighter">1.2k</div>
                            <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Active Pitches</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-5xl font-black text-slate-900 tracking-tighter">98%</div>
                            <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Match Accuracy</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000">
                            <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">The New Standard</div>
                            <h2 className="text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                                Engineering <br />
                                <span className="text-blue-600">The Dealflow.</span>
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-xl font-medium max-w-lg">
                                InfiniteTechAI isn't just a platform; it's a high-entropy engine designed to strip away the inefficiencies of private market fundraising.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-1 bg-blue-600 rounded">
                                        <CheckCircle2 size={16} className="text-white" />
                                    </div>
                                    <p className="text-slate-700 font-bold">Automated Due Diligence workflows for faster closing.</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-1 bg-blue-600 rounded">
                                        <CheckCircle2 size={16} className="text-white" />
                                    </div>
                                    <p className="text-slate-700 font-bold">Encrypted Data Rooms with military-grade security.</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-1 bg-blue-600 rounded">
                                        <CheckCircle2 size={16} className="text-white" />
                                    </div>
                                    <p className="text-slate-700 font-bold">Smart Matching Engine powered by sector-specific data.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative group perspective-1000">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[40px] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative bg-white p-4 rounded-[40px] shadow-2xl border border-slate-200">
                                <img
                                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2670&auto=format&fit=crop"
                                    className="rounded-[30px] w-full aspect-square object-cover shadow-inner"
                                    alt="InfiniteTechAI Core"
                                />
                                <div className="absolute -bottom-10 -right-10 bg-slate-900 text-white p-8 rounded-3xl shadow-2xl max-w-[200px] hidden md:block border-4 border-white animate-bounce-slow">
                                    <TrendingUp size={32} className="text-blue-500 mb-2" />
                                    <p className="text-sm font-bold leading-tight">Closing rounds 3x faster than average.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="bg-[#050505] py-40 relative">
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-8">
                        <div className="space-y-4">
                            <span className="text-blue-500 text-xs font-black tracking-[0.4em] uppercase block">Platform Features</span>
                            <h2 className="text-6xl font-black text-white tracking-tighter leading-none">The Full Stack.</h2>
                        </div>
                        <p className="text-slate-400 max-w-sm text-lg font-medium">Everything needed to manage capital deployment or fundraising rounds globally.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                        {[
                            {
                                icon: <Cpu />,
                                title: "Neural Matching Engine",
                                desc: "Our proprietary AI analyzes 50+ data points including founder DNA, market traction, and investor thesis to predict high-probability matches.",
                                img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop"
                            },
                            {
                                icon: <Network />,
                                title: "Smart Data Rooms",
                                desc: "Secure, tracked document sharing. Know exactly when investors view your pitch deck and which slides they focus on.",
                                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop"
                            },
                            {
                                icon: <MessageSquare />,
                                title: "Direct Founder Access",
                                desc: "Bypass the warm intro barrier. Our direct messaging channel connects verified founders with decision-making partners instantly.",
                                img: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2000&auto=format&fit=crop"
                            },
                            {
                                icon: <PieChart />,
                                title: "Live Portfolio Tracking",
                                desc: "Investors get a real-time dashboard of their portfolio performance, burn rates, and growth metrics in one unified view.",
                                img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop"
                            },
                            {
                                icon: <Lock />,
                                title: "Military-Grade Security",
                                desc: "End-to-end encryption for all sensitive financial data and intellectual property. Your competitive advantage stays protected.",
                                img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2000&auto=format&fit=crop"
                            },
                            {
                                icon: <Globe />,
                                title: "Global Deal Flow",
                                desc: "Break geographical boundaries. Access high-growth startups from Silicon Valley to Singapore without leaving your office.",
                                img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop"
                            }
                        ].map((f, i) => (
                            <div key={i} className="group relative">
                                <div className="aspect-[16/10] overflow-hidden rounded-3xl mb-8 relative">
                                    <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-transparent transition-all z-10"></div>
                                    <img src={f.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={f.title} />
                                    <div className="absolute top-6 left-6 z-20 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        {f.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-blue-500 transition-colors">{f.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section id="stories" className="py-40 bg-white">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                        <div className="space-y-4">
                            <span className="text-blue-600 text-xs font-black tracking-[0.4em] uppercase block">Proof of Concept</span>
                            <h2 className="text-6xl font-black tracking-tight text-slate-900 leading-none">Battle-Tested.</h2>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">
                            <ArrowUpRight className="text-blue-600" /> Over 450 Rounds Closed
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="group space-y-8">
                            <div className="relative h-[500px] overflow-hidden rounded-[40px]">
                                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Success Story" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                                <div className="absolute bottom-10 left-10 right-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest leading-none">Series B Secured</span>
                                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-xl text-[10px] font-black uppercase tracking-widest leading-none">FinTech</span>
                                    </div>
                                    <h4 className="text-4xl font-black text-white mb-4 tracking-tighter leading-tight">Velox AI raised $45M from Tier-1 VCs.</h4>
                                    <p className="text-slate-300 font-medium italic text-lg leading-relaxed">
                                        "The Neural Matching system connected us with the right leads within 24 hours. InfiniteTechAI is the only tool we use for deal-flow management."
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="group space-y-8">
                            <div className="relative h-[500px] overflow-hidden rounded-[40px]">
                                <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Success Story" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                                <div className="absolute bottom-10 left-10 right-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest leading-none">Seed Round Closed</span>
                                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-xl text-[10px] font-black uppercase tracking-widest leading-none">CleanTech</span>
                                    </div>
                                    <h4 className="text-4xl font-black text-white mb-4 tracking-tighter leading-tight">EcoCharge closed $3.2M Seed in 21 days.</h4>
                                    <p className="text-slate-300 font-medium italic text-lg leading-relaxed">
                                        "As a first-time founder, the automated DD checklists were a lifesaver. We were investor-ready in under a week."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-24 px-8 border-t border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 opacity-5 blur-[120px]"></div>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 relative z-10">
                    <div className="lg:col-span-4 space-y-8">
                        <div className="flex items-center gap-3">
                            <Infinity className="text-blue-500 w-10 h-10" />
                            <span className="text-2xl font-black tracking-tighter text-white uppercase">INFINITETECHAI</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                            The future of capital deployment is automated, secure, and data-driven. We are building the infrastructure for the next generation of global innovation.
                        </p>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12">
                        <div className="space-y-6">
                            <h5 className="text-white font-black text-xs uppercase tracking-[0.2em]">Platform</h5>
                            <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <li><a href="#" className="hover:text-blue-500 transition-colors">Startups</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition-colors">Investors</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition-colors">Enterprise</a></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h5 className="text-white font-black text-xs uppercase tracking-[0.2em]">Legal</h5>
                            <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition-colors">Security</a></li>
                            </ul>
                        </div>
                        <div className="md:col-span-2 space-y-10 flex flex-col items-center md:items-end">
                            <button onClick={() => setShowSelection(true)} className="px-10 py-5 bg-white text-slate-900 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95">
                                Join The Network
                            </button>
                            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] text-center md:text-right">
                                © 2024 BusinessDevelopment Connect. <br /> All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
