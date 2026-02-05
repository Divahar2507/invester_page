
import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Star,
  MessageSquare,
  Calendar,
  ChevronRight,
  ChevronLeft,
  X,
  Filter,
  CheckCircle2,
  Rocket,
  ChevronDown,
  User,
  ShieldCheck,
  Zap,
  Globe,
  Award,
  Video,
  Clock,
  ArrowRight,
  Bookmark,
  Send
} from 'lucide-react';
// Added ICON_MAP to the import list from constants
import { fetchMentors } from '../src/services/api';
import { ICON_MAP } from '../constants';

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [showToast, setShowToast] = useState(null);
  const [followedMentors, setFollowedMentors] = useState(new Set());

  // Booking Data State
  const [bookingData, setBookingData] = useState({
    modality: 'video',
    purpose: 'Strategy Roadmap Review',
    slot: ''
  });

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  useEffect(() => {
    const loadMentors = async () => {
      try {
        const data = await fetchMentors();
        setMentors(data);
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMentors();
  }, []);

  const allExpertise = useMemo(() => {
    const set = new Set();
    mentors.forEach(m => {
      if (Array.isArray(m.expertise)) {
        m.expertise.forEach(e => set.add(e));
      }
    });
    return Array.from(set);
  }, [mentors]);

  const filteredMentors = useMemo(() => {
    return mentors.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesExpertise = selectedExpertise.length === 0 ||
        selectedExpertise.some(e => m.expertise.includes(e));
      return matchesSearch && matchesExpertise;
    });
  }, [searchQuery, selectedExpertise, mentors]);

  const toggleExpertise = (exp) => {
    setSelectedExpertise(prev =>
      prev.includes(exp) ? prev.filter(e => e !== exp) : [...prev, exp]
    );
  };

  const handleBookingSubmit = () => {
    triggerToast("Booking request transmitted to mentor...");
    setTimeout(() => {
      triggerToast("Session confirmed. Calendar link dispatched.");
      setIsBooking(false);
      setBookingStep(1);
      setSelectedMentor(null);
    }, 1500);
  };

  // Body scroll lock
  useEffect(() => {
    if (selectedMentor || isBooking) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedMentor, isBooking]);

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9000] bg-slate-900 dark:bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-widest">{showToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none mb-4">Mentor Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
            Strategic guidance from top-tier venture partners, ex-founders, and policy architects.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
            {filteredMentors.length} ACTIVE EXPERTS
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Panel */}
        <aside className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest italic">Filters</h3>
              <button
                onClick={() => setSelectedExpertise([])}
                className="text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:underline"
              >
                Clear
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4">Expertise Filter</label>
                <div className="space-y-2">
                  {allExpertise.map(exp => (
                    <label key={exp} className="flex items-center gap-3 cursor-pointer group py-1">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedExpertise.includes(exp)}
                          onChange={() => toggleExpertise(exp)}
                          className="peer appearance-none w-5 h-5 rounded-lg border-2 border-slate-200 dark:border-slate-700 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                        />
                        <CheckCircle2 size={12} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-tight transition-colors ${selectedExpertise.includes(exp) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                        {exp}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, expertise, or company..."
                className="w-full pl-14 pr-5 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[22px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all shadow-sm dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMentors.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMentor(m)}
                className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group overflow-hidden cursor-pointer animate-in fade-in slide-in-from-top-4"
              >
                <div className="p-8 pb-4 flex-1">
                  <div className="flex items-start justify-between mb-8">
                    <div className="relative">
                      <img src={m.avatar} alt={m.name} className="w-20 h-20 rounded-[28px] object-cover ring-8 ring-slate-50 dark:ring-slate-800 group-hover:ring-indigo-50 dark:group-hover:ring-indigo-900/20 transition-all shadow-md" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 shadow-sm"></div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-900 dark:text-white font-black text-[11px] shadow-sm">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      {m.rating}
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase italic group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{m.name}</h4>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest leading-none">
                    {m.role} @ <span className="text-slate-900 dark:text-slate-200">{m.company}</span>
                  </p>
                </div>

                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-50 dark:border-slate-800 mt-auto flex gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedMentor(m); setIsBooking(true); }}
                    className="flex-1 py-4 bg-indigo-600 text-white font-black text-[10px] rounded-[20px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 transition-all"
                  >
                    <Calendar size={16} /> Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MENTOR PROFILE MODAL - PIXEL PERFECT REPLICA OF THE IMAGE */}
      {selectedMentor && !isBooking && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-0 md:p-8">
          <div className="absolute inset-0 bg-[#0A0D14]/90 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setSelectedMentor(null)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-6xl md:max-h-[85vh] md:rounded-[56px] overflow-hidden relative z-[6010] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col md:flex-row animate-in zoom-in-95 duration-500">

            {/* LEFT SIDEBAR - PROFILE & BRANDING */}
            <div className="w-full md:w-[360px] bg-slate-50 dark:bg-slate-800/60 p-12 flex flex-col items-center border-r border-slate-100 dark:border-slate-800 shrink-0">
              <div className="relative mb-12 w-full flex justify-center">
                <div className="w-36 h-36 bg-white dark:bg-slate-900 rounded-[44px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-1 border border-white dark:border-slate-800 flex items-center justify-center">
                  <img src={selectedMentor.avatar} className="w-full h-full object-cover rounded-[40px]" alt={selectedMentor.name} />
                </div>
              </div>

              <div className="text-center space-y-3 mb-12 w-full">
                <h3 className="text-3xl font-black text-[#121826] dark:text-white tracking-tighter uppercase italic leading-none">{selectedMentor.name}</h3>
                <p className="text-[10px] font-black text-[#6366F1] dark:text-indigo-400 uppercase tracking-[0.25em] leading-none">
                  {selectedMentor.role.toUpperCase()} @ {selectedMentor.company.toUpperCase()}
                </p>
              </div>

              <div className="mt-auto w-full pt-12">
                <button
                  onClick={() => setIsBooking(true)}
                  className="w-full py-5 bg-[#4F46E5] text-white rounded-full font-black text-[12px] uppercase tracking-[0.15em] flex items-center justify-center gap-3 hover:bg-[#4338CA] shadow-[0_15_30_rgba(79,70,229,0.3)] dark:shadow-none active:scale-95 transition-all"
                >
                  <Calendar size={18} className="stroke-[2.5px]" /> INITIATE BOOKING
                </button>
              </div>
            </div>

            {/* MAIN CONTENT AREA - EXPERT CAPABILITIES */}
            <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-slate-900 relative">

              {/* Header matching screenshot */}
              <div className="flex items-center justify-between px-12 py-10 border-b border-slate-50 dark:border-slate-800">
                <h5 className="text-[11px] font-black text-[#6366F1] uppercase tracking-[0.4em]">Expert Capabilities</h5>
                <button onClick={() => setSelectedMentor(null)} className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-rose-500 hover:text-white rounded-2xl text-slate-400 transition-all shadow-sm active:scale-90 group">
                  <X size={24} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              {/* Body Content matching screenshot */}
              <div className="flex-1 overflow-y-auto p-12 md:p-16 scrollbar-hide space-y-16">
                <section className="space-y-8">
                  <h5 className="text-[11px] font-black text-[#6366F1] uppercase tracking-[0.4em]">01. Profile Summary</h5>
                  <p className="text-[#334155] dark:text-slate-300 text-2xl leading-relaxed font-medium tracking-tight">
                    {selectedMentor.bio || `${selectedMentor.name} is a highly accomplished ${selectedMentor.role} within the InnoSphere Portal.`}
                  </p>
                </section>

                <section className="space-y-8">
                  <h5 className="text-[11px] font-black text-[#6366F1] uppercase tracking-[0.4em]">02. Domain Expertise</h5>
                  <div className="flex flex-wrap gap-4">
                    {selectedMentor.expertise.map((exp) => (
                      <div key={exp} className="px-6 py-4 bg-slate-50 dark:bg-slate-800/40 rounded-[20px] border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <Zap size={16} className="text-indigo-500" />
                        <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{exp}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-8">
                  <h5 className="text-[11px] font-black text-[#6366F1] uppercase tracking-[0.4em]">03. Mentor Performance</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-10 bg-slate-50 dark:bg-slate-800/40 rounded-[40px] border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Verification Rating</p>
                      <p className="text-4xl font-black text-[#121826] dark:text-white tracking-tighter italic flex items-center gap-3">
                        <Star size={24} className="text-amber-400 fill-amber-400" /> {selectedMentor.rating}
                      </p>
                    </div>
                    <div className="p-10 bg-slate-50 dark:bg-slate-800/40 rounded-[40px] border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Community Reviews</p>
                      <p className="text-4xl font-black text-[#6366F1] uppercase italic tracking-tighter">{selectedMentor.reviews}+ Sessions</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SESSION BOOKING MODAL */}
      {isBooking && selectedMentor && (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsBooking(false)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-[500px] rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-white dark:border-slate-800 overflow-hidden relative z-[7010] animate-in zoom-in-95 duration-300">
            <div className="p-10 space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[28px] font-black text-slate-900 dark:text-white tracking-tight uppercase italic leading-none">Session Booking</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2 leading-none">Stage {bookingStep} of 3</p>
                </div>
                <button onClick={() => setIsBooking(false)} className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-all active:scale-90"><X size={24} /></button>
              </div>

              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${bookingStep >= i ? 'bg-[#6366F1]' : 'bg-[#F1F5F9] dark:bg-slate-800'}`}></div>
                ))}
              </div>

              <div className="min-h-[320px]">
                {bookingStep === 1 && (
                  <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Session Modality</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setBookingData({ ...bookingData, modality: 'video' })}
                          className={`p-10 rounded-[40px] border-2 transition-all flex flex-col items-center gap-4 group active:scale-95 ${bookingData.modality === 'video' ? 'bg-[#F8FAFC] dark:bg-slate-800/40 border-transparent shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 hover:border-[#6366F1]/30'}`}
                        >
                          <Video size={36} className={`transition-colors ${bookingData.modality === 'video' ? 'text-[#6366F1]' : 'text-slate-300'}`} />
                          <span className={`text-[11px] font-black uppercase tracking-widest ${bookingData.modality === 'video' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Video Sync</span>
                        </button>
                        <button
                          onClick={() => setBookingData({ ...bookingData, modality: 'office' })}
                          className={`p-10 rounded-[40px] border-2 transition-all flex flex-col items-center gap-4 group active:scale-95 ${bookingData.modality === 'office' ? 'bg-[#F8FAFC] dark:bg-slate-800/40 border-transparent shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 hover:border-[#6366F1]/30'}`}
                        >
                          <Globe size={36} className={`transition-colors ${bookingData.modality === 'office' ? 'text-[#6366F1]' : 'text-slate-300'}`} />
                          <span className={`text-[11px] font-black uppercase tracking-widest ${bookingData.modality === 'office' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Office Hours</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Select Available Slot</label>
                      <div className="space-y-3">
                        {['Tomorrow, 10:00 AM — 11:00 AM', 'Tomorrow, 02:30 PM — 03:30 PM', 'Wednesday, 09:00 AM — 10:00 AM'].map(slot => (
                          <button
                            key={slot}
                            onClick={() => setBookingData({ ...bookingData, slot })}
                            className={`w-full p-6 text-left rounded-[28px] text-[14px] font-bold flex items-center justify-between group transition-all border-2 active:scale-95 ${bookingData.slot === slot ? 'bg-[#F8FAFC] dark:bg-slate-800 border-transparent text-[#6366F1]' : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 text-slate-500 hover:border-[#6366F1]/30'}`}
                          >
                            <div className="flex items-center gap-4"><Clock size={20} className={bookingData.slot === slot ? 'text-[#6366F1]' : 'text-slate-300'} /> {slot}</div>
                            {bookingData.slot === slot && <CheckCircle2 size={20} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div className="space-y-10 animate-in zoom-in-95 text-center py-6">
                    <div className="w-28 h-28 bg-[#F8FAFC] dark:bg-slate-800 rounded-[44px] flex items-center justify-center mx-auto border-4 border-white dark:border-slate-700 shadow-xl">
                      <img src={selectedMentor.avatar} className="w-full h-full object-cover rounded-[40px]" alt="" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">Confirm Session</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Booked with <strong>{selectedMentor.name}</strong></p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 pt-10 border-t border-slate-50 dark:border-slate-800">
                <button
                  disabled={bookingStep === 2 && !bookingData.slot}
                  onClick={() => bookingStep < 3 ? setBookingStep(prev => prev + 1) : handleBookingSubmit()}
                  className="w-full py-6 bg-[#6366F1] text-white font-black text-[13px] rounded-[28px] uppercase tracking-widest hover:bg-[#4F46E5] shadow-[0_15px_30px_rgba(99,102,241,0.25)] transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <ArrowRight size={20} className="stroke-[3px]" />
                  <span>{bookingStep === 3 ? 'Confirm Session' : 'Next Step'}</span>
                </button>
                {bookingStep > 1 && <button onClick={() => setBookingStep(prev => prev - 1)} className="w-full py-4 text-slate-400 font-black text-[10px] rounded-2xl uppercase tracking-[0.2em] hover:text-slate-600 transition-all">Go Back</button>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="pt-20 border-t border-slate-100 dark:border-slate-800/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 hover:opacity-100 transition-all duration-700 group/footer">
          <div className="flex items-center gap-4 group-hover/footer:rotate-1">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200/20">
              <ICON_MAP.LayoutDashboard size={24} />
            </div>
            <div>
              <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-xl block">InnoSphere Ecosystem</span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Strategic Hub</span>
            </div>
          </div>
          <div className="flex gap-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Security</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Help</a>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2024 InnoSphere Hub</span>
        </div>
      </footer>
    </div>
  );
};

export default Mentors;
