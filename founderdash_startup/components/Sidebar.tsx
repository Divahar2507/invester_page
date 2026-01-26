
import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Rocket,
  MessageSquare,
  Globe
} from 'lucide-react';
import { AppView, UserRole } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  userRole: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, userRole, onLogout }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    // Consolidated Common Menu for Startups
    { id: AppView.TALENT_POOL, label: 'Talent & Partners', icon: Users, roles: [UserRole.STARTUP] },

    { id: AppView.PROJECT_BOARD, label: 'Opportunity Hub', icon: Briefcase },
    { id: AppView.MESSAGES, label: 'Messages', icon: MessageSquare },
    { id: AppView.SETTINGS, label: 'Settings', icon: Settings },
  ];

  const filteredItems = menuItems.filter(item => !item.roles || item.roles.includes(userRole));

  return (
    <div className="w-64 flex flex-col h-full bg-white border-r border-slate-200 shrink-0">
      {/* Logo area removed as per request */}

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 space-y-4 mt-auto">
        <div className="pt-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">
            <HelpCircle size={20} />
            Support
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
