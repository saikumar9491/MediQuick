import React from 'react';
import { FlaskConical, CheckCircle, TrendingUp } from 'lucide-react';

export const ABStatsStrip = ({ tests }) => {
  if (!tests) return <div className="h-24 bg-slate-200 animate-pulse rounded-xl"></div>;

  const running = tests.filter(t => t.status === 'Running').length;
  const completed = tests.filter(t => t.status === 'Completed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Active Tests</p>
          <p className="text-xl font-black text-indigo-600">{running}</p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
          <FlaskConical className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Completed Tests</p>
          <p className="text-xl font-black text-slate-800">{completed}</p>
        </div>
        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
          <CheckCircle className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between opacity-50">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Avg Uplift (Winners)</p>
          <p className="text-xl font-black text-slate-800">--%</p>
        </div>
        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
