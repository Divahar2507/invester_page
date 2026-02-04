
import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  MapPin,
  X,
  CheckCircle2,
  Globe,
  Loader2,
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  HardDrive,
  Network,
  User,
  Download,
  ArrowRight,
  Video
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { fetchTechParks } from '../src/services/api';

const TechParks: React.FC = () => {
  const [techParks, setTechParks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPark, setSelectedPark] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourLoading, setTourLoading] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showSpecsOverlay, setShowSpecsOverlay] = useState(false);
  const [activeView, setActiveView] = useState('CORE LAB');

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTechParks();
        setTechParks(data);
        if (data.length > 0) setSelectedPark(data[0]);
      } catch (error) {
        console.error("Failed to fetch tech parks:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredParks = useMemo(() => {
    return techParks.filter(park => {
      const matchesSearch = park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        park.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' ||
        (park.tags && park.tags.some((tag: string) => tag.toLowerCase().includes(activeFilter.toLowerCase())));
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter, techParks]);

  const handleVirtualTour = () => {
    setTourLoading(true);
    setIsTourOpen(true);
    setTimeout(() => setTourLoading(false), 1200);
  };

  const handleDownloadDatasheet = () => {
    if (!selectedPark) return;
    const viewInfo = viewData[activeView];
    triggerToast(`Generating high-fidelity datasheet for ${activeView}...`);

    try {
      const doc = new jsPDF();
      doc.setFillColor(15, 23, 42); doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.setFont('helvetica', 'bold');
      doc.text('FACILITY TECHNICAL DATASHEET', 10, 25);
      doc.text(`INNOSPHERE ECOSYSTEM - ID: ${selectedPark.id}`, 10, 32);
      doc.setTextColor(15, 23, 42); doc.text(`Facility Name: ${selectedPark.name}`, 10, 65);
      doc.save(`${selectedPark.name.replace(/\s+/g, '_')}_Datasheet.pdf`);
      setShowSpecsOverlay(false);
      triggerToast("Datasheet Downloaded");
    } catch (error) { triggerToast("Export failed."); }
  };

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

  if (loading) return <div className="h-screen flex items-center justify-center text-indigo-600 font-black">CONNECTING TO NODES...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] bg-slate-900 text-white px-6 py-4 rounded-[20px] shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">{showToast}</span>
        </div>
      )}

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
              className={`px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest border transition-all active:scale-95 ${activeFilter === filter ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'}`}
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
              className={`p-6 bg-white dark:bg-slate-900 rounded-[36px] border transition-all cursor-pointer active:scale-[0.98] ${selectedPark?.id === park.id ? 'border-indigo-500 ring-4 ring-indigo-50 dark:ring-indigo-900/20 shadow-2xl' : 'border-slate-50 dark:border-slate-800 hover:border-indigo-200'}`}
            >
              <div className="flex gap-6">
                <img src={park.image} className="w-20 h-20 rounded-[24px] object-cover" alt="" />
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                  <h4 className="font-black text-slate-900 dark:text-white text-lg truncate uppercase italic tracking-tighter leading-none mb-2">{park.name}</h4>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 font-black"><MapPin size={12} className="text-indigo-500" /> {park.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b')] bg-cover opacity-20 contrast-125"></div>

          {selectedPark && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[48px] shadow-2xl overflow-hidden border border-white/20 w-full max-w-lg">
                <img src={selectedPark.image} className="w-full h-64 object-cover" alt="" />
                <div className="p-10 space-y-8">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">{selectedPark.name}</h3>
                  <button onClick={handleVirtualTour} className="w-full py-6 bg-indigo-600 text-white font-black text-[13px] rounded-[28px] uppercase tracking-widest shadow-xl">Virtual Tour</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isTourOpen && selectedPark && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-0 md:p-8 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" onClick={() => setIsTourOpen(false)}></div>
          <div className="bg-[#0A0D12] w-full h-full md:rounded-[48px] overflow-hidden relative z-[6010] flex flex-col">
            <div className="flex-1 relative flex items-center justify-center">
              <img src={selectedPark.image} className="absolute inset-0 w-full h-full object-cover opacity-30" />
              <div className="relative z-20 text-center space-y-8">
                <h2 className="text-6xl font-black text-white uppercase italic">{selectedPark.name}</h2>
                <p className="text-indigo-400 text-xl font-black uppercase tracking-[0.4em]">{selectedPark.location}</p>
              </div>
              <button onClick={() => setIsTourOpen(false)} className="absolute top-8 right-8 p-4 bg-white/5 rounded-2xl text-white"><X size={28} /></button>
            </div>
            <div className="p-8 bg-black/40 border-t border-white/5 backdrop-blur-2xl flex justify-between items-center">
              <div className="flex gap-8">
                {Object.keys(viewData).map(key => (
                  <button key={key} onClick={() => setActiveView(key)} className={`text-[12px] font-black uppercase tracking-widest ${activeView === key ? 'text-white' : 'text-white/40'}`}>{key}</button>
                ))}
              </div>
              <button onClick={handleDownloadDatasheet} className="text-indigo-400 font-black text-[11px] uppercase tracking-widest flex items-center gap-2">Access Specs <ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechParks;
