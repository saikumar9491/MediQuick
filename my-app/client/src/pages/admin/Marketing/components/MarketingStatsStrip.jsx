import React from 'react';
import { Megaphone, Users, MousePointerClick, ShoppingBag } from 'lucide-react';

export const MarketingStatsStrip = ({ stats }) => {
  if (!stats) return <div className="h-24 bg-slate-200 animate-pulse rounded-xl"></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Active Campaigns</p>
          <p className="text-2xl font-black text-emerald-600">{stats.active}</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
          <Megaphone className="w-6 h-6" />
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Reach</p>
          <p className="text-2xl font-black text-blue-600">{stats.totalReach.toLocaleString()}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6" />
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Click-through Rate</p>
          <p className="text-2xl font-black text-slate-800">{stats.ctr}%</p>
        </div>
        <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
          <MousePointerClick className="w-6 h-6" />
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Conversions</p>
          <p className="text-2xl font-black text-orange-600">{stats.conversions}</p>
        </div>
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
