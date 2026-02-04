
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Play,
  Calendar as CalendarIcon,
  Clock,
  Bookmark,
  Filter,
  X,
  CheckCircle2,
  Volume2,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Pause,
  Plus,
  CheckCircle,
  Info,
  CalendarDays,
  User,
  ArrowLeft,
  ArrowRight,
  FileText,
  Share2,
  UserPlus,
  Zap,
  LayoutDashboard,
  LayoutGrid
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const SEMINAR_DATA = [
  {
    id: 's1',
    title: 'Mastering Pitch Decks for Series A Funding',
    author: 'Elena Vance',
    category: 'POLICY UPDATES',
    time: '14:00 - 15:30',
    img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
    date: '2024-09-24',
    month: 'SEP',
    day: '24',
    description: 'Learn how to craft a compelling narrative that resonates with high-tier venture capitalists and institutional investors. This session covers the psychology of the investor meeting and the technical requirements of a Series A data room.'
  },
  {
    id: 's2',
    title: 'AI Ethics in Research & Development',
    author: 'Marcus Thorne',
    category: 'TECHNICAL WORKSHOPS',
    time: '09:00 - 10:30',
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop',
    date: '2024-09-27',
    month: 'SEP',
    day: '27',
    description: 'Navigating the legal and moral complexities of integrating generative AI into proprietary R&D workflows safely. Marcus Thorne breaks down the current EU AI Act implications and best practices for technical transparency.'
  },
  {
    id: 's3',
    title: 'Annual Intellectual Property Law Summit',
    author: 'Dr. June Li',
    category: 'BUSINESS SEMINARS',
    time: '11:00 - 17:00',
    img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
    date: '2024-10-02',
    month: 'OCT',
    day: '02',
    description: 'A comprehensive review of international IP law changes affecting global tech startups and manufacturing in 2024. Dr. June Li discusses cross-border filing strategies and the rising importance of patent pools in emerging tech.'
  }
];

const CURATED_EXPERTS = [
  {
    id: 'e1',
    name: 'Sarah Williams',
    role: 'STRATEGY DIRECTOR',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop',
    active: false
  },
  {
    id: 'e2',
    name: 'James Miller',
    role: 'FINTECH CTO',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop',
    active: true
  }
];

const CompactDatePicker = ({ onSelect, onClose }) => {
  const [viewDate, setViewDate] = useState(new Date(2024, 8, 1)); // Sept 2024
  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const days = useMemo(() => {
    const arr = [];
    const totalDays = daysInMonth(viewDate);
    const offset = firstDayOfMonth(viewDate);
    for (let i = 0; i < offset; i++) arr.push(null);
    for (let i = 1; i <= totalDays; i++) arr.push(i);
    return arr;
  }, [viewDate]);

  return (
    <div className="w-64 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-200 z-[500]">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
          {viewDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
        </h4>
        <div className="flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><ChevronLeft size={14} /></button>
          <button onClick={(e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><ChevronRight size={14} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <span key={d} className="text-[9px] font-bold text-slate-400">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div key={i} className="aspect-square flex items-center justify-center">
            {day && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
                  onClose();
                }}
                className={`w-full h-full text-[11px] font-bold rounded-xl transition-all ${day === 24 && viewDate.getMonth() === 8 ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:text-indigo-600'}`}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Seminars = () => {
  const [activeTab, setActiveTab] = useState('all content');
  const [viewMode, setViewMode] = useState('grid');
  const [savedSeminars, setSavedSeminars] = useState(new Set());
  const [followedExperts, setFollowedExperts] = useState(new Set(['James Miller']));
  const [showToast, setShowToast] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 8, 1));
  const [selectedEventId, setSelectedEventId] = useState(SEMINAR_DATA[0].id);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const activeEvent = useMemo(() =>
    SEMINAR_DATA.find(s => s.id === selectedEventId) || SEMINAR_DATA[0],
    [selectedEventId]
  );

  const handleEventClick = (ev) => {
    setSelectedEventId(ev.id);
    setVideoProgress(0);
    setIsVideoPlaying(true);
    setShowDetailsPanel(false);
    triggerToast(`Joining: ${ev.title}`);
    setVideoModalOpen(true);
  };

  const handleDownloadHandout = () => {
    const event = activeEvent;
    if (!event) return;
    triggerToast(`Generating Validated PDF Handout...`);

    try {
      const doc = new jsPDF();
      doc.setFillColor(15, 23, 42); doc.rect(0, 0, 210, 50, 'F');
      doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.setFont('helvetica', 'bold');
      doc.text('SESSION TECHNICAL HANDOUT', 15, 25);
      doc.setFontSize(10); doc.text(`NEXUS AUTHORIZED PORTAL | ID: ${event.id}`, 15, 38);

      doc.setTextColor(15, 23, 42); doc.setFontSize(14); doc.text('I. SESSION OVERVIEW', 15, 65);
      doc.setFontSize(10); doc.setFont('helvetica', 'normal');
      doc.text(`Title: ${event.title}`, 15, 75);
      doc.text(`Keynote Speaker: ${event.author}`, 15, 82);
      doc.text(`Date: ${event.date}`, 15, 89);
      doc.text(`Scheduled: ${event.time}`, 15, 96);

      doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text('II. CORE CURRICULUM', 15, 115);
      doc.setFontSize(10); doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(event.description, 180);
      doc.text(lines, 15, 125);

      doc.save(`${event.title.replace(/\s+/g, '_')}_Technical_Handout.pdf`);
      triggerToast("PDF Handout ready for offline review.");
    } catch (e) { triggerToast("Export failed."); }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/#/seminars?id=${selectedEventId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      triggerToast("Session link copied to clipboard!");
    } catch (err) {
      triggerToast("Failed to copy link.");
    }
  };

  const toggleSave = (id) => {
    const newSaved = new Set(savedSeminars);
    if (newSaved.has(id)) {
      newSaved.delete(id);
      triggerToast("Removed from bookmarks");
    } else {
      newSaved.add(id);
      triggerToast("Saved to your bookmarks");
    }
    setSavedSeminars(newSaved);
  };

  const toggleFollow = (name) => {
    const newFollowed = new Set(followedExperts);
    if (newFollowed.has(name)) {
      newFollowed.delete(name);
      triggerToast(`Unfollowed ${name}`);
    } else {
      newFollowed.add(name);
      triggerToast(`Now following ${name}`);
    }
    setFollowedExperts(newFollowed);
  };

  useEffect(() => {
    let interval;
    if (isVideoPlaying && videoProgress < 100) {
      interval = setInterval(() => {
        setVideoProgress(prev => Math.min(prev + 0.2, 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying, videoProgress]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const offset = firstDayOfMonth(currentMonth);
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const events = SEMINAR_DATA.filter(s => s.date === dateStr);
      days.push({ day: i, events, dateStr });
    }
    return days;
  }, [currentMonth]);

  const handleProgressBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedProgress = (x / rect.width) * 100;
    setVideoProgress(clickedProgress);
  };

  return (
    <div className="space-y-6 animate-slide-up pb-10">
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[8000] bg-slate-900 dark:bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
          <CheckCircle2 size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">{showToast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 relative gap-4">
            <div className="flex items-center gap-6 pb-0.5 scrollbar-hide overflow-x-auto">
              {['All Content', 'Policy Updates', 'Business Seminars', 'Technical Workshops'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`pb-3 text-[10px] font-black relative transition-all uppercase tracking-widest whitespace-nowrap ${activeTab === tab.toLowerCase() ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  {tab}
                  {activeTab === tab.toLowerCase() && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mb-2 items-center">
              {/* VIEW TOGGLE */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid size={14} /> Grid
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <CalendarIcon size={14} /> Calendar
                </button>
              </div>

              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showDatePicker ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-indigo-200'}`}
                >
                  <CalendarDays size={16} />
                  <span className="hidden sm:inline">Event Date</span>
                </button>
                {showDatePicker && (
                  <div className="absolute right-0 top-full mt-2 z-[600]">
                    <CompactDatePicker onSelect={(d) => triggerToast(`Filtered events for: ${d.toDateString()}`)} onClose={() => setShowDatePicker(false)} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div
                onClick={() => handleEventClick(activeEvent)}
                className="relative group rounded-[32px] overflow-hidden shadow-lg border-[6px] border-white dark:border-slate-800 aspect-[21/9] cursor-pointer bg-slate-900 transition-all duration-500"
              >
                <img src={activeEvent.img} className="w-full h-full object-cover brightness-[0.5] group-hover:scale-105 transition-transform duration-[2000ms]" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center ring-2 ring-white/10 group-hover:scale-110 transition-all duration-500">
                    <Play size={22} fill="white" className="text-white translate-x-0.5" />
                  </div>
                </div>
                <div className="absolute inset-0 flex flex-col items-start justify-end p-8 text-left">
                  <div className="space-y-3 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-indigo-600 text-white text-[7px] font-black rounded uppercase tracking-widest shadow-lg">FEATURED SESSION</span>
                      <span className="px-2 py-1 bg-white/10 backdrop-blur-xl text-white text-[7px] font-black rounded uppercase tracking-widest border border-white/20">{activeEvent.category}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-xl uppercase italic">{activeEvent.title}</h3>
                    <p className="text-slate-300 text-[11px] font-medium opacity-90 line-clamp-2 leading-relaxed">{activeEvent.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {SEMINAR_DATA
                  .filter(card => activeTab === 'all content' || card.category.toLowerCase() === activeTab)
                  .map((card) => (
                    <div key={card.id} onClick={() => handleEventClick(card)} className={`group bg-white dark:bg-slate-900 rounded-[28px] p-4 border transition-all cursor-pointer ${selectedEventId === card.id ? 'border-indigo-400 ring-4 ring-indigo-50 dark:ring-indigo-900/10 shadow-lg' : 'border-white dark:border-slate-800 shadow-sm hover:shadow-lg'}`}>
                      <div className="relative aspect-video rounded-[20px] overflow-hidden mb-4">
                        <img src={card.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        <div className={`absolute inset-0 transition-colors ${selectedEventId === card.id ? 'bg-indigo-600/10' : 'bg-black/20 group-hover:bg-black/0'}`}></div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[7px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em]">{card.category}</span>
                        <h4 className={`text-sm font-black leading-tight transition-colors tracking-tight line-clamp-2 uppercase italic ${selectedEventId === card.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white group-hover:text-indigo-600'}`}>{card.title}</h4>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{card.time}</span>
                          <button onClick={(e) => { e.stopPropagation(); toggleSave(card.id); }} className={`transition-all p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${savedSeminars.has(card.id) ? 'text-indigo-600' : 'text-slate-300 dark:text-slate-600 hover:text-indigo-600'}`}>
                            <Bookmark size={18} fill={savedSeminars.has(card.id) ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-white dark:border-slate-800 shadow-xl p-8 md:p-12 animate-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                  <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-[0.4em]">Strategic Roadmap</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm active:scale-90"><ChevronLeft size={24} /></button>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm active:scale-90"><ChevronRight size={24} /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-4">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div key={day} className="text-center text-[10px] font-black text-slate-400/60 tracking-widest pb-6 uppercase">{day}</div>
                ))}
                {calendarDays.map((date, i) => {
                  const hasEvents = date && date.events.length > 0;
                  return (
                    <div
                      key={i}
                      onClick={() => date && date.events.length > 0 && handleEventClick(date.events[0])}
                      className={`relative aspect-square rounded-[24px] p-2 border transition-all duration-300 ${!date ? 'bg-transparent border-transparent pointer-events-none' : 'bg-slate-50/20 dark:bg-slate-800/10 border-slate-50 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl cursor-pointer group'} ${hasEvents ? 'ring-2 ring-indigo-100 dark:ring-indigo-900 border-indigo-200 bg-white dark:bg-slate-800 shadow-md' : ''}`}
                    >
                      {date && (
                        <div className="flex flex-col items-center justify-center h-full relative">
                          <span className={`text-base font-black tracking-tight ${hasEvents ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-300'}`}>{date.day}</span>
                          {hasEvents && (
                            <div className="absolute bottom-2 flex flex-col items-center">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(79,70,229,1)] animate-pulse"></div>
                              <div className="hidden group-hover:block absolute top-full mt-2 w-32 bg-slate-900 text-white text-[8px] font-black p-2 rounded-lg z-50 text-center uppercase tracking-widest shadow-2xl">
                                {date.events[0].title}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-[32px] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {SEMINAR_DATA.map((s, idx) => (
                      <img key={idx} src={s.img} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover" alt="" />
                    ))}
                  </div>
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="text-slate-900 dark:text-white">{SEMINAR_DATA.length} Sessions</span> scheduled for this month
                  </p>
                </div>
                <button className="px-6 py-3 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-black text-[10px] rounded-xl uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95">Sync to Device</button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[48px] border border-white dark:border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Portal <br /> Schedule</h3>
              <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-[18px] text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800 flex flex-col items-center shadow-sm">
                <span>3</span> <span className="text-[8px] opacity-70">LIVE</span>
              </div>
            </div>
            <div className="space-y-10 relative">
              <div className="absolute left-[31px] top-10 bottom-10 w-[1.5px] bg-slate-50 dark:bg-slate-800/50"></div>
              {SEMINAR_DATA.map((ev) => (
                <div
                  key={ev.id}
                  role="button"
                  tabIndex={0}
                  className={`flex items-center gap-6 group cursor-pointer relative z-10 transition-all active:scale-[0.98] outline-none rounded-full pr-4 hover:bg-slate-50 dark:hover:bg-slate-800/40`}
                  onClick={() => handleEventClick(ev)}
                >
                  <div className={`flex flex-col items-center justify-center min-w-[64px] h-[64px] bg-white dark:bg-slate-900 rounded-full border transition-all shadow-lg shadow-slate-200/5 group-hover:scale-110 ${selectedEventId === ev.id ? 'border-indigo-500 ring-2 ring-indigo-50 dark:ring-indigo-900/30 shadow-indigo-100' : 'border-slate-50 dark:border-slate-800'}`}>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{ev.month}</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{ev.day}</span>
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <h4 className={`text-[13px] font-black leading-tight transition-colors tracking-tight mb-1.5 uppercase italic line-clamp-2 ${selectedEventId === ev.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white group-hover:text-indigo-600'}`}>{ev.title}</h4>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                      <Clock size={12} className="text-indigo-400/60" /> {ev.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setViewMode('calendar')} className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 active:scale-95 transition-all">
              FULL CALENDAR VIEW
            </button>
          </section>

          <section className="space-y-4 px-2">
            <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Keynote Network</h3>
            <div className="space-y-4">
              {CURATED_EXPERTS.map((expert) => (
                <div
                  key={expert.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-white dark:border-slate-800 rounded-[32px] hover:shadow-lg transition-all group shadow-sm active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <img src={expert.img} className="w-12 h-12 rounded-[18px] border-2 border-slate-50 dark:border-slate-800 object-cover" alt="" />
                    <div className="min-w-0">
                      <h4 className="text-[14px] font-black text-slate-900 dark:text-white leading-none truncate">{expert.name}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1.5 tracking-widest">{expert.role}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleFollow(expert.name)} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${followedExperts.has(expert.name) ? 'bg-emerald-500 text-white' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                    {followedExperts.has(expert.name) ? <CheckCircle size={18} /> : <Plus size={18} />}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {videoModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-4 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" onClick={() => { setVideoModalOpen(false); setIsVideoPlaying(false); }}></div>
          <div className="bg-[#0A0D12] w-full h-full md:rounded-[48px] overflow-hidden relative z-[1010] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5 flex flex-col animate-in zoom-in-95 duration-700">

            {showDetailsPanel ? (
              <div className="flex-1 overflow-y-auto p-10 md:p-20 space-y-16 animate-in slide-in-from-right duration-500 scrollbar-hide">
                <div className="max-w-7xl mx-auto space-y-12">
                  <button
                    onClick={() => setShowDetailsPanel(false)}
                    className="flex items-center gap-3 text-white/50 hover:text-white font-black text-[11px] uppercase tracking-[0.3em] transition-all group"
                  >
                    <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> BACK TO VIDEO
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8 space-y-12">
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-2xl">
                          SESSION OVERVIEW
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter uppercase italic drop-shadow-lg">
                          {activeEvent.title}
                        </h2>
                      </div>

                      <div className="bg-[#151921] border border-white/5 rounded-[44px] p-10 md:p-12 space-y-10 shadow-2xl">
                        <p className="text-slate-300 text-lg md:text-2xl leading-relaxed font-medium tracking-tight">
                          {activeEvent.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6">
                          <button
                            onClick={handleDownloadHandout}
                            className="px-10 py-5 bg-white text-slate-900 font-black text-[13px] rounded-[24px] flex items-center gap-4 hover:bg-slate-100 transition-all uppercase tracking-widest active:scale-95 shadow-xl shadow-white/5"
                          >
                            <FileText size={22} className="stroke-[2.5px]" /> DOWNLOAD HANDOUT
                          </button>
                          <button
                            onClick={handleShare}
                            className="px-10 py-5 bg-transparent border-2 border-white/10 text-white font-black text-[13px] rounded-[24px] flex items-center gap-4 hover:bg-white/5 transition-all uppercase tracking-widest active:scale-95"
                          >
                            <Share2 size={22} className="stroke-[2.5px]" /> SHARE SESSION
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-10">
                      {/* Keynote Speaker Card */}
                      <div className="bg-[#4F46E5] rounded-[44px] p-10 flex flex-col gap-10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform"></div>
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-white/10 backdrop-blur-3xl rounded-[28px] flex items-center justify-center text-white border border-white/20">
                            <User size={36} className="stroke-[2.5px]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.4em] leading-none mb-2">KEYNOTE SPEAKER</p>
                            <h4 className="text-white font-black text-2xl uppercase italic tracking-tighter leading-none">{activeEvent.author}</h4>
                          </div>
                        </div>

                        <div className="space-y-6 pt-10 border-t border-white/10">
                          <div className="flex items-center justify-between text-indigo-50 font-black uppercase text-[12px] tracking-widest">
                            <span className="opacity-60 text-[10px]">SCHEDULED</span>
                            <span>{activeEvent.time}</span>
                          </div>
                          <div className="flex items-center justify-between text-indigo-50 font-black uppercase text-[12px] tracking-widest">
                            <span className="opacity-60 text-[10px]">CATEGORY</span>
                            <span className="truncate ml-4">{activeEvent.category}</span>
                          </div>
                          <div className="flex items-center justify-between text-indigo-50 font-black uppercase text-[12px] tracking-widest">
                            <span className="opacity-60 text-[10px]">ROOM</span>
                            <span>DIGITAL HUB A</span>
                          </div>
                        </div>
                      </div>

                      {/* Related Content List */}
                      <div className="space-y-6">
                        <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">UPCOMING RELATED</h5>
                        <div className="space-y-4">
                          {SEMINAR_DATA.filter(s => s.id !== activeEvent.id).map(s => (
                            <div
                              key={s.id}
                              onClick={() => setSelectedEventId(s.id)}
                              className="p-6 bg-[#151921] border border-white/5 rounded-[32px] flex items-center gap-6 hover:bg-[#1E252D] hover:border-indigo-500/30 transition-all cursor-pointer group/item shadow-sm"
                            >
                              <img src={s.img} className="w-16 h-16 rounded-2xl object-cover opacity-60 group-hover/item:opacity-100 transition-opacity" alt="" />
                              <div className="min-w-0">
                                <h6 className="text-white font-black text-[13px] uppercase italic tracking-tight line-clamp-1 leading-none mb-2">{s.title}</h6>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">{s.author}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between p-10 md:p-14 relative overflow-hidden group/player">
                {/* Video Stream Simulation */}
                <div className="absolute inset-0 z-0">
                  <img src={activeEvent.img} className={`w-full h-full object-cover transition-all duration-[2000ms] ${isVideoPlaying ? 'scale-105 brightness-[0.4]' : 'brightness-[0.15] grayscale-[0.5]'}`} alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
                </div>

                {/* Top Controls Overlay */}
                <div className="relative z-10 flex items-start justify-between opacity-0 group-hover/player:opacity-100 transition-opacity duration-500">
                  <div className="flex items-center gap-6">
                    <div className="bg-rose-600 px-4 py-2 rounded-xl text-white font-black text-[10px] tracking-[0.3em] flex items-center gap-2 border border-white/20 shadow-2xl">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div> LIVE
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-white font-black text-3xl md:text-4xl tracking-tighter uppercase italic drop-shadow-2xl">{activeEvent.title}</h2>
                      <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">{activeEvent.author} • {activeEvent.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => toggleSave(activeEvent.id)} className={`p-4 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl transition-all active:scale-90 ${savedSeminars.has(activeEvent.id) ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white'}`}>
                      <Bookmark size={28} fill={savedSeminars.has(activeEvent.id) ? 'currentColor' : 'none'} className="stroke-[2px]" />
                    </button>
                    <button onClick={() => setVideoModalOpen(false)} className="p-4 bg-white/5 hover:bg-rose-600 backdrop-blur-3xl rounded-2xl text-white transition-all border border-white/10 shadow-2xl active:scale-90 group">
                      <X size={28} className="group-hover:rotate-90 transition-transform stroke-[3px]" />
                    </button>
                  </div>
                </div>

                {/* Center Play Icon */}
                <div className="relative z-10 flex-1 flex items-center justify-center">
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className={`w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-full flex items-center justify-center ring-4 ring-white/10 hover:scale-110 active:scale-90 transition-all duration-700 shadow-2xl ${isVideoPlaying ? 'opacity-0 pointer-events-none scale-150' : 'opacity-100 scale-100'}`}
                  >
                    <Play size={48} fill="white" className="text-white translate-x-1" />
                  </button>
                </div>

                {/* Bottom Player Controls */}
                <div className="relative z-10 space-y-8 bg-black/40 backdrop-blur-2xl p-10 rounded-[44px] border border-white/5 opacity-0 group-hover/player:opacity-100 transition-all duration-500 translate-y-4 group-hover/player:translate-y-0 shadow-2xl">
                  <div className="flex items-center gap-10">
                    <button onClick={() => setIsVideoPlaying(!isVideoPlaying)} className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-950 hover:scale-110 active:scale-95 transition-all shadow-xl">
                      {isVideoPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="translate-x-1" />}
                    </button>
                    <div className="flex-1 space-y-4">
                      <div onClick={handleProgressBarClick} className="h-2.5 bg-white/10 rounded-full cursor-pointer relative overflow-hidden group/bar">
                        <div className="absolute inset-y-0 left-0 bg-[#4F46E5] rounded-full shadow-[0_0_20px_rgba(79,70,229,1)] transition-all" style={{ width: `${videoProgress}%` }}></div>
                        <div className="absolute h-full w-1.5 bg-white opacity-0 group-hover/bar:opacity-100 transition-opacity" style={{ left: `${videoProgress}%` }}></div>
                      </div>
                      <div className="flex justify-between text-white/40 text-[11px] font-black uppercase tracking-[0.3em] tabular-nums">
                        <span>{Math.floor((videoProgress / 100) * 45)}:00</span>
                        <span>45:00</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-8">
                    <div className="flex gap-12">
                      <button onClick={() => triggerToast("Lossless Audio System Connected")} className="flex items-center gap-3 text-white/40 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.3em] group">
                        <Volume2 size={22} className="group-hover:scale-110 transition-transform" /> LOSSLESS AUDIO
                      </button>
                      <button onClick={() => setShowDetailsPanel(true)} className="flex items-center gap-3 text-white/40 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.3em] group">
                        <Info size={22} className="group-hover:scale-110 transition-transform" /> DETAILS & DOCS
                      </button>
                    </div>
                    <button onClick={() => triggerToast("Theater Mode Initiated")} className="p-2 text-white/40 hover:text-white transition-all hover:scale-125">
                      <Maximize size={26} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Seminars;
