
import React from 'react';
import { Briefcase, Clock, DollarSign, Filter, Search, ChevronRight, FileText, Send, UserPlus, Zap } from 'lucide-react';
import { User, UserRole, Project } from '../types';

interface ProjectBoardProps {
  user: User;
  projects: Project[];
  onConnect: (id: string, name: string) => void;
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({ user, projects, onConnect }) => {
  const isStartup = user.role === UserRole.STARTUP;
  const isFreelancer = user.role === UserRole.FREELANCER;
  const isPartner = user.role === UserRole.AGENCY || user.role === UserRole.INSTITUTION;

  // Logic: Freelancers only see project execution, not talent requirements.
  const visibleProjects = projects.filter(project => {
    if (isFreelancer) return project.type === 'execution';
    return true; // Agencies, Institutions, and the poster see everything
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Opportunity Hub</h2>
          <p className="text-slate-500 text-sm">The central board for all startup projects and recruitment requirements.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter opportunities..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {visibleProjects.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Briefcase size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching opportunities found</h3>
              <p className="text-sm text-slate-400">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            visibleProjects.map((project) => {
              const isMine = project.postedById === user.id;
              const isLeadOpportunity = project.type === 'recruitment' && isPartner;

              return (
                <div key={project.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-transparent hover:border-l-blue-600">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${
                        project.type === 'recruitment' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {project.type === 'recruitment' ? <UserPlus size={24} /> : <Zap size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-slate-900 leading-none">{project.title}</h3>
                          {project.type === 'recruitment' ? (
                            <span className="bg-purple-100 text-purple-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Talent Search</span>
                          ) : (
                            <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Project execution</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                          Posted by <span className="text-blue-600 font-bold">{project.postedBy}</span>
                          {isMine && <span className="ml-2 text-slate-300">(Me)</span>}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900">{project.budget}</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-bold tracking-wider">{project.category}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.skills.map(skill => (
                      <span key={skill} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-lg uppercase tracking-tight font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Clock size={12}/> 14 days left</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><FileText size={12}/> 3 Offers</span>
                    </div>
                    
                    {!isMine && (
                      <button 
                        onClick={() => onConnect(project.postedById, project.postedBy)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          isLeadOpportunity 
                            ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-100' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100'
                        }`}
                      >
                        {isLeadOpportunity ? 'Connect for Lead' : 'Send Quotation'}
                        <Send size={14} />
                      </button>
                    )}

                    {isMine && (
                      <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline group-hover:translate-x-1 transition-transform">
                        Manage Leads <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">Board Stats</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-80">Total Opportunities</span>
                <span className="text-lg font-black">{visibleProjects.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-80">Talent Needed</span>
                <span className="text-lg font-black">{projects.filter(p => p.type === 'recruitment').length}</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Matching Efficiency</p>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[85%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-6">Sector Spotlight</h4>
            <div className="space-y-4">
              {['Fintech', 'SaaS', 'Climate Tech', 'AI/ML'].map(s => (
                <div key={s} className="flex items-center justify-between group cursor-pointer">
                  <span className="text-sm text-slate-500 group-hover:text-blue-600 font-medium transition-colors">{s}</span>
                  <span className="text-[10px] font-bold bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full">{Math.floor(Math.random() * 20) + 5}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBoard;
