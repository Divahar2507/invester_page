
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Play,
  Calendar as CalendarIcon,
  Clock,
  Bookmark,
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
  LayoutGrid
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { fetchSeminars } from '../src/services/api';

const Seminars = () => {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSeminars();
        const mappedData = data.map(s => ({
          ...s,
          date: s.date_str,
          img: s.img || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200'
        }));
        setSeminars(mappedData);
        if (mappedData.length > 0) setSelectedEventId(mappedData[0].id);
      } catch (error) {
        console.error("Failed to fetch seminars:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const CURATED_EXPERTS = [
    { id: 'e1', name: 'Sarah Williams', role: 'STRATEGY DIRECTOR', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200', active: false },
    { id: 'e2', name: 'James Miller', role: 'FINTECH CTO', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200', active: true }
  ];

  const CompactDatePicker = ({ onSelect, onClose }) => {
    const [viewDate, setViewDate] = useState(new Date(2024, 8, 1));
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
          <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{viewDate.toLocaleString('default', { month: 'short', year: 'numeric' })}</h4>
          <div className="flex gap-1">
            <button onClick={(e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><ChevronLeft size={14} /></button>
            <button onClick={(e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><ChevronRight size={14} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-[9px] font-bold text-slate-400">{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => (
            <div key={i} className="aspect-square flex items-center justify-center">
              {day && <button onClick={(e) => { e.stopPropagation(); onSelect(new Date(viewDate.getFullYear(), viewDate.getMonth(), day)); onClose(); }} className={`w-full h-full text-[11px] font-bold rounded-xl transition-all ${day === 24 && viewDate.getMonth() === 8 ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-700 dark:text-slate-300'}`}>{day}</button>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const activeEvent = useMemo(() => seminars.find(s => s.id === selectedEventId) || seminars[0], [selectedEventId, seminars]);

  const handleEventClick = (ev) => {
    setSelectedEventId(ev.id);
    setVideoProgress(0);
    setIsVideoPlaying(true);
    setShowDetailsPanel(false);
    triggerToast(`Joining: ${ev.title}`);
    setVideoModalOpen(true);
  };

  const handleDownloadHandout = () => {
    if (!activeEvent) return;
    triggerToast("Generating Validated PDF Handout...");
    try {
      const doc = new jsPDF();
      doc.setFillColor(15, 23, 42); doc.rect(0, 0, 210, 50, 'F');
      doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.setFont('helvetica', 'bold');
      doc.text('SESSION TECHNICAL HANDOUT', 15, 25);
      doc.text(`NEXUS ID: ${activeEvent.id}`, 15, 38);
      doc.setTextColor(15, 23, 42); doc.text(`Title: ${activeEvent.title}`, 15, 75);
      doc.save(`${activeEvent.title.replace(/\s+/g, '_')}_Handout.pdf`);
    } catch (e) { triggerToast("Export failed."); }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/#/seminars?id=${selectedEventId}`);
      triggerToast("Session link copied!");
    } catch (err) { triggerToast("Failed to copy link."); }
  };

  const toggleSave = (id) => {
    setSavedSeminars(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); triggerToast("Removed bookmark"); }
      else { next.add(id); triggerToast("Saved bookmark"); }
      return next;
    });
  };

  const calendarDays = useMemo(() => {
    const days = [];
    const totalDays = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const offset = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, events: seminars.filter(s => s.date === dateStr), dateStr });
    }
    return days;
  }, [currentMonth, seminars]);

  if (loading) return <div className="h-screen flex items-center justify-center text-indigo-600 font-black">SYNCING ECOSYSTEM...</div>;

  return (
    <div className="space-y-6 animate-slide-up pb-10">
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[8000] bg-slate-900 dark:bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3"><CheckCircle2 size={16} /> <span className="text-xs font-bold uppercase tracking-widest">{showToast}</span></div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 gap-4">
            <div className="flex items-center gap-6 pb-0.5 overflow-x-auto">
              {['All Content', 'Policy Updates', 'Business Seminars', 'Technical Workshops'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`pb-3 text-[10px] font-black uppercase tracking-widest ${activeTab === tab.toLowerCase() ? 'text-indigo-600' : 'text-slate-400'}`}>{tab}</button>
              ))}
            </div>
            <div className="flex gap-2 mb-2 items-center">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button onClick={() => setViewMode('grid')} className={`px-3 py-2 rounded-lg text-[10px] font-black ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><LayoutGrid size={14} /> Grid</button>
                <button onClick={() => setViewMode('calendar')} className={`px-3 py-2 rounded-lg text-[10px] font-black ${viewMode === 'calendar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><CalendarIcon size={14} /> Calendar</button>
              </div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              {activeEvent && (
                <div onClick={() => handleEventClick(activeEvent)} className="relative group rounded-[32px] overflow-hidden aspect-[21/9] cursor-pointer bg-slate-900 shadow-xl border-4 border-white dark:border-slate-800">
                  <img src={activeEvent.img} className="w-full h-full object-cover brightness-[0.5] group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <h3 className="text-2xl font-black text-white uppercase italic">{activeEvent.title}</h3>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {seminars.map(card => (
                  <div key={card.id} onClick={() => handleEventClick(card)} className={`bg-white dark:bg-slate-900 p-4 rounded-[28px] border transition-all ${selectedEventId === card.id ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-white'}`}>
                    <img src={card.img} className="aspect-video rounded-[20px] object-cover mb-4" />
                    <h4 className="text-sm font-black uppercase line-clamp-2 italic">{card.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-xl border border-white dark:border-slate-800">
              <div className="flex justify-between mb-12">
                <h3 className="text-3xl font-black uppercase italic">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
              </div>
              <div className="grid grid-cols-7 gap-4">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => <div key={d} className="text-center text-[10px] font-black text-slate-400">{d}</div>)}
                {calendarDays.map((date, i) => (
                  <div key={i} className={`aspect-square rounded-[24px] border flex flex-col items-center justify-center ${date?.events.length ? 'ring-2 ring-indigo-100 bg-white' : 'bg-slate-50/20'}`}>
                    {date && <span className="font-black">{date.day}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[48px] shadow-xl border border-white dark:border-slate-800">
            <h3 className="text-2xl font-black uppercase italic mb-10">Portal Schedule</h3>
            <div className="space-y-10">
              {seminars.map(ev => (
                <div key={ev.id} onClick={() => handleEventClick(ev)} className="flex items-center gap-6 cursor-pointer group">
                  <div className="min-w-[64px] h-[64px] bg-slate-50 dark:bg-slate-800 rounded-full flex flex-col items-center justify-center font-black">
                    <span className="text-[8px] uppercase">{ev.month}</span>
                    <span className="text-xl">{ev.day}</span>
                  </div>
                  <h4 className="text-[13px] font-black uppercase italic leading-tight line-clamp-2">{ev.title}</h4>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {videoModalOpen && activeEvent && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-0 md:p-8">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" onClick={() => setVideoModalOpen(false)}></div>
          <div className="bg-[#0A0D12] w-full h-full md:rounded-[48px] overflow-hidden relative z-[6010] flex flex-col">
            <div className="flex-1 relative flex items-center justify-center">
              <img src={activeEvent.img} className="absolute inset-0 w-full h-full object-cover opacity-30" />
              <button onClick={() => setIsVideoPlaying(!isVideoPlaying)} className="relative z-20 w-32 h-32 bg-white/10 backdrop-blur-3xl rounded-full flex items-center justify-center border-2 border-white/20">
                {isVideoPlaying ? <Pause size={48} fill="white" /> : <Play size={48} fill="white" className="translate-x-1" />}
              </button>
              <button onClick={() => setVideoModalOpen(false)} className="absolute top-8 right-8 p-4 bg-white/5 rounded-2xl text-white"><X size={28} /></button>
            </div>
            <div className="p-8 bg-black/40 border-t border-white/5 backdrop-blur-2xl text-white">
              <h2 className="text-2xl font-black uppercase italic">{activeEvent.title}</h2>
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-2">{activeEvent.author}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seminars;
