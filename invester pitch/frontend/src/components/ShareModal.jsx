import * as React from 'react';
import { useState } from 'react';
import {
    X,
    Mail,
    Link as LinkIcon,
    Copy,
    Clock,
    Lock,
    Download,
    Send,
    MessageSquare,
    Eye,
    CheckCircle2,
    FileText
} from 'lucide-react';

const ShareModal = ({ isOpen, onClose, startupName = "EcoCharge" }) => {
    const [copied, setCopied] = useState(false);
    const [allowDownload, setAllowDownload] = useState(true);
    const [isLinkActive, setIsLinkActive] = useState(true);
    const [isSent, setIsSent] = useState(false);

    if (!isOpen) return null;

    const handleSend = () => {
        setIsSent(true);
        setTimeout(() => {
            setIsSent(false);
            onClose();
        }, 2000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText('vf.co/deck/ec-829s');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-[40px] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in slide-in-from-bottom-8 duration-500">

                {/* Left Side: Email Form */}
                <div className="flex-1 p-12 space-y-10 border-r border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-[20px] flex items-center justify-center">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Share via Email</h3>
                            <p className="text-sm font-semibold text-slate-400 mt-2">Send a secure invite directly to investors.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recipients</label>
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                                    <Mail size={18} strokeWidth={3} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter email addresses (comma separated)"
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[20px] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                            <input
                                type="text"
                                defaultValue={`Pitch Deck: ${startupName} Series A`}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[20px] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                            <textarea
                                rows={6}
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[24px] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm leading-relaxed resize-none"
                                defaultValue={`Hi,\n\nI'd like to share our latest pitch deck with you. ${startupName} is revolutionizing energy storage with solid-state technology.\n\nBest,`}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" className="peer sr-only" />
                                <div className="w-5 h-5 bg-slate-100 border-2 border-slate-200 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all group-hover:border-blue-400 flex items-center justify-center">
                                    <CheckCircle2 size={12} className="text-white scale-0 peer-checked:scale-100 transition-transform" />
                                </div>
                            </div>
                            <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors">Send me a copy</span>
                        </label>
                        <button
                            onClick={handleSend}
                            className={`flex items-center gap-3 px-10 py-4 font-black rounded-[20px] shadow-xl transition-all active:scale-[0.98]
                                ${isSent ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'}
                            `}
                        >
                            {isSent ? <CheckCircle2 size={18} /> : <Send size={18} />}
                            {isSent ? 'Invite Sent!' : 'Send Invite'}
                        </button>
                    </div>
                </div>

                {/* Right Side: Options & Link */}
                <div className="w-full md:w-[320px] bg-slate-50/50 p-12 flex flex-col gap-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none">Shareable Link</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Generate a secure link.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-300 hover:text-slate-900 transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-sm font-bold text-slate-900">Link Active</span>
                            </div>
                            <button
                                onClick={() => setIsLinkActive(!isLinkActive)}
                                className={`w-11 h-6 rounded-full transition-all relative ${isLinkActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${isLinkActive ? 'left-6' : 'left-1'}`}></div>
                            </button>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
                            <LinkIcon size={16} className="text-slate-300 shrink-0" />
                            <span className="text-xs font-bold text-slate-700 truncate">vf.co/deck/ec-829s</span>
                        </div>

                        <button
                            onClick={handleCopy}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all border
                                ${copied
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                                    : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'
                                }
                            `}
                        >
                            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Privacy Settings</h4>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-slate-300" />
                                    <span className="text-sm font-bold text-slate-600">Expiration</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <span className="text-[10px] font-black text-slate-900">7 Days</span>
                                    <ChevronRight size={12} className="text-slate-300 rotate-90" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Lock size={16} className="text-slate-300" />
                                    <span className="text-sm font-bold text-slate-600">Password</span>
                                </div>
                                <button className="w-11 h-6 bg-slate-200 rounded-full relative">
                                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Download size={16} className="text-slate-300" />
                                    <span className="text-sm font-bold text-slate-600">Allow Download</span>
                                </div>
                                <button
                                    onClick={() => setAllowDownload(!allowDownload)}
                                    className={`w-11 h-6 rounded-full transition-all relative ${allowDownload ? 'bg-blue-600' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${allowDownload ? 'left-6' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share on Platform</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all flex justify-center"><FileText size={20} /></button>
                            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors flex justify-center"><Eye size={20} /></button>
                            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors flex justify-center"><MessageSquare size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChevronRight = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export default ShareModal;
