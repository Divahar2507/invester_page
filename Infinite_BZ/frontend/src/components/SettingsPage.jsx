import { useState, useEffect } from 'react';
import {
    User, Mail, Phone, Briefcase, Building, FileText, Camera,
    Upload, CheckCircle2, Shield, CreditCard, Link as LinkIcon,
    ArrowLeft, Save, Users, X, Bell, Lock, Globe, Trash2,
    Linkedin, Twitter, Facebook, ExternalLink, ChevronRight,
    MapPin, Languages, Clock
} from 'lucide-react';

export default function SettingsPage({ user, onNavigate }) {
    const [activeTab, setActiveTab] = useState('profile'); // profile, account, notifications, security, social
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        jobTitle: '',
        company: '',
        bio: '',
        location: '',
        timezone: 'Asia/Kolkata',
        language: 'English (US)',
        profileImage: null,
        socials: {
            linkedin: '',
            twitter: '',
            website: ''
        },
        notifications: {
            eventUpdates: true,
            marketing: false,
            securityAlerts: true
        }
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [showFollowersModal, setShowFollowersModal] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                jobTitle: user.job_title || '',
                company: user.company || '',
                bio: user.bio || '',
                profileImage: user.profile_image || null
            }));
            if (user.profile_image) {
                setPreviewImage(user.profile_image);
            }
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleToggle = (key) => {
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key]
            }
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setFormData(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 1200);
    };

    const tabs = [
        { id: 'profile', label: 'Public Profile', icon: <User size={18} /> },
        { id: 'account', label: 'Account Settings', icon: <Building size={18} /> },
        { id: 'security', label: 'Security', icon: <Lock size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'social', label: 'Social Connections', icon: <LinkIcon size={18} /> }
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-primary-500/30">
            {/* Top Bar Overlay */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-indigo-500 to-primary-500 z-50"></div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                                Settings
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">Manage your account preferences and profile</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-400 text-slate-900 rounded-xl font-black transition-all shadow-lg shadow-primary-500/20 active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : <><Save size={18} /> Save Changes</>}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Professional Left Sidebar */}
                    <div className="lg:col-span-3 space-y-4 sticky top-10">
                        <nav className="bg-white/5 border border-white/10 rounded-3xl p-3 backdrop-blur-xl">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 relative group ${activeTab === tab.id
                                        ? 'bg-primary-500/10 text-primary-400 font-bold'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="text-sm">{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <div className="absolute right-4 w-1.5 h-1.5 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
                                    )}
                                </button>
                            ))}
                        </nav>

                        {/* Profile Quick Glance */}
                        <div className="bg-gradient-to-br from-indigo-500/10 to-primary-500/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary-500/30">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-lg font-bold">
                                            {formData.firstName?.[0] || 'U'}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold truncate text-white">{formData.firstName} {formData.lastName}</h3>
                                    <p className="text-xs text-slate-500 truncate">{formData.email}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Account ID</p>
                                <code className="text-[10px] text-primary-400 font-mono bg-white/5 px-2 py-1 rounded">IBZ_USER_0072</code>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-8">
                        {saveSuccess && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                <CheckCircle2 className="text-green-500" size={20} />
                                <span className="text-green-400 text-sm font-bold">Changes saved successfully!</span>
                            </div>
                        )}

                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 lg:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] -z-10 group-hover:bg-primary-500/10 transition-colors duration-700"></div>

                            {activeTab === 'profile' && (
                                <section className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="flex flex-col md:flex-row md:items-center gap-8 pb-10 border-b border-white/5">
                                        <div className="relative group/camera">
                                            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                                                {previewImage ? (
                                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-4xl font-bold">
                                                        {formData.firstName?.[0] || 'U'}
                                                    </div>
                                                )}
                                            </div>
                                            <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/camera:opacity-100 transition-opacity cursor-pointer rounded-3xl backdrop-blur-sm">
                                                <Camera size={28} className="text-white" />
                                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                            </label>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-white">Public Profile</h2>
                                            <p className="text-slate-500 text-sm max-w-md mt-1">
                                                This information will be displayed on your organizer profile and event pages.
                                            </p>
                                            <div className="flex gap-4 mt-6">
                                                <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all">
                                                    Change Photo
                                                </button>
                                                <button className="px-5 py-2.5 text-red-400 hover:bg-red-500/10 border border-transparent rounded-xl text-xs font-bold transition-all">
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                        <FormGroup label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
                                        <FormGroup label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
                                        <FormGroup label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} placeholder="Product Designer" icon={<Briefcase size={18} />} />
                                        <FormGroup label="Company" name="company" value={formData.company} onChange={handleInputChange} placeholder="Tech Industries" icon={<Building size={18} />} />
                                        <FormGroup label="Location" name="location" value={formData.location} onChange={handleInputChange} placeholder="Chennai, India" icon={<MapPin size={18} />} />
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Bio</label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-600 resize-none"
                                                placeholder="Tell the community about yourself..."
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'account' && (
                                <section className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <h2 className="text-2xl font-black text-white">Account Settings</h2>
                                        <p className="text-slate-500 text-sm mt-1">Manage your critical account details and identity.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormGroup label="Email Address" name="email" value={formData.email} onChange={handleInputChange} icon={<Mail size={18} />} type="email" disabled />
                                        <FormGroup label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 00000 00000" icon={<Phone size={18} />} />
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Timezone</label>
                                            <div className="relative">
                                                <select
                                                    name="timezone"
                                                    value={formData.timezone}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-12 text-white appearance-none focus:outline-none focus:border-primary-500 transition-all"
                                                >
                                                    <option value="Asia/Kolkata">India Standard Time (IST)</option>
                                                    <option value="UTC">Universal Coordinated Time (UTC)</option>
                                                    <option value="America/New_York">Eastern Time (ET)</option>
                                                </select>
                                                <Clock size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Preferred Language</label>
                                            <div className="relative">
                                                <select
                                                    name="language"
                                                    value={formData.language}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-12 text-white appearance-none focus:outline-none focus:border-primary-500 transition-all"
                                                >
                                                    <option value="English (US)">English (US)</option>
                                                    <option value="English (UK)">English (UK)</option>
                                                    <option value="Tamil">Tamil</option>
                                                </select>
                                                <Languages size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-red-400">Danger Zone</h3>
                                            <p className="text-slate-500 text-xs">Once you delete your account, there is no going back. Please be certain.</p>
                                        </div>
                                        <button className="px-6 py-3 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                                            <Trash2 size={18} /> Delete Account
                                        </button>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'notifications' && (
                                <section className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <h2 className="text-2xl font-black text-white">Notifications</h2>
                                        <p className="text-slate-500 text-sm mt-1">Control how you want to be notified about updates.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <ToggleRow
                                            title="Event Updates"
                                            description="Receive updates about events you're following or registered for."
                                            isActive={formData.notifications.eventUpdates}
                                            onToggle={() => handleToggle('eventUpdates')}
                                            icon={<Bell size={20} className="text-sky-400" />}
                                        />
                                        <ToggleRow
                                            title="Security Alerts"
                                            description="Get notified about login attempts and password changes."
                                            isActive={formData.notifications.securityAlerts}
                                            onToggle={() => handleToggle('securityAlerts')}
                                            icon={<Shield size={20} className="text-indigo-400" />}
                                        />
                                        <ToggleRow
                                            title="Marketing Emails"
                                            description="Occasional updates about new features and platform news."
                                            isActive={formData.notifications.marketing}
                                            onToggle={() => handleToggle('marketing')}
                                            icon={<ExternalLink size={20} className="text-emerald-400" />}
                                        />
                                    </div>
                                </section>
                            )}

                            {activeTab === 'security' && (
                                <section className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <h2 className="text-2xl font-black text-white">Security</h2>
                                        <p className="text-slate-500 text-sm mt-1">Secure your account with multi-factor authentication and password policy.</p>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-primary-500/10 rounded-2xl">
                                                    <Lock size={24} className="text-primary-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">Password Management</h3>
                                                    <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                                                </div>
                                            </div>
                                            <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black transition-all">
                                                Update Password
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                                                    <Shield size={24} className="text-indigo-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">Two-Factor Authentication</h3>
                                                    <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                                                </div>
                                            </div>
                                            <button className="px-6 py-2.5 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20 text-primary-400 rounded-xl text-xs font-black transition-all">
                                                Enable 2FA
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'social' && (
                                <section className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <h2 className="text-2xl font-black text-white">Social Connections</h2>
                                        <p className="text-slate-500 text-sm mt-1">Link your professional profiles to increase trust and networking.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormGroup
                                            label="LinkedIn Profile"
                                            name="socials.linkedin"
                                            value={formData.socials.linkedin}
                                            onChange={handleInputChange}
                                            placeholder="linkedin.com/in/username"
                                            icon={<Linkedin size={18} className="text-blue-400" />}
                                        />
                                        <FormGroup
                                            label="Twitter / X"
                                            name="socials.twitter"
                                            value={formData.socials.twitter}
                                            onChange={handleInputChange}
                                            placeholder="twitter.com/username"
                                            icon={<Twitter size={18} className="text-sky-400" />}
                                        />
                                        <FormGroup
                                            label="Personal Website"
                                            name="socials.website"
                                            value={formData.socials.website}
                                            onChange={handleInputChange}
                                            placeholder="www.example.com"
                                            icon={<Globe size={18} className="text-emerald-400" />}
                                        />
                                    </div>

                                    <div className="pt-8 border-t border-white/5">
                                        <h3 className="text-lg font-bold mb-6">Connected Accounts</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                                        <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">Google Account</p>
                                                        <p className="text-[10px] text-green-500 font-black flex items-center gap-1">
                                                            <CheckCircle2 size={10} /> CONNECTED
                                                        </p>
                                                    </div>
                                                </div>
                                                <button className="text-xs font-bold text-slate-500 hover:text-red-400 transition-colors">
                                                    Disconnect
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormGroup({ label, name, value, onChange, placeholder, icon, type = "text", disabled = false }) {
    return (
        <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 px-1">{label}</label>
            <div className="relative group">
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-700 disabled:opacity-50 disabled:bg-white/[0.02]"
                />
                {icon && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary-500 transition-colors">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}

function ToggleRow({ title, description, isActive, onToggle, icon }) {
    return (
        <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.07] transition-all cursor-pointer group" onClick={onToggle}>
            <div className="flex items-center gap-6">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-white mb-1">{title}</h3>
                    <p className="text-xs text-slate-500 max-w-sm">{description}</p>
                </div>
            </div>
            <button
                className={`w-14 h-8 rounded-full relative transition-all duration-300 ${isActive ? 'bg-primary-500' : 'bg-slate-700'}`}
            >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${isActive ? 'left-7' : 'left-1'}`}></div>
            </button>
        </div>
    );
}
