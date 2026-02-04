import React from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  Users,
  MapPin,
  BookOpen,
  Settings,
  HelpCircle,
  TrendingUp,
  FileText,
  DollarSign,
  ShieldCheck
} from 'lucide-react';
// import { NavItem, StatCardData, ResearchProject, Mentor, Seminar, TechPark } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { id: 'research-engine', label: 'Research Engine', icon: 'ShieldCheck', path: '/research-engine' },
  { id: 'research', label: 'Research', icon: 'FlaskConical', path: '/research' },
  { id: 'seminars', label: 'Seminars', icon: 'BookOpen', path: '/seminars' },
  { id: 'mentors', label: 'Mentors', icon: 'Users', path: '/mentors' },
  { id: 'techparks', label: 'Tech Parks', icon: 'MapPin', path: '/techparks' },
];

export const ICON_MAP = {
  LayoutDashboard,
  FlaskConical,
  Users,
  MapPin,
  BookOpen,
  Settings,
  HelpCircle,
  TrendingUp,
  FileText,
  DollarSign,
  ShieldCheck
};

export const DASHBOARD_STATS = [
  { label: 'Active R&D Projects', value: 124, change: '+12%', trend: 'up', icon: 'FlaskConical', color: 'text-blue-600 bg-blue-50' },
  { label: 'Mentors Online', value: 86, change: '+5%', trend: 'up', icon: 'Users', color: 'text-purple-600 bg-purple-50' },
  { label: 'Total Startups', value: 312, change: '-2%', trend: 'down', icon: 'TrendingUp', color: 'text-orange-600 bg-orange-50' },
  { label: 'Patents Pending', value: 45, change: '+8%', trend: 'up', icon: 'FileText', color: 'text-emerald-600 bg-emerald-50' },
];

export const RESEARCH_PROJECTS = [
  {
    id: '101',
    title: 'Neural Plasticity in AI Cognitive Models',
    institution: 'STANFORD UNIVERSITY',
    location: 'Stanford, CA',
    description: 'Investigating how deep learning architectures can mimic human brain plasticity for more efficient training and reduced forgetting.',
    field: 'AI & ML',
    status: 'Active',
    stage: 'Phase II - Testing',
    progress: 65,
    image: '/images/neural_plasticity.png'
  },
  {
    id: '102',
    title: 'Graphene-Based Hydrogen Storage Systems',
    institution: 'MIT RESEARCH LAB',
    location: 'Cambridge, MA',
    description: 'Breakthrough in solid-state hydrogen storage using functionalized multilayer graphene for high-density adsorption.',
    field: 'Green Tech',
    status: 'Active',
    stage: 'Prototyping',
    progress: 40,
    image: '/images/graphene_storage.png'
  }
];

export const MENTORS = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Managing Partner',
    company: 'InnoSphere VC',
    expertise: ['Venture Capital', 'Scaling'],
    rating: 4.9,
    reviews: 128,
    tags: ['Top Mentor 2024'],
    avatar: '/images/sarah_chen.png',
    status: 'top',
    bio: 'Sarah Chen is a highly accomplished Managing Partner within the InnoSphere Portal. With over 15 years in venture capital, she has successfully guided 50+ startups through Series A and B funding rounds with a primary focus on DeepTech and Fintech disruption.'
  },
  {
    id: '2',
    name: 'Dr. Marcus Vane',
    role: 'Policy Advisor',
    company: 'Ministry of Edu',
    expertise: ['Education Policy', 'Grants'],
    rating: 5.0,
    reviews: 84,
    tags: ['15+ Years Experience'],
    avatar: '/images/marcus_vane.png',
    status: 'regular',
    bio: 'Dr. Marcus Vane serves as a senior advisor specializing in educational grant frameworks. His expertise lies in bridge-funding academic research into viable commercial prototypes, ensuring policy compliance at every stage.'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Founder',
    company: 'ScaleUp Systems',
    expertise: ['IP Protection', 'Operations'],
    rating: 4.8,
    reviews: 42,
    tags: ['Ex-Founder'],
    avatar: '/images/elena_rodriguez.png',
    status: 'top',
    bio: 'Elena Rodriguez is an operational powerhouse who scaled three enterprise SaaS platforms to global exits. She now focuses on IP protection strategies and helping first-time founders navigate international market entry.'
  }
];

export const SEMINARS = [
  {
    id: '1',
    title: 'Commercializing University Tech',
    date: 'Oct 24',
    month: 'OCT',
    day: '24',
    time: '10:00 AM',
    speaker: 'James Wilson',
    role: 'TechPark CEO'
  },
  {
    id: '2',
    title: 'Venture Capital for Biotech',
    date: 'Oct 27',
    month: 'OCT',
    day: '27',
    time: '02:30 PM',
    speaker: 'Elena Rodriguez',
    role: 'LifeFund Partners'
  }
];

export const TECH_PARKS = [
  {
    id: '1',
    name: 'Innovation Center @ MIT',
    location: 'Cambridge, MA',
    tags: ['Cleanroom ISO 7', '3D Printing Lab'],
    status: 'Open Access',
    coordinates: { lat: 42.3601, lng: -71.0942 },
    image: '/images/innovation_center.png'
  }
];