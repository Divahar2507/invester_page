
import React, { useState, useMemo, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  ChevronDown,
  Filter,
  BookOpen,
  X,
  FileText,
  ChevronRight,
  CheckCircle2,
  Building2,
  Info,
  Loader2,
  Send,
  Zap,
  MapPin,
  Bookmark,
  Award,
  User,
  ChevronLeft,
  Download,
  Share2,
  Calendar as CalendarIcon,
  ArrowRight,
  Briefcase,
  History,
  Activity,
  ExternalLink,
  ShieldCheck,
  FlaskConical
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { RESEARCH_PROJECTS, ICON_MAP } from '../constants';
import { WatchListContext } from '../App';

const Research = () => {
  const navigate = useNavigate();
  const { watchList, toggleWatchList } = useContext(WatchListContext);
  const [activeTab, setActiveTab] = useState('open'); // 'open' | 'saved'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showToast, setShowToast] = useState(null);
  const [requestPending, setRequestPending] = useState(new Set());
  const [collaborationHistory, setCollaborationHistory] = useState([]);
  const [projects, setProjects] = useState([...RESEARCH_PROJECTS]);

  // Post Research Modal States
  const [showPostModal, setShowPostModal] = useState(false);
  const [postStep, setPostStep] = useState(1);
  const [newProjectData, setNewProjectData] = useState({
    title: '',
    institution: '',
    location: '',
    field: 'Biotech',
    description: ''
  });

  // Paper/Project Reader State
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isReadingPaper, setIsReadingPaper] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Body scroll lock effect for modals
  useEffect(() => {
    if (isReadingPaper || showPostModal || selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isReadingPaper, showPostModal, selectedProject]);

  const triggerToast = (msg, type = 'success') => {
    setShowToast({ msg, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleCollaborationRequest = (e, id, title) => {
    e.stopPropagation();
    if (requestPending.has(id)) return;

    triggerToast(`Initiating secure link for: ${title}`, 'info');

    setTimeout(() => {
      const nextPending = new Set(requestPending);
      nextPending.add(id);
      setRequestPending(nextPending);

      const newHistory = [
        { id, title, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...collaborationHistory.slice(0, 9)
      ];
      setCollaborationHistory(newHistory);

      triggerToast(`Collaboration request dispatched to ${title} team`, 'success');
    }, 1200);
  };

  const toggleSave = (e, id) => {
    e.stopPropagation();
    const isSaved = watchList.has(id);
    toggleWatchList(id);
    triggerToast(isSaved ? "Removed from watch list" : "Added to watch list", "success");
  };

  const handleShare = async () => {
    const paper = selectedPaper || selectedProject || {};
    const shareData = {
      title: paper.title || 'Research Project',
      text: `Check out this research: ${paper.title}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        triggerToast("Link copied to clipboard!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadHandout = () => {
    const paper = selectedPaper || selectedProject;
    if (!paper) return;

    triggerToast("Generating Validated PDF Handout...", "info");

    try {
      const doc = new jsPDF();

      // Styling
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('SCIENTIFIC RESEARCH HANDOUT', 10, 25);

      doc.setFontSize(10);
      doc.text(`INNOSPHERE ECOSYSTEM - AUTHENTICATED DOCUMENT ID: ${paper.id}`, 10, 32);

      // Info Sections
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.text('I. METADATA', 10, 55);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Title: ${paper.title}`, 10, 65);
      doc.text(`Organization: ${paper.institution || paper.journal || 'InnoSphere Lab'}`, 10, 72);
      doc.text(`Field: ${paper.field || 'General R&D'}`, 10, 79);
      doc.text(`Generation Date: ${new Date().toLocaleString()}`, 10, 86);

      // Abstract
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('II. EXECUTIVE SUMMARY', 10, 105);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const abstractText = paper.content?.abstract || paper.description || 'Detailed technical abstract pending final review.';
      const splitAbstract = doc.splitTextToSize(abstractText, 190);
      doc.text(splitAbstract, 10, 115);

      // Technical Specs
      if (paper.content) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('III. PROJECT PARAMETERS', 10, 145);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`• Objective: ${paper.content.objective || 'N/A'}`, 15, 155);
        doc.text(`• Requirements: ${paper.content.requirements || 'N/A'}`, 15, 162);
        doc.text(`• Advantages: ${paper.content.advantages || 'N/A'}`, 15, 169);
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('THIS DOCUMENT IS CLASSIFIED AS OPEN-ACCESS FOR REGISTERED ECOSYSTEM PARTNERS.', 105, 285, { align: 'center' });

      doc.save(`${paper.title.replace(/\s+/g, '_')}_Scientific_Handout.pdf`);
      triggerToast("PDF Handout Downloaded Successfully", "success");
    } catch (error) {
      console.error("PDF generation failed:", error);
      triggerToast("PDF generation failed. Check console.", "info");
    }
  };

  const categories = ['All', 'AI & ML', 'Biotech', 'Green Tech', 'Quantum', 'Robotics'];

  const filteredProjects = useMemo(() => {
    let base = activeTab === 'saved'
      ? projects.filter(p => watchList.has(p.id))
      : projects;

    return base.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.institution.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.field === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, activeTab, watchList, projects]);

  const handlePostSubmit = () => {
    const project = {
      id: `new-${Date.now()}`,
      title: newProjectData.title || 'Advanced Domain Research',
      institution: newProjectData.institution || 'InnoSphere Internal Lab',
      location: newProjectData.location || 'Global Hub',
      description: newProjectData.description || 'Research parameters initialized via admin portal.',
      field: newProjectData.field,
      status: 'New',
      stage: 'Conceptual',
      progress: 5
    };
    setProjects([project, ...projects]);
    triggerToast("Research Need Published to Marketplace", "success");
    setShowPostModal(false);
    setPostStep(1);
    setNewProjectData({ title: '', institution: '', location: '', field: 'Biotech', description: '' });
    setActiveTab('open');
  };

  const SIDEBAR_PAPERS = [
    {
      id: 'p1',
      title: 'SCALABLE QUANTUM ERROR CORRECTION',
      journal: 'NATURE PHYSICS',
      date: 'OCT 2023',
      color: 'text-rose-500',
      author: 'Dr. Aris Thorne',
      authorInitial: 'A',
      content: {
        abstract: 'Addressing the decoherence problem in large-scale topological qubits through adaptive feedback loops.',
        scope: 'Topological quantum computing frameworks across cryogenic layers.',
        requirements: 'Cryogenic environment < 10mK, High-precision microwave controllers.',
        objective: 'Stabilize logical qubits for > 1000 gate operations without fidelity loss.',
        advantages: 'Reduces overhead by 40% compared to surface code.',
        conclusion: 'Modular architecture allows for immediate scaling to 50+ logical qubits.'
      }
    },
    {
      id: 'p2',
      title: 'TRANSFORMER MODELS FOR PROTEIN FOLDING',
      journal: 'BIOINFORMATICS',
      date: 'SEP 2023',
      color: 'text-indigo-500',
      author: 'Dr. Sarah Chen',
      authorInitial: 'S',
      content: {
        abstract: 'Utilizing attention mechanisms to predict tertiary structures of complex multi-domain proteins.',
        scope: 'Structural biology and drug discovery synchronization.',
        requirements: 'A100 GPU Cluster, PDB Database Access.',
        objective: 'Reach sub-angstrom accuracy in unknown protein sequences.',
        advantages: 'Processing speed increased by 100x compared to traditional MD simulations.',
        conclusion: 'This model paves the way for rapid pandemic response through custom enzyme design.'
      }
    },
    {
      id: 'p3',
      title: 'SOLID STATE ELECTROLYTES FOR EVS',
      journal: 'ADVANCED MATERIALS',
      date: 'AUG 2023',
      color: 'text-emerald-500',
      author: 'Prof. Li Wei',
      authorInitial: 'L',
      content: {
        abstract: 'Characterizing ion transport in ceramic-polymer hybrid electrolytes for high-safety lithium-metal batteries.',
        scope: 'Energy storage and electric mobility infrastructure.',
        requirements: 'SEM/TEM characterization, Inert gas glovebox environment.',
        objective: 'Achieve energy density > 500Wh/kg.',
        advantages: 'Complete elimination of fire risk associated with traditional liquid electrolytes.',
        conclusion: 'Stable cycling demonstrated for 1000+ charges with < 5% degradation.'
      }
    }
  ];

  const openPaper = (paper) => {
    setSelectedPaper(paper);
    setIsReadingPaper(true);
  };

  const openProjectDetails = (project) => {
    setSelectedProject(project);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[8000] bg-slate-900 dark:bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-widest">{showToast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-3 uppercase italic">R&D Marketplace</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed">
              Real-time collaboration for the world's most ambitious projects.
            </p>
          </div>
          <button
            onClick={() => { setShowPostModal(true); setPostStep(1); }}
            className="flex items-center justify-center gap-4 px-10 py-5 bg-[#6366F1] text-white font-black text-[13px] rounded-full shadow-[0_15px_30px_rgba(99,102,241,0.3)] hover:bg-[#4F46E5] hover:-translate-y-1 transition-all active:scale-95 shrink-0 uppercase tracking-widest group"
          >
            <Plus size={22} className="stroke-[3px] group-hover:rotate-90 transition-transform" />
            <span>Post Research Need</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, lab, or keywords..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all dark:text-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400'}`}
              >
                {cat}
                {selectedCategory === cat && cat !== 'All' && <X size={12} className="ml-1" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-2">
            <button
              onClick={() => setActiveTab('open')}
              className={`px-6 py-4 font-black text-[10px] uppercase tracking-widest relative transition-colors ${activeTab === 'open' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
            >
              Verified Requests
              <span className="ml-2 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-md text-[8px]">
                {projects.length}
              </span>
              {activeTab === 'open' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-[0_-4px_10px_rgba(79,70,229,0.3)]"></div>}
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-4 font-black text-[10px] uppercase tracking-widest relative transition-colors ${activeTab === 'saved' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
            >
              Watch List
              <span className="ml-2 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md text-[8px]">
                {watchList.size}
              </span>
              {activeTab === 'saved' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-[0_-4px_10px_rgba(79,70,229,0.3)]"></div>}
            </button>
          </div>

          <div className="space-y-5">
            {filteredProjects.length > 0 ? filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => openProjectDetails(project)}
                className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden animate-in fade-in slide-in-from-top-4 cursor-pointer active:scale-[0.995]"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm">
                      <BookOpen size={28} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight leading-tight">{project.title}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                        <Building2 size={12} className="text-indigo-500" />
                        {project.institution} <span className="text-slate-300">•</span> {project.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleSave(e, project.id)}
                      className={`p-2 rounded-xl transition-all active:scale-90 ${watchList.has(project.id) ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300 hover:text-indigo-400'}`}
                    >
                      <Bookmark size={20} fill={watchList.has(project.id) ? "currentColor" : "none"} />
                    </button>
                    <span className={`px-4 py-1.5 rounded-xl text-[8px] font-black tracking-[0.2em] uppercase border ${project.status === 'Active' ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800' :
                        project.status === 'New' ? 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800' :
                          'bg-slate-50 border-slate-100 text-slate-500 dark:bg-slate-800 dark:border-slate-700'
                      }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-10 font-medium">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-12">
                    <div>
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Primary Domain</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedCategory(project.field); }}
                        className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                      >
                        {project.field}
                      </button>
                    </div>
                    <div className="hidden sm:block">
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Project Maturity</span>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-700 ${i <= 2 ? 'bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.4)]' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">{project.stage}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleCollaborationRequest(e, project.id, project.title)}
                    className={`px-8 py-4 font-black text-[10px] rounded-2xl uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${requestPending.has(project.id) ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-50'}`}
                  >
                    {requestPending.has(project.id) ? (
                      <><CheckCircle2 size={16} /> Link Requested</>
                    ) : (
                      <><Send size={16} /> Request Collaboration</>
                    )}
                  </button>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center space-y-4 bg-slate-50 dark:bg-slate-800/20 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  {activeTab === 'saved' ? 'Watch List Empty' : 'No Matches Found'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                  {activeTab === 'saved' ? 'Save projects to track them here' : 'Adjust your filters or search keywords'}
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setActiveTab('open'); }}
                  className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] underline underline-offset-8"
                >
                  Reset Dashboard
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* RECENT ACTIVITY LOG - FOR ACCURATE REFLECTION */}
          <section className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <History size={20} className="text-indigo-600" />
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Portal Activity</h3>
            </div>
            <div className="space-y-6">
              {collaborationHistory.length > 0 ? collaborationHistory.map((log, i) => (
                <div key={i} className="flex gap-4 group animate-in slide-in-from-right-2">
                  <div className="w-1.5 h-12 bg-indigo-600 rounded-full shrink-0 group-hover:scale-y-110 transition-transform"></div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1 leading-tight">{log.title}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">COLLAB REQUEST SENT • {log.time}</p>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center space-y-2 opacity-50">
                  <Activity size={24} className="mx-auto text-slate-300" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No recent log entries</p>
                </div>
              )}
            </div>
          </section>

          {/* Published Papers sidebar */}
          <section className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 p-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Published Papers</h3>
              <button onClick={() => triggerToast("Navigating to full publication library...")} className="text-[#6366F1] font-black text-[10px] uppercase tracking-widest hover:underline">Full Library</button>
            </div>
            <div className="space-y-10 relative">
              <div className="absolute left-[33px] top-6 bottom-6 w-[1.5px] bg-[#F1F5F9] dark:bg-slate-800"></div>
              {SIDEBAR_PAPERS.map((paper) => (
                <div
                  key={paper.id}
                  onClick={() => openPaper(paper)}
                  className="flex items-center gap-6 group cursor-pointer relative z-10 transition-all hover:translate-x-1"
                >
                  <div className="w-[68px] h-[68px] rounded-[26px] bg-white dark:bg-slate-900 border border-[#F1F5F9] dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-[44px] h-[44px] rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/50 border border-[#EDF2F7] dark:border-slate-700 flex items-center justify-center">
                      <FileText size={22} className={paper.color} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-black text-[#6366F1] dark:text-indigo-400 group-hover:text-indigo-700 transition-colors line-clamp-2 leading-[1.3] tracking-tighter uppercase italic">{paper.title}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-2 uppercase tracking-widest">{paper.journal} • {paper.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* PAPER READER MODAL */}
      {isReadingPaper && selectedPaper && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-0 md:p-10">
          <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setIsReadingPaper(false)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-full md:h-[90vh] md:rounded-[48px] overflow-hidden relative z-[6010] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
            <div className="w-full md:w-[320px] bg-[#F8FAFC] dark:bg-slate-800/60 p-10 flex flex-col items-start border-r border-slate-100 dark:border-slate-800 shrink-0">
              <div className="space-y-6 w-full mb-12">
                <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_15px_35px_rgba(0,0,0,0.06)] flex items-center justify-center">
                  <FileText size={42} className={selectedPaper.color} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-[#6366F1] uppercase tracking-[0.4em]">Scientific Journal</h4>
                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mt-1 italic uppercase leading-tight">{selectedPaper.journal}</p>
                </div>
              </div>
              <div className="w-full border-t border-slate-200 dark:border-slate-700 pt-10 space-y-10">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Lead Investigator</p>
                  <div className="flex items-center gap-4 mt-5">
                    <div className="w-12 h-12 bg-[#6366F1] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100 dark:shadow-none">{selectedPaper.authorInitial}</div>
                    <p className="text-[15px] font-black text-slate-900 dark:text-white leading-tight">{selectedPaper.author}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Publication Date</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white mt-4 flex items-center gap-3">
                    <CalendarIcon size={18} className="text-[#6366F1]" /> {selectedPaper.date}
                  </p>
                </div>
              </div>
              <div className="mt-auto w-full pt-12">
                <button onClick={handleDownloadHandout} className="w-full py-5 bg-[#6366F1] text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-200 active:scale-95 transition-all">
                  <Download size={18} /> FULL PDF HANDOUT
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-slate-900 relative">
              <div className="flex items-center justify-between p-8 border-b border-slate-50 dark:border-slate-800">
                <h5 className="text-[10px] font-black text-[#6366F1] uppercase tracking-[0.4em]">Section Highlights</h5>
                <button onClick={() => setIsReadingPaper(false)} className="p-3 bg-[#F8FAFC] dark:bg-slate-800 hover:bg-rose-500 hover:text-white rounded-2xl text-slate-400 transition-all shadow-sm active:scale-90 group"><X size={24} className="group-hover:rotate-90 transition-transform" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 md:p-16 scrollbar-hide space-y-20">
                <section className="space-y-6">
                  <h5 className="text-[11px] font-black text-[#6366F1] uppercase tracking-[0.4em]">01. Executive Abstract</h5>
                  <p className="text-slate-700 dark:text-slate-300 text-xl leading-relaxed font-medium tracking-tight">{selectedPaper.content.abstract}</p>
                </section>
                <section className="space-y-6">
                  <h5 className="text-[11px] font-black text-[#6366F1] uppercase tracking-[0.4em]">05. Advantages</h5>
                  <div className="p-12 border-l-[6px] border-[#6366F1] bg-[#F8FAFC] dark:bg-slate-800/20 rounded-r-[40px]">
                    <p className="text-slate-700 dark:text-slate-300 text-2xl italic leading-relaxed font-medium tracking-tight">"{selectedPaper.content.advantages}"</p>
                  </div>
                </section>
                <section className="space-y-6">
                  <h5 className="text-[11px] font-black text-[#6366F1] uppercase tracking-[0.4em]">06. Conclusion</h5>
                  <p className="text-slate-600 dark:text-slate-400 text-xl leading-relaxed font-medium tracking-tight">{selectedPaper.content.conclusion}</p>
                </section>
                <div className="pt-20 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60 italic">DOI: 10.1038/NPHYS.INNOSPHERE.2024.0122</p>
                  <div className="flex gap-4">
                    <button onClick={handleShare} className="p-4 bg-[#F8FAFC] dark:bg-slate-800 text-slate-500 rounded-[24px] hover:bg-[#6366F1] hover:text-white transition-all shadow-sm active:scale-90"><Share2 size={24} /></button>
                    <button onClick={(e) => toggleSave(e, selectedPaper.id)} className={`p-4 rounded-[24px] transition-all shadow-sm active:scale-90 ${watchList.has(selectedPaper.id) ? 'bg-[#6366F1] text-white' : 'bg-[#F8FAFC] dark:bg-slate-800 text-slate-500 hover:bg-[#6366F1] hover:text-white'}`}><Bookmark size={24} fill={watchList.has(selectedPaper.id) ? 'currentColor' : 'none'} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT DETAIL MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-0 md:p-10">
          <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setSelectedProject(null)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-full md:h-auto md:max-h-[85vh] md:rounded-[48px] overflow-hidden relative z-[6010] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
            <div className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-800/60 p-10 flex flex-col items-start border-r border-slate-100 dark:border-slate-800 shrink-0">
              <div className="space-y-6 w-full mb-8">
                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
                  <FlaskConical size={32} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Project Detail</h4>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mt-1 italic uppercase leading-tight">{selectedProject.title}</h3>
                </div>
              </div>
              <div className="w-full space-y-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-indigo-500" />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{selectedProject.institution}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-indigo-500" />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{selectedProject.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap size={18} className="text-indigo-500" />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Phase: {selectedProject.stage}</span>
                </div>
              </div>
              <div className="mt-auto w-full pt-10">
                <button onClick={handleDownloadHandout} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-95 transition-all">
                  <Download size={18} /> EXPORT DATA SHEET
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-slate-900 relative">
              <div className="flex items-center justify-between p-8 border-b border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded-lg uppercase tracking-widest border border-emerald-100">Verified Node</span>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black rounded-lg uppercase tracking-widest border border-indigo-100">{selectedProject.field}</span>
                </div>
                <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-rose-500 hover:text-white rounded-xl text-slate-400 transition-all active:scale-90"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 scrollbar-hide space-y-12">
                <section className="space-y-4">
                  <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Project Description</h5>
                  <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-medium">{selectedProject.description}</p>
                </section>
                <section className="space-y-4">
                  <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">InnoSphere Status</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[24px] border border-slate-100 dark:border-slate-800">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Collaboration Index</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{selectedProject.progress}% Optimized</p>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[24px] border border-slate-100 dark:border-slate-800">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Code</p>
                      <p className="text-2xl font-black text-emerald-600 uppercase">{selectedProject.status}</p>
                    </div>
                  </div>
                </section>
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                  <button onClick={(e) => handleCollaborationRequest(e, selectedProject.id, selectedProject.title)} className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100">
                    {requestPending.has(selectedProject.id) ? 'COLLAB PENDING' : 'SEND COLLAB LINK'}
                  </button>
                  <div className="flex gap-4">
                    <button onClick={handleShare} className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-[24px] hover:bg-indigo-600 hover:text-white transition-all active:scale-90"><Share2 size={20} /></button>
                    <button onClick={(e) => toggleSave(e, selectedProject.id)} className={`p-4 rounded-[24px] transition-all active:scale-90 ${watchList.has(selectedProject.id) ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-indigo-600 hover:text-white'}`}><Bookmark size={20} fill={watchList.has(selectedProject.id) ? 'currentColor' : 'none'} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POST RESEARCH SUBMISSION WIZARD */}
      {showPostModal && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setShowPostModal(false)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[48px] shadow-[0_0_120px_rgba(0,0,0,0.5)] border border-white dark:border-slate-800 overflow-hidden relative z-[9010] animate-in zoom-in-95 duration-300">
            <div className="p-12 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Submit Research Need</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Stage {postStep} of 3</p>
                </div>
                <button onClick={() => setShowPostModal(false)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-all active:scale-90">
                  <X size={20} />
                </button>
              </div>

              {/* Steps Progress */}
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${postStep >= i ? 'bg-[#6366F1]' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
                ))}
              </div>

              <div className="min-h-[300px]">
                {postStep === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Project Identifier</label>
                      <input
                        type="text"
                        value={newProjectData.title}
                        onChange={(e) => setNewProjectData({ ...newProjectData, title: e.target.value })}
                        placeholder="e.g. Adaptive Mesh Optimization"
                        className="w-full p-5 bg-[#F8FAFC] dark:bg-slate-800 border-none rounded-[24px] text-[15px] font-bold focus:ring-4 ring-indigo-50 dark:ring-indigo-900/20 outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Core Domain</label>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.filter(c => c !== 'All').map(c => (
                          <button
                            key={c}
                            onClick={() => setNewProjectData({ ...newProjectData, field: c })}
                            className={`p-4 rounded-[20px] border text-[11px] font-black uppercase tracking-widest transition-all text-left flex justify-between items-center ${newProjectData.field === c ? 'bg-[#6366F1] border-[#6366F1] text-white shadow-xl shadow-indigo-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400'}`}
                          >
                            {c} {newProjectData.field === c && <CheckCircle2 size={16} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {postStep === 2 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Hosting Institution</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          value={newProjectData.institution}
                          onChange={(e) => setNewProjectData({ ...newProjectData, institution: e.target.value })}
                          placeholder="e.g. Stanford R&D Lab"
                          className="w-full pl-12 pr-5 py-5 bg-[#F8FAFC] dark:bg-slate-800 border-none rounded-[24px] text-[15px] font-bold focus:ring-4 ring-indigo-50 outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Geographic Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          value={newProjectData.location}
                          onChange={(e) => setNewProjectData({ ...newProjectData, location: e.target.value })}
                          placeholder="e.g. San Francisco, CA"
                          className="w-full pl-12 pr-5 py-5 bg-[#F8FAFC] dark:bg-slate-800 border-none rounded-[24px] text-[15px] font-bold focus:ring-4 ring-indigo-50 outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {postStep === 3 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Technical Requirements & Description</label>
                      <textarea
                        rows={6}
                        value={newProjectData.description}
                        onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
                        placeholder="Detail the technical milestones and required collaborative expertise..."
                        className="w-full p-5 bg-[#F8FAFC] dark:bg-slate-800 border-none rounded-[24px] text-[15px] font-bold focus:ring-4 ring-indigo-50 outline-none text-slate-900 dark:text-white resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-[20px] border border-emerald-100 dark:border-emerald-800">
                      <Info size={20} className="text-emerald-600" />
                      <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Submission will trigger an automatic verification protocol by the board.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-8 border-t border-slate-50 dark:border-slate-800">
                {postStep > 1 && (
                  <button
                    onClick={() => setPostStep(prev => prev - 1)}
                    className="px-10 py-5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-[11px] rounded-[24px] uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  disabled={postStep === 1 && !newProjectData.title}
                  onClick={() => postStep < 3 ? setPostStep(prev => prev + 1) : handlePostSubmit()}
                  className="flex-1 py-5 bg-[#6366F1] text-white font-black text-[11px] rounded-[24px] uppercase tracking-widest hover:bg-[#4F46E5] shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {postStep === 3 ? (
                    <><CheckCircle2 size={18} /> Finalize & Publish</>
                  ) : (
                    <><ArrowRight size={18} /> Continue Sequence</>
                  )}
                </button>
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

export default Research;
