import React from 'react';
import { LayoutDashboard, Compass, Briefcase, FileSearch, MessageSquare, Settings, LogOut, TrendingUp, DollarSign, Activity, Users, Eye } from 'lucide-react';

export const NAV_ITEMS = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { label: 'Browse Pitches', icon: <Compass size={20} />, path: '/browse' },
    { label: 'Watchlist', icon: <Eye size={20} />, path: '/watchlist' },
    { label: 'My Portfolio', icon: <Briefcase size={20} />, path: '/portfolio' },
    { label: 'In Review', icon: <FileSearch size={20} />, path: '/in-review' },
    { label: 'Messages', icon: <MessageSquare size={20} />, path: '/messages', badge: 3 },
];

export const STARTUP_NAV_ITEMS = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { label: 'Find Investors', icon: <Users size={20} />, path: '/browse-investors' },
    { label: 'Create Pitch', icon: <Compass size={20} />, path: '/create-pitch' },
    { label: 'Messages', icon: <MessageSquare size={20} />, path: '/messages' },
];


