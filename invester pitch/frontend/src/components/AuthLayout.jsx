import * as React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            {/* Navbar */}
            <header className="w-full bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">VentureFlow</span>
                </div>
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link to="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                        Return to Home
                    </Link>
                    <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                        Contact Support
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] md:min-h-[700px]">

                    {/* Left Panel - Hero Section */}
                    <div className="relative w-full md:w-5/12 bg-slate-900 hidden md:flex flex-col justify-between p-12 overflow-hidden">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"
                                alt="Skyscrapers"
                                className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-slate-900/40" />
                        </div>

                        {/* Top Content */}
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm shadow-sm mb-8">
                                <TrendingUp className="w-4 h-4 text-blue-200" />
                                <span className="text-xs font-bold text-blue-100 tracking-wider">INVESTOR PORTAL</span>
                            </div>
                        </div>

                        {/* Bottom Content */}
                        <div className="relative z-10">
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                Discover the <br />
                                <span className="text-blue-200">Next Unicorn</span>
                            </h1>
                            <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-sm">
                                Join the world's most exclusive network of startup investors. Access curated deal flow and manage your portfolio with real-time insights.
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-200 flex items-center justify-center overflow-hidden relative" style={{ zIndex: i }}>
                                            <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Investor" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-blue-100 flex items-center justify-center relative z-10">
                                        <span className="text-xs font-bold text-blue-700">+2k</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Active Investors</p>
                                    <p className="text-slate-400 text-xs">Joined this month</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Form Section */}
                    <div className="w-full md:w-7/12 p-8 md:p-16 overflow-y-auto flex flex-col justify-center relative bg-white">
                        {children}

                        {/* Footer Links */}
                        <div className="mt-12 flex items-center justify-center gap-8 text-xs text-slate-400">
                            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default AuthLayout;
