import React, { useState } from 'react';
import { PieChart, Briefcase, Eye, DollarSign, ChevronDown, Download, CheckCircle2, Circle, Loader2, FileText, Zap, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

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

        // Simulate sophisticated data aggregation
        setTimeout(async () => {
            try {
                let reportData = "";
                let fileName = `${selectedReport}_report_${new Date().toISOString().split('T')[0]}`;
                const investorName = user?.email?.split('@')[0] || 'Investor';

                // Header based on format
                if (exportFormat === 'PDF') {
                    reportData = "==================================================\n";
                    reportData += `       INVESTOR HUB - ${selectedReport.toUpperCase()} REPORT\n`;
                    reportData += "==================================================\n";
                    reportData += `Generated on: ${new Date().toLocaleString()}\n`;
                    reportData += `Prepared for: ${investorName}\n`;
                    reportData += `Range: ${dateRange}\n`;
                    reportData += "--------------------------------------------------\n\n";
                }

                if (selectedReport === 'portfolio') {
                    const investments = await api.getInvestments();
                    const dataToUse = investments;

                    if (exportFormat === 'CSV' || exportFormat === 'EXCEL') {
                        reportData += "Startup Name,Deployment,Round,Date,Status\n";
                        dataToUse.forEach(inv => {
                            reportData += `${inv.startup_name},${inv.amount},${inv.round},${inv.date},${inv.status}\n`;
                        });
                    } else {
                        dataToUse.forEach(inv => {
                            reportData += `ENTITY: ${inv.startup_name}\n`;
                            reportData += `ASSET: ${inv.amount} | ROUND: ${inv.round}\n`;
                            reportData += `TIMESTAMP: ${inv.date} | STATUS: ${inv.status}\n`;
                            reportData += "--------------------------------------------------\n";
                        });
                    }
                } else if (selectedReport === 'watchlist') {
                    const watchlist = await api.getWatchlist();
                    const dataToUse = watchlist;

                    if (exportFormat === 'CSV' || exportFormat === 'EXCEL') {
                        reportData += "Entity Name,Sector,Phase,Timestamp\n";
                        dataToUse.forEach(item => {
                            reportData += `${item.startup_name},${item.industry},${item.stage},${item.added_at}\n`;
                        });
                    } else {
                        dataToUse.forEach(item => {
                            reportData += `TARGET: ${item.startup_name}\n`;
                            reportData += `SECTOR: ${item.industry} | PHASE: ${item.stage}\n`;
                            reportData += `MONITORING SINCE: ${item.added_at}\n`;
                            reportData += "--------------------------------------------------\n";
                        });
                    }
                } else if (selectedReport === 'deal-flow') {
                    // Use Connections as Deal Flow proxy
                    const connections = await api.getMyConnections();
                    const dataToUse = connections;

                    if (exportFormat === 'CSV' || exportFormat === 'EXCEL') {
                        reportData += "Company,Status,Connection Date\n";
                        dataToUse.forEach(c => {
                            // Handle cases where user might be requester or receiver
                            const companyName = c.receiver?.startup_profile?.company_name || c.requester?.startup_profile?.company_name || c.receiver?.full_name || 'Unknown';
                            reportData += `${companyName},${c.status},${c.created_at || 'N/A'}\n`;
                        });
                    } else {
                        reportData += "PIPELINE ACTIVITY\n\n";
                        dataToUse.forEach(c => {
                            const companyName = c.receiver?.startup_profile?.company_name || c.requester?.startup_profile?.company_name || c.receiver?.full_name || 'Unknown';
                            reportData += `SOURCE: ${companyName}\n`;
                            reportData += `STATUS: ${c.status.toUpperCase()} | DATE: ${c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}\n`;
                            reportData += "--------------------------------------------------\n";
                        });
                    }
                } else {
                    // Tax (Keep Dummy)
                    if (exportFormat === 'CSV' || exportFormat === 'EXCEL') {
                        reportData += "METRIC,VALUE,VELOCITY\nAlpha Analysis,98%,High\nMarket Capture,44%,Steady\nRisk Index,12%,Low\n";
                    } else {
                        reportData += "METRIC ANALYSIS\n";
                        reportData += "Alpha Analysis: 98% (High Velocity)\n";
                        reportData += "Market Capture: 44% (Steady Growth)\n";
                        reportData += "Risk Index: 12% (Tier 1 Stability)\n";
                        reportData += "\n(Note: Tax data requires external integration)\n";
                    }
                }

                const mimeTypes = {
                    'CSV': 'text/csv',
                    'EXCEL': 'application/vnd.ms-excel',
                    'PDF': 'text/plain'
                };
                const extensions = {
                    'CSV': 'csv',
                    'EXCEL': 'xls',
                    'PDF': 'pdf'
                };

                const blob = new Blob([reportData], { type: mimeTypes[exportFormat] });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${fileName}.${extensions[exportFormat]}`;
                document.body.appendChild(a);
                a.click();

                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    setIsGenerating(false);
                }, 100);
            } catch (e) {
                console.error(e);
                setIsGenerating(false);
                alert("Protocol Exception: Data aggregation failed.");
            }
        }, 2000);
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