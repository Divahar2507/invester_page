
import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    Target,
    Map as MapIcon,
    Lightbulb,
    FileText,
    Users,
    TrendingUp,
    CheckCircle2,
    Search,
    ArrowRight,
    Plus,
    BarChart3,
    Globe,
    Loader2,
    ChevronRight,
    X,
    Save,
    Download
} from 'lucide-react';
import {
    fetchStartups,
    createStartup,
    fetchStartupResearch,
    addCompetitor,
    addCustomer,
    updateMarketSize,
    updateProblemSolution,
    addResearchNote
} from '../src/services/researchEngine';
import { jsPDF } from 'jspdf';

const ResearchEngine = () => {
    const [startups, setStartups] = useState([]);
    const [selectedStartupId, setSelectedStartupId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [researchData, setResearchData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // overview, competitors, customers, market, problem
    const [showNewStartupModal, setShowNewStartupModal] = useState(false);
    const [newStartupName, setNewStartupName] = useState('');
    const [showToast, setShowToast] = useState(null);

    // Form States
    const [competitorForm, setCompetitorForm] = useState({ name: '', website: '', description: '', strengths: '', weaknesses: '' });
    const [customerForm, setCustomerForm] = useState({ segment: '', pain_points: '', current_solution: '' });
    const [marketForm, setMarketForm] = useState({ tam: '', sam: '', som: '', source: '' });
    const [problemForm, setProblemForm] = useState({ problem: '', existing_solutions: '', gap: '', proposed_solution: '' });
    const [noteForm, setNoteForm] = useState('');

    const triggerToast = (msg) => {
        setShowToast(msg);
        setTimeout(() => setShowToast(null), 3000);
    };

    useEffect(() => {
        loadStartups();
    }, []);

    useEffect(() => {
        if (selectedStartupId) {
            loadStartupResearch(selectedStartupId);
        }
    }, [selectedStartupId]);

    const loadStartups = async () => {
        try {
            const data = await fetchStartups();
            setStartups(data);
            if (data.length > 0 && !selectedStartupId) {
                setSelectedStartupId(data[0].id);
            }
        } catch (error) {
            console.error("Failed to load startups:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadStartupResearch = async (id) => {
        setLoading(true);
        try {
            const data = await fetchStartupResearch(id);
            setResearchData(data);
            if (data.market_size) setMarketForm(data.market_size);
            if (data.problem_solution_fit) setProblemForm(data.problem_solution_fit);
        } catch (error) {
            console.error("Failed to load research:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStartup = async () => {
        if (!newStartupName) return;
        try {
            const newStartup = await createStartup({ name: newStartupName, industry: 'General', description: 'New Project' });
            setStartups([...startups, newStartup]);
            setSelectedStartupId(newStartup.id);
            setShowNewStartupModal(false);
            setNewStartupName('');
            triggerToast("New Research Workspace Initialized");
        } catch (error) {
            console.error("Create failed:", error);
        }
    };

    const handleAddCompetitor = async () => {
        try {
            await addCompetitor(selectedStartupId, competitorForm);
            triggerToast("Competitor Added");
            setCompetitorForm({ name: '', website: '', description: '', strengths: '', weaknesses: '' });
            loadStartupResearch(selectedStartupId); // Refresh to update score
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddCustomer = async () => {
        try {
            await addCustomer(selectedStartupId, customerForm);
            triggerToast("Customer Segment Added");
            setCustomerForm({ segment: '', pain_points: '', current_solution: '' });
            loadStartupResearch(selectedStartupId);
        } catch (e) { console.error(e); }
    };

    const handleUpdateMarket = async () => {
        try {
            await updateMarketSize(selectedStartupId, marketForm);
            triggerToast("Market Data Updated");
            loadStartupResearch(selectedStartupId);
        } catch (e) { console.error(e); }
    };

    const handleUpdateProblem = async () => {
        try {
            await updateProblemSolution(selectedStartupId, problemForm);
            triggerToast("Problem-Solution Fit Updated");
            loadStartupResearch(selectedStartupId);
        } catch (e) { console.error(e); }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-rose-500';
    };

    const handleExportPDF = () => {
        if (!researchData) return;
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text(`Research Report: ${researchData.startup.name}`, 10, 20);

        doc.setFontSize(12);
        doc.text(`Research Score: ${researchData.score}/100`, 10, 30);

        let y = 40;

        if (researchData.problem_solution_fit) {
            doc.setFontSize(14);
            doc.text("Problem-Solution Fit", 10, y);
            y += 10;
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            const problem = doc.splitTextToSize(`Problem: ${researchData.problem_solution_fit.problem}`, 180);
            doc.text(problem, 10, y);
            y += problem.length * 5;
            const solution = doc.splitTextToSize(`Solution: ${researchData.problem_solution_fit.proposed_solution}`, 180);
            doc.text(solution, 10, y);
            y += solution.length * 5 + 10;
        }

        if (researchData.market_size) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("Market Opportunity", 10, y);
            y += 10;
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`TAM: ${researchData.market_size.tam}`, 10, y);
            y += 7;
            doc.text(`SAM: ${researchData.market_size.sam}`, 10, y);
            y += 7;
            doc.text(`SOM: ${researchData.market_size.som}`, 10, y);
            y += 15;
        }

        doc.save(`${researchData.startup.name}_Research_Report.pdf`);
        triggerToast("Research Report Downloaded");
    };

    if (loading && !researchData) return <div className="h-screen flex items-center justify-center text-indigo-600 font-black animate-pulse">LOADING ENGINE...</div>;

    return (
        <div className="space-y-8 animate-in fade-in pb-20">
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[8000] bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-widest">{showToast}</span>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Research Engine</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">"Think before you build" System</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            value={selectedStartupId || ''}
                            onChange={(e) => setSelectedStartupId(Number(e.target.value))}
                            className="appearance-none bg-white dark:bg-slate-800 border-none px-6 py-3 pr-10 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg min-w-[200px] focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            {startups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronRight size={14} className="rotate-90 text-slate-400" />
                        </div>
                    </div>
                    <button
                        onClick={() => setShowNewStartupModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl shadow-lg transition-all active:scale-95"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {researchData && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation for Research Modules */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-800 text-center">
                            <div className="relative inline-flex items-center justify-center">
                                <svg className="w-32 h-32">
                                    <circle cx="64" cy="64" r="58" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                                    <circle cx="64" cy="64" r="58" fill="none" stroke={researchData.score >= 80 ? '#10b981' : researchData.score >= 50 ? '#f59e0b' : '#f43f5e'} strokeWidth="8" strokeDasharray="364" strokeDashoffset={364 - (364 * researchData.score) / 100} className="transition-all duration-1000 ease-out" transform="rotate(-90 64 64)" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-3xl font-black ${getScoreColor(researchData.score)}`}>{researchData.score}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
                                </div>
                            </div>
                            <button onClick={handleExportPDF} className="w-full mt-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90">
                                <Download size={14} /> Export Report
                            </button>
                        </div>

                        <nav className="space-y-2">
                            {[
                                { id: 'overview', label: 'Overview', icon: BarChart3 },
                                { id: 'problem', label: 'Problem Fix', icon: Target },
                                { id: 'competitors', label: 'Competitors', icon: ShieldCheck },
                                { id: 'customers', label: 'Customers', icon: Users },
                                { id: 'market', label: 'Market Size', icon: Globe },
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    <item.icon size={18} /> {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* PROBLEM SOLUTION FIT */}
                        {activeTab === 'problem' && (
                            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-right-8 duration-500">
                                <h2 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3"><Target className="text-indigo-500" /> Problem-Solution Fit</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">The Problem</label>
                                        <textarea
                                            value={problemForm.problem}
                                            onChange={(e) => setProblemForm({ ...problemForm, problem: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                                            rows={3}
                                            placeholder="Describe the painful problem..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Existing Solutions</label>
                                        <textarea
                                            value={problemForm.existing_solutions}
                                            onChange={(e) => setProblemForm({ ...problemForm, existing_solutions: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                                            rows={2}
                                            placeholder="How do people solve it now?"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">The Gap</label>
                                        <textarea
                                            value={problemForm.gap}
                                            onChange={(e) => setProblemForm({ ...problemForm, gap: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                                            rows={2}
                                            placeholder="Why do existing solutions fail?"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Our Solution</label>
                                        <textarea
                                            value={problemForm.proposed_solution}
                                            onChange={(e) => setProblemForm({ ...problemForm, proposed_solution: e.target.value })}
                                            className="w-full bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none border border-indigo-100 dark:border-indigo-800"
                                            rows={3}
                                            placeholder="Your unique value proposition..."
                                        />
                                    </div>
                                    <button onClick={handleUpdateProblem} className="bg-slate-900 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 flex items-center gap-2">
                                        <Save size={14} /> Save Framework
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* COMPETITORS */}
                        {activeTab === 'competitors' && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800">
                                    <h2 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3"><ShieldCheck className="text-rose-500" /> Competitor Analysis</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        <input placeholder="Competitor Name" value={competitorForm.name} onChange={e => setCompetitorForm({ ...competitorForm, name: e.target.value })} className="bg-slate-50 p-4 rounded-xl text-sm font-bold outline-none" />
                                        <input placeholder="Website" value={competitorForm.website} onChange={e => setCompetitorForm({ ...competitorForm, website: e.target.value })} className="bg-slate-50 p-4 rounded-xl text-sm font-bold outline-none" />
                                        <input placeholder="Strengths" value={competitorForm.strengths} onChange={e => setCompetitorForm({ ...competitorForm, strengths: e.target.value })} className="bg-slate-50 p-4 rounded-xl text-sm font-bold outline-none" />
                                        <input placeholder="Weaknesses" value={competitorForm.weaknesses} onChange={e => setCompetitorForm({ ...competitorForm, weaknesses: e.target.value })} className="bg-slate-50 p-4 rounded-xl text-sm font-bold outline-none" />
                                        <div className="col-span-2">
                                            <button onClick={handleAddCompetitor} className="w-full bg-rose-500 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600">Add Competitor</button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {researchData.competitors.length === 0 && <p className="text-center text-slate-400 italic">No competitors tracked yet.</p>}
                                        {researchData.competitors.map(comp => (
                                            <div key={comp.id} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-6">
                                                <div className="flex-1">
                                                    <h3 className="font-black text-lg">{comp.name}</h3>
                                                    <a href={comp.website} target="_blank" className="text-indigo-500 text-xs font-bold hover:underline">{comp.website}</a>
                                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{comp.description}</p>
                                                </div>
                                                <div className="flex-1 space-y-2 text-xs">
                                                    <div className="flex gap-2"><span className="font-black text-emerald-500 uppercase">Strong:</span> {comp.strengths}</div>
                                                    <div className="flex gap-2"><span className="font-black text-rose-500 uppercase">Weak:</span> {comp.weaknesses}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* OVERVIEW / DASHBOARD */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-8 duration-500">
                                <div onClick={() => setActiveTab('market')} className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[32px] text-white cursor-pointer shadow-xl hover:scale-[1.02] transition-transform">
                                    <Globe size={40} className="mb-6 opacity-80" />
                                    <h3 className="text-3xl font-black mb-1">{researchData.market_size?.tam || '---'}</h3>
                                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">Total Addressable Market</p>
                                </div>
                                <div onClick={() => setActiveTab('competitors')} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 cursor-pointer shadow-xl hover:scale-[1.02] transition-transform">
                                    <ShieldCheck size={40} className="mb-6 text-rose-500" />
                                    <h3 className="text-3xl font-black mb-1 text-slate-900 dark:text-white">{researchData.competitors.length}</h3>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Tracked Competitors</p>
                                </div>
                                <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl">
                                    <h3 className="font-black text-lg uppercase italic mb-4">Research Roadmap</h3>
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Problem</span>
                                        <span>Competitors</span>
                                        <span>Market</span>
                                        <span>Customers</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: `${researchData.score}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MARKET SIZE */}
                        {activeTab === 'market' && (
                            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-right-8 duration-500">
                                <h2 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3"><Globe className="text-emerald-500" /> Market Sizing</h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl text-center">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">TAM (Total)</h4>
                                            <input value={marketForm.tam} onChange={e => setMarketForm({ ...marketForm, tam: e.target.value })} className="w-full bg-transparent text-center font-black text-xl outline-none" placeholder="$0B" />
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl text-center">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">SAM (Serviceable)</h4>
                                            <input value={marketForm.sam} onChange={e => setMarketForm({ ...marketForm, sam: e.target.value })} className="w-full bg-transparent text-center font-black text-xl outline-none" placeholder="$0B" />
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl text-center">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">SOM (Obtainable)</h4>
                                            <input value={marketForm.som} onChange={e => setMarketForm({ ...marketForm, som: e.target.value })} className="w-full bg-transparent text-center font-black text-xl outline-none" placeholder="$0M" />
                                        </div>
                                    </div>
                                    <input value={marketForm.source} onChange={e => setMarketForm({ ...marketForm, source: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-sm font-bold outline-none" placeholder="Data Source / Link" />
                                    <button onClick={handleUpdateMarket} className="w-full bg-emerald-500 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600">Update Market Data</button>
                                </div>
                            </div>
                        )}

                        {/* CUSTOMERS */}
                        {activeTab === 'customers' && (
                            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-right-8 duration-500">
                                <h2 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3"><Users className="text-amber-500" /> Target Customers</h2>
                                <div className="grid grid-cols-1 gap-4 mb-8">
                                    <input placeholder="Customer Segment (e.g., Doctors)" value={customerForm.segment} onChange={e => setCustomerForm({ ...customerForm, segment: e.target.value })} className="bg-slate-50 p-4 rounded-xl text-sm font-bold outline-none" />
                                    <input placeholder="Pain Points" value={customerForm.pain_points} onChange={e => setCustomerForm({ ...customerForm, pain_points: e.target.value })} className="bg-slate-50 p-4 rounded-xl text-sm font-bold outline-none" />
                                    <button onClick={handleAddCustomer} className="w-full bg-amber-500 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-600">Add Segment</button>
                                </div>
                                <div className="space-y-4">
                                    {researchData.target_customers.map(cust => (
                                        <div key={cust.id} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-black text-lg">{cust.segment}</h3>
                                                <p className="text-sm text-slate-500">Pain: {cust.pain_points}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-full shadow-sm"><Users size={20} className="text-slate-400" /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* New Startup Modal */}
            {showNewStartupModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-[32px] shadow-2xl animate-in zoom-in-95">
                        <h2 className="text-2xl font-black uppercase italic mb-6">Start New Research</h2>
                        <input
                            autoFocus
                            placeholder="Startup Name"
                            value={newStartupName}
                            onChange={e => setNewStartupName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-lg font-bold outline-none mb-6 focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="flex gap-4">
                            <button onClick={() => setShowNewStartupModal(false)} className="flex-1 py-3 text-slate-500 font-bold uppercase text-xs">Cancel</button>
                            <button onClick={handleCreateStartup} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase text-xs">Initialize</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResearchEngine;
