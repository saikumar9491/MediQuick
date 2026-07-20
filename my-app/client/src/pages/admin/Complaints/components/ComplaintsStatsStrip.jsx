import React from 'react';
import { AlertCircle, UserMinus, Clock, CheckCircle, Timer } from 'lucide-react';

export const ComplaintsStatsStrip = ({ stats, loading }) => {
  if (loading || !stats) {
    return <div className="h-[100px] animate-pulse bg-slate-200 rounded-xl w-full"></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Complaints</p>
          <p className="text-2xl font-black text-slate-800">{stats.total}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">New / Unassigned</p>
          <p className={`text-2xl font-black ${stats.newOrUnassigned > 0 ? 'text-orange-600' : 'text-slate-800'}`}>
            {stats.newOrUnassigned}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stats.newOrUnassigned > 0 ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
          <UserMinus className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">In Progress</p>
          <p className="text-2xl font-black text-slate-800">{stats.inProgress}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Resolved Today</p>
          <p className="text-2xl font-black text-slate-800">{stats.resolvedToday}</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
          <CheckCircle className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Avg Resolution</p>
          <p className="text-2xl font-black text-slate-800">{stats.avgResolutionHrs} <span className="text-sm font-bold text-slate-500">hrs</span></p>
        </div>
        <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
          <Timer className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
