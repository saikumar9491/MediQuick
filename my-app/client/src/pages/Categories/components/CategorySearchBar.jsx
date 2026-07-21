import React from 'react';
import { Search, X } from 'lucide-react';

const CategorySearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative max-w-md mx-auto">
      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Search category or subcategory name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-white border border-slate-200/80 pl-11 pr-10 py-3 rounded-full text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#00a2a4] transition-all shadow-xs"
      />
      {searchQuery && (
        <button 
          onClick={() => setSearchQuery('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default CategorySearchBar;
