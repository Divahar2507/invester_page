import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Loader2, ArrowLeft, FileText, Calendar, DollarSign, Percent, Zap, TrendingUp, Briefcase } from 'lucide-react';

const InvestmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [investment, setInvestment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvestment = async () => {
            try {
                const data = await api.getInvestment(id);
                setInvestment(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load investment details.");
            } finally {
                setLoading(false);
            }
        };
        fetchInvestment();
    }, [id]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    if (error) return (
        <div className="flex h-screen flex-col items-center justify-center bg-slate-50 gap-4">
            <p className="text-red-500 font-bold">{error}</p>
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg">Go Back</button>
        </div>
    );

    if (!investment) return null;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 font-['Plus Jakarta Sans'] animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/portfolio')} className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
                    <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{investment.startup_name}</h1>
                    <p className="text-slate-500 text-sm">Investment Details</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount Invested</label>
                        <div className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                            <DollarSign className="text-emerald-500" size={24} />
                            {investment.amount.toLocaleString()}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Equity Stake</label>
                        <div className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                            <Percent className="text-blue-500" size={24} />
                            {investment.equity_stake !== null && investment.equity_stake !== undefined ? `${investment.equity_stake}%` : 'N/A'}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Round</label>
                        <div className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                            <Zap className="text-amber-500" size={24} />
                            {investment.round}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</label>
                        <div className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                            <Calendar className="text-rose-500" size={24} />
                            {new Date(investment.date).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileText size={20} className="text-slate-400" />
                        Notes & Documents
                    </h3>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-700 leading-relaxed dark:text-slate-300">
                        {investment.notes || "No notes added."}
                    </div>

                    {investment.document_url && (
                        <div className="mt-4">
                            <button
                                onClick={() => {
                                    const url = investment.document_url.startsWith('http')
                                        ? investment.document_url
                                        : `http://localhost:8000${investment.document_url}`;
                                    window.open(url, '_blank');
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
                            >
                                <FileText size={18} />
                                View Attached Document
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvestmentDetails;
