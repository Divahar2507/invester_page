import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashShell from "../components/DashShell.jsx";
import { CheckCircle2, ShieldCheck, Zap, Rocket, TrendingUp, Infinity } from "lucide-react";

export default function UpgradePlans() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 0,
      period: "/mo",
      desc: "Perfect for early-stage founders building their initial traction.",
      features: [
        "Up to 3 Active Pitches",
        "Global Profile Indexing",
        "Basic Visitor Analytics",
        "Community Hub Access",
      ],
      cta: "Current Plan",
      disabled: true,
      color: "slate"
    },
    {
      id: "growth",
      name: "Growth",
      price: 999,
      period: "/mo",
      desc: "Advanced tools for founders aggressively seeking capital.",
      features: [
        "Unlimited Active Pitches",
        "Direct Investor Outreach",
        "FundHub Access (Port 3009)",
        "Automated Due Diligence",
        "Priority Feed Placement",
      ],
      cta: "Switch to Growth",
      featured: true,
      color: "blue"
    },
    {
      id: "pro",
      name: "Pro Scale",
      price: 1999,
      period: "/mo",
      desc: "Full ecosystem features for scaling startups and enterprises.",
      features: [
        "All Growth Features",
        "1-on-1 Strategic Consulting",
        "Legal Engine White-labeling",
        "Ecosystem API Access",
        "Dedicated Success Manager",
      ],
      cta: "Become Pro",
      color: "indigo"
    }
  ];

  function goCheckout(planId, amount) {
    navigate("/upgrade/checkout", {
      state: {
        planId,
        planName: plans.find(p => p.id === planId).name,
        billing,
        amount,
      },
    });
  }

  return (
    <DashShell>
      <div className="min-h-screen py-20 px-6 font-['Inter']">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest">
              Establish Your Orbit
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Scale Your Vision.</h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              Choose the level of access that matches your fundraising intensity. Our ecosystem grows with you.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-10 rounded-[44px] border border-slate-200 bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 ${plan.featured ? 'scale-105 z-10 ring-4 ring-blue-500/10 border-blue-500' : 'hover:border-blue-500/30'}`}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-blue-600 text-white text-[9px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
                    Recommended
                  </div>
                )}

                <div className="space-y-8">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{plan.price}</span>
                      <span className="text-sm font-bold text-slate-400">{plan.period}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {plan.desc}
                  </p>

                  <button
                    onClick={() => !plan.disabled && goCheckout(plan.id, plan.price)}
                    disabled={plan.disabled}
                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${plan.id === 'growth' ? 'bg-blue-600 text-white hover:bg-black shadow-lg shadow-blue-500/20' : 'bg-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'}`}
                  >
                    {plan.cta}
                  </button>

                  <div className="space-y-4 pt-4">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 size={16} className={plan.id === 'growth' ? 'text-blue-600' : 'text-slate-300'} />
                        <span className="text-[11px] font-bold text-slate-600 tracking-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Quote */}
          <div className="text-center pt-20">
            <div className="max-w-2xl mx-auto p-12 bg-slate-50 rounded-[48px] border border-slate-100">
              <p className="text-lg italic text-slate-400 font-medium leading-relaxed mb-6">
                "INVESTORCONNECTER is the cockpit for your journey to Series A and beyond. Precision scouting in the digital age."
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">INVESTORCONNECTER CORE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashShell>
  );
}
