import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Check, X, ShieldCheck } from 'lucide-react';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [showCur, setShowCur] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConf, setShowConf] = useState(false);
    const [password, setPassword] = useState('');

    const requirements = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'Contains a number', met: /\d/.test(password) },
        { label: 'Contains a special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
        { label: 'Contains an uppercase letter', met: /[A-Z]/.test(password) }
    ];

    const strength = requirements.filter(r => r.met).length;
    const strengthColor = strength === 4 ? 'bg-emerald-500' : strength >= 2 ? 'bg-orange-500' : 'bg-red-500';
    const strengthLabel = strength === 4 ? 'Strong' : strength >= 2 ? 'Fair' : 'Weak';

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">Change Password</h1>
                <p className="text-slate-500 mt-2">Update your password to keep your account secure. Use a strong password you haven't used before.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                        <div className="relative">
                            <input
                                type={showCur ? 'text' : 'password'}
                                placeholder="Enter current password"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            />
                            <button onClick={() => setShowCur(!showCur)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                {showCur ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest">Forgot password?</button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                                <button onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Meter */}
                        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-500 uppercase">Password Strength</span>
                                <span className={`text-[10px] uppercase font-bold ${strengthColor.replace('bg-', 'text-')}`}>{strengthLabel}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-6">
                                {[1, 2, 3, 4].map(idx => (
                                    <div key={idx} className={`h-1.5 rounded-full ${idx <= strength ? strengthColor : 'bg-slate-200'}`}></div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {requirements.map((req, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
                                            {req.met ? <Check size={10} strokeWidth={4} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>}
                                        </div>
                                        <span className={`text-xs ${req.met ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>{req.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConf ? 'text' : 'password'}
                                placeholder="Re-enter new password"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            />
                            <button onClick={() => setShowConf(!showConf)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                {showConf ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => navigate('/profile')}
                            className="px-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            className="flex items-center gap-2 px-10 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
