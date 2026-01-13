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

    // State
    const [pitch, setPitch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form State
    const [topic, setTopic] = useState("Follow-up on Pitch Deck Review");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState(30);

    // Calendar State (Dynamic)
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [selectedDay, setSelectedDay] = useState(today.getDate());
    const [selectedTime, setSelectedTime] = useState('10:00 AM');

    // Fetch Startup Data
    React.useEffect(() => {
        const fetchPitch = async () => {
            try {
                const data = await api.getPitch(id);
                setPitch(data);
                setTopic(`Follow-up with ${data.company_name}`);
            } catch (e) {
                console.error("Failed to load pitch", e);
                // navigate('/browse'); // Optional: redirect on error
            } finally {
                setLoading(false);
            }
        };
        fetchPitch();
    }, [id]);

    // Calendar Helpers
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const handlePrevMonth = () => {
        const newDate = new Date(currentYear, currentMonth - 1, 1);
        if (newDate >= new Date(today.getFullYear(), today.getMonth(), 1)) {
            setCurrentDate(newDate);
            setSelectedDay(1);
        }
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
        setSelectedDay(1);
    };

    const handleConfirm = async () => {
        if (!pitch) return;
        setSubmitting(true);

        try {
            // Parse Time
            const [timeStr, modifier] = selectedTime.split(' ');
            let [hours, minutes] = timeStr.split(':');
            hours = parseInt(hours);
            if (hours === 12 && modifier === 'AM') hours = 0;
            if (modifier === 'PM' && hours < 12) hours += 12;

            const meetingDate = new Date(currentYear, currentMonth, selectedDay, hours, parseInt(minutes));

            await api.scheduleMeeting({
                startup_id: pitch.startup_id,
                pitch_id: parseInt(id),
                title: topic,
                description: description || "Discuss investment opportunity",
                meeting_time: meetingDate.toISOString(),
                duration_minutes: duration
            });

            setSuccess(true);
        } catch (e) {
            console.error("Scheduling failed", e);
            alert("Failed to schedule meeting: " + e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const getGoogleCalendarLink = () => {
        // Construct Start/End Dates for Link
        const [timeStr, modifier] = selectedTime.split(' ');
        let [hours, minutes] = timeStr.split(':');
        hours = parseInt(hours);
        if (hours === 12 && modifier === 'AM') hours = 0;
        if (modifier === 'PM' && hours < 12) hours += 12;

        const start = new Date(currentYear, currentMonth, selectedDay, hours, parseInt(minutes));
        const end = new Date(start.getTime() + duration * 60000);

        const formatForLink = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(topic)}&details=${encodeURIComponent(description || "")}&dates=${formatForLink(start)}/${formatForLink(end)}`;
    };

    if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Plus Jakarta Sans']"><div className="animate-spin w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>;

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Plus Jakarta Sans'] p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={32} className="text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Meeting Confirmed!</h2>
                        <p className="text-slate-500 mt-2">
                            Invitation sent to {pitch?.company_name}. A calendar invite has been sent to your email.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <a
                            href={getGoogleCalendarLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
                        >
                            <CalendarIcon size={18} />
                            Add to Google Calendar
                        </a>
                        <button
                            onClick={() => navigate('/browse')}
                            className="mt-3 text-sm font-medium text-slate-500 hover:text-slate-900"
                        >
                            Back to Browse
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                        <p className="text-slate-500 text-sm">with <span className="font-semibold text-slate-900">{pitch?.company_name} Team</span></p>
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
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Duration</label>
                                    <div className="relative">
                                        <select
                                            value={duration}
                                            onChange={(e) => setDuration(Number(e.target.value))}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none"
                                        >
                                            <option value={15}>15 min</option>
                                            <option value={30}>30 min</option>
                                            <option value={45}>45 min</option>
                                            <option value={60}>60 min</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Agenda</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
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
                                            <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold">ME</div>
                                            <span className="text-xs font-semibold text-slate-700">You</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                                            <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                                                {(pitch?.company_name || 'S').charAt(0)}
                                            </div>
                                            <span className="text-xs font-semibold text-slate-700">{pitch?.company_name} Founders</span>
                                        </div>
                                    </div>
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
                                    <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"><ChevronLeft size={16} className="text-slate-500" /></button>
                                    <span className="text-sm font-semibold text-slate-700">{monthNames[currentMonth]} {currentYear}</span>
                                    <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"><ChevronRight size={16} className="text-slate-500" /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Calendar Grid */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-7 gap-1">
                                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                            <div key={day} className="text-center py-1 text-xs font-semibold text-slate-400 uppercase">{day}</div>
                                        ))}
                                        {/* Empty slots for start of month */}
                                        {[...Array(firstDay)].map((_, i) => (
                                            <div key={`empty-${i}`} className="text-center py-2"></div>
                                        ))}
                                        {/* Days */}
                                        {[...Array(daysInMonth)].map((_, i) => {
                                            const day = i + 1;
                                            const isSelected = selectedDay === day;
                                            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                                            const isPast = (currentYear < today.getFullYear()) || (currentYear === today.getFullYear() && currentMonth < today.getMonth()) || (currentYear === today.getFullYear() && currentMonth === today.getMonth() && day < today.getDate());

                                            return (
                                                <button
                                                    key={day}
                                                    disabled={isPast}
                                                    onClick={() => !isPast && setSelectedDay(day)}
                                                    className={`w-8 h-8 mx-auto flex items-center justify-center rounded-lg text-sm font-medium transition-all
                                                        ${isSelected
                                                            ? 'bg-blue-600 text-white shadow-sm'
                                                            : isPast ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'
                                                        }
                                                        ${isToday && !isSelected ? 'relative after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-blue-600 after:rounded-full' : ''}
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
                                    <p className="text-xs font-semibold text-slate-500">Available times for {monthNames[currentMonth].substring(0, 3)} {selectedDay}</p>
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
                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-white border border-white/20 mx-auto">
                                        {(pitch?.company_name || 'S').charAt(0)}
                                    </div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">{pitch?.company_name}</h3>
                                    <p className="text-xs text-slate-300 font-medium">{pitch?.stage || 'Series A'}</p>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-slate-900">Startup Summary</h4>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                                        <CheckCircle2 size={12} className="text-emerald-600" />
                                        <span className="text-xs font-semibold">{pitch?.match_score || 95}% Match</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500">{pitch?.location || 'Remote'}</p>
                                    <p className="text-sm text-slate-600 leading-relaxed mt-2 line-clamp-3">
                                        {pitch?.description || 'No description available.'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(pitch?.tags ? pitch.tags.split(',') : ['Technology']).map(tag => (
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
                        <button
                            onClick={handleConfirm}
                            disabled={submitting}
                            className={`w-full py-4 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 text-sm ${submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {submitting ? 'Scheduling...' : 'Confirm Meeting'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleMeeting;
