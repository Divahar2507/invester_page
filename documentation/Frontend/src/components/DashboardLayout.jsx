
import React, { useState, useEffect } from 'react';
import Marketplace from '../pages/Marketplace';
import Security from '../pages/Security';
import Documents from './views/Documents';
import Billing from '../pages/Billing';
import ServiceDetail from './views/ServiceDetail';
import Settings from './views/Settings';
import Overview from './views/Overview';
import Support from '../pages/Support';

const DashboardView = {
  OVERVIEW: 'OVERVIEW',
  ONBOARDING: 'ONBOARDING',
  DASHBOARD: 'DASHBOARD',
  MARKETPLACE: 'MARKETPLACE',
  DOCUMENTS: 'DOCUMENTS',
  BILLING: 'BILLING',
  SECURITY: 'SECURITY',
  SETTINGS: 'SETTINGS',
  SUPPORT: 'SUPPORT',
  SERVICE_DETAIL: 'SERVICE_DETAIL'
};

const DashboardLayout = ({ user, onLogout, initialTemplate }) => {
  const [activeView, setActiveView] = useState(DashboardView.OVERVIEW);
  const [currentUser, setCurrentUser] = useState(user);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (initialTemplate === 'security') setActiveView(DashboardView.SECURITY);
    else if (initialTemplate === 'billing') setActiveView(DashboardView.BILLING);
    else if (initialTemplate === 'compliance') setActiveView(DashboardView.DOCUMENTS);
    else setActiveView(DashboardView.MARKETPLACE);
  }, [initialTemplate]);

  const sidebarItems = [
    {
      id: DashboardView.OVERVIEW, label: 'Dashboard', icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
      )
    },
    {
      id: DashboardView.MARKETPLACE, label: 'Marketplace', icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
      )
    },
    {
      id: DashboardView.DOCUMENTS, label: 'Documents', icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      )
    },
    {
      id: DashboardView.BILLING, label: 'Billing', icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
      )
    },
    {
      id: DashboardView.SECURITY, label: 'Security', icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
      )
    },
    {
      id: DashboardView.SETTINGS, label: 'Settings', icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      )
    },
    {
      id: DashboardView.SUPPORT, label: 'Support & Help', icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    },
  ];

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case DashboardView.MARKETPLACE:
        return <Marketplace onSelectService={() => setActiveView(DashboardView.SERVICE_DETAIL)} />;
      case DashboardView.SERVICE_DETAIL:
        return <ServiceDetail onBack={() => setActiveView(DashboardView.MARKETPLACE)} />;
      case DashboardView.SECURITY:
        return <Security />;
      case DashboardView.DOCUMENTS:
        return <Documents />;
      case DashboardView.BILLING:
        return <Billing />;
      case DashboardView.SETTINGS:
        return <Settings user={currentUser} onSave={handleUpdateUser} />;
      case DashboardView.SUPPORT:
        return <Support />;
      default:
        return <Overview onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col z-20 shadow-sm">
        <div className="p-8 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-black text-sm">C</span>
          </div>
          <span className="font-black text-slate-900 tracking-tight text-xl">CompliancePro</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 custom-scrollbar overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeView === item.id || (activeView === DashboardView.SERVICE_DETAIL && item.id === DashboardView.MARKETPLACE)
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 translate-x-1'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <div className={activeView === item.id ? 'scale-110' : ''}>{item.icon}</div>
              <span className="font-black text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50 bg-slate-50/30">
          <div
            onClick={() => setActiveView(DashboardView.SETTINGS)}
            className={`flex items-center gap-4 p-4 mb-6 rounded-3xl bg-white border border-slate-100 shadow-sm cursor-pointer hover:border-blue-300 transition-all ${activeView === DashboardView.SETTINGS ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg uppercase">
              {currentUser.name.substring(0, 1)}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-black text-slate-800 truncate">{currentUser.name}</div>
              <div className="text-[10px] text-indigo-600 uppercase font-black tracking-widest">Enterprise Tier</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl transition shadow-xl"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-xl transition-all font-medium"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back
            </button>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-[1.25rem] px-6 py-2.5 w-[28rem] transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search for professionals, legal docs, or tax records..." className="bg-transparent border-none focus:outline-none text-sm font-medium ml-4 w-full" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
              >
                <div className="relative">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                </div>
              </button>
              {showNotifications && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <h4 className="font-bold text-slate-900">Notifications</h4>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">3 New</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 hover:bg-slate-50 rounded-2xl transition cursor-pointer flex gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">GST Filing Due Tomorrow</p>
                        <p className="text-[10px] text-slate-400">Compliance Alert</p>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-slate-50 rounded-2xl transition cursor-pointer flex gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">Audit Report Generated</p>
                        <p className="text-[10px] text-slate-400">Document Ready</p>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-slate-50 rounded-2xl transition cursor-pointer flex gap-3">
                      <div className="h-2 w-2 rounded-full bg-orange-500 mt-2"></div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">New Login from USA</p>
                        <p className="text-[10px] text-slate-400">Security Alert</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="h-10 w-px bg-slate-100"></div>
            <button
              onClick={() => setActiveView(DashboardView.SUPPORT)}
              className="flex items-center gap-3 px-6 py-3 bg-blue-50 text-blue-700 font-black rounded-2xl text-xs hover:bg-blue-100 transition-all tracking-tight"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Help & Support
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-slate-50/50">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
