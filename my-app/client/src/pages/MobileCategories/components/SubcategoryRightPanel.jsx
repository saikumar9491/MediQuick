import React from 'react';
import { 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Package, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const SubcategoryRightPanel = ({
  activeCategory,
  onSelectSubcategory,
  scrollRef,
  onScroll,
  miniBannerData
}) => {
  if (!activeCategory) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-white">
        <Package className="w-10 h-10 stroke-1 text-slate-300 mb-2" />
        <span className="text-xs font-semibold">Select a category to view items</span>
      </div>
    );
  }

  const subOptions = activeCategory.subOptions || [];
  const categoryName = activeCategory.name || 'Category';
  const totalCount = activeCategory.count || 0;

  return (
    <div 
      ref={scrollRef}
      onScroll={onScroll}
      className="flex-1 bg-white overflow-y-auto p-4 flex flex-col h-full no-scrollbar select-none"
    >
      {/* 1. Header Row */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <h2 className="text-sm font-extrabold text-[#0057FF] tracking-tight truncate">
          {categoryName}
        </h2>
        <span className="text-[10px] font-extrabold text-[#FF6B00] bg-orange-50 border border-orange-100/80 px-2 py-0.5 rounded-full flex-shrink-0 font-[IBM_Plex_Mono]">
          {totalCount} {totalCount === 1 ? 'product' : 'products'}
        </span>
      </div>

      {/* 2. Subcategory Grid (2 Columns) */}
      {subOptions.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {subOptions.map((sub, index) => {
            const subName = typeof sub === 'object' ? sub.name : sub;
            const subCount = typeof sub === 'object' ? sub.count : 0;

            return (
              <button
                key={index}
                onClick={() => onSelectSubcategory(subName, sub)}
                className="bg-[#F5F7FF] border border-blue-100/70 rounded-xl p-3 flex flex-col justify-between text-left hover:border-[#0057FF]/40 hover:bg-blue-50/60 active:scale-[0.98] transition-all min-h-[82px] group"
              >
                {/* Top Icon & Arrow Row */}
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="w-6 h-6 rounded-md bg-white text-[#0057FF] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0057FF] group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Subcategory Name */}
                <span className="text-[10.5px] font-bold text-slate-800 leading-tight line-clamp-2 w-full group-hover:text-[#0057FF] transition-colors">
                  {subName}
                </span>

                {/* Real Product Count */}
                <span className="text-[8.5px] font-extrabold text-[#FF6B00] mt-1.5 font-[IBM_Plex_Mono]">
                  {subCount > 0 ? `${subCount} items` : 'Explore'}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="py-8 px-4 text-center border border-dashed border-slate-200 rounded-xl mb-6">
          <p className="text-xs font-medium text-slate-400">No subcategories listed under {categoryName}.</p>
          <button
            onClick={() => onSelectSubcategory('All', null)}
            className="mt-3 text-[10px] font-bold text-[#0057FF] hover:underline"
          >
            Browse all {categoryName} items
          </button>
        </div>
      )}

      {/* 3. Small Promotional Mini-Banner (Admin-managed from Page Management API) */}
      <div className="mt-auto bg-gradient-to-br from-[#0057FF] to-[#003BB5] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between gap-3">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
        
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-blue-200">
            <ShieldCheck size={10} />
            <span>MediQuick Verified</span>
          </div>
          <h3 className="text-xs font-black tracking-tight leading-tight">
            {miniBannerData?.heroHeadline || `Authentic ${categoryName}`}
          </h3>
          <p className="text-[9.5px] text-blue-100 leading-snug line-clamp-2 opacity-90">
            {miniBannerData?.heroSubtext || '100% genuine products sourced directly from authorized medical suppliers.'}
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-1 border-t border-white/10">
          <span className="text-[8px] font-extrabold text-blue-200 uppercase tracking-widest font-[IBM_Plex_Mono]">
            Instant Express Delivery
          </span>
          <button
            onClick={() => onSelectSubcategory('All', null)}
            className="bg-[#FF6B00] hover:bg-[#E55A00] text-white text-[9.5px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-xs active:scale-95 transition-all flex items-center gap-1"
          >
            <span>Shop Now</span>
            <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryRightPanel;
