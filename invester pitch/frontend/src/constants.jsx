import React from 'react';
import { LayoutDashboard, Compass, Briefcase, FileSearch, MessageSquare, Settings, LogOut, TrendingUp, DollarSign, Activity, Users, Eye, CreditCard } from 'lucide-react';

export const NAV_ITEMS = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { label: 'Browse Pitches', icon: <Compass size={20} />, path: '/browse' },
    { label: 'My Network', icon: <Users size={20} />, path: '/connections' },
    { label: 'Watchlist', icon: <Eye size={20} />, path: '/watchlist' },
    { label: 'My Portfolio', icon: <Briefcase size={20} />, path: '/portfolio' },
    { label: 'In Review', icon: <FileSearch size={20} />, path: '/in-review' },
    { label: 'Funding Portal', icon: <DollarSign size={20} />, path: 'http://localhost:3009', isExternal: true },
    { label: 'Messages', icon: <MessageSquare size={20} />, path: '/messages', badge: 3 },
];

export const STARTUP_NAV_ITEMS = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { label: 'My Network', icon: <Users size={20} />, path: '/connections' },
    { label: 'Find Investors', icon: <Users size={20} />, path: '/browse-investors' },
    { label: 'Create Pitch', icon: <Compass size={20} />, path: '/create-pitch' },
    { label: 'Funding Portal', icon: <DollarSign size={20} />, path: 'http://localhost:3009', isExternal: true },
    { label: 'Billing', icon: <CreditCard size={20} />, path: '/subscription' },
    { label: 'Messages', icon: <MessageSquare size={20} />, path: '/messages' },
];


