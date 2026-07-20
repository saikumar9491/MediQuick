import React, { useMemo } from 'react';
import { Package, Users, Bike, AlertTriangle } from 'lucide-react';

export const RadarStatsStrip = ({ deliveries, riders, loading }) => {
  const stats = useMemo(() => {
    const onDuty = riders.filter(r => r.status === 'on-duty' || r.status === 'delivering').length;
    const delivering = riders.filter(r => r.status === 'delivering').length;
    const atRisk = deliveries.filter(d => d.riskStatus !== 'On Track').length;

    return {
      active: deliveries.length,
      onDuty,
      delivering,
      atRisk
    };
  }, [deliveries, riders]);

  if (loading && deliveries.length === 0) return <div className="h-[90px] animate-pulse bg-slate-200 rounded-xl" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Active Deliveries</p>
          <p className="text-2xl font-black text-slate-800">{stats.active}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <Package className="w-6 h-6" />
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Riders On-Duty</p>
          <p className="text-2xl font-black text-slate-800">{stats.onDuty}</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Currently Delivering</p>
          <p className="text-2xl font-black text-slate-800">{stats.delivering}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <Bike className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">At-Risk Deliveries</p>
          <p className={`text-2xl font-black ${stats.atRisk > 0 ? 'text-orange-600' : 'text-slate-800'}`}>
            {stats.atRisk}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stats.atRisk > 0 ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
