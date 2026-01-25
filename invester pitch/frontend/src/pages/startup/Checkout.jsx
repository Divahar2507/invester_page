import React from 'react';
import {
    ChevronLeft,
    CreditCard,
    ShieldCheck,
    Lock,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();

    return (
        <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-right-8 duration-700 pb-20">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-8 hover:text-slate-900 transition-colors">
                <ChevronLeft size={20} />
                Back to Plans
            </button>

            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-12">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Side: Form */}
                <div className="lg:col-span-7 space-y-10">
                    {/* Billing Cycle Selection */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billing Cycle</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 rounded-[24px] border-2 border-blue-600 bg-blue-50/30 relative cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-black text-slate-900">Monthly</span>
                                    <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                                    </div>
                                </div>
                                <p className="text-2xl font-black text-slate-900">₹999</p>
                                <p className="text-xs font-bold text-slate-400">Billed monthly</p>
                            </div>

                            <div className="p-6 rounded-[24px] border border-slate-100 bg-white relative cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-black text-slate-900">Annually</span>
                                    <div className="w-5 h-5 rounded-full border border-slate-200" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-2xl font-black text-slate-900">₹799</p>
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase rounded">Save 20%</span>
                                </div>
                                <p className="text-xs font-bold text-slate-400">₹9,588 / year</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-4 pt-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</p>
                        <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                            <div className="flex items-center gap-6 border-b border-slate-50 pb-6">
                                <button className="flex items-center gap-2 text-sm font-black text-blue-600 border-b-2 border-blue-600 pb-2">
                                    <CreditCard size={18} /> Credit Card
                                </button>
                                <button className="flex items-center gap-2 text-sm font-bold text-slate-400 pb-2">
                                    PayPal
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Cardholder Name</label>
                                    <input type="text" placeholder="Alex Morgan" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none font-bold transition-all" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Card Number</label>
                                    <div className="relative">
                                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none font-bold tracking-widest transition-all" />
                                        <CreditCard size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Expiry Date</label>
                                        <input type="text" placeholder="MM / YY" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none font-bold transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">CVC / CVC2</label>
                                        <input type="text" placeholder="123" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none font-bold transition-all" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 ml-1 pt-2">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-200" />
                                    <span className="text-xs font-bold text-slate-500">Save this card for future billing</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-8">
                        <button className="px-8 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95">
                            Confirm Upgrade <ArrowRight size={18} />
                        </button>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Lock size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Encrypted & Secure</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-slate-900 rounded-[40px] p-10 text-white sticky top-24">
                        <h3 className="text-xl font-black mb-10">Order Summary</h3>

                        <div className="space-y-6 mb-10 pb-10 border-b border-white/10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-black text-lg">Pro Growth</p>
                                    <p className="text-xs font-bold text-white/40 italic">Monthly Plan</p>
                                </div>
                                <span className="font-black text-xl">₹999</span>
                            </div>

                            <div className="flex justify-between items-center text-sm font-bold text-white/60">
                                <span>Subtotal</span>
                                <span>₹999.00</span>
                            </div>

                            <div className="flex justify-between items-center text-sm font-bold text-white/60">
                                <span>Tax (0%)</span>
                                <span>₹0.00</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-10">
                            <span className="text-lg font-black uppercase tracking-widest text-white/40">Total Due</span>
                            <span className="text-4xl font-black tracking-tighter">₹999.00</span>
                        </div>

                        <div className="bg-white/5 p-6 rounded-3xl space-y-4">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">You'll Get:</p>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={16} className="text-blue-500" />
                                <span className="text-xs font-bold">Unlimited Active Pitches</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={16} className="text-blue-500" />
                                <span className="text-xs font-bold">Advanced Visitor Analytics</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={16} className="text-blue-500" />
                                <span className="text-xs font-bold">AI Investor Matching (50/mo)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={16} className="text-blue-500" />
                                <span className="text-xs font-bold">Custom Branding & Domain</span>
                            </div>
                        </div>

                        <p className="mt-10 text-[9px] text-white/30 font-medium leading-relaxed text-center">
                            By confirming your subscription, you allow PitchDeck AI to charge your card for future payments in accordance with our <span className="underline cursor-pointer">Terms.</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
