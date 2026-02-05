
import React, { useState, useEffect } from 'react';
import { X, User, FileText, CheckCircle, Clock, ExternalLink, Calendar, Handshake } from 'lucide-react';
import { JobApplication, ApplicationStatus, UserRole } from '../types';
import { applicationApi } from '../api';

interface ApplicantsModalProps {
    jobId: string;
    jobTitle: string;
    onClose: () => void;
    onScheduleInterview: (participant: { name: string, avatar: string, id: string, role: UserRole }) => void;
    onHire: (application: JobApplication) => void;
}

const ApplicantsModal: React.FC<ApplicantsModalProps> = ({ jobId, jobTitle, onClose, onScheduleInterview, onHire }) => {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const data = await applicationApi.listByJob(jobId);
                setApplications(data);
            } catch (error) {
                console.error("Error fetching applicants:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [jobId]);

    const updateStatus = async (appId: string, status: ApplicationStatus) => {
        try {
            await applicationApi.updateStatus(appId, status);
            setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.APPLIED: return 'bg-blue-50 text-blue-600 border-blue-100';
            case ApplicationStatus.SHORTLISTED: return 'bg-purple-50 text-purple-600 border-purple-100';
            case ApplicationStatus.INTERVIEW: return 'bg-orange-50 text-orange-600 border-orange-100';
            case ApplicationStatus.SELECTED: return 'bg-green-50 text-green-600 border-green-100';
            case ApplicationStatus.REJECTED: return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in zoom-in-95 duration-200">
                <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Applicants for {jobTitle}</h2>
                            <p className="text-xs opacity-60">Manage leads and hire the best talent</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                                <User size={40} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No applicants yet</h3>
                            <p className="text-sm text-slate-500 max-w-xs">When talent applies to your posting, they will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map((app) => (
                                <div key={app.id} className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-200 transition-colors shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <img src={app.talent?.avatar || `https://picsum.photos/seed/${app.talent_id}/100/100`} className="w-14 h-14 rounded-xl object-cover" alt="" />
                                            <div>
                                                <h4 className="font-bold text-slate-900">{app.talent?.name || 'Applicant'}</h4>
                                                <p className="text-xs text-slate-500 mb-2">{app.talent?.organization || 'Independent Professional'}</p>
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {app.talent?.skills?.slice(0, 3).map(skill => (
                                                        <span key={skill} className="text-[9px] font-bold bg-slate-50 text-slate-400 px-2 py-0.5 rounded uppercase">{skill}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                                        <p className="text-xs text-slate-600 italic leading-relaxed">"{app.message || 'No cover message provided.'}"</p>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex gap-2">
                                            {app.resume_link && (
                                                <a href={app.resume_link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all">
                                                    <ExternalLink size={12} /> Portfolio
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <select
                                                value={app.status}
                                                onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                {Object.values(ApplicationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>

                                            <button
                                                onClick={() => onScheduleInterview({ name: app.talent?.name || 'User', avatar: app.talent?.avatar || '', id: app.talent_id, role: app.talent?.role || UserRole.FREELANCER })}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-blue-600 hover:bg-blue-50 transition-all"
                                            >
                                                <Clock size={12} /> Schedule
                                            </button>

                                            <button
                                                onClick={() => onHire(app)}
                                                className="flex items-center gap-1.5 px-4 py-1.5 bg-green-600 text-white rounded-lg text-[10px] font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
                                            >
                                                <Handshake size={12} /> Hire
                                            </button>
                                        </div>
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

export default ApplicantsModal;
