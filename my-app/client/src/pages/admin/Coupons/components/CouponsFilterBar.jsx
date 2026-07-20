import React from 'react';
import { Search, X } from 'lucide-react';

export const CouponsFilterBar = ({ 
  search, setSearch, 
  status, setStatus, 
  type, setType,
  onFilterChange 
}) => {
  const [localSearch, setLocalSearch] = React.useState(search);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(localSearch);
    onFilterChange();
  };

  const handleClear = () => {
    setLocalSearch('');
    setSearch('');
    setStatus('All');
    setType('All');
  };

  const hasFilters = search !== '' || status !== 'All' || type !== 'All';

  return (
    <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-4 rounded-t-xl items-center justify-between">
      <div className="flex flex-wrap gap-4 items-center">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search Coupon Code..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 bg-white shadow-sm"
          />
        </form>

        <select 
          value={status} 
          onChange={(e) => { setStatus(e.target.value); onFilterChange(); }}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none bg-white shadow-sm"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Expired">Expired</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select 
          value={type} 
          onChange={(e) => { setType(e.target.value); onFilterChange(); }}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none bg-white shadow-sm"
        >
          <option value="All">All Discount Types</option>
          <option value="Percentage">Percentage</option>
          <option value="Flat">Flat Amount</option>
        </select>
      </div>

      {hasFilters && (
        <button 
          onClick={handleClear}
          className="text-sm font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Clear Filters
        </button>
      )}
    </div>
  );
};
