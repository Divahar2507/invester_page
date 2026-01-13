import * as React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';
import { api } from '../services/api';

const Navbar = () => {
    const [user, setUser] = React.useState(null);
    const [unreadCount, setUnreadCount] = React.useState(0);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, notifs] = await Promise.all([
                    api.getMe(),
                    api.getNotifications()
                ]);
                setUser(userData);
                setUnreadCount(notifs.filter(n => !n.is_read).length);
            } catch (e) {
                console.error("Failed to fetch Navbar data", e);
            }
        };
        fetchData();

        // Optional: Poll for notifications every minute
        const interval = setInterval(async () => {
            try {
                const notifs = await api.getNotifications();
                setUnreadCount(notifs.filter(n => !n.is_read).length);
            } catch (e) { console.error(e); }
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-30">
            <div className="flex-1 max-w-2xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search startups, sectors..."
                        className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Link to="/notifications" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative group">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    )}
                </Link>

                <div className="h-6 w-px bg-slate-200 mx-2"></div>

                <Link to="/profile" className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-full transition-colors group">
                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors overflow-hidden border border-slate-200">
                        {user?.name ? (
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
