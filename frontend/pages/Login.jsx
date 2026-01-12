import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';
import { Loader2, Eye, EyeOff, TrendingUp, Lightbulb, ArrowLeft } from 'lucide-react';

const Login = ({ role }) => {
    // If role is passed via prop, use it. Otherwise default to generic or 'investor' for now, or detect from URL if needed.
    // In our App.jsx, we pass role="investor" or role="startup". "generic" if none (like /login).

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Theme Configuration based on Role
    const isStartup = role === 'startup';
    const isInvestor = role === 'investor';

    // Dynamic Content
    const title = isStartup ? "Welcome Back, Founder" : "Welcome Back, Investor";
    const subtitle = isStartup ? "Log in to manage your fundraising campaign." : "Log in to access your deal flow and portfolio.";
    const registerLink = isStartup ? "/register/startup" : "/register/investor";

    // Theme Colors (Tailwind classes)
    const accentColor = isStartup ? "purple" : "blue"; // purple for startup, blue for investor
    const accentBg = isStartup ? "bg-purple-600 hover:bg-purple-700 shadow-purple-200" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200";
    const accentText = isStartup ? "text-purple-600" : "text-blue-600";

    const heroImage = isStartup
        ? "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop" // Startup/Teamwork image
        : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"; // City/Finance image

    const heroTitle = isStartup ? "Build the Future" : "Discover the Next Unicorn";
    const heroDesc = isStartup
        ? "Connect with world-class investors who share your vision. turning your ideas into reality."
        : "Join the world's most exclusive network of startup investors. Access curated deal flow.";

    const Icon = isStartup ? Lightbulb : TrendingUp;

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
        <div className="min-h-screen bg-white flex flex-col font-mono">
            {/* Top Navbar */}
            <div className="w-full px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className={`${isStartup ? 'bg-purple-600' : 'bg-blue-600'} w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                            <Icon size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-black text-slate-900 tracking-tight">Portal</span>
                    </Link>
                </div>
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                        <ArrowLeft size={16} /> Return to Home
                    </Link>
                    <Link to="/contact-support" className={`px-6 py-2.5 ${isStartup ? 'bg-purple-50 text-purple-600 hover:bg-purple-100' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'} font-bold rounded-xl transition-all text-sm`}>
                        Contact Support
                    </Link>
                </div>
            </div>

            {/* Main Content Split Layout */}
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/50">
                <div className="w-full max-w-[1240px] bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 overflow-hidden flex min-h-[720px]">

                    {/* Left Panel: Image and Text */}
                    <div className={`hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900`}>
                        <img
                            src={heroImage}
                            alt="Background"
                            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-br ${isStartup ? 'from-purple-900/40 via-purple-900/20' : 'from-blue-900/40 via-blue-900/20'} to-transparent`}></div>

                        <div className="relative z-10 w-full p-16 flex flex-col justify-between">
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 w-fit">
                                <Icon size={16} className={isStartup ? "text-purple-400" : "text-blue-400"} />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{isStartup ? "For Founders" : "Investor Portal"}</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-6xl font-black text-white leading-tight tracking-tight">
                                    {isStartup ? <>Build the <br /> Future</> : <>Discover the <br />Next Unicorn</>}
                                </h2>
                                <p className="text-xl text-slate-300 font-medium max-w-md leading-relaxed">
                                    {heroDesc}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                            <img src={`https://i.pravatar.cc/150?img=${i + 10 + (isStartup ? 5 : 0)}`} alt="User" />
                                        </div>
                                    ))}
                                    <div className={`w-12 h-12 rounded-full border-4 border-slate-900 ${isStartup ? 'bg-purple-600' : 'bg-blue-600'} flex items-center justify-center text-xs font-bold text-white relative z-10`}>
                                        +2k
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Active {isStartup ? "Founders" : "Investors"}</p>
                                    <p className="text-xs text-slate-400 font-medium">Joined this month</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Form */}
                    <div className="w-full lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center">
                        <div className="max-w-md w-full mx-auto space-y-10">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
                                <p className="text-slate-500 font-medium mt-3">{subtitle}</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-900 ml-1">Work Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className={`w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 ${isStartup ? 'focus:ring-purple-500/10 focus:border-purple-500' : 'focus:ring-blue-500/10 focus:border-blue-500'} transition-all font-medium text-slate-900 placeholder:text-slate-300 shadow-sm`}
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-sm font-bold text-slate-900">Password</label>
                                        <Link to="/forgot-password" className={`text-sm font-bold ${accentText} hover:opacity-80 transition-colors`}>Forgot Password?</Link>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className={`w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 ${isStartup ? 'focus:ring-purple-500/10 focus:border-purple-500' : 'focus:ring-blue-500/10 focus:border-blue-500'} transition-all font-medium text-slate-900 placeholder:text-slate-300 shadow-sm pr-14`}
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
                                    className={`w-full py-5 ${accentBg} text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg tracking-tight hover:shadow-2xl`}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Log In'}
                                </button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-slate-400 font-bold">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex justify-center">
                                    <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            try {
                                                const roleToUse = role || 'investor'; // Default to investor if not specified
                                                const data = await api.googleLogin(credentialResponse.credential, roleToUse);
                                                localStorage.setItem('token', data.access_token);
                                                navigate('/dashboard');
                                            } catch (err) {
                                                console.error('Google Backend Login Failed', err);
                                                alert('Google Login Failed: ' + err.message);
                                            }
                                        }}
                                        onError={() => {
                                            console.log('Login Failed');
                                            alert('Google Login Failed');
                                        }}
                                        useOneTap
                                        theme="outline"
                                        shape="circle"
                                        text="signin_with"
                                        width="100%"
                                    />
                                </div>
                                <button type="button" onClick={() => alert("LinkedIn Login Logic (Requires API Key)")} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 h-[40px]">
                                    <svg className="w-5 h-5" fill="#0077b5" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                    <span className="font-bold text-slate-700 text-sm">LinkedIn</span>
                                </button>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-600">New user?</span>
                                <Link to={registerLink} className="px-8 py-3 bg-white border border-slate-200 text-slate-900 font-black rounded-xl hover:bg-slate-50 transition-all shadow-sm text-sm tracking-tight active:scale-95">
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
