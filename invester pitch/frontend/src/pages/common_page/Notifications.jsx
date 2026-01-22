import React, { useState, useEffect } from "react";
import { api } from "../../services/api"; // Updated api path
import { Bell, MessageSquare, Briefcase, Info, Check, Eye, UserPlus, CheckCircle2, Loader2 } from 'lucide-react';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            // Fetch notifications using the existing or fallback API method
            let notifs = [];
            try {
                if (api.getNotifications) {
                    notifs = await api.getNotifications();
                } else {
                    // Fallback if getNotifications not defined in api.js yet (fetched from existing startup logic)
                    // Using generic approach or empty
                    console.warn("api.getNotifications not found");
                }
            } catch (e) {
                console.error(e);
            }
            setNotifications(notifs);
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
            if (api.markNotificationAsRead) {
                await api.markNotificationAsRead(id);
            }
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
            case 'view': return <Eye size={18} className="text-indigo-500" />;
            case 'connection_request': return <UserPlus size={18} className="text-amber-500" />;
            case 'connection_accepted': return <CheckCircle2 size={18} className="text-emerald-500" />;
            case 'system': return <Info size={18} className="text-slate-500" />;
            default: return <Bell size={18} className="text-orange-500" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'message': return 'bg-blue-50';
            case 'match': return 'bg-emerald-50';
            case 'view': return 'bg-indigo-50';
            case 'connection_request': return 'bg-amber-50';
            case 'connection_accepted': return 'bg-emerald-50';
            default: return 'bg-slate-50';
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 font-['Plus Jakarta Sans'] animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h1>
                    <p className="text-slate-500 mt-1 text-base">Stay updated on your investment activity and network.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p className="text-sm font-medium text-slate-500">Loading notifications...</p>
                </div>
            ) : notifications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center shadow-sm">
                    <Bell size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No notifications yet</h3>
                    <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">We'll let you know when you get updates.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`flex gap-5 p-5 rounded-2xl border transition-all duration-300 ${notif.is_read ? 'bg-white border-slate-100' : 'bg-blue-50/30 border-blue-100 shadow-sm ring-1 ring-blue-50'}`}
                        >
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white ${getBgColor(notif.type)}`}>
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`text-base font-bold truncate ${notif.is_read ? 'text-slate-700' : 'text-slate-900'}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-4">
                                        {new Date(notif.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                    {notif.description}
                                </p>
                                {!notif.is_read && (
                                    <button
                                        onClick={() => handleMarkAsRead(notif.id)}
                                        className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-white px-3 py-1.5 rounded-lg border border-blue-50 shadow-sm"
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

            {!loading && notifications.length > 0 && (
                <div className="text-center pt-8">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">End of notifications</p>
                </div>
            )}
        </div>
    );
}
