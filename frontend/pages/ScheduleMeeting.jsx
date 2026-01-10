import * as React from 'react';
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    Clock,
    X,
    Mail,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    CheckCircle2
} from 'lucide-react';

const ScheduleMeeting = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(18);
    const [selectedTime, setSelectedTime] = useState('10:00 AM');

    const startup = {
        name: 'EcoCharge',
        location: 'San Francisco, CA',
        matchScore: '95%',
        description: 'Revolutionary solid-state battery technology increasing EV range by 40% with sustainable materials. Currently raising Series A to scale...',
        tags: ['CleanTech', 'Seed Stage']
    };

    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM',
        '11:00 AM', '01:30 PM', '02:00 PM',
        '03:30 PM', '04:00 PM'
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 transition-all">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Schedule Meeting</h1>
                        <p className="text-slate-500 font-medium">with <span className="text-slate-900 font-bold">{startup.name} team</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Form Details */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Meeting Details Card */}
                        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10 space-y-8">
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-900">Meeting Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-900 ml-1">Topic</label>
                                    <input
                                        type="text"
                                        defaultValue="Follow-up on Pitch Deck Review"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-900 ml-1">Duration</label>
                                    <div className="relative">
                                        <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium appearance-none">
                                            <option>30 min</option>
                                            <option>45 min</option>
                                            <option>60 min</option>
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-900 ml-1">Agenda</label>
                                <textarea
                                    placeholder="Outline the main points you want to discuss..."
                                    rows={4}
                                    className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[24px] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium resize-none leading-relaxed"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-900 ml-1">Participants</label>
                                <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-6 space-y-4">
                                    <div className="flex flex-wrap gap-3">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                                            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold">JD</div>
                                            <span className="text-sm font-bold text-slate-700">John Doe (You)</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">EC</div>
                                            <span className="text-sm font-bold text-slate-700">EcoCharge Founders</span>
                                            <button className="ml-1 text-slate-300 hover:text-slate-500 transition-colors"><X size={14} /></button>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Add email addresses..."
                                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Availability Card */}
                        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <CalendarIcon className="text-blue-600" size={24} />
                                    <h2 className="text-xl font-bold text-slate-900">Select Availability</h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><ChevronLeft size={20} className="text-slate-400" /></button>
                                    <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">October 2023</span>
                                    <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><ChevronRight size={20} className="text-slate-400" /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Calendar Grid */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-7 gap-1">
                                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                            <div key={day} className="text-center py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                                        ))}
                                        {[...Array(24)].map((_, i) => (
                                            <div key={i} className="text-center py-3 text-sm font-bold text-slate-300">{i + 1}</div>
                                        ))}
                                        {[...Array(7)].map((_, i) => {
                                            const day = 25 + i;
                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => setSelectedDate(day)}
                                                    className={`w-10 h-10 mx-auto flex items-center justify-center rounded-xl text-sm font-bold transition-all
                                                        ${selectedDate === day
                                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 rotate-12 scale-110'
                                                            : 'text-slate-700 hover:bg-slate-50'
                                                        }
                                                        ${day === 18 ? 'relative after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-blue-600 after:rounded-full' : ''}
                                                    `}
                                                >
                                                    {day}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Time Slots */}
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Available times for Oct {selectedDate}</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {timeSlots.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`py-4 rounded-2xl text-xs font-bold transition-all border
                                                    ${selectedTime === time
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100 scale-[1.02]'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50/50'
                                                    }
                                                `}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary & Availability Info */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Startup Summary Card */}
                        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 to-slate-800 relative flex items-center justify-center p-8">
                                <div className="text-center space-y-3">
                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-white border border-white/20 mx-auto">EC</div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">{startup.name}</h3>
                                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Pitch Deck v2.4</p>
                                </div>
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_35%,rgba(59,130,246,0.5)_0%,transparent_50%)]"></div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">Startup Summary</h4>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                                        <CheckCircle2 size={12} className="fill-emerald-600 text-white" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{startup.matchScore} Match</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-400">{startup.location}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium mt-3">
                                        {startup.description}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {startup.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-lg uppercase border border-slate-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <Link to={`/pitch/${id}`} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors pt-4 border-t border-slate-50">
                                    View Pitch Deck again <ExternalLink size={16} />
                                </Link>
                            </div>
                        </div>

                        {/* Founder Availability Card */}
                        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Founder Availability</h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                                    <p className="text-sm font-bold text-slate-700">Usually replies within 2 hours</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                    <p className="text-sm font-bold text-slate-700">Preferred times: 9am - 12pm PST</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button className="w-full py-5 bg-blue-600 text-white font-black rounded-[24px] hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all active:scale-95 text-lg tracking-tight">
                            Confirm Meeting
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChevronDown = ({ size, className }) => (
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
        <path d="m6 9 6 6 6-6" />
    </svg>
);

export default ScheduleMeeting;
