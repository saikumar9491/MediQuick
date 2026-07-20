import React from 'react';
import { Truck, AlertTriangle, XOctagon, UserMinus } from 'lucide-react';

export const FleetStatsStrip = ({ stats }) => {
  if (!stats) return <div className="h-24 bg-slate-200 animate-pulse rounded-xl"></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Vehicles</p>
          <p className="text-2xl font-black text-slate-800">{stats.totalVehicles}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <Truck className="w-6 h-6" />
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Active</p>
          <p className="text-2xl font-black text-emerald-600">{stats.active}</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
          <Truck className="w-6 h-6" />
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Under Maintenance</p>
          <p className="text-2xl font-black text-orange-600">{stats.underMaintenance}</p>
        </div>
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Unassigned</p>
          <p className="text-2xl font-black text-rose-600">{stats.unassigned}</p>
        </div>
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
          <UserMinus className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
