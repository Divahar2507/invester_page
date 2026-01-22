import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Loader2, DollarSign, PieChart, MapPin, Tag, FileText } from 'lucide-react';
import { api } from '../../services/api';

const CreatePitch = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        raising_amount: '',
        equity_percentage: '',
        valuation: '',
        location: '',
        tags: '',
        pitch_file_url: null,
    });

    useEffect(() => {
        if (isEditing) {
            fetchPitch();
        }
    }, [id]);

    const fetchPitch = async () => {
        try {
            const data = await api.getPitch(id);
            setFormData({
                title: data.title || '',
                description: data.description || '',
                raising_amount: data.raising_amount || '',
                equity_percentage: data.equity_percentage || '',
                valuation: data.valuation || '',
                location: data.location || '',
                tags: data.tags || '',
                pitch_file_url: data.pitch_file_url
            });
        } catch (error) {
            console.error("Failed to load pitch", error);
            alert("Failed to load pitch details");
            navigate('/dashboard');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                title: formData.title,
                description: formData.description || "",
                raising_amount: formData.raising_amount ? formData.raising_amount.toString() : "",
                equity_percentage: formData.equity_percentage ? formData.equity_percentage.toString() : "",
                valuation: formData.valuation ? formData.valuation.toString() : "",
                location: formData.location ? formData.location.toString() : "",
                tags: formData.tags ? formData.tags.toString() : ""
            };

            if (isEditing) {
                // We need an updatePitch method in api.js. 
                // Assuming it will be added shortly.
                await api.updatePitch(id, payload);
            } else {
                await api.createPitch(payload);
            }
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to save pitch", error);
            alert("Failed to save pitch: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-8 font-['Plus Jakarta Sans']">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{isEditing ? 'Edit Pitch' : 'Create New Pitch'}</h1>
            <p className="text-slate-500 mb-8">{isEditing ? 'Update your pitch details.' : 'Share your startup with our network of investors.'}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700">Pitch Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="e.g. Next-Gen AI for Healthcare"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700">Short Description</label>
                        <textarea
                            name="description"
                            required
                            rows="4"
                            placeholder="Describe your startup, problem, solution, and traction..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700 flex items-center gap-2"><DollarSign size={16} /> Asking Amount ($)</label>
                            <input
                                type="text"
                                name="raising_amount"
                                required
                                placeholder="e.g. 500,000"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                value={formData.raising_amount}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700 flex items-center gap-2"><PieChart size={16} /> Equity Offered (%)</label>
                            <input
                                type="number"
                                name="equity_percentage"
                                required
                                placeholder="e.g. 10"
                                step="0.1"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                value={formData.equity_percentage}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700 flex items-center gap-2"><MapPin size={16} /> Location</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. San Francisco, CA"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700 flex items-center gap-2"><Tag size={16} /> Tags (comma separated)</label>
                            <input
                                type="text"
                                name="tags"
                                placeholder="e.g. AI, B2B, SaaS"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                value={formData.tags}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isEditing ? 'Update Pitch' : 'Publish Pitch')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePitch;
