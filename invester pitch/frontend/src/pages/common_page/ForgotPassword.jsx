import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api'; // I'll need to update api.js too
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, success, error
    const [message, setMessage] = useState('');

    const [devLink, setDevLink] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');
        setMessage('');
        setDevLink(null);
        try {
            const response = await api.forgotPassword(email);
            setStatus('success');
            setMessage('If an account exists with this email, we have sent a password reset link.');
            if (response.dev_link) {
                setDevLink(response.dev_link);
            }
        } catch (err) {
            setStatus('error');
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-100">
            {/* Simple Navbar */}
            <div className="w-full px-8 py-5 flex items-center">
                <Link to="/login/generic" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
                    <ArrowLeft size={16} /> Back to Login
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 bg-slate-900">
                <div className="w-full max-w-md bg-slate-800/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
                            <Mail size={24} />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Forgot Password?</h1>
                        <p className="text-slate-400 text-sm mt-2">No worries, we'll send you reset instructions.</p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center space-y-6">
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-medium">
                                {message}
                            </div>
                            <p className="text-slate-500 text-xs">
                                Check your email (and spam folder) for the link.
                            </p>

                            {devLink && (
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-xs text-left break-all">
                                    <p className="font-bold mb-1">[DEV MODE] Click below to reset:</p>
                                    <a href={devLink} className="underline hover:text-yellow-300">{devLink}</a>
                                </div>
                            )}

                            <Link to="/" className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all">
                                Return Home
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-white placeholder:text-slate-600"
                                    required
                                />
                            </div>

                            {status === 'error' && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold text-center">
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
