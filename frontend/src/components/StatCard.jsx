import * as React from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

const StatCard = ({ label, value, trend, isPositive, icon }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden font-['Plus Jakarta Sans'] h-full flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                        {isPositive ? <TrendingUp size={14} /> : null}
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
            </div>
        </div>
    );
};

export default StatCard;
