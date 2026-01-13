import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Briefcase, Info, Check, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await api.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await api.markNotificationAsRead(id);
            // Optimistic update
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'message': return <MessageSquare size={18} className="text-blue-500" />;
            case 'match': return <Briefcase size={18} className="text-emerald-500" />;
            case 'system': return <Info size={18} className="text-slate-500" />;
            default: return <Bell size={18} className="text-orange-500" />;
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6 font-['Plus Jakarta Sans'] animate-in fade-in duration-500 min-h-screen bg-slate-50">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h1>
                    <p className="text-slate-500 mt-1 text-sm">Stay updated with your investment activity.</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500 text-sm">Loading notifications...</p>
                </div>
            ) : notifications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                    <Bell size={40} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500 font-medium">No notifications yet.</p>
                    <p className="text-slate-400 text-sm mt-1">We'll let you know when something important happens.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`flex gap-4 p-4 rounded-xl border transition-all duration-200 ${notif.is_read ? 'bg-white border-slate-100' : 'bg-blue-50/50 border-blue-100 shadow-sm'}`}
                        >
                            <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notif.is_read ? 'bg-slate-100' : 'bg-white shadow-sm border border-blue-100'}`}>
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`text-sm font-semibold ${notif.is_read ? 'text-slate-700' : 'text-slate-900'}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                        {new Date(notif.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    {notif.description}
                                </p>
                                {!notif.is_read && (
                                    <button
                                        onClick={() => handleMarkAsRead(notif.id)}
                                        className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <Check size={14} />
                                        Mark as read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
