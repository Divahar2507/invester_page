// Use import * as React to ensure JSX intrinsic elements are recognized
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, LogOut, TrendingUp } from 'lucide-react';
import { NAV_ITEMS, STARTUP_NAV_ITEMS } from '../constants';
import { api } from '../services/api';

const Sidebar = () => {
    const location = useLocation();
    const [userRole, setUserRole] = React.useState('investor');
    const [navItems, setNavItems] = React.useState(NAV_ITEMS);

    React.useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const user = await api.getMe();
                setUserRole(user.role);
                if (user.role === 'startup') {
                    setNavItems(STARTUP_NAV_ITEMS);
                } else {
                    setNavItems(NAV_ITEMS);
                }
            } catch (error) {
                console.error("Failed to fetch user role for sidebar", error);
            }
        };
        fetchUserRole();
    }, []);

    return (
        <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                        {userRole === 'startup' ? 'STARTUP' : 'INVESTOR'}
                    </span>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const content = (
                            <div className="flex items-center gap-3">
                                {item.icon}
                                {item.label}
                            </div>
                        );
                        const className = `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`;

                        if (item.isExternal) {
                            return (
                                <a key={item.path} href={item.path} target="_blank" rel="noopener noreferrer" className={className}>
                                    {content}
                                </a>
                            );
                        }

                        return (
                            <Link key={item.path} to={item.path} className={className}>
                                {content}
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
