import React from 'react';
import { Search, Hash, AlertCircle, FileText } from 'lucide-react';

export const SearchStatsStrip = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Searches</p>
          <p className="text-xl font-black text-indigo-600">{stats.totalSearches.toLocaleString()}</p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
          <Search className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Unique Terms</p>
          <p className="text-xl font-black text-slate-800">{stats.uniqueTerms.toLocaleString()}</p>
        </div>
        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
          <Hash className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Zero-Result Searches</p>
          <p className={`text-xl font-black ${stats.zeroResults > 0 ? 'text-amber-500' : 'text-slate-800'}`}>
            {stats.zeroResults.toLocaleString()}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stats.zeroResults > 0 ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-600'}`}>
          <AlertCircle className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Avg Results</p>
          <p className="text-xl font-black text-slate-800">{stats.avgResults}</p>
        </div>
        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
