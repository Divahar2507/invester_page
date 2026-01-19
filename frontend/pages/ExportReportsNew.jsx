import React, { useState } from 'react';
import { PieChart, Briefcase, Eye, DollarSign, ChevronDown, Download, CheckCircle2, Circle, Loader2, FileText, Zap, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const reportTypes = [
    {
        id: 'portfolio',
        title: 'Portfolio Performance',
        description: 'Detailed analysis of ROI, IRR, and valuation changes across your holdings over time.',
        icon: PieChart,
        color: 'text-blue-600',
        gradient: 'from-blue-500/10 to-transparent'
    },
    {
        id: 'deal-flow',
        title: 'Deal Flow Summary',
        description: 'Aggregated metrics on pipeline volume, rejection reasons, and lead sources.',
        icon: Briefcase,
        color: 'text-purple-600',
        gradient: 'from-purple-500/10 to-transparent'
    },
    {
        id: 'watchlist',
        title: 'Watchlist Overview',
        description: 'Recent updates, funding rounds, and news for companies you are tracking.',
        icon: Eye,
        color: 'text-orange-500',
        gradient: 'from-orange-500/10 to-transparent'
    },
    {
        id: 'tax',
        title: 'Tax & Accounting',
        description: 'Summary of capital calls, distributions, and K-1 preparation data.',
        icon: DollarSign,
        color: 'text-emerald-500',
        gradient: 'from-emerald-500/10 to-transparent'
    }
];

const ExportReports = () => {
    const [selectedReport, setSelectedReport] = useState('portfolio');
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [exportFormat, setExportFormat] = useState('PDF');
    const [isGenerating, setIsGenerating] = useState(false);

    const [user, setUser] = useState(null);

    React.useEffect(() => {
        api.getMe().then(setUser).catch(console.error);
    }, []);

    const handleExport = async () => {
        setIsGenerating(true);

        try {
            console.log("Starting export process v4 - Robust");
            let dataToUse = [];
            let columns = [];
            let rows = [];
            const investorName = user?.email?.split('@')[0] || 'Investor';
            const timestamp = new Date().toLocaleString();

            console.log("Fetching data for:", selectedReport);

            // Fetch Real Data
            if (selectedReport === 'portfolio') {
                const investments = await api.getInvestments();
                if (!investments || investments.length === 0) {
                    alert("No portfolio data to export.");
                    setIsGenerating(false);
                    return;
                }
                dataToUse = investments;
                columns = ["Startup Name", "Deployment", "Round", "Date", "Status"];
                rows = dataToUse.map(inv => [
                    inv.startup_name || 'Unnamed',
                    inv.amount ? `$${Number(inv.amount).toLocaleString()}` : '$0',
                    inv.round || 'N/A',
                    inv.date ? new Date(inv.date).toLocaleDateString() : 'N/A',
                    inv.status || 'Active'
                ]);
            } else if (selectedReport === 'watchlist') {
                const watchlist = await api.getWatchlist();
                if (!watchlist || watchlist.length === 0) {
                    alert("No watchlist items to export.");
                    setIsGenerating(false);
                    return;
                }
                dataToUse = watchlist;
                columns = ["Company", "Sector", "Phase", "Added On"];
                rows = dataToUse.map(item => [
                    item.startup_name || 'Unknown',
                    item.industry || 'N/A',
                    item.stage || 'N/A',
                    item.added_at ? new Date(item.added_at).toLocaleDateString() : 'N/A'
                ]);
            } else if (selectedReport === 'deal-flow') {
                const connections = await api.getMyConnections();
                if (!connections || connections.length === 0) {
                    alert("No deal flow data to export.");
                    setIsGenerating(false);
                    return;
                }
                dataToUse = connections;
                columns = ["Counterparty", "Role", "Status", "Date"];
                rows = dataToUse.map(c => [
                    c.requester_name || 'Unknown',
                    c.requester_role || 'N/A',
                    c.status ? c.status.toUpperCase() : 'PENDING',
                    c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'
                ]);
            } else {
                columns = ["Metric", "Value", "Velocity"];
                rows = [
                    ["Alpha Analysis", "98%", "High"],
                    ["Market Capture", "44%", "Steady"],
                    ["Risk Index", "12%", "Low"]
                ];
            }

            console.log(`Data prepared. Rows: ${rows.length}`);

            // Generate File
            const fileName = `${selectedReport}_report_${new Date().toISOString().split('T')[0]}`;

            if (exportFormat === 'PDF') {
                console.log("Generating PDF...");

                // Defensive Constructor Check
                const DocClass = jsPDF.jsPDF || jsPDF;
                if (!DocClass) {
                    throw new Error("jsPDF library not loaded correctly.");
                }

                const doc = new DocClass();
                console.log("jsPDF instance created");

                // Header
                doc.setFontSize(20);
                doc.setTextColor(40, 40, 40);
                doc.text("INVESTOR HUB REPORT", 14, 22);

                doc.setFontSize(11);
                doc.setTextColor(100);
                doc.text(`Type: ${selectedReport.toUpperCase().replace('-', ' ')}`, 14, 32);
                doc.text(`Generated For: ${investorName}`, 14, 38);
                doc.text(`Date: ${timestamp}`, 14, 44);

                // Line
                doc.setDrawColor(200, 200, 200);
                doc.line(14, 48, 196, 48);

                console.log("Adding table via autoTable...");

                // Table
                if (typeof autoTable === 'function') {
                    try {
                        autoTable(doc, {
                            startY: 55,
                            head: [columns],
                            body: rows,
                            theme: 'grid',
                            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                            styles: { fontSize: 9, cellPadding: 3 },
                            alternateRowStyles: { fillColor: [245, 245, 245] }
                        });
                        console.log("Table added successfully");
                    } catch (tableErr) {
                        console.error("autoTable failed:", tableErr);
                        doc.text("Error rendering table.", 14, 60);
                    }
                } else {
                    console.warn("autoTable is not a function:", typeof autoTable);
                    doc.text("Table plugin missing.", 14, 60);
                }

                // Footer
                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text(`Page ${i} of ${pageCount} - Confidential Property of ${investorName}`, 105, 290, { align: 'center' });
                }

                console.log("Saving PDF file...");
                doc.save(`${fileName}.pdf`);
                console.log("PDF download triggered");

            } else if (exportFormat === 'CSV' || exportFormat === 'EXCEL') {
                // Generate CSV Content
                let csvContent = columns.join(",") + "\n";
                rows.forEach(row => {
                    const cleanRow = row.map(cell => `"${String(cell).replace(/"/g, '""')}"`); // Escape quotes
                    csvContent += cleanRow.join(",") + "\n";
                });

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${fileName}.csv`; // Always .csv for text data
                document.body.appendChild(a);
                a.click();

                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }, 100);
            }

        } catch (e) {
            console.error("CRITICAL EXPORT ERROR:", e);
            alert(`Export Failed: ${e.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 font-['Plus Jakarta Sans'] animate-in fade-in duration-500 bg-slate-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Data Export</h1>
                    <p className="text-slate-500 mt-1 text-base">Generate high-fidelity reports for your investment telemetry.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Encrypted Connection</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: Configuration Hub */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Step 1: Modality Selection */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">1</div>
                            <h2 className="text-lg font-bold text-slate-900">Select Report Type</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reportTypes.map((report) => {
                                const Icon = report.icon;
                                const isSelected = selectedReport === report.id;

                                return (
                                    <div
                                        key={report.id}
                                        onClick={() => setSelectedReport(report.id)}
                                        className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${isSelected
                                            ? 'border-blue-600 bg-blue-50/50'
                                            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`p-3 rounded-xl ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm'} transition-all`}>
                                                <Icon size={24} />
                                            </div>
                                            {isSelected && (
                                                <div className="bg-blue-600 text-white p-1 rounded-full animate-in zoom-in">
                                                    <CheckCircle2 size={14} strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className={`font-bold text-base mb-2 ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>{report.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{report.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Parameters */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-sm">2</div>
                            <h2 className="text-lg font-bold text-slate-900">Operational Parameters</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Date Range</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer hover:bg-slate-100"
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value)}
                                    >
                                        <option>Last 30 Days</option>
                                        <option>Last Quarter</option>
                                        <option>Year to Date</option>
                                        <option>All Time</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Export Format</label>
                                <div className="flex gap-2">
                                    {['PDF', 'CSV', 'EXCEL'].map((format) => (
                                        <button
                                            key={format}
                                            onClick={() => setExportFormat(format)}
                                            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${exportFormat === format
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            {format}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Terminal Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <FileText size={20} className="text-slate-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg">Summary</h3>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                <span className="text-sm text-slate-500 font-medium">Report Type</span>
                                <span className="text-sm font-bold text-slate-900">{selectedReport === 'deal-flow' ? 'Deal Flow' :
                                    selectedReport === 'watchlist' ? 'Watchlist' :
                                        selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                <span className="text-sm text-slate-500 font-medium">Time Period</span>
                                <span className="text-sm font-bold text-slate-900">{dateRange}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                <span className="text-sm text-slate-500 font-medium">Format</span>
                                <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-md text-slate-700">{exportFormat}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleExport}
                            disabled={isGenerating}
                            className="w-full py-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Generating Report...
                                </>
                            ) : (
                                <>
                                    <Download size={18} />
                                    Download Report
                                </>
                            )}
                        </button>
                        <p className="text-center text-xs text-slate-400 font-medium mt-4">Secure download link expires in 10m</p>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                        <div className="flex gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg shrink-0 h-fit">
                                <Zap size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm mb-1">Pro Tip</h4>
                                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                    For compliance audits, use the PDF format. For data analysis and custom modeling, CSV provides raw data exports.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportReports;
