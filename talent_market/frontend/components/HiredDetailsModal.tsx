
import React from 'react';
import { X, User, Building2, Calendar, Briefcase, ChevronRight } from 'lucide-react';
import { HiredMember, UserRole } from '../types';

interface HiredDetailsModalProps {
  title: string;
  members: HiredMember[];
  onClose: () => void;
}

const HiredDetailsModal: React.FC<HiredDetailsModalProps> = ({ title, members, onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
            <p className="text-slate-500 text-sm mt-1">Management of active {title.toLowerCase()} relationships.</p>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white rounded-2xl transition-all shadow-sm">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4">
          {members.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto">
                <User size={40} />
              </div>
              <p className="text-slate-500 font-medium">No active records found.</p>
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                <img src={member.avatar} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50 group-hover:border-blue-100 transition-colors" alt="" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 text-lg truncate">{member.name}</h4>
                    {member.organization && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-600 uppercase tracking-tighter">
                        {member.organization}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Briefcase size={12} className="text-blue-500" /> {member.project}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Calendar size={12} className="text-blue-500" /> Joined {member.startDate}
                    </div>
                  </div>
                </div>

                <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Workspace Personnel Management</p>
        </div>
      </div>
    </div>
  );
};

export default HiredDetailsModal;
