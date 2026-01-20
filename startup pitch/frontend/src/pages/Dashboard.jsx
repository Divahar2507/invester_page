import React from "react";
import { useNavigate } from "react-router-dom";
import DashShell from "../components/DashShell.jsx";
import { getName } from "../auth.js";
import { Folder, Eye, Zap, TrendingUp, Clock, FileText, Calendar, ArrowRight, MessageCircle } from "lucide-react";

function StatCard({ icon: Icon, label, value, delta, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-amber-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
          <TrendingUp size={12} /> {delta}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
        <div className="text-sm font-medium text-slate-500">{label}</div>
      </div>
    </div>
  );
}

function PitchRow({ badge, title, desc, metaLeft, metaRight, iconBg }) {
  return (
    <div className="group flex items-center p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mr-4 ${iconBg}`}>
        <FileText className="text-white" size={20} />
      </div>

      <div className="flex-1 min-w-0 mr-4">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-slate-900 text-sm truncate">{title}</h4>
          {badge && <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${badge === 'FINAL' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{badge}</span>}
        </div>
        <p className="text-xs text-slate-500 truncate">{desc}</p>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <div className="hidden sm:flex items-center gap-3">
          {metaLeft}
        </div>
        <div className="text-xs font-medium text-slate-400">
          {metaRight}
        </div>
      </div>
    </div>
  );
}

function MatchRow({ name, role, match }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">{name}</div>
          <div className="text-xs text-slate-500">{role}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">
          <Zap size={12} fill="currentColor" /> {match}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const name = getName();

  return (
    <DashShell>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Good morning, {name} 👋</h1>
            <p className="text-slate-500 mt-1">Here is your startup’s daily brief and pitch performance.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              System Online
            </div>
            <div className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-bold">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard color="blue" icon={Folder} label="Total Pitches" value="4" delta="+20%" />
          <StatCard color="purple" icon={Eye} label="Investor Views" value="128" delta="+12%" />
          <StatCard color="orange" icon={Zap} label="Match Score" value="85%" delta="+5%" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Recent Pitches */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900">Recent Pitches</h3>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">View All</button>
              </div>
              <div className="p-2 space-y-1">
                <PitchRow
                  badge="V3.0"
                  iconBg="bg-blue-500"
                  title="Series A Deck"
                  desc="Updated financial projections and added new team slides."
                  metaLeft={
                    <>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[10px] font-bold uppercase">Editing</span>
                      <span className="flex items-center gap-1 text-slate-500 text-xs font-medium"><Eye size={12} /> 14</span>
                    </>
                  }
                  metaRight="2h ago"
                />

                <PitchRow
                  badge="FINAL"
                  iconBg="bg-purple-500"
                  title="Seed Round Teaser"
                  desc="One-pager summary for cold outreach campaigns."
                  metaLeft={
                    <>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold uppercase">Shared</span>
                      <span className="flex items-center gap-1 text-slate-500 text-xs font-medium"><Eye size={12} /> 85</span>
                    </>
                  }
                  metaRight="1d ago"
                />

                <PitchRow
                  iconBg="bg-slate-500"
                  title="Q3 Board Update"
                  desc="Quarterly report presentation draft."
                  metaLeft={
                    <>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold uppercase">Draft</span>
                      <span className="flex items-center gap-1 text-slate-500 text-xs font-medium"><Eye size={12} /> 0</span>
                    </>
                  }
                  metaRight="5d ago"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Matches & Activity */}
          <div className="space-y-6">

            {/* Match Opportunities */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-slate-900">Match Opportunities</h3>
                <ArrowRight size={18} className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
              </div>
              <div className="space-y-3">
                <MatchRow name="Michael Ross" role="Partner @ Ventura" match="98%" />
                <div className="h-px bg-slate-50"></div>
                <MatchRow name="Sarah Jenning" role="Angel Investor" match="89%" />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg text-slate-900 mb-6">Recent Activity</h3>
              <div className="space-y-6 relative pl-2">
                <div className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-slate-100"></div>

                <div className="relative flex gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 relative z-10 ring-4 ring-white"></div>
                  <div>
                    <p className="text-sm text-slate-600 leading-snug"><span className="font-bold text-slate-900">John Doe</span> commented on slide 4 of “Series A Deck”</p>
                    <p className="text-xs text-slate-400 mt-1">10 min ago</p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 mt-1.5 relative z-10 ring-4 ring-white"></div>
                  <div>
                    <p className="text-sm text-slate-600 leading-snug">New match found: <span className="font-bold text-slate-900">TechStar Accelerator</span></p>
                    <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 mt-1.5 relative z-10 ring-4 ring-white"></div>
                  <div>
                    <p className="text-sm text-slate-600 leading-snug">You uploaded “<span className="font-bold text-slate-900">Financials_2023.xlsx</span>”</p>
                    <p className="text-xs text-slate-400 mt-1">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                <Zap size={100} />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                  <Zap className="text-white" size={20} />
                </div>
                <h3 className="font-bold text-lg mb-1">Boost Visibility</h3>
                <p className="text-blue-100 text-sm mb-4 leading-relaxed">Get your pitch in front of top-tier investors today.</p>
                <button
                  onClick={() => navigate("/upgrade")}
                  className="w-full py-2.5 bg-white text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashShell>
  );
}