import * as React from 'react';
import { useState } from 'react';
import { Rocket, TrendingUp, MessageSquare, Megaphone, Eye, X, Bell } from 'lucide-react';

const NotificationsPage = () => {
    const [filter, setFilter] = useState('All');

    const notifications = [
        {
            id: 1,
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
            id: 2,
            type: 'portfolio',
            title: 'Portfolio Update: EcoCharge',
            description: 'Q3 Financials Released: Revenue up 25% QoQ, burn rate decreased by 10%.',
            time: '5h ago',
            unread: true,
            icon: <TrendingUp className="text-emerald-600" size={20} />,
            iconBg: 'bg-emerald-50',
            actions: ['View Report']
        },
        {
            id: 3,
            type: 'message',
            title: 'Message from Michael Klein',
            description: '"Hi Sarah, regarding the term sheet for BioGen, can we schedule a quick call tomorrow to discuss the valuation cap?"',
            time: 'Yesterday',
            unread: false,
            initials: 'MK',
            iconBg: 'bg-slate-100',
            actions: ['Reply']
        },
        {
            id: 4,
            type: 'announcement',
            title: 'Platform Announcement',
            description: 'VentureFlow will undergo scheduled maintenance on Oct 30th from 2:00 AM to 4:00 AM UTC.',
            time: 'Yesterday',
            unread: false,
            icon: <Megaphone className="text-orange-600" size={20} />,
            iconBg: 'bg-orange-50'
        },
        {
            id: 5,
            type: 'alert',
            title: 'Alert: FinFlow',
            description: 'FinFlow (on your watchlist) just closed their seed round with $2.5M.',
            time: 'Yesterday',
            unread: false,
            icon: <Eye className="text-blue-600" size={20} />,
            iconBg: 'bg-blue-50',
            actions: ['View Company']
        }
    ];

    const filteredNotifications = filter === 'Unread'
        ? notifications.filter(n => n.unread)
        : notifications;

    const sections = [
        { title: 'TODAY', items: filteredNotifications.filter(n => ['2h ago', '5h ago'].includes(n.time)) },
        { title: 'YESTERDAY', items: filteredNotifications.filter(n => n.time === 'Yesterday') }
    ];

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

            <div className="space-y-12">
                {sections.map((section, sIdx) => section.items.length > 0 && (
                    <div key={sIdx} className="space-y-6">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{section.title}</h2>
                        <div className="space-y-4">
                            {section.items.map((item) => (
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

                                            {item.actions && (
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
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsPage;
