import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Loader2, ArrowLeft, CheckCircle2, Upload, ChevronDown, DollarSign, Calendar, Percent, FileText } from 'lucide-react';

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
                status: 'Active'
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/portfolio');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to log investment');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-100/50">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Investment Logged!</h3>
                <p className="text-slate-500 text-lg">Your portfolio has been updated successfully.</p>
                <p className="text-slate-400 mt-2">Redirecting to portfolio...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Log Investment</h1>
                <p className="text-slate-500 mt-2 text-lg">Record the details of your new portfolio addition.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden shadow-slate-200/50">
                <div className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Startup Name */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-900 ml-1">Startup Name</label>
                            <input
                                type="text"
                                name="startup_name"
                                value={formData.startup_name}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                placeholder="e.g. EcoCharge"
                            />
                        </div>

                        {/* Funding Round */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-900 ml-1">Funding Round</label>
                            <div className="relative">
                                <select
                                    name="round"
                                    value={formData.round}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900 font-medium appearance-none"
                                >
                                    <option value="" disabled>Select round</option>
                                    <option value="Pre-Seed">Pre-Seed</option>
                                    <option value="Seed">Seed</option>
                                    <option value="Series A">Series A</option>
                                    <option value="Series B">Series B</option>
                                    <option value="Series C+">Series C+</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>

                        {/* Investment Amount */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-900 ml-1">Investment Amount</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Investment Date */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-900 ml-1">Investment Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900 font-medium appearance-none"
                                />
                                <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Equity Stake */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-900 ml-1">Equity Stake <span className="text-slate-400 font-normal">(Optional)</span></label>
                        <div className="relative">
                            <input
                                type="number"
                                name="equity_stake"
                                value={formData.equity_stake}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                placeholder="0"
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                        </div>
                    </div>

                    {/* Relevant Notes */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-900 ml-1">Relevant Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[24px] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900 font-medium placeholder:text-slate-400/50 resize-none leading-relaxed"
                            placeholder="Enter any additional details about the deal, co-investors, or specific terms..."
                        />
                    </div>

                    {/* Deal Documents */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-900 ml-1">Deal Documents</label>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-[32px] p-12 text-center group transition-all cursor-pointer ${isDragging
                                ? 'border-blue-500 bg-blue-50'
                                : file
                                    ? 'border-emerald-400 bg-emerald-50/30'
                                    : 'border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/50'
                                }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600 group-hover:scale-110'}`}>
                                {file ? <CheckCircle2 size={28} /> : <Upload size={28} />}
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-1">
                                {file ? file.name : 'Click to upload or drag and drop'}
                            </h4>
                            <p className="text-sm text-slate-400 font-medium uppercase tracking-widest text-[10px]">
                                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'PDF, DOCX, XLSX (max. 10MB)'}
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="px-10 pb-4">
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-6">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-10 py-4 text-slate-500 font-bold hover:text-slate-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                        Submit Investment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LogInvestment;
