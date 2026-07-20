import React from 'react';
import { ShoppingCart, DollarSign, Send, CheckCircle } from 'lucide-react';

export const AbandonedCartStatsStrip = ({ stats }) => {
  if (!stats) return <div className="h-24 bg-slate-200 animate-pulse rounded-xl"></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Abandoned (30d)</p>
          <p className="text-2xl font-black text-rose-600">{stats.totalAbandoned}</p>
        </div>
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-6 h-6" />
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Potential Lost Revenue</p>
          <p className="text-2xl font-black text-slate-800">₹{stats.potentialRevenueLost.toLocaleString()}</p>
        </div>
        <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Reminders Sent</p>
          <p className="text-2xl font-black text-blue-600">{stats.recoveryEmailsSent}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <Send className="w-6 h-6" />
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Carts Recovered</p>
          <p className="text-2xl font-black text-emerald-600">{stats.cartsRecovered}</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
          <CheckCircle className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
