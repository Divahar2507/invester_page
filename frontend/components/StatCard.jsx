// Use import * as React to ensure JSX intrinsic elements are recognized
import * as React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, trend, isPositive, icon }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-slate-50 rounded-xl text-blue-600">
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
            </div>
        </div>
    );
};

export default StatCard;
