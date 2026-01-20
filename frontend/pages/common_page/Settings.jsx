import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    User,
    Shield,
    Bell,
    Globe,
    CreditCard,
    ChevronRight,
    LogOut,
    HelpCircle,
    Smartphone,
    Mail,
    Lock
} from 'lucide-react';

const SettingsPage = () => {
    const settingsSections = [
        {
            title: 'Account Settings',
            description: 'Manage your personal details and public profile.',
            items: [
                {
                    icon: <User className="text-blue-600" size={20} />,
                    iconBg: 'bg-blue-50',
                    label: 'Personal Information',
                    description: 'Edit your name, biogaphy, and firm details',
                    path: '/profile'
                },
                {
                    icon: <Mail className="text-orange-600" size={20} />,
                    iconBg: 'bg-orange-50',
                    label: 'Email Address',
                    description: 'Change your primary contact email',
                    path: '/profile' // Linked to profile since email is there
                }
            ]
        },
        {
            title: 'Security & Privacy',
            description: 'Secure your account with multi-factor authentication and password management.',
            items: [
                {
                    icon: <Lock className="text-indigo-600" size={20} />,
                    iconBg: 'bg-indigo-50',
                    label: 'Change Password',
                    description: 'Update your login credentials',
                    path: '/change-password'
                },
                {
                    icon: <Shield className="text-emerald-600" size={20} />,
                    iconBg: 'bg-emerald-50',
                    label: 'Two-Factor Authentication',
                    description: 'Add an extra layer of security',
                    status: 'Enabled'
                }
            ]
        },
        {
            title: 'Preferences',
            description: 'Customize your notification and platform experience.',
            items: [
                {
                    icon: <Bell className="text-purple-600" size={20} />,
                    iconBg: 'bg-purple-50',
                    label: 'Notifications',
                    description: 'Control your email and push alerts',
                    path: '/profile' // Notification settings are at bottom of profile
                },
                {
                    icon: <Globe className="text-blue-500" size={20} />,
                    iconBg: 'bg-blue-50',
                    label: 'Language & Region',
                    description: 'Select your local currency and language',
                    status: 'USD / English'
                }
            ]
        }
    ];

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Configure your platform experience and account security.</p>
            </div>

            <div className="space-y-12">
                {settingsSections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-6">
                        <div className="border-b border-slate-100 pb-4">
                            <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
                            <p className="text-sm text-slate-500">{section.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {section.items.map((item, iIdx) => {
                                const Content = (
                                    <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.label}</h3>
                                                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {item.status && (
                                                <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                    {item.status}
                                                </span>
                                            )}
                                            <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
                                        </div>
                                    </div>
                                );

                                return item.path ? (
                                    <Link key={iIdx} to={item.path}>{Content}</Link>
                                ) : (
                                    <button key={iIdx} className="w-full text-left">{Content}</button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Logout/Support Footer */}
            <div className="pt-8 flex flex-col md:flex-row gap-4">
                <button className="flex-1 flex items-center justify-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors">
                    <HelpCircle size={20} />
                    Contact Support
                </button>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '#/login';
                    }}
                    className="flex-1 flex items-center justify-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 font-bold hover:bg-red-100 transition-colors"
                >
                    <LogOut size={20} />
                    Sign Out of Account
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
