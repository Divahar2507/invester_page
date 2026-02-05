
import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Phone, Building, Save, X, Edit3, CheckCircle } from 'lucide-react';

const Settings = ({ user, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    company: user.company || 'Acme Industries Ltd',
    role: user.role || 'Compliance Officer',
    phone: user.phone || '+1 (555) 000-0000',
    avatar: user.avatar || null
  });

  // Revert data if user cancels
  const [originalData, setOriginalData] = useState(formData);

  useEffect(() => {
    const initialData = {
      name: user.name || '',
      email: user.email || '',
      company: user.company || 'Acme Industries Ltd',
      role: user.role || 'Compliance Officer',
      phone: user.phone || '+1 (555) 000-0000',
      avatar: user.avatar || null
    };
    setOriginalData(initialData);
    setFormData(initialData);
  }, [user]);

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setOriginalData(formData); // Snapshot current state before edit
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData); // Revert
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-4">
          <span>Account</span>
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          <span className="text-slate-900">Profile Settings</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Profile Settings</h1>
            <p className="text-slate-500">Manage your personal information and organization details.</p>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg"
            >
              <Edit3 size={18} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3 text-green-700 font-bold animate-in zoom-in duration-300">
          <CheckCircle className="h-5 w-5" />
          Changes saved successfully! Your profile has been updated.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm space-y-10">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Profile" className="h-32 w-32 rounded-[2rem] object-cover ring-8 ring-indigo-50 shadow-sm" />
                ) : (
                  <div className="h-32 w-32 rounded-[2rem] bg-indigo-100 text-indigo-600 flex items-center justify-center text-4xl font-black uppercase ring-8 ring-indigo-50">
                    {formData.name.substring(0, 1)}
                  </div>
                )}

                {isEditing && (
                  <>
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 h-10 w-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer">
                      <Edit3 size={16} />
                    </label>
                  </>
                )}
              </div>
              <div className="text-center">
                <h4 className="font-bold text-slate-900">{formData.name}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Enterprise Admin</p>
              </div>
            </div>

            {/* Personal Info Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><User size={12} /> Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700"
                  />
                ) : (
                  <div className="w-full p-4 rounded-2xl border border-transparent bg-slate-50/50 font-bold text-slate-700">
                    {formData.name}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Mail size={12} /> Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700"
                  />
                ) : (
                  <div className="w-full p-4 rounded-2xl border border-transparent bg-slate-50/50 font-bold text-slate-700">
                    {formData.email}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Briefcase size={12} /> Job Title</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700"
                  />
                ) : (
                  <div className="w-full p-4 rounded-2xl border border-transparent bg-slate-50/50 font-bold text-slate-700">
                    {formData.role}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Phone size={12} /> Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700"
                  />
                ) : (
                  <div className="w-full p-4 rounded-2xl border border-transparent bg-slate-50/50 font-bold text-slate-700">
                    {formData.phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-50">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
              Organization Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Building size={12} /> Company Legal Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700"
                  />
                ) : (
                  <div className="w-full p-4 rounded-2xl border border-transparent bg-slate-50/50 font-bold text-slate-700">
                    {formData.company}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Organization ID</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value="ORG-9982-COMPL-24"
                    disabled
                    className="flex-1 p-4 rounded-2xl border border-slate-100 bg-slate-100 text-slate-400 cursor-not-allowed font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center justify-end gap-4 animate-in slide-in-from-bottom-2 fade-in">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-slate-600 font-black hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-12 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-3 ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Profile Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Settings;
