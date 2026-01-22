import * as React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Loader2, Eye, EyeOff, TrendingUp, CheckCircle2, ChevronRight, Upload, Calendar, Building2, User, Globe, DollarSign } from 'lucide-react';

const InputField = ({ label, name, value, onChange, type = "text", placeholder, icon: Icon, required = true, isTextArea = false }) => (
    <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{label} {required && '*'}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-3.5 text-slate-400" size={18} />}
            {isTextArea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full ${Icon ? 'pl-11' : 'pl-5'} pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400 min-h-[100px] shadow-sm`}
                    required={required}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full ${Icon ? 'pl-11' : 'pl-5'} pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400 shadow-sm`}
                    required={required}
                />
            )}
        </div>
    </div>
);

const SelectField = ({ label, name, value, onChange, options, required = true }) => (
    <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{label} {required && '*'}</label>
        <div className="relative">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 shadow-sm appearance-none`}
                required={required}
            >
                <option value="" disabled>Select {label}</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    </div>
);

const Register = ({ role }) => {
    const navigate = useNavigate();
    const isStartup = role === 'startup';
    const activeRole = role || 'investor';

    // Steps Configuration
    const [step, setStep] = useState(1); // 1 = Personal, 2 = Startup
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form Stats
    const [formData, setFormData] = useState({
        // Personal Details
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNumber: '',
        gender: 'male',
        linkedinUrl: '',
        referrer: 'Angel Investor',
        referrerName: '',
        isSingleFounder: 'yes', // Startup only

        // Startup Details (Step 2)
        brandName: '',
        legalName: '',
        websiteUrl: '',
        startupSector: '',
        startupStage: '',
        city: '',
        companyType: '',
        monthlyRevenue: '',
        valuation: '',
        capitalToRaise: '',
        incorporationDate: '',
        description: '',
        pitchDeck: null
    });

    const [showPassword, setShowPassword] = useState(false);

    // Theme Colors
    const accentColor = isStartup ? "bg-purple-600" : "bg-blue-600";
    const accentHover = isStartup ? "hover:bg-purple-700" : "hover:bg-blue-700";
    const accentText = isStartup ? "text-purple-600" : "text-blue-600";
    const accentBorder = isStartup ? "focus:border-purple-500" : "focus:border-blue-500";
    const accentRing = isStartup ? "focus:ring-purple-500/10" : "focus:ring-blue-500/10";
    const heroImage = isStartup
        ? "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2071&auto=format&fit=crop";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, pitchDeck: e.target.files[0] }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (passwordCheck()) setStep(2);
    };

    const passwordCheck = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }
        setError(null);
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        // Password check is already done in Step 1, but good to be safe or if we move password to step 2 (we didn't).
        // If password fields are in Step 1, we don't need to re-check specific fields for step 2 unless we validate specific step 2 fields.

        setLoading(true);
        setError(null);
        try {
            // Adapt to API structure. 
            await api.register(formData.email, formData.password, activeRole, formData.fullName, {
                mobileNumber: formData.mobileNumber,
                linkedin: formData.linkedinUrl,
                confirmPassword: formData.confirmPassword,
                // For Startup: Use brandName as company_name. For Investor: Use formData.companyName (which we need to add)
                companyName: isStartup ? formData.brandName : (formData.referrerName || "Independent Investor"),
            });
            navigate(isStartup ? '/login/startup' : '/login/investor');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-mono">
            {/* Navbar */}
            <div className="bg-white px-8 py-4 flex items-center justify-between border-b border-slate-100 shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className={`${accentColor} w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer`}>
                        <TrendingUp size={20} className="text-white" />
                    </div>
                    {/* Updated Logo Text as requested */}
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {isStartup ? "Startup Register" : "Investor Register"}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-500 hidden md:block">Already have an account?</span>
                    <Link to={isStartup ? "/login/startup" : "/login/investor"} className={`px-6 py-2.5 ${isStartup ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'} font-bold rounded-xl hover:bg-opacity-80 transition-all text-sm`}>
                        Log In
                    </Link>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto p-4 md:p-8 flex items-start gap-8">

                {/* Left Side - Stepper & Info (Sticky) */}
                <div className="hidden lg:block w-1/4 sticky top-28 space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            {isStartup ? "Start Your Fund Raising Journey" : "Join the Investor Network"}
                        </h1>
                        <p className="text-slate-500 font-medium">Complete the steps to creates your account.</p>
                    </div>

                    <div className="space-y-0 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200 -z-10"></div>

                        {/* Step 1 */}
                        <div className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${step === 1 ? 'bg-white shadow-xl shadow-slate-200/50' : 'opacity-60'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${step >= 1 ? `${accentColor} text-white` : 'bg-slate-200 text-slate-500'}`}>
                                {step > 1 ? <CheckCircle2 size={16} /> : '1'}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Personal Details</h3>
                                <p className="text-xs font-bold text-slate-400 mt-0.5">Tell us about yourself</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${step === 2 ? 'bg-white shadow-xl shadow-slate-200/50' : 'opacity-60'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${step >= 2 ? `${accentColor} text-white` : 'bg-slate-200 text-slate-500'}`}>2</div>
                            <div>
                                <h3 className="font-bold text-slate-900">{isStartup ? "Startup Details" : "Investor Details"}</h3>
                                <p className="text-xs font-bold text-slate-400 mt-0.5">{isStartup ? "Tell us about your startup" : "Your investment preferences"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Form Area */}
                <div className="flex-1 bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12">
                    <form onSubmit={step === 1 ? handleNext : handleRegister}>

                        {/* STEP 1: PERSONAL DETAILS */}
                        {step === 1 && (
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                    <span className={`w-8 h-8 rounded-lg ${accentColor} bg-opacity-10 ${accentText} flex items-center justify-center`}><User size={18} /></span>
                                    Personal Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Your Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
                                    <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />

                                    {/* Gender */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Gender *</label>
                                        <div className="flex gap-4">
                                            {['Male', 'Female', 'Other'].map(g => (
                                                <label key={g} className={`flex-1 cursor-pointer border rounded-2xl px-4 py-3 flex items-center gap-3 transition-all ${formData.gender === g.toLowerCase() ? `${accentBorder} bg-${isStartup ? 'purple' : 'blue'}-50 ring-1 ring-${isStartup ? 'purple' : 'blue'}-500` : 'border-slate-200 hover:bg-slate-50'}`}>
                                                    <input type="radio" name="gender" value={g.toLowerCase()} checked={formData.gender === g.toLowerCase()} onChange={handleChange} className="accent-current w-4 h-4" />
                                                    <span className="font-bold text-slate-700 text-sm">{g}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <InputField label="Phone Number" name="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleChange} placeholder="+91 98765 43210" />

                                    {/* Removed Investor fields from Step 1, moved to Step 2 */}

                                    {isStartup && (
                                        <>
                                            <SelectField label="Referrer" name="referrer" value={formData.referrer} onChange={handleChange} options={['Angel Investor', 'VC', 'Friend', 'Social Media', 'Event']} />
                                            <InputField label="Referrer Name" name="referrerName" value={formData.referrerName} onChange={handleChange} placeholder="Name of referrer" required={false} />

                                            <div className="col-span-1 md:col-span-2 space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Are you a single Founder? *</label>
                                                <div className="flex gap-6">
                                                    {['Yes', 'No'].map(opt => (
                                                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                                            <input type="radio" name="isSingleFounder" value={opt.toLowerCase()} checked={formData.isSingleFounder === opt.toLowerCase()} onChange={handleChange} className="w-5 h-5 accent-current" />
                                                            <span className="font-bold text-slate-700">{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="space-y-2 relative">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password *</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 ${accentRing} ${accentBorder} transition-all font-medium`}
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-9 text-slate-400 hover:text-slate-600">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password *</label>
                                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 ${accentRing} ${accentBorder} transition-all font-medium`} required />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: DETAILS */}
                        {step === 2 && (
                            <div>
                                <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-1">
                                    ← Back to Personal Details
                                </button>

                                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                    <span className={`w-8 h-8 rounded-lg ${accentColor} bg-opacity-10 ${accentText} flex items-center justify-center`}><Building2 size={18} /></span>
                                    {isStartup ? "Startup Details" : "Investor Details"}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {isStartup ? (
                                        <>
                                            <InputField label="Brand Name" name="brandName" value={formData.brandName} onChange={handleChange} placeholder="Validation Ltd" />
                                            <InputField label="Legal Name" name="legalName" value={formData.legalName} onChange={handleChange} placeholder="Validation Private Limited" />
                                            <InputField label="Website URL" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} placeholder="https://..." icon={Globe} />
                                            <SelectField label="Startup Sector" name="startupSector" value={formData.startupSector} onChange={handleChange} options={['Fintech', 'Edtech', 'Healthtech', 'SaaS', 'E-commerce', 'AI/ML']} />
                                            <SelectField label="Startup Stage" name="startupStage" value={formData.startupStage} onChange={handleChange} options={['Idea', 'Prototype', 'MVP', 'Early Revenue', 'Growth']} />
                                            <InputField label="City of Operation" name="city" value={formData.city} onChange={handleChange} placeholder="San Francisco" />
                                            <SelectField label="Company Type" name="companyType" value={formData.companyType} onChange={handleChange} options={['Private Limited', 'LLP', 'Sole Proprietorship']} />
                                            <InputField label="Monthly Revenue (Lakhs)" name="monthlyRevenue" value={formData.monthlyRevenue} onChange={handleChange} placeholder="0" />
                                            <InputField label="Pre-money Valuation (Lakhs)" name="valuation" value={formData.valuation} onChange={handleChange} placeholder="1000" />
                                            <InputField label="Capital to Raise (Lakhs)" name="capitalToRaise" value={formData.capitalToRaise} onChange={handleChange} placeholder="50" />
                                            <InputField label="Date of Incorporation" name="incorporationDate" type="date" value={formData.incorporationDate} onChange={handleChange} />

                                            <div className="col-span-1 md:col-span-2">
                                                <InputField label="Tell us what you are building" name="description" isTextArea value={formData.description} onChange={handleChange} placeholder="Brief description of your startup..." />
                                            </div>

                                            <div className="col-span-1 md:col-span-2 space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Pitch Deck *</label>
                                                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.ppt,.pptx" />
                                                    <div className={`w-12 h-12 rounded-full bg-${isStartup ? 'purple' : 'blue'}-50 text-${isStartup ? 'purple' : 'blue'}-600 flex items-center justify-center mb-3`}>
                                                        <Upload size={20} />
                                                    </div>
                                                    <p className="font-bold text-slate-700">Click to upload or drag & drop</p>
                                                    <p className="text-xs text-slate-400 mt-1">PDF, PPT up to 10MB</p>
                                                    {formData.pitchDeck && <p className="mt-4 text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full flex items-center gap-2"><CheckCircle2 size={14} /> {formData.pitchDeck.name}</p>}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <InputField label="Company / Firm Name" name="referrerName" value={formData.referrerName} onChange={handleChange} placeholder="Ventures LLC" required={true} />
                                            <InputField label="LinkedIn Profile URL" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." icon={Globe} required={false} />
                                            <SelectField label="Investor Type" name="referrer" value={formData.referrer} onChange={handleChange} options={['Angel Investor', 'VC', 'Family Office', 'Corporate', 'Other']} />
                                            <InputField label="Website URL" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} placeholder="https://..." icon={Globe} required={false} />
                                            <InputField label="Focus Industries (Comma sep)" name="startupSector" value={formData.startupSector} onChange={handleChange} placeholder="SaaS, Fintech..." required={false} />
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Error & Actions */}
                        {error && <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center">{error}</div>}

                        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-end">
                            {step === 1 ? (
                                <button type="submit" className={`px-8 py-4 ${accentColor} text-white font-bold rounded-2xl ${accentHover} shadow-lg transition-transform active:scale-95 flex items-center gap-2`}>
                                    Next Step <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button type="submit" disabled={loading} className={`px-8 py-4 ${accentColor} text-white font-bold rounded-2xl ${accentHover} shadow-lg transition-transform active:scale-95 flex items-center gap-2 min-w-[200px] justify-center`}>
                                    {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
