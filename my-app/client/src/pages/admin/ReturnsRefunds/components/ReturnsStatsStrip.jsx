import React from 'react';
import { RefreshCcw, Search, CheckCircle, CreditCard, DollarSign } from 'lucide-react';

export const ReturnsStatsStrip = ({ stats, loading }) => {
  if (loading || !stats) {
    return <div className="h-[100px] animate-pulse bg-slate-200 rounded-xl w-full"></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Returns</p>
          <p className="text-2xl font-black text-slate-800">{stats.totalRequests}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <RefreshCcw className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Pending Review</p>
          <p className={`text-2xl font-black ${stats.pendingReview > 0 ? 'text-orange-600' : 'text-slate-800'}`}>
            {stats.pendingReview}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stats.pendingReview > 0 ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
          <Search className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Approved</p>
          <p className="text-2xl font-black text-slate-800">{stats.approved}</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
          <CheckCircle className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Refunded (Month)</p>
          <p className="text-2xl font-black text-slate-800">{stats.refundedThisMonth}</p>
        </div>
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
          <CreditCard className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Refunded</p>
          <p className="text-2xl font-black text-slate-800">₹{stats.totalRefundedAmount.toLocaleString()}</p>
        </div>
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
