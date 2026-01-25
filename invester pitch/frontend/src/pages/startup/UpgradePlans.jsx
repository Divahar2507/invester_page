import React, { useState } from 'react';
import {
    CheckCircle2,
    ArrowRight,
    Zap,
    Rocket,
    Shield,
    Globe,
    TrendingUp,
    ChevronDown,
    Building,
    User
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UpgradePlans = () => {
    const [isAnnual, setIsAnnual] = useState(true);

    const plans = [
        {
            name: 'Basic',
            price: '₹0',
            description: 'Essential tools for high-potential founders just starting their journey.',
            features: [
                '3 Active Pitches in Ecosystem',
                'Basic Visitor Analytics',
                'Community Networking Access',
                'Standard Data Export (PDF)',
                '1,000+ Investor Directory Search'
            ],
            cta: 'Current Plan',
            current: true,
            style: 'border-slate-100 bg-white/50 grayscale opacity-70'
        },
        {
            name: 'Pro Growth',
            badge: 'Most Popular',
            price: isAnnual ? '₹799' : '₹999',
            description: 'Advanced protocols for serious founders scaling for institutional capital.',
            features: [
                'Unlimited Active Pitches',
                'Advanced Algorithmic Signal',
                'AI Investor Matching (50/mo)',
                'White-label Branding & Domains',
                'Priority Terminal Placement',
                'Direct Partner Outreach Protocol'
            ],
            cta: 'Upgrade to Pro',
            current: false,
            style: 'border-blue-500 bg-white shadow-2xl shadow-blue-500/10 scale-105 z-10'
        },
        {
            name: 'Institutional',
            price: isAnnual ? '₹1,599' : '₹1,999',
            description: 'Full ecosystem access for teams with active capital requirements.',
            features: [
                'Unlimited Team Seats',
                'Global API Ecosystem Access',
                'Institutional Compliance Vault',
                'Dedicated Strategic Advisory',
                'Custom Legal Automation Engine',
                'Priority Verification Badge'
            ],
            cta: 'Contact Sales',
            current: false,
            style: 'border-slate-100 bg-white'
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Header */}
            <div className="text-center space-y-6 max-w-3xl mx-auto pt-10">
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-100 shadow-sm">
                    Upgrade Now
                </span>
                <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-[1.05]">
                    Choose the plan that <br />
                    fits your <span className="text-blue-600 italic">growth.</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Unlock premium protocols to supercharge your fundraising journey. Detailed analytics, algorithmic matching, and strategic institutional reach.
                </p>

                {/* Toggle */}
                <div className="flex items-center justify-center gap-4 pt-4">
                    <span className={`text-sm font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
                    <button
                        onClick={() => setIsAnnual(!isAnnual)}
                        className="w-14 h-8 bg-slate-100 rounded-full p-1 relative transition-colors"
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 absolute ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Annually</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-tight rounded-full">Save 20%</span>
                    </div>
                </div>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-8">
                {plans.map((plan, idx) => (
                    <div
                        key={idx}
                        className={`p-10 rounded-[48px] border flex flex-col transition-all duration-500 group relative ${plan.style}`}
                    >
                        {plan.badge && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl shadow-blue-500/40">
                                {plan.badge}
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{plan.description}</p>
                        </div>

                        <div className="flex items-baseline gap-1 mb-10">
                            <span className="text-5xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                            <span className="text-slate-400 font-bold">/mo</span>
                        </div>

                        {plan.current ? (
                            <button className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest mb-10 bg-slate-100 text-slate-400 cursor-default flex items-center justify-center gap-2">
                                {plan.cta}
                            </button>
                        ) : (
                            <Link
                                to={plan.name === 'Pro Growth' ? "/checkout" : "#"}
                                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest mb-10 transition-all active:scale-95 flex items-center justify-center gap-2 ${plan.name === 'Pro Growth'
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:shadow-2xl'
                                        : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {plan.cta}
                                <ArrowRight size={18} />
                            </Link>
                        )}

                        <div className="space-y-4 flex-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Everything in {idx > 0 ? plans[idx - 1].name : 'Basic'}, plus:</p>
                            {plan.features.map((feature, fIdx) => (
                                <div key={fIdx} className="flex items-start gap-3">
                                    <div className={`mt-0.5 rounded-full p-0.5 ${plan.name === 'Pro Growth' ? 'bg-blue-500 text-white' : 'bg-emerald-50 text-emerald-500'}`}>
                                        <CheckCircle2 size={12} />
                                    </div>
                                    <span className="text-sm text-slate-600 font-bold leading-tight">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Trusted By / Feature Comparison Footer */}
            <div className="pt-20 text-center">
                <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em] mb-12">Trusted by 10,000+ Founders Globally</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                    <div className="flex items-center justify-center gap-3 font-black text-xl italic text-slate-600"><Rocket className="text-blue-500" /> AERO.AI</div>
                    <div className="flex items-center justify-center gap-3 font-black text-xl italic text-slate-600"><Building className="text-indigo-500" /> NEXUS</div>
                    <div className="flex items-center justify-center gap-3 font-black text-xl italic text-slate-600"><Globe className="text-emerald-500" /> ORBIT</div>
                    <div className="flex items-center justify-center gap-3 font-black text-xl italic text-slate-600"><Shield className="text-rose-500" /> SECURE</div>
                </div>
            </div>
        </div>
    );
};

export default UpgradePlans;
