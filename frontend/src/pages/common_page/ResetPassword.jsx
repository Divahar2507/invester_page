import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Loader2, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing reset token.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus('error');
            setMessage("Passwords don't match.");
            return;
        }

        setLoading(true);
        setStatus('idle');
        try {
            await api.resetPassword(token, password);
            setStatus('success');
            setMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login/generic'); // Default generic login
            }, 3000);
        } catch (err) {
            setStatus('error');
            setMessage('Failed to reset password. Link might be expired.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans text-slate-100">
                <div className="text-center p-8">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold mb-2">Invalid Link</h1>
                    <p className="text-slate-400">This password reset link is invalid or expired.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-100">
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-900">
                <div className="w-full max-w-md bg-slate-800/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
                            <Lock size={24} />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Set New Password</h1>
                        <p className="text-slate-400 text-sm mt-2">Enter your new password below.</p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white animate-bounce">
                                <CheckCircle2 size={32} />
                            </div>
                            <p className="text-xl font-bold text-white">Success!</p>
                            <p className="text-slate-400 text-sm">You can now use your new password to log in.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-white placeholder:text-slate-600"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
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
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
