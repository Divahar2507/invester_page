
import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Building2,
  Camera,
  Save,
  Shield,
  Bell,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SettingsProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState<User>({
    ...user,
    email: user.email || 'alex@nexusai.io',
    bio: user.bio || 'Passionate about building the next generation of AI-driven collaborative tools for global startups.',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Profile Settings</h2>
          <p className="text-slate-500 mt-1">Manage your public profile and account preferences.</p>
        </div>
        {showSuccess && (
          <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl text-sm font-bold border border-green-100 animate-in zoom-in-95 duration-200">
            <CheckCircle2 size={18} />
            Profile updated successfully
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar (Local) */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">
            <UserIcon size={20} />
            Personal Info
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-semibold text-sm transition-colors">
            <Bell size={20} />
            Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-semibold text-sm transition-colors">
            <Shield size={20} />
            Security & Privacy
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-semibold text-sm transition-colors">
            <Globe size={20} />
            Language & Region
          </button>
        </div>

        {/* Main Form Area */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Profile Photo */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <img
                    src={formData.avatar}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-50 group-hover:opacity-80 transition-opacity"
                    alt="Profile"
                  />
                  <button type="button" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-slate-900/60 p-2 rounded-lg text-white">
                      <Camera size={20} />
                    </div>
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Your Photo</h4>
                  <p className="text-xs text-slate-400 mb-3">Recommended size: 400x400px</p>
                  <div className="flex gap-2">
                    <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Change</button>
                    <button type="button" className="text-xs font-bold text-red-500 hover:underline">Remove</button>
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bio</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Organization</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={e => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">User Role</label>
                  <input
                    disabled
                    type="text"
                    value={formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                    className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-sm font-bold text-slate-500 cursor-not-allowed uppercase"
                  />
                </div>

                {formData.role !== UserRole.STARTUP && (
                  <>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Skills (Comma separated)</label>
                      <input
                        type="text"
                        value={formData.skills?.join(', ')}
                        onChange={e => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })}
                        placeholder="React, TypeScript, UI/UX..."
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience Level</label>
                      <select
                        value={formData.experience_level}
                        onChange={e => setFormData({ ...formData, experience_level: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium appearance-none"
                      >
                        <option value="">Select Level</option>
                        <option value="Junior">Junior (0-2 years)</option>
                        <option value="Mid">Mid (2-5 years)</option>
                        <option value="Senior">Senior (5+ years)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Availability</label>
                      <select
                        value={formData.availability}
                        onChange={e => setFormData({ ...formData, availability: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium appearance-none"
                      >
                        <option value="">Select Availability</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Remote, Bangalore"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Portfolio / LinkedIn</label>
                      <input
                        type="text"
                        value={formData.linkedin}
                        onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </form>

          {/* Additional Account Section */}
          <div className="mt-8 bg-red-50 rounded-3xl p-8 border border-red-100">
            <h4 className="font-bold text-red-600 mb-2">Danger Zone</h4>
            <p className="text-xs text-red-500 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="bg-white text-red-600 border border-red-200 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
