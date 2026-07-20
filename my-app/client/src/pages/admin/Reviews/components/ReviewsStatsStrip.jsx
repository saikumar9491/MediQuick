import React from 'react';
import { Star, MessageSquare, EyeOff, CheckCircle } from 'lucide-react';

export const ReviewsStatsStrip = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return <div className="h-24 bg-slate-200 animate-pulse rounded-xl"></div>;

  const total = reviews.length;
  const avgRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1);
  const hidden = reviews.filter(r => !r.isApproved).length;
  const responded = reviews.filter(r => !!r.adminResponse).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Reviews</p>
          <p className="text-xl font-black text-slate-800">{total}</p>
        </div>
        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Avg Rating</p>
          <div className="flex items-center gap-1">
            <p className="text-xl font-black text-amber-500">{avgRating}</p>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500 mb-0.5" />
          </div>
        </div>
        <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
          <Star className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Hidden Reviews</p>
          <p className={`text-xl font-black ${hidden > 0 ? 'text-rose-500' : 'text-slate-800'}`}>{hidden}</p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hidden > 0 ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-600'}`}>
          <EyeOff className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Responded</p>
          <p className="text-xl font-black text-emerald-600">{responded} <span className="text-sm text-slate-400 font-medium">/ {total}</span></p>
        </div>
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
          <CheckCircle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
