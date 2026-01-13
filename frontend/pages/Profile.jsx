import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { User, Mail, Building2, Briefcase, Info, Shield, Bell, Plus, X, Loader2, Save, CheckCircle2 } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        firm_name: '',
        role: 'Managing Partner',
        bio: '',
        sectors: ['FinTech', 'CleanTech', 'SaaS'],
        stages: ['Pre-Seed', 'Seed'],
        minCheck: '100000',
        maxCheck: '500000',
        notifications: {
            'Email Notifications': true,
            'Pitch Match Alerts': true,
            'System Updates': true
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const userData = await api.getMe();
            setUser(userData);

            let profileData;
            if (userData.role === 'startup') {
                profileData = await api.getMyStartupProfile();
            } else {
                profileData = await api.getMyInvestorProfile();
            }

            setProfile(profileData || {});

            // Map fetched data to form
            setFormData({
                name: userData.role === 'startup' ? profileData?.founder_name : (profileData?.contact_name || userData?.name),
                email: userData.email,
                firm_name: (userData.role === 'startup' ? profileData?.company_name : profileData?.firm_name) || 'VentureFlow Capital',
                role: userData.role === 'startup' ? 'Founder' : 'Managing Partner',
                bio: (profileData?.bio || profileData?.founder_bio) || 'Experienced investor focused on early-stage B2B SaaS and CleanTech startups.',
                sectors: profileData?.focus_industries ? profileData.focus_industries.split(',').map(s => s.trim()) : ['FinTech', 'CleanTech', 'SaaS'],
                stages: profileData?.preferred_stage ? profileData.preferred_stage.split(',').map(s => s.trim()) : ['Pre-Seed', 'Seed'],
                minCheck: profileData?.min_check_size?.toString() || '100000',
                maxCheck: profileData?.max_check_size?.toString() || '500000',
                notifications: {
                    'Email Notifications': true,
                    'Pitch Match Alerts': true,
                    'System Updates': true
                }
            });

        } catch (e) {
            console.error("Failed to fetch profile data", e);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleNotification = (item) => {
        if (!isEditing) return;
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [item]: !prev.notifications[item]
            }
        }));
    };

    const toggleStage = (stage) => {
        if (!isEditing) return;
        setFormData(prev => ({
            ...prev,
            stages: prev.stages.includes(stage)
                ? prev.stages.filter(s => s !== stage)
                : [...prev.stages, stage]
        }));
    };

    const removeSector = (sector) => {
        if (!isEditing) return;
        setFormData(prev => ({
            ...prev,
            sectors: prev.sectors.filter(s => s !== sector)
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = user.role === 'startup' ? {
                founder_name: formData.name,
                company_name: formData.firm_name,
                founder_bio: formData.bio,
                // Add other startup fields if needed
            } : {
                contact_name: formData.name,
                firm_name: formData.firm_name,
                bio: formData.bio,
                focus_industries: formData.sectors.join(', '),
                preferred_stage: formData.stages.join(', '),
                min_check_size: parseFloat(formData.minCheck),
                max_check_size: parseFloat(formData.maxCheck)
            };

            if (user.role === 'startup') {
                await api.updateStartupProfile(payload);
            } else {
                await api.updateInvestorProfile(payload);
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setIsEditing(false); // Exit edit mode on save
        } catch (e) {
            console.error("Save failed", e);
            alert("Failed to save changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                    <p className="text-slate-500 mt-1">Manage your account settings, investment preferences, and security.</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg ${isEditing
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                        }`}
                >
                    {isEditing ? <X size={18} /> : <Briefcase size={18} />} {/* Fallback icon if Edit not imported, using Briefcase or similar */}
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
            </div>

            {/* Personal Details Card */}
            <div className={`bg-white rounded-2xl border transition-colors shadow-sm overflow-hidden ${isEditing ? 'border-blue-200' : 'border-slate-200'}`}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User size={20} className={isEditing ? "text-blue-600" : "text-slate-400"} />
                        <h2 className="font-bold text-lg text-slate-900">Personal Details</h2>
                    </div>
                    {!isEditing && <div className="w-2 h-2 rounded-full bg-red-400" title="Locked - Click Edit to change"></div>}
                </div>
                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="flex flex-col items-center gap-4">
                            <div className={`w-32 h-32 bg-orange-100 rounded-full overflow-hidden border-4 border-white shadow-md group relative ${!isEditing && 'opacity-90 grayscale-[0.2]'}`}>
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=FDBA74&color=7C2D12&size=128`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <span className="text-white text-[10px] font-bold uppercase tracking-widest">Update</span>
                                    </div>
                                )}
                            </div>
                            {isEditing && <Link to="/change-photo" className="text-sm font-bold text-blue-600 hover:text-blue-700">Change Photo</Link>}
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    Full Name
                                    {!isEditing && <span className="w-1.5 h-1.5 rounded-full bg-red-100"></span>}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    disabled={!isEditing}
                                    value={formData.name || ''}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 transition-all outline-none ${isEditing ? 'focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500' : 'cursor-not-allowed select-none'}`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    Email Address
                                    {!isEditing && <span className="w-1.5 h-1.5 rounded-full bg-red-100"></span>}
                                </label>
                                <input
                                    type="text"
                                    name="email"
                                    disabled={!isEditing}
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 transition-all outline-none ${isEditing ? 'focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500' : 'cursor-not-allowed select-none'}`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Firm Name</label>
                                <input
                                    type="text"
                                    name="firm_name"
                                    disabled={!isEditing}
                                    value={formData.firm_name || ''}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 transition-all outline-none ${isEditing ? 'focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500' : 'cursor-not-allowed select-none'}`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role / Title</label>
                                <input
                                    type="text"
                                    name="role"
                                    disabled={!isEditing}
                                    value={formData.role || ''}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 transition-all outline-none ${isEditing ? 'focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500' : 'cursor-not-allowed select-none'}`}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio</label>
                                <textarea
                                    rows={3}
                                    name="bio"
                                    disabled={!isEditing}
                                    value={formData.bio || ''}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 transition-all outline-none resize-none ${isEditing ? 'focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500' : 'cursor-not-allowed select-none'}`}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Investment Criteria Card */}
            <div className={`bg-white rounded-2xl border transition-colors shadow-sm overflow-hidden ${isEditing ? 'border-blue-200' : 'border-slate-200'}`}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Briefcase size={20} className={isEditing ? "text-blue-600" : "text-slate-400"} />
                        <h2 className="font-bold text-lg text-slate-900">Investment Criteria</h2>
                    </div>
                    {!isEditing && <div className="w-2 h-2 rounded-full bg-red-400" title="Locked"></div>}
                </div>
                <div className="p-8 space-y-8">
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Sectors</label>
                        <div className="flex flex-wrap gap-2">
                            {formData.sectors.map(sector => (
                                <span key={sector} className={`flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 shadow-sm ${!isEditing ? 'opacity-80' : ''}`}>
                                    {sector} {isEditing && <X size={14} className="cursor-pointer hover:text-blue-800 transition-colors" onClick={() => removeSector(sector)} />}
                                </span>
                            ))}
                            {isEditing && (
                                <button className="flex items-center gap-2 px-3 py-1.5 border border-dashed border-slate-300 text-slate-400 text-xs font-bold rounded-full hover:border-blue-400 hover:text-blue-400 transition-all hover:bg-blue-50">
                                    <Plus size={14} /> Add Sector
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Investment Stage</label>
                            <div className="flex flex-wrap gap-6">
                                {['Pre-Seed', 'Seed', 'Series A', 'Series B+'].map(stage => (
                                    <label key={stage} className={`flex items-center gap-2 group ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}>
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                disabled={!isEditing}
                                                checked={formData.stages.includes(stage)}
                                                onChange={() => toggleStage(stage)}
                                                className={`w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                            />
                                        </div>
                                        <span className={`text-sm font-medium transition-colors ${formData.stages.includes(stage) ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                                            {stage}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Check Size Range ($)</label>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                                    <input
                                        type="number"
                                        name="minCheck"
                                        disabled={!isEditing}
                                        value={formData.minCheck}
                                        onChange={handleInputChange}
                                        className={`w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all outline-none font-medium ${isEditing ? 'focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500' : 'opacity-70 cursor-not-allowed'}`}
                                    />
                                </div>
                                <span className="text-slate-300 font-bold">—</span>
                                <div className="flex-1 relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                                    <input
                                        type="number"
                                        name="maxCheck"
                                        disabled={!isEditing}
                                        value={formData.maxCheck}
                                        onChange={handleInputChange}
                                        className={`w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all outline-none font-medium ${isEditing ? 'focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500' : 'opacity-70 cursor-not-allowed'}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Security Settings Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Shield size={20} />
                        </div>
                        <h3 className="font-bold text-slate-900">Security Settings</h3>
                    </div>
                    <div className="space-y-4">
                        <Link to="/change-password" title="Change Password" className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-between group">
                            Change Password
                            <CheckCircle2 size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <button className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-between group">
                            Two-Factor Authentication
                            <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase">Enabled</span>
                        </button>
                    </div>
                </div>

                {/* Notifications Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Bell size={20} />
                        </div>
                        <h3 className="font-bold text-slate-900">Notifications</h3>
                    </div>
                    <div className="space-y-3">
                        {['Email Notifications', 'Pitch Match Alerts', 'System Updates'].map(item => (
                            <div key={item} className={`flex items-center justify-between px-4 py-2 rounded-xl transition-colors group ${isEditing ? 'hover:bg-slate-50 cursor-pointer' : 'cursor-default'}`} onClick={() => toggleNotification(item)}>
                                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-wider text-[10px]">{item}</span>
                                <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${formData.notifications[item] ? 'bg-blue-600 shadow-inner' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${formData.notifications[item] ? 'right-0.5' : 'left-0.5'}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Save Action Bar - Bottom */}
            {isEditing && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex items-center justify-end gap-4 z-50 md:static md:bg-transparent md:border-0 md:p-0">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-200 ${success
                            ? 'bg-emerald-500 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : success ? <CheckCircle2 size={18} /> : <Save size={18} />}
                        {success ? 'Saved Successfully' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;
