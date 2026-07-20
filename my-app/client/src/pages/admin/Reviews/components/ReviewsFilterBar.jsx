import React from 'react';
import { Search } from 'lucide-react';

export const ReviewsFilterBar = ({ 
  search, setSearch, 
  ratingFilter, setRatingFilter, 
  statusFilter, setStatusFilter, 
  responseFilter, setResponseFilter 
}) => {
  return (
    <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl flex flex-wrap gap-4 items-center justify-between">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search by product or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      <div className="flex flex-wrap gap-3">
        <select 
          value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
        >
          <option value="All">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <select 
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
        >
          <option value="All">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Hidden">Hidden</option>
        </select>

        <select 
          value={responseFilter} onChange={(e) => setResponseFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
        >
          <option value="All">All Responses</option>
          <option value="Responded">Responded</option>
          <option value="Not Responded">Not Responded</option>
        </select>
      </div>
    </div>
  );
};
