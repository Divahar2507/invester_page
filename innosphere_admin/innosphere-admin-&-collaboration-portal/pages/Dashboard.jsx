
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Bookmark,
  Download,
  Plus,
  X,
  CheckCircle2,
  Clock,
  User,
  Zap,
  MapPin,
  FileText,
  DollarSign,
  ShieldCheck,
  Library,
  Share2,
  FlaskConical,
  Award,
  ChevronLeft,
  ChevronRight,
  FileJson,
  FileSpreadsheet,
  CheckCircle,
  Loader2,
  History,
  Activity,
  BarChart3,
  Cpu,
  Layers,
  Terminal,
  Building2,
  Target,
  FileSearch
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { DASHBOARD_STATS, ICON_MAP, SEMINARS, RESEARCH_PROJECTS } from '../constants';
import { WatchListContext } from '../App';

const Dashboard = () => {
  const navigate = useNavigate();
  const { watchList, toggleWatchList } = useContext(WatchListContext);
  const [showToast, setShowToast] = useState(null);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [requestPending, setRequestPending] = useState(new Set());
  const [portalActivity, setPortalActivity] = useState([
    { id: '1', action: 'Telemetry node initialized', time: '08:30 AM' },
    { id: '2', action: 'System security audit complete', time: '09:15 AM' }
  ]);

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef(null);

  const generateFullContent = (title, institution) => ({
    abstract: `This project, ${title}, hosted at ${institution}, investigates the intersection of high-frequency data streams and adaptive cognitive modeling. By leveraging multi-node compute architectures, we explore the limits of real-time responsiveness in enterprise ecosystems. The research specifically focuses on the mitigation of synchronization drift in distributed networks.`,
    objective: `To engineer a standard-setting framework that reduces synchronization latency by 45% while maintaining a 99.999% reliability index across global distribution points. Secondary goals include the optimization of power consumption for edge devices.`,
    scope: `Deployment targets include major US and European cloud hubs, with specific focus on low-power edge devices and high-performance server clusters. The project spans three distinct phases: theoretical modeling, prototype validation, and multi-hub stress testing.`,
    requirements: `High-precision microwave controllers, A100 GPU cluster access, and AES-256 quantum-resistant encryption bridges. Participants must also possess verified Level-4 InnoSphere security clearance for data stream access.`,
    advantages: `Reduced forgetting in training models, immediate scalability for partner labs, and zero-latency floor planning integration.`,
    specifications: [
      { label: 'Compute Power', value: '8x A100 Nodes' },
      { label: 'Network Throughput', value: '100 Gbps Dedicated' },
      { label: 'Storage Cluster', value: '5PB NVMe Raid 10' }
    ],
    conclusion: `The initial benchmarks indicate that ${title} is positioned to disrupt current R&D paradigms by providing a modular, scalable architecture for future collaboration. The proposed framework significantly outperforms current industry standards in both latency and fault tolerance.`
  });

  const [trendingResearch, setTrendingResearch] = useState(
    RESEARCH_PROJECTS.slice(0, 2).map(p => ({
      ...p,
      inst: p.institution.toUpperCase(),
      desc: p.description,
      tag: p.field.toUpperCase(),
      img: p.id === '101'
        ? '/images/neural_plasticity.png'
        : '/images/graphene_storage.png',
      author: p.id === '101' ? 'Dr. Sarah Williams' : 'Prof. James Miller',
      papers: p.id === '101' ? 14 : 8,
      content: generateFullContent(p.title, p.institution)
    }))
  );

  const [formData, setFormData] = useState({ title: '', inst: '', domain: '', desc: '' });

  const triggerToast = (msg, type = 'success') => {
    setShowToast({ msg, type });
    if (type !== 'loading') setTimeout(() => setShowToast(null), 3000);
  };

  const logActivity = (action) => {
    setPortalActivity(prev => [{ id: Date.now().toString(), action, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...prev].slice(0, 8));
  };

  const handleExport = (format) => {
    setIsExportMenuOpen(false);
    triggerToast(`Generating ${format} report...`, 'loading');
    logActivity(`Exported ${format} analytics`);

    if (format === 'PDF') {
      try {
        const doc = new jsPDF();
        doc.setFillColor(15, 23, 42); doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.setFont('helvetica', 'bold');
        doc.text('INNOSPHERE ANALYTICS REPORT', 10, 25);
        doc.setFontSize(10); doc.text(`SECURE ADMIN AUDIT - ${new Date().toLocaleDateString()}`, 10, 32);

        doc.setTextColor(15, 23, 42); doc.setFontSize(14); doc.text('I. ACTIVE KPIS', 10, 55);
        doc.setFontSize(10); doc.setFont('helvetica', 'normal');
        DASHBOARD_STATS.forEach((s, i) => doc.text(`• ${s.label}: ${s.value} (Growth: ${s.change})`, 10, 65 + (i * 10)));

        doc.save('InnoSphere_Analytics_Export.pdf');
        triggerToast("PDF Report Downloaded", "success");
      } catch (err) { triggerToast("Export failed", "info"); }
    } else {
      setTimeout(() => triggerToast(`${format} exported successfully`, 'success'), 1200);
    }
  };

  const handleDownloadHandout = () => {
    const paper = selectedResearch;
    if (!paper) return;
    triggerToast("Generating Validated Data Sheet...", "loading");
    logActivity(`Exported Data Sheet: ${paper.title}`);
    try {
      const doc = new jsPDF();
      doc.setFillColor(15, 23, 42); doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255); doc.setFontSize(20); doc.setFont('helvetica', 'bold');
      doc.text('PROJECT DATA SHEET', 10, 25);
      doc.setFontSize(10); doc.text(`INNOSPHERE AUTHENTICATED - ${paper.id}`, 10, 32);

      let y = 55;
      const addSection = (title, text) => {
        doc.setTextColor(15, 23, 42); doc.setFontSize(14); doc.setFont('helvetica', 'bold');
        doc.text(title, 10, y); y += 10;
        doc.setFontSize(10); doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(text, 190);
        doc.text(lines, 10, y); y += (lines.length * 6) + 10;
      };

      addSection('ABSTRACT', paper.content.abstract);
      addSection('OBJECTIVE', paper.content.objective);
      addSection('SCOPE', paper.content.scope);
      addSection('REQUIREMENTS', paper.content.requirements);
      addSection('CONCLUSION', paper.content.conclusion);

      doc.save(`${paper.title.replace(/\s+/g, '_')}_Data_Sheet.pdf`);
      triggerToast("Data Sheet Downloaded", "success");
    } catch (e) { triggerToast("PDF Error", "info"); }
  };

  const handleCollabRequest = (id, title) => {
    if (requestPending.has(id)) return;
    triggerToast(`Transmitting collaboration link...`, 'loading');
    setTimeout(() => {
      setRequestPending(prev => new Set([...Array.from(prev), id]));
      logActivity(`Collaboration link sent: ${title}`);
      triggerToast(`Request sent to ${title} team`, 'success');
    }, 1500);
  };

  const handleCreateProject = () => {
    const newProject = {
      ...formData,
      id: `dash-${Date.now()}`,
      institution: formData.inst || 'InnoSphere Lab',
      location: 'Global Hub',
      description: formData.desc || 'Draft research.',
      field: formData.domain || 'R&D',
      status: 'New',
      progress: 5,
      inst: (formData.inst || 'InnoSphere Lab').toUpperCase(),
      tag: (formData.domain || 'R&D').toUpperCase(),
      img: '/assets/images/neural_plasticity.png',
      stage: 'PROPOSAL PHASE',
      author: 'Dr. Sarah Chen',
      papers: 0,
      content: generateFullContent(formData.title, formData.inst || 'InnoSphere Lab')
    };
    setTrendingResearch([newProject, ...trendingResearch]);
    setIsNewProjectModalOpen(false);
    logActivity(`Created project: ${newProject.title}`);
    triggerToast("Project Published", "success");
  };

  const toggleSave = (e, id) => {
    e.stopPropagation();
    toggleWatchList(id);
    triggerToast(watchList.has(id) ? "Removed from watch list" : "Added to watch list");
    logActivity(`${watchList.has(id) ? 'Removed' : 'Saved'} project to watchlist`);
  };

  return (
    <div className="space-y-8 animate-slide-up relative pb-10">
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[8000] bg-slate-900 dark:bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          {showToast.type === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
          <span className="text-xs font-bold uppercase tracking-widest">{showToast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">InnoSphere Hub</h2>
          <p className="text-slate-500 dark:text-slate-400 font-semibold text-[10px] mt-2 uppercase tracking-widest opacity-70">
            Secure Admin Access Level: <span className="text-indigo-600 dark:text-indigo-400 font-black">Verified</span>
          </p>
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="relative" ref={exportMenuRef}>
            <button onClick={() => setIsExportMenuOpen(!isExportMenuOpen)} className={`px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-3 shadow-sm active:scale-95 border ${isExportMenuOpen ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'}`}>
              <Download size={16} /> Export
            </button>
            {isExportMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95">
                <div className="p-2 space-y-1">
                  <button onClick={() => handleExport('PDF')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                    <FileText size={16} className="text-rose-500" /> PDF Summary
                  </button>
                  <button onClick={() => handleExport('CSV')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                    <FileSpreadsheet size={16} className="text-emerald-500" /> Metrics (CSV)
                  </button>
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setIsNewProjectModalOpen(true)} className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-wider hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-3 active:scale-95">
            <Plus size={18} className="stroke-[3px]" /> New Project
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {DASHBOARD_STATS.map((stat, i) => {
          const Icon = ICON_MAP[stat.icon];
          return (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-white dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color} dark:bg-opacity-10 dark:text-opacity-90`}><Icon size={18} /></div>
                <div className={`flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-lg ${stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                  {stat.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{stat.change}
                </div>
              </div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6 px-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Trending Insights</h3>
              <button onClick={() => navigate('/research')} className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline flex items-center gap-2 group transition-all">
                Marketplace <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trendingResearch.map((card) => (
                <div key={card.id} onClick={() => setSelectedResearch(card)} className="bg-white dark:bg-slate-900 rounded-[44px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-2xl transition-all flex flex-col group cursor-pointer active:scale-[0.99] animate-in slide-in-from-top-4">
                  <div className="relative aspect-[4/3] overflow-hidden m-2 rounded-[36px]">
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]" />
                    <div className="absolute top-6 left-6 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-slate-900 dark:text-white tracking-widest uppercase border border-white/50 shadow-2xl">
                      {card.inst}
                    </div>
                  </div>
                  <div className="p-8 pt-4 flex-1 flex flex-col">
                    <div className="mb-3">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
                        {card.tag}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 dark:text-white text-xl leading-tight group-hover:text-indigo-600 tracking-tight transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed font-medium line-clamp-3">
                      {card.desc}
                    </p>
                    <div className="mt-8 pt-6 flex items-center justify-between border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
                        <BarChart3 size={16} className="text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Insight Package Active</span>
                      </div>
                      <button onClick={(e) => toggleSave(e, card.id)} className={`p-2 transition-all hover:scale-110 active:scale-90 ${watchList.has(card.id) ? 'text-indigo-600' : 'text-slate-300 dark:text-slate-700'}`}>
                        <Bookmark size={22} fill={watchList.has(card.id) ? 'currentColor' : 'none'} className="stroke-[2.5px]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SEMINAR HUB SECTION */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-lg font-extrabold text-[#1E293B] dark:text-white tracking-tighter uppercase leading-none">Seminar Hub</h3>
              <button onClick={() => navigate('/seminars')} className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] hover:text-indigo-600 transition-colors">View Schedule</button>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col divide-y divide-slate-100/30 dark:divide-slate-800/50">
              {SEMINARS.slice(0, 2).map((s) => (
                <div key={s.id} className="p-8 flex items-center gap-8 group hover:bg-slate-50/30 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center min-w-[76px] h-[76px] bg-[#EEF2FF] dark:bg-indigo-950/40 rounded-[22px] border border-indigo-50/50 shadow-sm transition-transform group-hover:scale-105">
                    <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-0.5">{s.month}</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{s.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-[#1E293B] dark:text-white text-lg truncate uppercase tracking-tight leading-none mb-3 group-hover:text-indigo-600 transition-colors">{s.title}</h4>
                    <div className="flex items-center gap-6">
                      <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight text-slate-400">
                        <Clock size={15} className="text-indigo-500/60" /> {s.time}
                      </span>
                      <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight text-slate-400">
                        <User size={15} className="text-indigo-500/60" /> {s.speaker.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => navigate('/seminars')} className="px-10 py-3.5 bg-[#4F46E5] text-white rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-[#4338CA] shadow-[0_10px_20px_rgba(79,70,229,0.2)] active:scale-95 transition-all">Join</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[48px] border border-white dark:border-slate-800 shadow-sm h-full flex flex-col">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-8 flex items-center justify-between uppercase tracking-tighter italic">Portal Activity <History size={20} className="text-indigo-600" /></h3>
            <div className="space-y-8 relative flex-1">
              <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-100 dark:bg-slate-800"></div>
              {portalActivity.map((act) => (
                <div key={act.id} className="relative pl-10 animate-in slide-in-from-right-2">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 bg-indigo-500 ring-4 ring-slate-50 transition-all"></div>
                  <h4 className="font-black text-slate-900 dark:text-white text-[11px] uppercase tracking-tight leading-tight">{act.action}</h4>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1.5">{act.time}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* PROJECT DETAIL MODAL - ENHANCED WITH ALL SCIENTIFIC SECTIONS */}
      {selectedResearch && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-0 md:p-8">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setSelectedResearch(null)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-7xl md:max-h-[92vh] md:rounded-[56px] overflow-hidden relative z-[6010] shadow-[0_40px_100_rgba(0,0,0,0.6)] border border-white/10 flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
            {/* Sidebar Branding & Metadata */}
            <div className="w-full md:w-[340px] bg-slate-50 dark:bg-slate-800/60 p-12 flex flex-col border-r border-slate-100 dark:border-slate-800 shrink-0">
              <div className="space-y-12 w-full mb-16">
                <div className="w-24 h-24 bg-indigo-600 rounded-[36px] flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                  <FlaskConical size={44} className="stroke-[1.5px]" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em]">Project Technical Hub</h4>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mt-4 italic uppercase leading-tight">
                    {selectedResearch.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-8 pt-12 border-t border-slate-200 dark:border-slate-700 flex-1">
                <div className="flex items-center gap-5 text-slate-600 dark:text-slate-400 group">
                  <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm text-indigo-500 group-hover:scale-110 transition-transform">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Institution</p>
                    <span className="text-[13px] font-black uppercase tracking-tight text-slate-900 dark:text-white">{selectedResearch.institution}</span>
                  </div>
                </div>
                <div className="flex items-center gap-5 text-slate-600 dark:text-slate-400 group">
                  <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm text-indigo-500 group-hover:scale-110 transition-transform">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Facility Node</p>
                    <span className="text-[13px] font-black uppercase tracking-tight text-slate-900 dark:text-white">{selectedResearch.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-5 text-slate-600 dark:text-slate-400 group">
                  <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm text-indigo-500 group-hover:scale-110 transition-transform">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Maturity Phase</p>
                    <span className="text-[13px] font-black uppercase tracking-tight text-slate-900 dark:text-white">{selectedResearch.stage}</span>
                  </div>
                </div>
              </div>

              <div className="pt-12">
                <button onClick={handleDownloadHandout} className="w-full py-6 bg-[#121826] dark:bg-white text-white dark:text-[#121826] rounded-full font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-95 shadow-xl">
                  <Download size={20} /> Export Technical Handout
                </button>
                <p className="mt-6 text-[9px] text-center font-black text-slate-400 uppercase tracking-[0.3em]">VALIDATED ADMIN DOCUMENT</p>
              </div>
            </div>

            {/* Content Area - Detailed Scientific Sections */}
            <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-slate-900 relative">
              <div className="flex items-center justify-between p-12 border-b border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <span className="px-5 py-2.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-emerald-100">Verified Hub</span>
                  <span className="px-5 py-2.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-indigo-100">{selectedResearch.field}</span>
                </div>
                <button onClick={() => setSelectedResearch(null)} className="p-4 bg-slate-50 dark:bg-slate-800 hover:bg-rose-500 hover:text-white rounded-2xl text-slate-400 transition-all shadow-sm active:scale-90 group">
                  <X size={28} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-20 space-y-24 scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                  <section className="space-y-8">
                    <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] flex items-center gap-3">
                      <FileSearch size={16} /> 01. Abstract
                    </h5>
                    <p className="text-slate-700 dark:text-slate-300 text-xl leading-relaxed font-medium tracking-tight">
                      {selectedResearch.content.abstract}
                    </p>
                  </section>

                  <section className="space-y-8">
                    <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] flex items-center gap-3">
                      <Target size={16} /> 02. Project Objective
                    </h5>
                    <p className="text-slate-700 dark:text-slate-300 text-xl leading-relaxed font-medium tracking-tight">
                      {selectedResearch.content.objective}
                    </p>
                  </section>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 border-t border-slate-50 dark:border-slate-800 pt-24">
                  <section className="space-y-8">
                    <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] flex items-center gap-3">
                      <Layers size={16} /> 03. Project Scope
                    </h5>
                    <p className="text-slate-700 dark:text-slate-300 text-xl leading-relaxed font-medium tracking-tight">
                      {selectedResearch.content.scope}
                    </p>
                  </section>

                  <section className="space-y-8">
                    <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] flex items-center gap-3">
                      <Terminal size={16} /> 04. Technical Requirements
                    </h5>
                    <p className="text-slate-700 dark:text-slate-300 text-xl leading-relaxed font-medium tracking-tight">
                      {selectedResearch.content.requirements}
                    </p>
                  </section>
                </div>

                <section className="space-y-10 border-t border-slate-50 dark:border-slate-800 pt-24">
                  <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Cpu size={16} /> 05. Technical Details & Specifications
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {selectedResearch.content.specifications.map((spec, i) => (
                      <div key={i} className="p-10 bg-slate-50 dark:bg-slate-800/40 rounded-[44px] border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-indigo-200 transition-colors">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-indigo-500 transition-colors">{spec.label}</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-8 border-t border-slate-50 dark:border-slate-800 pt-24">
                  <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] flex items-center gap-3">
                    <CheckCircle size={16} /> 06. Conclusion & Roadmap
                  </h5>
                  <p className="text-slate-700 dark:text-slate-300 text-xl leading-relaxed font-medium tracking-tight">
                    {selectedResearch.content.conclusion}
                  </p>
                </section>

                <div className="pt-16 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-10">
                  <button
                    onClick={() => handleCollabRequest(selectedResearch.id, selectedResearch.title)}
                    className={`px-20 py-8 rounded-full font-black text-[14px] uppercase tracking-widest transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 ${requestPending.has(selectedResearch.id) ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-[#4F46E5] text-white shadow-indigo-200 hover:bg-[#4338CA]'}`}
                  >
                    {requestPending.has(selectedResearch.id) ? (
                      <><CheckCircle2 size={24} /> Transmitted Link</>
                    ) : (
                      'Send Collab Link'
                    )}
                  </button>
                  <div className="flex gap-6">
                    <button onClick={() => triggerToast("Link copied to clipboard")} className="p-6 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90"><Share2 size={28} /></button>
                    <button onClick={(e) => toggleSave(e, selectedResearch.id)} className={`p-6 rounded-full transition-all shadow-sm active:scale-90 ${watchList.has(selectedResearch.id) ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-indigo-600 hover:text-white'}`}><Bookmark size={28} fill={watchList.has(selectedResearch.id) ? 'currentColor' : 'none'} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsNewProjectModalOpen(false)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[40px] shadow-2xl border border-white dark:border-slate-800 overflow-hidden relative z-[4010] animate-in zoom-in-95">
            <div className="p-12 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Initiate R&D Draft</h3>
                <button onClick={() => setIsNewProjectModalOpen(false)} className="text-slate-400 hover:text-rose-600 transition-all"><X size={24} /></button>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Identifier</label>
                  <input type="text" placeholder="e.g. Adaptive Mesh Optimization" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none focus:ring-4 ring-indigo-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hosting Org</label>
                  <input type="text" placeholder="e.g. InnoSphere R&D Hub" value={formData.inst} onChange={e => setFormData({ ...formData, inst: e.target.value })} className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none focus:ring-4 ring-indigo-50" />
                </div>
              </div>
              <button onClick={handleCreateProject} className="w-full py-6 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl active:scale-95 hover:bg-indigo-700 transition-all">PUBLISH DRAFT</button>
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

export default Dashboard;
