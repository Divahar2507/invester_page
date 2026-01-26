
import React from 'react';
import { X, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Interview } from '../types';

interface UpcomingInterviewsModalProps {
  interviews: Interview[];
  onClose: () => void;
  onHire: (interview: Interview) => void;
  onReject: (interview: Interview) => void;
}

const UpcomingInterviewsModal: React.FC<UpcomingInterviewsModalProps> = ({ interviews, onClose, onHire, onReject }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Interview Outcomes</h2>
            <p className="text-slate-500 text-sm mt-1">Review candidates and make hiring decisions.</p>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white rounded-2xl transition-all shadow-sm">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
          {interviews.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No interviews pending review</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Interviews you schedule from the message center will appear here for final evaluation.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="group relative flex flex-col sm:flex-row sm:items-center gap-6 p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <img src={interview.participantAvatar} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-50 group-hover:border-blue-100 transition-colors" alt="" />
                      <div className="absolute -top-1 -right-1 bg-blue-600 text-white p-1 rounded-lg">
                        <CheckCircle size={10} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 truncate text-lg leading-tight">{interview.participantName}</h4>
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{interview.participantRole}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium truncate mt-1">{interview.topic}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Calendar size={12} className="text-blue-500" /> {interview.date}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock size={12} className="text-blue-500" /> {interview.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 sm:pt-0 sm:pl-6 border-t sm:border-t-0 sm:border-l border-slate-50">
                    <button 
                      onClick={() => onHire(interview)}
                      className="flex-1 sm:flex-none whitespace-nowrap bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                    >
                      <CheckCircle size={14} /> Hire
                    </button>
                    <button 
                      onClick={() => onReject(interview)}
                      className="flex-1 sm:flex-none whitespace-nowrap bg-white text-red-600 border border-red-100 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingInterviewsModal;
