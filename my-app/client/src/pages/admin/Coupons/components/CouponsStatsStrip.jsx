import React from 'react';
import { Tag, Users, DollarSign, Clock, TrendingDown } from 'lucide-react';

export const CouponsStatsStrip = ({ stats }) => {
  if (!stats) return <div className="h-24 bg-slate-200 animate-pulse rounded-xl"></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Active Coupons</p>
          <p className="text-xl font-black text-emerald-600">{stats.active}</p>
        </div>
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
          <Tag className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Redemptions</p>
          <p className="text-xl font-black text-blue-600">{stats.totalRedemptions}</p>
        </div>
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Revenue Generated</p>
          <p className="text-xl font-black text-slate-800">₹{stats.revenueGenerated.toLocaleString()}</p>
        </div>
        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Discount</p>
          <p className="text-xl font-black text-indigo-600">₹{stats.totalDiscountGiven.toLocaleString()}</p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
          <TrendingDown className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Expiring Soon</p>
          <p className="text-xl font-black text-orange-600">{stats.expiringSoon}</p>
        </div>
        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
