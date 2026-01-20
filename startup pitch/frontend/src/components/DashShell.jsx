import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getName } from "../auth.js";
import { Grid, FileText, Zap, Users, MessageSquare, Settings, LogOut, Search, Bell, Plus, Menu } from "lucide-react";

export default function DashShell({ children }) {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = React.useState(getName());
  const [loading, setLoading] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [notificationCount, setNotificationCount] = React.useState(0);

  React.useEffect(() => {
    async function loadData() {
      try {
        const { api } = await import("../api");
        const user = await api.me();
        if (user.company_name) {
          setDisplayName(user.company_name);
        } else if (user.full_name) {
          setDisplayName(user.full_name);
        }

        // Initial notif count
        const notifs = await api.getNotifications();
        setNotificationCount(notifs.filter(n => !n.is_read).length);

      } catch (e) {
        console.error("Failed to load dashboard shell data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Poll for notifications
    const interval = setInterval(async () => {
      try {
        const { api } = await import("../api");
        const notifs = await api.getNotifications();
        setNotificationCount(notifs.filter(n => !n.is_read).length);
      } catch (e) { }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  function onLogout() {
    clearAuth();
    navigate("/login");
  }

  const NavItem = ({ to, icon: Icon, label, badge }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
          ? "bg-slate-100 text-slate-900 shadow-sm"
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
        }`
      }
    >
      <Icon size={18} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-600 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-white font-['Plus Jakarta Sans']">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">PitchDeck AI</span>
          </div>

          <nav className="space-y-1">
            <NavItem to="/dashboard" icon={Grid} label="Dashboard" />
            <NavItem to="/my-pitches" icon={FileText} label="My Pitches" />
            <NavItem to="/opportunities" icon={Zap} label="Opportunities" badge="3" />
            <NavItem to="/investors" icon={Users} label="Investors" />
            <NavItem to="/messages" icon={MessageSquare} label="Messages" />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100 space-y-1">
          <NavItem to="/settings" icon={Settings} label="Settings" />
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>

          <div
            className="mt-6 flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:border-blue-200 transition-colors"
            onClick={() => navigate("/company-profile")}
          >
            <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
              {displayName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate">{displayName}</div>
              <div className="text-xs text-slate-500 truncate">Founder Workspace</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
              onClick={() => navigate("/notifications")}
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full border border-white flex items-center justify-center animate-in zoom-in duration-300">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all shadow-sm">
              <Plus size={18} />
              Create New Pitch
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}
    </div>
  );
}