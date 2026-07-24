import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import CategoryLeftPanel from './components/CategoryLeftPanel';
import SubcategoryRightPanel from './components/SubcategoryRightPanel';
import { API_BASE } from '../../utils/apiConfig';
import MobileBottomTabBar from '../../components/mobile/MobileBottomTabBar';

const MobileCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Store right panel scroll offset per category ID
  const scrollPositions = useRef({});
  const rightPanelRef = useRef(null);

  // 1. Fetch Categories
  useEffect(() => {
    const loadCategoriesData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/categories/with-counts`);
        const catData = await res.json();
        const list = catData.categories || catData || [];
        setCategories(list);

        if (list.length > 0) {
          setActiveCategoryId(list[0]._id || list[0].name);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategoriesData();
  }, []);

  // 2. Handle category selection from left panel (preserves scroll position per category)
  const handleSelectCategory = (catId) => {
    if (rightPanelRef.current && activeCategoryId) {
      scrollPositions.current[activeCategoryId] = rightPanelRef.current.scrollTop;
    }

    setActiveCategoryId(catId);

    // Restore scroll position for target category on next render tick
    setTimeout(() => {
      if (rightPanelRef.current) {
        const savedPos = scrollPositions.current[catId] || 0;
        rightPanelRef.current.scrollTop = savedPos;
      }
    }, 10);
  };

  // Record scroll position as user scrolls right panel
  const handleRightPanelScroll = (e) => {
    if (activeCategoryId && e.target) {
      scrollPositions.current[activeCategoryId] = e.target.scrollTop;
    }
  };

  const activeCategory = activeCategoryId === 'flash-deals-special' 
    ? { _id: 'flash-deals-special', name: 'Flash Deals', subOptions: ['All Flash Deals', '⚡ 25% OFF'] }
    : (categories.find(c => c._id === activeCategoryId || c.name === activeCategoryId) || categories[0]);

  return (
    <div className="w-full h-screen overflow-hidden bg-slate-50 flex flex-col font-sans select-none md:hidden">
      {/* ─── 1. HEADER (Fixed at top) ─── */}
      <header className="bg-white border-b border-slate-200/80 px-4 py-2 shrink-0 z-30 shadow-3xs flex flex-col gap-2">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <h1 className="text-base font-black text-slate-900 tracking-tight">
            Shop by category
          </h1>
          <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0057FF] flex items-center justify-center">
            <Search className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Full-width Search Bar */}
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F7FF] border border-blue-100/70 pl-9 pr-8 py-1.5 rounded-full text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0057FF] focus:bg-white transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* ─── 2. MAIN CONTENT AREA (Two-Panel Split View: Fixed Left, Scrollable Right) ─── */}
      <main className="flex-1 flex overflow-hidden min-h-0 relative">
        {loading ? (
          /* Skeleton Loader */
          <div className="flex-1 flex items-center justify-center bg-white py-16">
            <div className="flex flex-col items-center gap-2">
              <span className="w-8 h-8 border-3 border-[#0057FF] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-400">Loading Categories...</span>
            </div>
          </div>
        ) : (
          /* Two-Panel Split Layout */
          <div className="flex w-full h-full overflow-hidden">
            {/* Left Panel (Fixed ~68px wide) */}
            <CategoryLeftPanel
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelectCategory={handleSelectCategory}
              searchQuery={searchQuery}
            />

            {/* Right Panel (Flexible - Subcategory Chips + Direct Product Grid) */}
            <SubcategoryRightPanel
              activeCategory={activeCategory}
              scrollRef={rightPanelRef}
              onScroll={handleRightPanelScroll}
            />
          </div>
        )}
      </main>

      {/* ─── 3. SHARED MOBILE BOTTOM TAB BAR (Fixed at bottom) ─── */}
      <div className="shrink-0 z-30">
        <MobileBottomTabBar />
      </div>
    </div>
  );
};

export default MobileCategories;
