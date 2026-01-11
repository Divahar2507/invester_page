import * as React from 'react';
import { useState, useEffect } from 'react';
import { Rocket, TrendingUp, MessageSquare, Megaphone, Eye, X, Bell, UserPlus, check, XClicke } from 'lucide-react';
import { api } from '../services/api';

const NotificationsPage = () => {
    const [filter, setFilter] = useState('All');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock Notifications for other types
    const [notifications, setNotifications] = useState([
        {
            id: 101, // Use high ID to avoid conflict
            type: 'pitch',
            title: 'New Pitch: CyberGuard AI',
            description: 'Submitted a Series A pitch deck. 92% Match with your cybersecurity thesis.',
            time: '2h ago',
            unread: true,
            icon: <Rocket className="text-indigo-600" size={20} />,
            iconBg: 'bg-indigo-50',
            actions: ['Review Pitch', 'Dismiss']
        },
        {
            id: 102,
            type: 'announcement',
            title: 'Platform Announcement',
            description: 'VentureFlow will undergo scheduled maintenance on Oct 30th from 2:00 AM to 4:00 AM UTC.',
            time: 'Yesterday',
            unread: false,
            icon: <Megaphone className="text-orange-600" size={20} />,
            iconBg: 'bg-orange-50'
        }
    ]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await api.getIncomingRequests();
            // Map to notification format
            const requestNotifs = data.map(req => ({
                id: req.id,
                type: 'connection_request',
                title: `Connection Request: ${req.requester_name || 'Startup'}`,
                description: `${req.requester_name} (${req.requester_role}) wants to connect with you.`,
                time: new Date(req.created_at).toLocaleDateString(),
                unread: true,
                icon: <UserPlus className="text-blue-600" size={20} />,
                iconBg: 'bg-blue-50',
                isRequest: true,
                connectionId: req.id
            }));

            setRequests(requestNotifs);
        } catch (e) {
            console.error("Failed to fetch requests", e);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (id, action) => {
        try {
            await api.respondToRequest(id, action);
            // Remove from list or update status
            setRequests(prev => prev.filter(r => r.connectionId !== id));
            // Optionally add a success notification
            alert(`Request ${action}ed`);
        } catch (e) {
            console.error(e);
            alert("Failed to respond");
        }
    };

    // Merge mocks and real requests
    const allItems = [...requests, ...notifications].sort((a, b) => b.id - a.id);

    const filteredNotifications = filter === 'Unread'
        ? allItems.filter(n => n.unread)
        : allItems;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                {['All', 'Unread'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${filter === tab
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                            : 'text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {filteredNotifications.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl">
                        No notifications found.
                    </div>
                ) : (
                    filteredNotifications.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-2xl border ${item.unread ? 'border-blue-100 shadow-sm' : 'border-slate-100'} overflow-hidden flex relative group hover:shadow-md transition-all duration-300`}
                        >
                            {item.unread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}

                            <div className="p-6 flex gap-6 w-full">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                                    {item.initials ? (
                                        <span className="text-sm font-bold text-slate-500">{item.initials}</span>
                                    ) : item.icon}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-slate-900">{item.title}</h3>
                                        <span className="text-xs font-medium text-slate-400">{item.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
                                        {item.description}
                                    </p>

                                    {item.isRequest ? (
                                        <div className="flex items-center gap-4 pt-3">
                                            <button
                                                onClick={() => handleRespond(item.connectionId, 'accept')}
                                                className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleRespond(item.connectionId, 'reject')}
                                                className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors">
                                                Decline
                                            </button>
                                        </div>
                                    ) : (
                                        item.actions && (
                                            <div className="flex items-center gap-6 pt-3">
                                                {item.actions.map((action, aIdx) => (
                                                    <button
                                                        key={aIdx}
                                                        className={`text-sm font-bold transition-colors ${aIdx === 0
                                                            ? 'text-blue-600 hover:text-blue-700'
                                                            : 'text-slate-400 hover:text-slate-600'
                                                            }`}
                                                    >
                                                        {action}
                                                    </button>
                                                ))}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
