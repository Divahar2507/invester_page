
import React, { useState } from 'react';
import { X, Send, Link as LinkIcon, FileText } from 'lucide-react';
import { Project } from '../types';

interface ApplicationModalProps {
    jobTitle: string;
    onClose: () => void;
    onApply: (message: string, resumeLink: string) => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ jobTitle, onClose, onApply }) => {
    const [message, setMessage] = useState('');
    const [resumeLink, setResumeLink] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onApply(message, resumeLink);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold">Apply for Position</h2>
                        <p className="text-xs opacity-80 mt-1">Applying to: <span className="font-bold">{jobTitle}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Cover Message</label>
                        <div className="relative">
                            <textarea
                                required
                                rows={4}
                                placeholder="Introduce yourself and explain why you're a good fit..."
                                className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 text-sm resize-none"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Resume / Portfolio Link</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="url"
                                required
                                placeholder="https://linkedin.com/in/..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 text-sm"
                                value={resumeLink}
                                onChange={e => setResumeLink(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]"
                        >
                            Send Application
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationModal;
