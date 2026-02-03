
import React from 'react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  ArrowRight,
  Zap,
  UserPlus,
  Trophy,
  Target
} from 'lucide-react';
import { Stat, User, UserRole, ProjectType, Interview, HiringStats } from '../types';

interface DashboardProps {
  user: User;
  interviews: Interview[];
  hiringStats: HiringStats;
  onPostProject?: (type: ProjectType) => void;
  onViewInterviews: () => void;
  onViewInterns: () => void;
  onViewAgencyLeads: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, interviews, hiringStats, onPostProject, onViewInterviews, onViewInterns, onViewAgencyLeads }) => {
  const isStartup = user.role === UserRole.STARTUP;
  const isInstitution = user.role === UserRole.INSTITUTION;
  const isAgency = user.role === UserRole.AGENCY;
  const isFreelancer = user.role === UserRole.FREELANCER;

  const getStats = (): Stat[] => {
    if (isStartup) {
      return [
        { label: 'Active Interns', value: hiringStats.activeInterns, change: '+2', isPositive: true, subtext: 'Hired from Institutions', icon: Users },
        { label: 'Agency Leads', value: hiringStats.agencyLeads, change: '+1', isPositive: true, subtext: 'Active Partnerships', icon: Target },
        { label: 'Upcoming Interviews', value: interviews.length, change: interviews.length > 0 ? `+${interviews.length}` : '0', isPositive: interviews.length > 0, subtext: 'Pending decision', icon: Calendar }
      ];
    }
    if (isInstitution) {
      return [
        { label: 'Students Hired', value: hiringStats.hiredStudents, change: '+5', isPositive: true, subtext: 'Total across startups', icon: Trophy },
        { label: 'Active Internships', value: 12, change: '+2', isPositive: true, subtext: 'Current student count', icon: Users },
        { label: 'Partner Startups', value: 8, change: '0', isPositive: false, subtext: 'Trusting your talent', icon: Briefcase }
      ];
    }
    if (isAgency || isFreelancer) {
      return [
        { label: 'Leads Taken', value: hiringStats.leadsTaken, change: '+3', isPositive: true, subtext: 'Projects won this month', icon: Zap },
        { label: 'Active Projects', value: 4, change: '+1', isPositive: true, subtext: 'Under execution', icon: Briefcase },
        { label: 'Client Rating', value: '4.9', change: '+0.1', isPositive: true, subtext: 'Based on 24 reviews', icon: Target }
      ];
    }
    return [];
  };

  const stats = getStats();

  const handleStatClick = (label: string) => {
    if (label === 'Upcoming Interviews') onViewInterviews();
    if (label === 'Active Interns') onViewInterns();
    if (label === 'Agency Leads') onViewAgencyLeads();
  };

  const isInteractive = (label: string) => {
    return ['Upcoming Interviews', 'Active Interns', 'Agency Leads'].includes(label);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Welcome back, {user.name.split(' ')[0]}!</h2>
            <p className="text-slate-500 max-w-md text-sm">
              {isStartup 
                ? "Manage your workforce and partnerships from a single command center."
                : isInstitution 
                ? "Your students are making waves! Check out the latest hiring trends."
                : "Your professional reputation is growing. Review your active leads and projects."}
            </p>
          </div>
          <div className="relative z-10 hidden sm:block">
             <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100 animate-pulse">
               <Zap size={32} />
             </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 blur-3xl rounded-full"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const clickable = isInteractive(stat.label);
            return (
              <button 
                key={idx} 
                onClick={() => handleStatClick(stat.label)}
                disabled={!clickable}
                className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left transition-all group ${clickable ? 'hover:shadow-lg hover:border-blue-200 cursor-pointer active:scale-95' : 'cursor-default'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                  <div className={`p-2 rounded-lg ${clickable ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-slate-50 text-slate-400'} transition-colors`}>
                    <stat.icon size={16} />
                  </div>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-3xl font-black text-slate-900 leading-none">{String(stat.value).padStart(2, '0')}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{stat.subtext}</p>
              </button>
            );
          })}
        </div>

        <section>
          <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Ecosystem Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Collaboration Progress</h4>
              <p className="text-xs text-slate-400 mb-4">Project: Q4 Sprint Alpha</p>
              <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[65%]"></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Market Sentiment</h4>
              <p className="text-xs text-slate-400 mb-4">Trending Sector: Climate Tech</p>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <Target size={16} /> High Demand
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Immediate Actions</h3>
          <div className="space-y-4">
            {isStartup ? (
              <>
                <button 
                  onClick={() => onPostProject?.('execution')}
                  className="w-full bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between hover:bg-slate-800 transition-all group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <Zap size={20} className="text-blue-400" />
                    <span className="font-black text-xs uppercase tracking-widest">Post a Project</span>
                  </div>
                  <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => onPostProject?.('recruitment')}
                  className="w-full bg-blue-50 text-blue-600 p-5 rounded-2xl flex items-center justify-between hover:bg-blue-100 transition-all group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <UserPlus size={20} />
                    <span className="font-black text-xs uppercase tracking-widest">Find a Talent</span>
                  </div>
                  <ArrowRight size={18} />
                </button>
              </>
            ) : (
              <button className="w-full bg-blue-600 text-white p-5 rounded-2xl flex items-center justify-between hover:bg-blue-700 transition-all group">
                <span className="font-black text-xs uppercase tracking-widest">Update Profile</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
