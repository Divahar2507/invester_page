// Use import * as React to ensure JSX intrinsic elements are recognized
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, LogOut, TrendingUp } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { api } from '../services/api';

const Sidebar = () => {
    const location = useLocation();


    return (
        <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
                        <TrendingUp size={18} className="text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">InvestorHub</span>
                </div>

                <nav className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    {item.label}
                                </div>

                            </Link>
                        );
                    })}
                </nav>
            </div >

            <div className="mt-auto p-6 border-t border-slate-100 space-y-1">
                <Link
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                    <Settings size={20} />
                    Settings
                </Link>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '#/login';
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>


            </div>
        </div >
    );
};

export default Sidebar;
