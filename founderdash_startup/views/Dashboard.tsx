
import React from 'react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Plus, 
  Search, 
  ArrowRight,
  Mail,
  UserCheck,
  Zap,
  UserPlus
} from 'lucide-react';
import { Stat, Activity, User, UserRole, ProjectType } from '../types';

interface DashboardProps {
  user: User;
  onPostProject?: (type: ProjectType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onPostProject }) => {
  const isStartup = user.role === UserRole.STARTUP;

  const stats: Stat[] = [
    { label: isStartup ? 'Active Interns' : 'Talent Placed', value: isStartup ? 12 : 84, change: '+20%', isPositive: true, subtext: 'v.s. last month', icon: Users },
    { label: isStartup ? 'Agency Leads' : 'New Proposals', value: isStartup ? '08' : '15', change: '+10%', isPositive: true, subtext: 'active negotiations', icon: Briefcase },
    { label: 'Upcoming Calls', value: '05', change: '-5%', isPositive: false, subtext: 'scheduled this week', icon: Calendar }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Welcome back, {user.name.split(' ')[0]}!</h2>
            <p className="text-slate-500 max-w-md">
              {isStartup 
                ? "You have 3 new quotations for your 'React Native' project. Review them today to stay on track."
                : "There are 5 new projects matching your skills in the marketplace."}
            </p>
          </div>
          <div className="relative z-10">
             <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100">
               <Zap size={32} />
             </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 blur-3xl rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                <stat.icon size={18} className="text-blue-600" />
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{stat.subtext}</p>
            </div>
          ))}
        </div>

        <section>
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Collaborations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CollaborationCard 
              title="Q3 Brand Strategy" 
              partner="AGENCY X" 
              status="In Progress"
              progress={75}
            />
            <CollaborationCard 
              title="Backend Refactor" 
              partner="John Freelancer" 
              status="Review"
              progress={90}
            />
          </div>
        </section>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Immediate Actions</h3>
          <div className="space-y-4">
            {isStartup ? (
              <>
                <button 
                  onClick={() => onPostProject?.('execution')}
                  className="w-full bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Zap size={20} className="text-blue-400" />
                    <span className="font-bold text-sm">Post a Project</span>
                  </div>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => onPostProject?.('recruitment')}
                  className="w-full bg-blue-50 text-blue-600 p-4 rounded-2xl flex items-center justify-between hover:bg-blue-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <UserPlus size={20} />
                    <span className="font-bold text-sm">Find Talent</span>
                  </div>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            ) : (
              <>
                <button className="w-full bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between hover:bg-slate-800 transition-colors group">
                  <span className="font-bold text-sm">Browse Marketplace</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full bg-blue-50 text-blue-600 p-4 rounded-2xl flex items-center justify-between hover:bg-blue-100 transition-colors group">
                  <span className="font-bold text-sm">Update Availability</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Community Score</h4>
            <p className="text-4xl font-black mb-4">98</p>
            <p className="text-xs text-slate-400 leading-relaxed">Your account is in excellent standing. You're among the top 5% of collaborators this month.</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      </div>
    </div>
  );
};

const CollaborationCard = ({ title, partner, status, progress }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h4 className="font-bold text-slate-900 leading-none mb-1">{title}</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{partner}</p>
      </div>
      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-600 uppercase">{status}</span>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold text-slate-400">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  </div>
);

export default Dashboard;
