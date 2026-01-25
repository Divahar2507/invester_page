import React from 'react';
import {
    CreditCard,
    Download,
    ChevronRight,
    ArrowUpRight,
    Mail,
    Clock,
    CheckCircle2,
    ExternalLink,
    Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Subscription = () => {
    const billingHistory = [
        { date: 'Oct 24, 2023', amount: '$49.00', status: 'Paid' },
        { date: 'Sep 24, 2023', amount: '$49.00', status: 'Paid' },
        { date: 'Aug 24, 2023', amount: '$49.00', status: 'Paid' },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscription & Billing</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your plan, payment details, and invoices.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                    <Mail size={18} />
                    Contact Support
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Billing Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-black text-slate-900">Pro Growth</h2>
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">Active</span>
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">Monthly</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-slate-900">$49</span>
                                        <span className="text-slate-400 font-bold">/mo</span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium mt-4 flex items-center gap-2 text-slate-400">
                                        Next billing date: <span className="text-slate-900 font-bold uppercase tracking-tight">November 24, 2023</span>
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row gap-4 items-center">
                                <Link to="/plans" className="flex-1 w-full text-center px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                    Upgrade Plan
                                </Link>
                                <button className="flex-1 w-full text-center px-6 py-4 bg-white text-rose-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-50 transition-all">
                                    Cancel Subscription
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Billing History */}
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-50">
                            <h3 className="text-xl font-black text-slate-900">Billing History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {billingHistory.map((invoice, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5 text-sm font-bold text-slate-700">{invoice.date}</td>
                                            <td className="px-8 py-5 text-sm font-black text-slate-900">{invoice.amount}</td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tight rounded-full">
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                    <Download size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-8">
                    {/* Payment Method */}
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900">Payment Method</h3>
                            <CreditCard className="text-slate-300 group-hover:text-blue-500 transition-colors" size={24} />
                        </div>

                        <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 mb-6 relative group/card cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-8 bg-slate-900 rounded flex items-center justify-center font-black text-[10px] text-white">VISA</div>
                                <div className="flex-1">
                                    <p className="text-xs font-black text-slate-900 mb-0.5">•••• 4242</p>
                                    <p className="text-[10px] font-bold text-slate-400">Expires 12/24</p>
                                </div>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[8px] font-black uppercase tracking-tighter rounded">Primary</span>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                            <Plus size={14} /> Update Payment Method
                        </button>
                    </div>

                    {/* Referral Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[32px] text-white overflow-hidden relative shadow-2xl shadow-blue-500/20">
                        <div className="relative z-10">
                            <ArrowUpRight size={32} className="mb-6 opacity-40" />
                            <h3 className="text-2xl font-black mb-2">Refer a <br />Founder.</h3>
                            <p className="text-blue-100 text-sm font-medium mb-8 leading-relaxed">Credit $100 to your account for every successful institutional partner verification.</p>
                            <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg shadow-black/10 active:scale-95">
                                Copy Invite Link
                            </button>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
