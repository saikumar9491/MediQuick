import React from 'react';
import { Lightbulb, TrendingUp, CheckCircle, Percent } from 'lucide-react';

export const PricingStatsStrip = ({ suggestions }) => {
  if (!suggestions) return <div className="h-24 bg-slate-200 animate-pulse rounded-xl"></div>;

  const totalImpact = suggestions.reduce((acc, curr) => acc + curr.potentialImpact, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Pricing Suggestions</p>
          <p className="text-xl font-black text-indigo-600">{suggestions.length}</p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
          <Lightbulb className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Potential Rev. Impact</p>
          <p className={`text-xl font-black ${totalImpact >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {totalImpact >= 0 ? '+' : '-'}₹{Math.abs(totalImpact).toLocaleString()}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${totalImpact >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between opacity-50">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Applied This Month</p>
          <p className="text-xl font-black text-slate-800">--</p>
        </div>
        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
          <CheckCircle className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between opacity-50">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Avg Price Change</p>
          <p className="text-xl font-black text-slate-800">--%</p>
        </div>
        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
          <Percent className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
