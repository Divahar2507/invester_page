import React from 'react';
import { Clock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const Overview = ({ onNavigate }) => {
    // Mock Data mimicking the onboarding result
    const milestones = [
        { date: 'March 31, 2024', task: 'First GST Filing Due', priority: 'high' },
        { date: 'April 15, 2024', task: 'Annual Income Tax Filing', priority: 'high' },
        { date: 'May 31, 2024', task: 'MCA Annual Filing Deadline', priority: 'high' },
        { date: 'June 30, 2024', task: 'Professional Tax First Half', priority: 'medium' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Compliance Overview</h1>
                <p className="text-slate-500">Real-time status of your regulatory obligations and upcoming deadlines.</p>
            </div>

            {/* Health Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900">85%</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compliance Health</div>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[85%]"></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900">4</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Actions</div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">2 High Priority tasks need attention this week.</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900">0</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Risks</div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">Your organization is currently low risk.</p>
                </div>
            </div>

            {/* Priority Matrix & Roadmap */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Priority Matrix */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50">
                            <h3 className="text-xl font-bold text-slate-900">Action Required</h3>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="h-12 w-12 bg-white text-red-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                    <Clock size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-red-900 text-lg">GST Filing Due (March)</h4>
                                    <p className="text-red-700/80 text-sm mt-1">Deadline approaching in 4 days. Late fees apply after Mar 31.</p>
                                </div>
                                <button className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition">
                                    File Now
                                </button>
                            </div>

                            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="h-12 w-12 bg-white text-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                    <CheckCircle size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-orange-900 text-lg">Approve Annual Report Draft</h4>
                                    <p className="text-orange-700/80 text-sm mt-1">Auditor has submitted the draft for your review.</p>
                                </div>
                                <button className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl border border-orange-200 hover:bg-orange-50 transition">
                                    Review
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Compliance Roadmap (Q1 2024)</h3>
                        <div className="space-y-4">
                            {milestones.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className={`h-3 w-3 rounded-full ${item.priority === 'high' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-900">{item.task}</div>
                                        <div className="text-xs font-bold text-slate-400">{item.date}</div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${item.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                                        }`}>
                                        {item.priority}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Insights */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-2xl">🤖</div>
                            <h3 className="text-2xl font-bold mb-2">AI Insights</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                Based on your recent activity, we recommend reviewing your <strong>Employee Contracts</strong>. New labor codes may impact your compliance status.
                            </p>
                            <button className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition text-sm flex items-center justify-center gap-2">
                                Review Contracts <ArrowRight size={16} />
                            </button>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8">
                        <h3 className="font-bold text-slate-900 mb-6">Recent Activity</h3>
                        <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100">
                            {[
                                { text: 'Uploaded GST Return (Feb)', time: '2 hours ago', icon: '📄' },
                                { text: 'Profile Updated', time: '5 hours ago', icon: '👤' },
                                { text: 'New Director Added', time: '1 day ago', icon: '👥' },
                            ].map((act, i) => (
                                <div key={i} className="relative pl-10">
                                    <div className="absolute left-0 top-0 h-8 w-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xs shadow-sm z-10">
                                        {act.icon}
                                    </div>
                                    <div className="text-sm font-bold text-slate-700">{act.text}</div>
                                    <div className="text-xs text-slate-400 font-medium">{act.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
