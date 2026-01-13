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
    CheckCircle2,
    ChevronDown
} from 'lucide-react';
import { api } from '../services/api';

const ScheduleMeeting = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(18);
    const [selectedTime, setSelectedTime] = useState('10:00 AM');

    // In a real app, fetch startup details by ID
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
        <div className="min-h-screen bg-slate-50 p-8 font-['Plus Jakarta Sans']">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Schedule Meeting</h1>
                        <p className="text-slate-500 text-sm">with <span className="font-semibold text-slate-900">{startup.name} Team</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Form Details */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Meeting Details Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                <CalendarIcon className="text-blue-600" size={20} />
                                <h2 className="text-lg font-bold text-slate-900">Meeting Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Topic</label>
                                    <input
                                        type="text"
                                        defaultValue="Follow-up on Pitch Deck Review"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Duration</label>
                                    <div className="relative">
                                        <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none">
                                            <option>30 min</option>
                                            <option>45 min</option>
                                            <option>60 min</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Agenda</label>
                                <textarea
                                    placeholder="Outline the main points you want to discuss..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Participants</label>
                                <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
                                    <div className="flex flex-wrap gap-2">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                                            <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold">JD</div>
                                            <span className="text-xs font-semibold text-slate-700">John Doe (You)</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                                            <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">EC</div>
                                            <span className="text-xs font-semibold text-slate-700">EcoCharge Founders</span>
                                            <button className="ml-1 text-slate-300 hover:text-slate-500 transition-colors"><X size={12} /></button>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Add email addresses..."
                                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Availability Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-blue-600" size={20} />
                                    <h2 className="text-lg font-bold text-slate-900">Select Availability</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"><ChevronLeft size={16} className="text-slate-500" /></button>
                                    <span className="text-sm font-semibold text-slate-700">October 2023</span>
                                    <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"><ChevronRight size={16} className="text-slate-500" /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Calendar Grid */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-7 gap-1">
                                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                            <div key={day} className="text-center py-1 text-xs font-semibold text-slate-400 uppercase">{day}</div>
                                        ))}
                                        {[...Array(24)].map((_, i) => (
                                            <div key={i} className="text-center py-2 text-sm text-slate-300 pointer-events-none">{i + 1}</div>
                                        ))}
                                        {[...Array(7)].map((_, i) => {
                                            const day = 25 + i;
                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => setSelectedDate(day)}
                                                    className={`w-8 h-8 mx-auto flex items-center justify-center rounded-lg text-sm font-medium transition-all
                                                        ${selectedDate === day
                                                            ? 'bg-blue-600 text-white shadow-sm'
                                                            : 'text-slate-700 hover:bg-slate-100'
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
                                <div className="space-y-4">
                                    <p className="text-xs font-semibold text-slate-500">Available times for Oct {selectedDate}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {timeSlots.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all border
                                                    ${selectedTime === time
                                                        ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
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
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="aspect-[3/2] bg-slate-900 relative flex items-center justify-center p-6">
                                <div className="text-center space-y-2">
                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-white border border-white/20 mx-auto">EC</div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">{startup.name}</h3>
                                    <p className="text-xs text-slate-300 font-medium">Pitch Deck v2.4</p>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-slate-900">Startup Summary</h4>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                                        <CheckCircle2 size={12} className="text-emerald-600" />
                                        <span className="text-xs font-semibold">{startup.matchScore} Match</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500">{startup.location}</p>
                                    <p className="text-sm text-slate-600 leading-relaxed mt-2">
                                        {startup.description}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {startup.tags.map(tag => (
                                        <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg border border-slate-200">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <Link to={`/pitch/${id}`} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors pt-4 border-t border-slate-50">
                                    View Pitch Deck again <ExternalLink size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Founder Availability Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Founder Availability</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                                    <p className="text-sm text-slate-600">Usually replies within 2 hours</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                    <p className="text-sm text-slate-600">Preferred times: 9am - 12pm PST</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all active:scale-95 text-sm">
                            Confirm Meeting
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleMeeting;
