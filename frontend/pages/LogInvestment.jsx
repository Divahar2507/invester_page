import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Loader2, ArrowLeft, CheckCircle2, Upload, ChevronDown, DollarSign, Calendar, Percent, FileText, Briefcase, Zap } from 'lucide-react';

const LogInvestment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const fileInputRef = React.useRef(null);

    const [formData, setFormData] = useState({
        startup_name: '',
        round: '',
        amount: '',
        date: '',
        equity_stake: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) setFile(selectedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.createInvestment({
                startup_name: formData.startup_name,
                amount: parseFloat(formData.amount),
                date: formData.date || new Date().toISOString().split('T')[0],
                round: formData.round || 'Seed',
                notes: formData.notes,
                status: 'Active',
                file: file
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/portfolio');
            }, 1500);
        } catch (err) {
            console.error(err);
            const msg = err.message || 'Failed to log investment';
            // Check for specific duplicate message OR generic 400 which usually implies duplicate in this context
            if (err.status === 403) {
                setError('Permission Denied: You must be logged in as an Investor to perform this action.');
            } else if (
                msg.toLowerCase().includes('already in your portfolio') ||
                msg.toLowerCase().includes('duplicate') ||
                err.status === 400
            ) {
                setError('You have already added this startup to your portfolio (Duplicate Entry).');
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center font-['Plus Jakarta Sans'] animate-in fade-in duration-500 bg-slate-50">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Investment Logged</h3>
                <p className="text-slate-500 text-base">Redirecting to portfolio...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 font-['Plus Jakarta Sans'] animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
                    <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Log New Investment</h1>
                    <p className="text-slate-500 text-sm">Record a new investment transaction for your portfolio.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Startup Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Briefcase size={16} className="text-blue-500" />
                                Startup Name
                            </label>
                            <input
                                type="text"
                                name="startup_name"
                                value={formData.startup_name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 font-medium text-base placeholder:text-slate-400"
                                placeholder="e.g. EcoCharge AI"
                            />
                        </div>

                        {/* Funding Round */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Zap size={16} className="text-amber-500" />
                                Funding Round
                            </label>
                            <div className="relative">
                                <select
                                    name="round"
                                    value={formData.round}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 font-medium text-base appearance-none cursor-pointer"
                                >
                                    <option value="" disabled className="text-slate-400">Select round</option>
                                    <option value="Pre-Seed">Pre-Seed</option>
                                    <option value="Seed">Seed</option>
                                    <option value="Series A">Series A</option>
                                    <option value="Series B">Series B</option>
                                    <option value="Series C+">Series C+</option>
                                    <option value="SAFE">SAFE Note</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>

                        {/* Investment Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <DollarSign size={16} className="text-emerald-500" />
                                Investment Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 font-medium text-base placeholder:text-slate-400"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Investment Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Calendar size={16} className="text-rose-500" />
                                Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 font-medium text-base appearance-none cursor-pointer"
                                />
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Equity Stake & Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Percent size={16} className="text-indigo-500" />
                                Equity Stake
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="equity_stake"
                                    value={formData.equity_stake}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 font-medium text-base placeholder:text-slate-400"
                                    placeholder="0.00"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">%</span>
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <FileText size={16} className="text-slate-500" />
                                Notes
                            </label>
                            <input
                                type="text"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 font-medium placeholder:text-slate-400"
                                placeholder="Add notes about this investment..."
                            />
                        </div>
                    </div>

                    {/* Deal Documents */}
                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-slate-700">Documents</label>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-10 text-center group transition-all cursor-pointer ${isDragging
                                ? 'border-blue-500 bg-blue-50'
                                : file
                                    ? 'border-emerald-400 bg-emerald-50'
                                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-200'
                                }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-white shadow-sm text-slate-400 group-hover:text-blue-500'}`}>
                                {file ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                            </div>
                            <h4 className="text-base font-bold text-slate-900 mb-1">
                                {file ? file.name : 'Upload Documents'}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium">
                                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Drag and drop or click to upload'}
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="px-8 pb-6 animate-in slide-in-from-top-2">
                        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-medium flex items-center gap-2">
                            <Zap size={16} className="fill-rose-600 text-white" />
                            {error}
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="text-slate-500 font-medium text-sm hover:text-slate-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-sm transition-all disabled:opacity-50 text-sm"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                        Save Investment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LogInvestment;

