
import React, { useState } from 'react';
import {
   Shield,
   Lock,
   Smartphone,
   Key,
   LogOut,
   CheckCircle,
   Smartphone as PhoneIcon,
   Globe,
   Laptop,
   Info,
   X
} from 'lucide-react';

const Security = () => {
   // 2FA State
   const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
   const [showAuthSetup, setShowAuthSetup] = useState(false);
   const [showSMSSetup, setShowSMSSetup] = useState(false);

   // Password State
   const [passwordForm, setPasswordForm] = useState({ current: '', new: '' });
   const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

   // Session State
   const [sessions, setSessions] = useState([
      { id: 1, device: 'MacBook Pro', browser: 'Chrome', location: 'San Francisco, USA', date: 'Current Session', icon: Laptop, active: true },
      { id: 2, device: 'iPhone 13', browser: 'Safari', location: 'New York, USA', date: 'Active 2h ago', icon: Smartphone, active: false },
      { id: 3, device: 'iPad Air', browser: 'Chrome', location: 'London, UK', date: 'Active 1d ago', icon: Smartphone, active: false },
   ]);

   const handlePasswordUpdate = (e) => {
      e.preventDefault();
      setShowPasswordSuccess(true);
      setTimeout(() => setShowPasswordSuccess(false), 3000);
      setPasswordForm({ current: '', new: '' });
   };

   const handleLogoutAll = () => {
      if (window.confirm("Are you sure you want to log out of all other devices?")) {
         setSessions(prev => prev.filter(s => s.active)); // Keep only current
      }
   };

   const handleRevokeSession = (id) => {
      setSessions(prev => prev.filter(s => s.id !== id));
   };

   return (
      <div className="max-w-6xl mx-auto space-y-8 min-h-screen pb-20 relative">
         <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-4">
               <span>Settings</span>
               <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
               <span className="text-slate-900">Security & Access</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Security & Access</h1>
            <p className="text-slate-500">Manage your account protection, two-factor authentication, and monitor active sessions.</p>
         </div>

         <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-8">
            {/* 2FA Header */}
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-blue-600">
                     <Shield size={32} />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold">Two-Factor Authentication (2FA)</h3>
                     <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                  </div>
               </div>
               <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`h-8 w-14 rounded-full relative p-1 transition-colors duration-300 ${twoFactorEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
               >
                  <div className={`h-6 w-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </button>
            </div>

            {/* 2FA Methods */}
            <div className={`space-y-4 transition-opacity duration-300 ${!twoFactorEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
               <div className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl">
                  <div className="flex gap-4">
                     <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Lock size={20} />
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <span className="font-bold">Authenticator App</span>
                           <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded uppercase">Recommended</span>
                        </div>
                        <p className="text-xs text-slate-400">Use apps like Google Authenticator or Authy to generate secure codes.</p>
                     </div>
                  </div>
                  <button
                     onClick={() => setShowAuthSetup(true)}
                     className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                  >
                     Setup
                  </button>
               </div>

               <div className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl">
                  <div className="flex gap-4">
                     <div className="h-10 w-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                        <Smartphone size={20} />
                     </div>
                     <div>
                        <div className="font-bold">SMS Verification</div>
                        <p className="text-xs text-slate-400">Receive a security code via text message to your registered mobile number.</p>
                     </div>
                  </div>
                  <button
                     onClick={() => setShowSMSSetup(true)}
                     className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition"
                  >
                     Configure
                  </button>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Change Password */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6 flex flex-col">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                     <Key size={24} />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold">Change Password</h3>
                     <p className="text-sm text-slate-400">Update your account password regularly.</p>
                  </div>
               </div>

               <form onSubmit={handlePasswordUpdate} className="space-y-4 flex-1 flex flex-col justify-center">
                  <div>
                     <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Current Password</label>
                     <input
                        type="password"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        required
                        placeholder="••••••••"
                        className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                     />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">New Password</label>
                     <input
                        type="password"
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                        required
                        placeholder="••••••••"
                        className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                     />
                  </div>
                  <button
                     type="submit"
                     className={`w-full py-4 font-bold rounded-xl transition flex items-center justify-center gap-2 ${showPasswordSuccess ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-slate-900 hover:bg-black text-white'}`}
                  >
                     {showPasswordSuccess ? <><CheckCircle size={20} /> Password Updated!</> : 'Update Password'}
                  </button>
               </form>
            </div>

            {/* Active Sessions */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 flex flex-col">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Globe size={24} />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold">Active Sessions</h3>
                        <p className="text-sm text-slate-400">Manage where you are currently logged in.</p>
                     </div>
                  </div>
                  <button
                     onClick={handleLogoutAll}
                     className="text-xs font-bold text-red-600 hover:underline uppercase"
                  >
                     Log out all
                  </button>
               </div>

               <div className="flex-1 space-y-4">
                  {sessions.map(session => (
                     <div key={session.id} className={`flex items-center justify-between p-4 border border-slate-100 rounded-2xl ${!session.active ? 'opacity-60' : 'bg-blue-50/30'}`}>
                        <div className="flex gap-4">
                           <session.icon className="h-6 w-6 text-slate-400" />
                           <div>
                              <div className="text-sm font-bold">{session.device} · {session.browser}</div>
                              <div className="text-[10px] text-slate-400">{session.location} · 192.168.1.1</div>
                           </div>
                        </div>
                        {session.active ? (
                           <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-bold rounded uppercase">Current</span>
                        ) : (
                           <button
                              onClick={() => handleRevokeSession(session.id)}
                              className="text-[10px] font-bold text-slate-500 hover:text-red-600 uppercase"
                           >
                              Revoke
                           </button>
                        )}
                     </div>
                  ))}
                  {sessions.length === 0 && (
                     <div className="text-center py-8 text-slate-400 text-sm">No active sessions found.</div>
                  )}
               </div>
            </div>
         </div>

         {/* --- Modals --- */}

         {/* Authenticator Setup Modal */}
         {showAuthSetup && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl animate-in zoom-in-95 text-center relative">
                  <button onClick={() => setShowAuthSetup(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition"><X size={16} /></button>
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                     <Lock size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Authenticator Setup</h3>
                  <div className="bg-slate-100 w-48 h-48 mx-auto my-6 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">[ QR CODE ]</p>
                  </div>
                  <p className="text-xs text-slate-500 mb-6 px-4">Scan the QR code with your authenticator app to enable 2FA protection for your account.</p>
                  <button onClick={() => setShowAuthSetup(false)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl">I've Scanned It</button>
               </div>
            </div>
         )}

         {/* SMS Setup Modal */}
         {showSMSSetup && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl animate-in zoom-in-95 relative">
                  <button onClick={() => setShowSMSSetup(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition"><X size={16} /></button>
                  <h3 className="text-xl font-bold mb-6">SMS Configuration</h3>
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Mobile Number</label>
                        <input type="text" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 bg-slate-50 border rounded-xl" />
                     </div>
                     <button onClick={() => setShowSMSSetup(false)} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl">Send Code</button>
                  </div>
               </div>
            </div>
         )}

      </div>
   );
};

export default Security;
