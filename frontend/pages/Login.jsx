import * as React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Loader2, Eye, EyeOff, TrendingUp } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await api.login(email, password);
            localStorage.setItem('token', data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Top Navbar */}
            <div className="w-full px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                        <TrendingUp size={18} className="text-white" />
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tight">StartupPitch</span>
                </div>
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Return to Home</Link>
                    <Link to="/contact-support" className="px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-all text-sm">
                        Contact Support
                    </Link>
                </div>
            </div>

            {/* Main Content Split Layout */}
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/50">
                <div className="w-full max-w-[1240px] bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 overflow-hidden flex min-h-[720px]">

                    {/* Left Panel: Image and Text */}
                    <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900">
                        <img
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                            alt="Modern office buildings"
                            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-900/20 to-transparent"></div>

                        <div className="relative z-10 w-full p-16 flex flex-col justify-between">
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 w-fit">
                                <TrendingUp size={16} className="text-blue-400" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Investor Portal</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-6xl font-black text-white leading-tight tracking-tight">
                                    Discover the <br />Next Unicorn
                                </h2>
                                <p className="text-xl text-slate-300 font-medium max-w-md leading-relaxed">
                                    Join the world's most exclusive network of startup investors. Access curated deal flow and manage your portfolio with real-time insights.
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                            <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Investor" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-blue-600 flex items-center justify-center text-xs font-bold text-white relative z-10">
                                        +2k
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Active Investors</p>
                                    <p className="text-xs text-slate-400 font-medium">Joined this month</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Form */}
                    <div className="w-full lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center">
                        <div className="max-w-md w-full mx-auto space-y-10">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back, Investor</h1>
                                <p className="text-slate-500 font-medium mt-3">Log in to access your deal flow and portfolio.</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-900 ml-1">Work Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@firm.vc"
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-300 shadow-sm"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-sm font-bold text-slate-900">Password</label>
                                        <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</a>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-300 shadow-sm pr-14"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors p-1"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg tracking-tight"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Log In'}
                                </button>
                            </form>

                            <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-600">New user?</span>
                                <Link to="/register" className="px-8 py-3 bg-white border border-slate-200 text-slate-900 font-black rounded-xl hover:bg-slate-50 transition-all shadow-sm text-sm tracking-tight active:scale-95">
                                    Sign In
                                </Link>
                            </div>

                            <div className="flex items-center justify-center gap-6 pt-10">
                                <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Privacy Policy</a>
                                <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
