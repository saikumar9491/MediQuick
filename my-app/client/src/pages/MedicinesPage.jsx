import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ChevronRight, 
  Search,
  LayoutGrid,
  List as ListIcon,
  X,
  Star,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  RotateCcw,
  Package,
  Pill,
  CheckCircle,
  ShieldAlert,
  ChevronLeft
} from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import { fetchProducts, fetchCategories } from '../api/products';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const MedicinesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialFilterParam = searchParams.get('filter') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Counts
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 12;

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(3000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [rxFilter, setRxFilter] = useState('All'); // 'All' | 'otc_only' | 'rx_only'
  const [sortBy, setSortBy] = useState('recommended');

  // Mobile & Layout View State
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Handle URL filter query param (e.g. /medicines?filter=hair-care or /medicines?filter=vitamins)
  useEffect(() => {
    if (initialFilterParam) {
      const map = {
        'hair-care': 'Hair Care',
        'fitness': 'Fitness & Health',
        'sexual-wellness': 'Sexual Wellness',
        'vitamins': 'Vitamins & Nutrition',
        'supports': 'Supports & Braces',
        'immunity': 'Immunity Boosters',
        'homeopathy': 'Homeopathy',
        'pet-care': 'Pet Care'
      };
      if (map[initialFilterParam]) {
        setSelectedCategory(map[initialFilterParam]);
      }
    }
  }, [initialFilterParam]);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch Categories List
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Primary API Product Fetch
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          subCategory: selectedSubCategory || undefined,
          search: debouncedSearch || undefined,
          brand: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
          priceMin: priceMin > 0 ? priceMin : undefined,
          priceMax: priceMax < 3000 ? priceMax : undefined,
          inStock: inStockOnly ? 'true' : undefined,
          prescriptionRequired: rxFilter !== 'All' ? rxFilter : undefined,
          sort: sortBy
        };

        const res = await fetchProducts(params);
        setProducts(res.medicines || []);
        setTotalCount(res.totalCount || 0);
        setTotalPages(res.totalPages || 1);
        if (res.brandsWithCounts && res.brandsWithCounts.length > 0) {
          setBrands(res.brandsWithCounts);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [
    page, 
    selectedCategory, 
    selectedSubCategory, 
    debouncedSearch, 
    selectedBrands, 
    priceMin, 
    priceMax, 
    inStockOnly, 
    rxFilter, 
    sortBy
  ]);

  // Active filters list for removable chips
  const activeFilters = useMemo(() => {
    const list = [];
    if (selectedCategory && selectedCategory !== 'All') {
      list.push({ id: 'category', label: `Category: ${selectedCategory}`, clear: () => { setSelectedCategory('All'); setSelectedSubCategory(''); } });
    }
    if (selectedSubCategory) {
      list.push({ id: 'subcategory', label: `Subcategory: ${selectedSubCategory}`, clear: () => setSelectedSubCategory('') });
    }
    if (debouncedSearch) {
      list.push({ id: 'search', label: `Search: "${debouncedSearch}"`, clear: () => { setSearchQuery(''); setDebouncedSearch(''); } });
    }
    selectedBrands.forEach(b => {
      list.push({ id: `brand-${b}`, label: `Brand: ${b}`, clear: () => setSelectedBrands(prev => prev.filter(item => item !== b)) });
    });
    if (inStockOnly) {
      list.push({ id: 'stock', label: 'In Stock Only', clear: () => setInStockOnly(false) });
    }
    if (rxFilter !== 'All') {
      list.push({ id: 'rx', label: rxFilter === 'rx_only' ? 'Prescription Required' : 'OTC Only', clear: () => setRxFilter('All') });
    }
    if (priceMax < 3000 || priceMin > 0) {
      list.push({ id: 'price', label: `Price: ₹${priceMin} - ₹${priceMax}`, clear: () => { setPriceMin(0); setPriceMax(3000); } });
    }
    return list;
  }, [selectedCategory, selectedSubCategory, debouncedSearch, selectedBrands, inStockOnly, rxFilter, priceMin, priceMax]);

  const handleClearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCategory('');
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedBrands([]);
    setPriceMin(0);
    setPriceMax(3000);
    setInStockOnly(false);
    setRxFilter('All');
    setSortBy('recommended');
    setPage(1);
    setSearchParams({});
  };

  const handleBrandToggle = (brandName) => {
    setSelectedBrands(prev => {
      if (prev.includes(brandName)) {
        return prev.filter(b => b !== brandName);
      } else {
        return [...prev, brandName];
      }
    });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] pb-24 pt-4 sm:pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
          <button onClick={() => navigate('/')} className="hover:text-slate-700 cursor-pointer">Home</button>
          <span>/</span>
          <span className="text-slate-800 font-bold">All Medicines</span>
        </nav>

        {/* 2. HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              All Medicines & Healthcare Products
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Showing <span className="font-bold text-slate-800">{totalCount}</span> genuine products from certified pharmacy partners
            </p>
          </div>

          {/* Page-level Search Input */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicines, brands, salts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200/80 pl-10 pr-4 py-2.5 rounded-full text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#00a2a4] transition-all shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 3. ACTIVE FILTERS BAR */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Active Filters:</span>
            {activeFilters.map(chip => (
              <span 
                key={chip.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00a2a4]/10 text-[#00a2a4] text-xs font-bold border border-[#00a2a4]/20"
              >
                <span>{chip.label}</span>
                <button onClick={chip.clear} className="hover:text-rose-600 cursor-pointer">
                  <X size={13} />
                </button>
              </span>
            ))}
            <button
              onClick={handleClearAllFilters}
              className="ml-auto text-xs font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={12} /> Clear All
            </button>
          </div>
        )}

        {/* CONTROLS BAR: Sort & View Mode */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Filter size={15} className="text-[#00a2a4]" />
            <span>Filters ({activeFilters.length})</span>
          </button>

          <div className="hidden lg:block text-xs text-slate-400 font-semibold">
            Page <span className="font-bold text-slate-700">{page}</span> of <span className="font-bold text-slate-700">{totalPages}</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#00a2a4] text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#00a2a4] text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="List View"
              >
                <ListIcon size={15} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#00a2a4] shadow-xs cursor-pointer"
              >
                <option value="recommended">Recommended & Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT: Sidebar + Product Grid */}
        <div className="flex gap-8 items-start">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block w-72 flex-shrink-0 bg-white border border-slate-200/70 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-800 flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-[#00a2a4]" /> Filter Products
              </h2>
              {activeFilters.length > 0 && (
                <button onClick={handleClearAllFilters} className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer">
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Categories</h3>
              <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                <button
                  onClick={() => { setSelectedCategory('All'); setSelectedSubCategory(''); setPage(1); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    selectedCategory === 'All' ? 'bg-[#00a2a4] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                </button>

                {categories.map(cat => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <div key={cat._id || cat.name}>
                      <button
                        onClick={() => { setSelectedCategory(cat.name); setSelectedSubCategory(''); setPage(1); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                          isSelected ? 'bg-[#00a2a4]/10 text-[#00a2a4] font-bold border border-[#00a2a4]/20' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                      </button>

                      {/* Subcategories if selected */}
                      {isSelected && cat.subOptions && (
                        <div className="pl-3 mt-1 space-y-1 border-l-2 border-[#00a2a4]/30 ml-3">
                          {cat.subOptions.map(sub => {
                            const subName = typeof sub === 'object' ? sub.name : sub;
                            const isSubSelected = selectedSubCategory === subName;
                            return (
                              <button
                                key={subName}
                                onClick={() => { setSelectedSubCategory(isSubSelected ? '' : subName); setPage(1); }}
                                className={`w-full text-left px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                                  isSubSelected ? 'text-[#00a2a4] font-extrabold bg-[#00a2a4]/10' : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                {subName}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex justify-between">
                <span>Price Range</span>
                <span className="text-[#00a2a4]">Max ₹{priceMax}</span>
              </h3>
              <input
                type="range"
                min="0"
                max="3000"
                step="50"
                value={priceMax}
                onChange={(e) => { setPriceMax(Number(e.target.value)); setPage(1); }}
                className="w-full accent-[#00a2a4] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>₹0</span>
                <span>₹3000+</span>
              </div>
            </div>

            {/* Prescription Requirement */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Prescription Type</h3>
              <div className="space-y-1.5">
                {[
                  { id: 'All', label: 'All Products' },
                  { id: 'otc_only', label: 'OTC Only (No Rx Required)' },
                  { id: 'rx_only', label: 'Prescription Required (Rx)' }
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900">
                    <input
                      type="radio"
                      name="rxFilter"
                      checked={rxFilter === item.id}
                      onChange={() => { setRxFilter(item.id); setPage(1); }}
                      className="w-3.5 h-3.5 text-[#00a2a4] focus:ring-[#00a2a4]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-slate-700">In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => { setInStockOnly(e.target.checked); setPage(1); }}
                  className="w-4 h-4 rounded text-[#00a2a4] focus:ring-[#00a2a4]"
                />
              </label>
            </div>

            {/* Brand Filter List */}
            {brands.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Popular Brands</h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  {brands.map(b => {
                    const isChecked = selectedBrands.includes(b.name);
                    return (
                      <label key={b.name} className="flex items-center justify-between text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleBrandToggle(b.name)}
                            className="w-3.5 h-3.5 rounded text-[#00a2a4] focus:ring-[#00a2a4]"
                          />
                          <span className="truncate">{b.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">{b.count}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

          </aside>

          {/* PRODUCT GRID SECTION */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                  <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-2xl h-64 p-3 space-y-3">
                    <div className="h-28 bg-slate-100 rounded-xl" />
                    <div className="h-3 w-3/4 bg-slate-100 rounded" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded" />
                    <div className="h-7 w-full bg-slate-100 rounded-full mt-2" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5"
                    : "space-y-4"
                }>
                  {products.map(product => (
                    <ProductCard key={product._id} {...product} />
                  ))}
                </div>

                {/* 5. SERVER-SIDE PAGINATION */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2 border-t border-slate-200/60 pt-8">
                    <button
                      onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft size={15} /> Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
                      <button
                        key={pNum}
                        onClick={() => { setPage(pNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-9 h-9 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          page === pNum 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {pNum}
                      </button>
                    ))}

                    <button
                      onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Next <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* EMPTY STATE */
              <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center my-6">
                <Package size={42} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-base font-bold text-slate-800 mb-1">No products match your filters</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">Try removing some active filters or searching for another term.</p>
                <button
                  onClick={handleClearAllFilters}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-[#00a2a4] transition-all cursor-pointer shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* MOBILE FILTERS SIDE SHEET */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-50 bg-slate-900"
            />
            {/* Content drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-50 h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <SlidersHorizontal size={16} className="text-[#00a2a4]" /> Filters
                </h2>
                <div className="flex items-center gap-4">
                  {activeFilters.length > 0 && (
                    <button 
                      onClick={() => { handleClearAllFilters(); setShowMobileFilters(false); }}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Scrollable Filters List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
                
                {/* Categories */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => { setSelectedCategory('All'); setSelectedSubCategory(''); setPage(1); }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedCategory === 'All' 
                          ? 'bg-[#00a2a4] text-white border-transparent shadow-xs' 
                          : 'bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c._id}
                        onClick={() => { setSelectedCategory(c.name); setSelectedSubCategory(''); setPage(1); }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                          selectedCategory === c.name 
                            ? 'bg-[#00a2a4] text-white border-transparent shadow-xs' 
                            : 'bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategories (if main category selected) */}
                {selectedCategory !== 'All' && categories.find(c => c.name === selectedCategory)?.subCategories?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Subcategories</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => { setSelectedSubCategory(''); setPage(1); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          selectedSubCategory === '' 
                            ? 'bg-[#00a2a4]/10 text-[#00a2a4] border-[#00a2a4]/30' 
                            : 'bg-slate-50 text-slate-550 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        All {selectedCategory}
                      </button>
                      {categories.find(c => c.name === selectedCategory).subCategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => { setSelectedSubCategory(sub); setPage(1); }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            selectedSubCategory === sub 
                              ? 'bg-[#00a2a4]/10 text-[#00a2a4] border-[#00a2a4]/30' 
                              : 'bg-slate-50 text-slate-550 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prescription Gating */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Prescription Gating</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'All', label: 'Show All' },
                      { id: 'otc_only', label: 'OTC Only' },
                      { id: 'rx_only', label: 'Rx Required' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => { setRxFilter(opt.id); setPage(1); }}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                          rxFilter === opt.id 
                            ? 'bg-slate-900 border-transparent text-white' 
                            : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Status */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Availability</h3>
                  <label className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 cursor-pointer">
                    <span className="text-xs font-bold text-slate-750">In Stock Only</span>
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={() => { setInStockOnly(!inStockOnly); setPage(1); }}
                      className="w-4 h-4 rounded text-[#00a2a4] focus:ring-[#00a2a4]"
                    />
                  </label>
                </div>

                {/* Brands */}
                {brands.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Brands</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {brands.map(b => {
                        const isChecked = selectedBrands.includes(b.name);
                        return (
                          <button
                            key={b.name}
                            onClick={() => { handleBrandToggle(b.name); setPage(1); }}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-left truncate flex items-center justify-between ${
                              isChecked 
                                ? 'bg-teal-50 border-teal-300 text-[#00a2a4]' 
                                : 'bg-white border-slate-200 text-slate-650'
                            }`}
                          >
                            <span className="truncate">{b.name}</span>
                            <span className="text-[9px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full font-bold ml-1">{b.count}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Sticky Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-white flex gap-3">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 bg-slate-900 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest text-center shadow-lg cursor-pointer"
                >
                  Apply Filters ({activeFilters.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicinesPage;
