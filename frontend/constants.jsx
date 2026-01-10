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

export const MOCK_STARTUPS = [
    {
        id: '1',
        name: 'EcoCharge',
        sector: 'CleanTech',
        stage: 'Series A',
        location: 'San Francisco, CA',
        matchScore: 95,
        description: 'Revolutionary solid-state battery technology increasing EV range by 40% with sustainable materials.',
        fundingAsk: '$5,000,000',
        valuation: '$25M',
        tags: ['B2B', 'Hardware', 'Manufacturing'],
        logo: 'EC',
        status: 'In Review',
        reviewStatus: 'Due Diligence',
        reviewProgress: 65
    },
    {
        id: '2',
        name: 'HealthAI',
        sector: 'MedTech',
        stage: 'Seed',
        location: 'Boston, MA',
        matchScore: 88,
        description: 'Al-driven diagnostics platform for early detection of rare diseases using genomic sequencing.',
        fundingAsk: '$2,500,000',
        valuation: '$10M',
        tags: ['SaaS', 'AI', 'Healthcare'],
        logo: 'HA',
        status: 'In Review',
        reviewStatus: 'Initial Screening',
        reviewProgress: 25
    },
    {
        id: '3',
        name: 'CloudScale',
        sector: 'SaaS / Cloud',
        stage: 'Series B',
        location: 'Austin, TX',
        matchScore: 90,
        description: 'Automated cloud infrastructure optimization platform reducing overhead by 30%.',
        fundingAsk: '$12,000,000',
        valuation: '$65M',
        tags: ['B2B', 'SaaS', 'Cloud'],
        logo: 'CS',
        status: 'In Review',
        reviewStatus: 'Final Decision',
        reviewProgress: 90
    }
];

export const MOCK_PORTFOLIO = [
    {
        id: 'p1',
        name: 'NexTech AI',
        sector: 'AI / SaaS',
        stage: 'Series A',
        location: 'San Francisco, CA',
        matchScore: 100,
        description: 'Next-gen enterprise automation platform.',
        fundingAsk: '',
        valuation: '',
        tags: [],
        logo: 'NT',
        status: 'On Track',
        investedAmount: '$750k',
        currentValue: '$1.8M',
        growth: '+140%'
    },
    {
        id: 'p2',
        name: 'GreenScape',
        sector: 'CleanTech',
        stage: 'Seed',
        location: 'Austin, TX',
        matchScore: 100,
        description: 'Supply chain transparency for agriculture.',
        fundingAsk: '',
        valuation: '',
        tags: [],
        logo: 'GS',
        status: 'Needs Attention',
        investedAmount: '$300k',
        currentValue: '$340k',
        growth: '+13%'
    }
];

export const MOCK_MESSAGES = [
    {
        id: 'm1',
        sender: 'Sarah Jenkins',
        role: 'Partner at Elevate Ventures',
        content: "Hi Alex, I reviewed the deck you sent over last week. It's looking really strong.",
        timestamp: '10:23 AM',
        isMe: false,
        avatar: 'https://picsum.photos/seed/sarah/100/100'
    },
    {
        id: 'm2',
        sender: 'Sarah Jenkins',
        role: 'Partner at Elevate Ventures',
        content: 'Can you clarify the Customer Acquisition Cost (CAC) trend in Q3? It seems a bit higher than the projections.',
        timestamp: '10:24 AM',
        isMe: false,
        avatar: 'https://picsum.photos/seed/sarah/100/100'
    },
    {
        id: 'm3',
        sender: 'Alex Morgan',
        role: 'Founder',
        content: 'Absolutely, Sarah. We saw a temporary dip due to the aggressive scaling of our new ad campaign on LinkedIn.',
        timestamp: '10:35 AM',
        isMe: true,
        avatar: 'https://picsum.photos/seed/alex/100/100'
    }
];
