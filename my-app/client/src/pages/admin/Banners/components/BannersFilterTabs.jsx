import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

const BannersFilterTabs = ({
  activeTab = 'all',
  setActiveTab,
  searchQuery = '',
  setSearchQuery,
  counts = {}
}) => {
  const tabs = [
    { id: 'all', label: 'All Banners', count: counts.all || 0 },
    { id: 'homepage-hero', label: 'Homepage Hero', count: counts['homepage-hero'] || 0 },
    { id: 'category-mini', label: 'Category Mini', count: counts['category-mini'] || 0 },
    { id: 'flash-sale', label: 'Flash Sale', count: counts['flash-sale'] || 0 },
    { id: 'mobile-only', label: 'Mobile Only', count: counts['mobile-only'] || 0 },
    { id: 'desktop-only', label: 'Desktop Only', count: counts['desktop-only'] || 0 },
    { id: 'both-devices', label: 'Both Devices', count: counts['both-devices'] || 0 }
  ];

  return (
    <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      {/* Horizontal Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#0057FF] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-64">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or headline..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-1.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0057FF] focus:bg-white transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

    </div>
  );
};

export default BannersFilterTabs;
