import React, { useState } from 'react';
import { PieChart, Briefcase, Eye, DollarSign, ChevronDown, Download, CheckCircle2, Circle } from 'lucide-react';

const reportTypes = [
    {
        id: 'portfolio',
        title: 'Portfolio Performance',
        description: 'Detailed analysis of ROI, IRR, and valuation changes across your holdings over time.',
        icon: PieChart,
        color: 'text-blue-600'
    },
    {
        id: 'deal-flow',
        title: 'Deal Flow Summary',
        description: 'Aggregated metrics on pipeline volume, rejection reasons, and lead sources.',
        icon: Briefcase,
        color: 'text-purple-600'
    },
    {
        id: 'watchlist',
        title: 'Watchlist Overview',
        description: 'Recent updates, funding rounds, and news for companies you are tracking.',
        icon: Eye,
        color: 'text-orange-500'
    },
    {
        id: 'tax',
        title: 'Tax & Accounting',
        description: 'Summary of capital calls, distributions, and K-1 preparation data.',
        icon: DollarSign,
        color: 'text-emerald-500'
    }
];

const ExportReports = () => {
    const [selectedReport, setSelectedReport] = useState('portfolio');
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [exportFormat, setExportFormat] = useState('PDF');

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Export Reports</h1>
                <p className="text-slate-500 mt-2">Generate custom insights from your portfolio and deal flow.</p>
            </div>

            <div className="space-y-6">
                {/* Step 1: Select Report Type */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                        <h2 className="text-xl font-bold text-slate-900">Select Report Type</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reportTypes.map((report) => {
                            const Icon = report.icon;
                            const isSelected = selectedReport === report.id;

                            return (
                                <div
                                    key={report.id}
                                    onClick={() => setSelectedReport(report.id)}
                                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                            ? 'border-blue-600 bg-blue-50/10'
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-2.5 rounded-lg bg-slate-100 ${report.color}`}>
                                            <Icon size={24} />
                                        </div>
                                        {isSelected ? (
                                            <CheckCircle2 className="text-blue-600 fill-blue-100" size={24} />
                                        ) : (
                                            <Circle className="text-slate-300" size={24} />
                                        )}
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-2">{report.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{report.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step 2: Configure Parameters */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                        <h2 className="text-xl font-bold text-slate-900">Configure Parameters</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900">Date Range</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                >
                                    <option>Last 30 Days</option>
                                    <option>Last Quarter</option>
                                    <option>Year to Date</option>
                                    <option>All Time</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900">Export Format</label>
                            <div className="flex gap-3">
                                {['PDF', 'CSV', 'EXCEL'].map((format) => (
                                    <button
                                        key={format}
                                        onClick={() => setExportFormat(format)}
                                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${exportFormat === format
                                                ? 'bg-blue-50 border-blue-600 text-blue-700'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {format}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Generate Action */}
                <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
                    <Download size={24} />
                    Generate Report
                </button>
            </div>
        </div>
    );
};

export default ExportReports;
