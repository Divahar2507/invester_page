
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  ListFilter, 
  Maximize2, 
  Plus, 
  Minus, 
  Navigation, 
  Layers,
  ArrowRight,
  Video,
  Mail,
  PhoneCall,
  ChevronRight,
  TrendingUp,
  X,
  CheckCircle2,
  Globe,
  Loader2,
  Cpu,
  ShieldCheck,
  Zap,
  FileText,
  Activity,
  HardDrive,
  Network,
  User,
  Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { TECH_PARKS } from '../constants';

const TechParks: React.FC = () => {
  const [selectedPark, setSelectedPark] = useState(TECH_PARKS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourLoading, setTourLoading] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showSpecsOverlay, setShowSpecsOverlay] = useState(false);
  
  // Immersive View State
  const [activeView, setActiveView] = useState('CORE LAB');

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const filteredParks = useMemo(() => {
    return TECH_PARKS.filter(park => {
      const matchesSearch = park.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           park.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || 
                           park.tags.some(tag => tag.toLowerCase().includes(activeFilter.toLowerCase()));
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const handleVirtualTour = () => {
    setTourLoading(true);
    setIsTourOpen(true);
    // Establish telemetry connection simulation
    setTimeout(() => setTourLoading(false), 1200);
  };

  const handleAction = (type: 'email' | 'call' | 'specs') => {
    if (type === 'email') triggerToast(`Secure inquiry channel opened for ${selectedPark.name}`);
    if (type === 'call') triggerToast(`Dialing InnoSphere Facility Hub...`);
    if (type === 'specs') {
      setShowSpecsOverlay(true);
      triggerToast(`Retrieving technical specs for ${activeView}...`);
    }
  };

  const handleDownloadDatasheet = () => {
    const viewInfo = viewData[activeView];
    triggerToast(`Generating high-fidelity datasheet for ${activeView}...`);
    
    try {
      const doc = new jsPDF();
      
      // Document Styling & Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('FACILITY TECHNICAL DATASHEET', 10, 25);
      
      doc.setFontSize(10);
      doc.text(`INNOSPHERE ECOSYSTEM - DOCUMENT ID: INNO-SPEC-${selectedPark.id}`, 10, 32);
      
      // Basic Info
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.text('I. GENERAL INFORMATION', 10, 55);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Facility Name: ${selectedPark.name}`, 10, 65);
      doc.text(`Location: ${selectedPark.location}`, 10, 72);
      doc.text(`Node Identifier: ${activeView}`, 10, 79);
      doc.text(`Generated Date: ${new Date().toLocaleString()}`, 10, 86);
      
      // Architectural Overview
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('II. ARCHITECTURAL OVERVIEW', 10, 105);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const splitDesc = doc.splitTextToSize(viewInfo.desc, 190);
      doc.text(splitDesc, 10, 115);
      
      // Technical Specifications
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('III. TECHNICAL SPECIFICATIONS', 10, 140);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      let currentY = 150;
      viewInfo.specs.forEach(spec => {
        doc.text(`• ${spec.label}: ${spec.value}`, 15, currentY);
        currentY += 8;
      });
      
      // Compliance
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('IV. COMPLIANCE & STATUS', 10, 185);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('• ISO 9001:2015 Verified', 15, 195);
      doc.text('• Tier III Power Redundancy Standard', 15, 202);
      doc.text('• Link Status: Active / Optimized', 15, 209);
      doc.text('• Uptime Rating: 99.999%', 15, 216);
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('RESTRICTED INFORMATION - AUTHORIZED PERSONNEL ONLY', 105, 280, { align: 'center' });
      
      const fileName = `${selectedPark.name.replace(/\s+/g, '_')}_${activeView.replace(/\s+/g, '_')}_Datasheet.pdf`;
      doc.save(fileName);
      
      setShowSpecsOverlay(false);
      triggerToast("Technical Datasheet Downloaded Successfully");
    } catch (error) {
      console.error("PDF generation failed:", error);
      triggerToast("PDF Engine error. System recovery in progress.");
    }
  };

  const getMarkerPos = (id: string) => {
    const positions: Record<string, { top: string, left: string }> = {
      '1': { top: '35%', left: '42%' },
      '2': { top: '55%', left: '28%' }
    };
    return positions[id] || { top: '50%', left: '50%' };
  };

  useEffect(() => {
    if (filteredParks.length > 0 && !filteredParks.find(p => p.id === selectedPark.id)) {
      setSelectedPark(filteredParks[0]);
    }
  }, [filteredParks]);

  const viewData: Record<string, { desc: string, icon: any, color: string, specs: any[] }> = {
    'CORE LAB': {
      desc: '"The 4K visualization allows for remote facility inspections and strategic floor planning for member labs."',
      icon: Cpu,
      color: 'bg-[#928163]',
      specs: [
        { label: 'Air Quality', value: 'ISO Class 7', icon: Activity },
        { label: 'Compute', value: '8x A100 Nodes', icon: HardDrive },
        { label: 'Power Redundancy', value: 'Tier III', icon: Zap }
      ]
    },
    'FABRICATION': {
      desc: '"Advanced fabrication node monitoring with real-time CNC telemetry and environmental sensor aggregation."',
      icon: Zap,
      color: 'bg-[#4B6F77]',
      specs: [
        { label: 'CNC Precision', value: '±0.005mm', icon: Activity },
        { label: 'Material Feed', icon: HardDrive, value: 'Automated 5-Axis' },
        { label: 'Throughput', value: '12 Units/Hr', icon: Network }
      ]
    },
    'SECURITY HUB': {
      desc: '"Tier-4 biometric security checkpoints and automated surveillance protocols for highly sensitive research assets."',
      icon: ShieldCheck,
      color: 'bg-[#313B4E]',
      specs: [
        { label: 'Encryption', value: 'AES-256 Quantum', icon: ShieldCheck },
        { label: 'Monitoring', value: '360° LiDAR', icon: Activity },
        { label: 'Access Control', value: 'Retinal/Palm', icon: User }
      ]
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] bg-slate-900 dark:bg-indigo-600 text-white px-6 py-4 rounded-[20px] shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">{showToast}</span>
        </div>
      )}

      {/* Main Dashboard UI */}
      <div className="bg-white dark:bg-slate-900 p-8 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-8 items-center rounded-t-[44px] shadow-sm z-20">
        <div className="relative flex-1 min-w-[320px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specialized hubs..." 
            className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-transparent rounded-[28px] text-[15px] font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all dark:text-white"
          />
        </div>
        <div className="flex gap-3">
          {['All', 'Cleanrooms', 'CNC', 'Incubator'].map((filter) => (
            <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={`px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest border transition-all whitespace-nowrap active:scale-95 ${activeFilter === filter ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[400px] border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col overflow-y-auto p-8 space-y-6">
          <div className="flex items-center justify-between px-2">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Facility Directory</span>
             <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase">
                <Globe size={14} /> LIVE: {filteredParks.length}
             </div>
          </div>
          {filteredParks.map((park) => (
            <div 
              key={park.id}
              onClick={() => setSelectedPark(park)}
              className={`p-6 bg-white dark:bg-slate-900 rounded-[36px] border transition-all cursor-pointer active:scale-[0.98] ${selectedPark.id === park.id ? 'border-indigo-500 ring-4 ring-indigo-50 dark:ring-indigo-900/20 shadow-2xl' : 'border-slate-50 dark:border-slate-800 hover:border-indigo-200'}`}
            >
              <div className="flex gap-6">
                <img src={park.image} className="w-20 h-20 rounded-[24px] object-cover" alt="" />
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                  <h4 className="font-black text-slate-900 dark:text-white text-lg truncate uppercase italic tracking-tighter leading-none mb-2">{park.name}</h4>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={12} className="text-indigo-500" /> {park.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop')] bg-cover opacity-20 contrast-125"></div>
          
          {filteredParks.map((park) => {
            const pos = getMarkerPos(park.id);
            const isActive = selectedPark.id === park.id;
            return (
              <div 
                key={park.id}
                style={{ top: pos.top, left: pos.left }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                onClick={() => setSelectedPark(park)}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isActive ? 'bg-indigo-600 text-white scale-125 ring-8 ring-indigo-500/20' : 'bg-white dark:bg-slate-900 text-slate-400'}`}>
                  <MapPin size={isActive ? 32 : 24} />
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-10 left-10 w-[440px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[48px] shadow-2xl overflow-hidden border border-white/20">
            <div className="h-56 overflow-hidden">
               <img src={selectedPark.image} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="p-10 space-y-8">
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">{selectedPark.name}</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-4"><MapPin size={16} className="text-indigo-500" /> {selectedPark.location}</p>
              </div>
              <button 
                onClick={handleVirtualTour}
                className="w-full py-6 bg-indigo-600 text-white font-black text-[13px] rounded-[28px] shadow-xl flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all uppercase tracking-[0.2em] active:scale-95"
              >
                <Video size={20} /> Virtual Tour
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIRTUAL TOUR MODAL - MATCHES SCREENSHOT EXACTLY */}
      {isTourOpen && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => { setIsTourOpen(false); setShowSpecsOverlay(false); }}></div>
          
          <div className="bg-black w-full h-full md:rounded-[64px] overflow-hidden relative z-[9010] shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/10 flex flex-col animate-in zoom-in-95 duration-500">
            
            {/* Immersive View Background */}
            <div className="absolute inset-0">
               <img 
                 src={selectedPark.image} 
                 className={`w-full h-full object-cover transition-all duration-[3000ms] ${tourLoading ? 'scale-110 blur-3xl opacity-50' : 'scale-100 blur-0 opacity-40'}`} 
                 alt="" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            </div>

            {tourLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-8 z-10">
                 <Loader2 size={64} className="text-indigo-500 animate-spin" />
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Initializing Telemetry</h3>
                    <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.5em] animate-pulse">Establishing Immersive Node</p>
                 </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col justify-between p-12 md:p-20 z-10 animate-in fade-in duration-1000">
                 
                 {/* Top Header Row */}
                 <div className="flex items-start justify-between">
                    <div className="space-y-6">
                       <span className="px-4 py-2 bg-[#F43F5E] text-white text-[10px] font-black rounded-lg uppercase tracking-widest leading-none shadow-2xl border border-white/20">LIVE IMMERSIVE</span>
                       <div className="space-y-2">
                          <h3 className="text-6xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                            {selectedPark.name.toUpperCase()}
                          </h3>
                          <div className="flex items-center gap-3 text-white/50 text-sm font-black uppercase tracking-[0.3em] mt-4">
                            <MapPin size={20} className="text-indigo-400" /> {selectedPark.location.toUpperCase()}
                          </div>
                       </div>
                    </div>
                    
                    <button 
                      onClick={() => { setIsTourOpen(false); setShowSpecsOverlay(false); }} 
                      className="w-20 h-20 bg-white/5 hover:bg-rose-600 backdrop-blur-3xl rounded-[28px] text-white flex items-center justify-center transition-all border border-white/10 active:scale-90 group shadow-2xl"
                    >
                       <X size={44} className="group-hover:rotate-90 transition-transform stroke-[3px]" />
                    </button>
                 </div>

                 {/* Bottom Navigation Layer - Matches the provided design layout */}
                 <div className="flex flex-col md:flex-row items-end justify-between gap-12">
                    
                    {/* Facility View Switcher Buttons */}
                    <div className="flex gap-5">
                       {Object.keys(viewData).map((key) => {
                         const view = viewData[key];
                         const isActive = activeView === key;
                         return (
                           <button 
                             key={key} 
                             onClick={() => { setActiveView(key); triggerToast(`Stream Node Switched: ${key}`); }}
                             className={`px-12 py-8 rounded-[40px] backdrop-blur-3xl border transition-all hover:scale-105 active:scale-95 group shadow-2xl flex items-center gap-5 ${isActive ? view.color + '/60 border-white/30 ring-2 ring-white/10' : 'bg-white/5 border-white/10'}`}
                           >
                             <view.icon size={28} className={`transition-all ${isActive ? 'text-white' : 'text-indigo-400 group-hover:scale-110'}`} />
                             <span className="text-[14px] font-black uppercase tracking-[0.3em] text-white whitespace-nowrap">{key}</span>
                           </button>
                         );
                       })}
                    </div>
                    
                    {/* Facility Detail Card - The right-side "Facility Optimized" component */}
                    <div className="bg-[#0A0D12]/70 backdrop-blur-[40px] p-12 rounded-[56px] border border-white/10 max-w-[540px] space-y-8 shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-right-12 duration-1000 relative">
                       {showSpecsOverlay && (
                         <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl rounded-[56px] z-20 p-10 flex flex-col justify-between border border-indigo-500/20 animate-in zoom-in-95">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em]">TECHNICAL VAULT</h4>
                              <button onClick={() => setShowSpecsOverlay(false)} className="p-2 text-slate-500 hover:text-white"><X size={20} /></button>
                            </div>
                            <div className="space-y-4">
                              {viewData[activeView].specs.map((spec, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                  <div className="flex items-center gap-3">
                                    <spec.icon size={16} className="text-indigo-500" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                                  </div>
                                  <span className="text-xs font-black text-white">{spec.value}</span>
                                </div>
                              ))}
                            </div>
                            <button 
                              onClick={handleDownloadDatasheet}
                              className="w-full py-5 bg-[#6366F1] text-white rounded-full text-[12px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-[#5255E3] transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                            >
                              <Download size={18} /> DOWNLOAD DATASHEET
                            </button>
                         </div>
                       )}

                       <div className="flex items-center justify-end gap-4 text-[#10B981]">
                          <CheckCircle2 size={20} className="stroke-[3px]" />
                          <span className="text-[11px] font-black uppercase tracking-[0.3em]">FACILITY OPTIMIZED</span>
                       </div>
                       
                       <p className="text-slate-200 text-xl md:text-2xl font-medium leading-relaxed italic text-right drop-shadow-lg">
                         {viewData[activeView].desc}
                       </p>
                       
                       <div className="flex justify-end pt-6">
                          <button 
                            onClick={() => handleAction('specs')}
                            className="text-white hover:text-indigo-400 font-black text-[13px] uppercase tracking-[0.4em] flex items-center gap-4 transition-all group"
                          >
                            ACCESS SPECS 
                            <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform stroke-[4px]" />
                          </button>
                       </div>
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
      `}</style>
    </div>
  );
};

export default TechParks;
