import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

export const ComplaintsFilterBar = ({ 
  search, setSearch, 
  status, setStatus, 
  priority, setPriority, 
  category, setCategory,
  onFilterChange 
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== localSearch) {
        setSearch(localSearch);
        onFilterChange();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, search, setSearch, onFilterChange]);

  const handleClear = () => {
    setLocalSearch('');
    setSearch('');
    setStatus('All');
    setPriority('All');
    setCategory('All');
    onFilterChange();
  };

  return (
    <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-4 items-center rounded-t-xl">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search ID or Customer..." 
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select 
          value={status} 
          onChange={(e) => { setStatus(e.target.value); onFilterChange(); }}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Escalated">Escalated</option>
        </select>

        <select 
          value={priority} 
          onChange={(e) => { setPriority(e.target.value); onFilterChange(); }}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

        <select 
          value={category} 
          onChange={(e) => { setCategory(e.target.value); onFilterChange(); }}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Categories</option>
          <option value="Product Quality">Product Quality</option>
          <option value="Delivery Delay">Delivery Delay</option>
          <option value="Wrong Item">Wrong Item</option>
          <option value="Damaged Item">Damaged Item</option>
          <option value="Prescription Issue">Prescription Issue</option>
          <option value="Refund Not Received">Refund Not Received</option>
          <option value="Rider Behavior">Rider Behavior</option>
          <option value="Other">Other</option>
        </select>

        {(search || status !== 'All' || priority !== 'All' || category !== 'All') && (
          <button 
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>
    </div>
  );
};
