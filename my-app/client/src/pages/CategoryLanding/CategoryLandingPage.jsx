import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  Leaf, 
  Check, 
  LayoutGrid, 
  SlidersHorizontal,
  X,
  Droplet,
  Heart,
  Zap,
  Activity,
  Award,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { API_BASE } from '../../utils/apiConfig';

const CategoryLandingPage = ({
  categoryName = 'Ayurveda',
  heroTitle = 'Ayurveda, rooted in tradition',
  heroSubtitle = 'Discover authentic herbal formulations, ancient remedies, and pure botanicals crafted for natural daily balance.',
  trustBadges = ['Authentic Formulations', 'Trusted Herbal Brands', '100% Natural Botanicals'],
  concernsList = [
    { id: 'all', label: 'All Ayurveda', icon: Leaf, keywords: [] },
    { id: 'immunity', label: 'Immunity & Vitality', icon: ShieldCheck, keywords: ['tulsi', 'giloy', 'amla', 'chyawanprash', 'koflet', 'bonnisan'] },
    { id: 'digestion', label: 'Digestion & Gut', icon: Zap, keywords: ['triphala', 'gasex', 'liv.52', 'dashmool', 'digest'] },
    { id: 'stress', label: 'Stress & Sleep', icon: Heart, keywords: ['ashwagandha'] },
    { id: 'skin-hair', label: 'Skin & Hair Care', icon: Droplet, keywords: ['neem', 'aloe', 'hair'] },
    { id: 'wellness', label: 'General Wellness', icon: Activity, keywords: ['juice', 'drops', 'tablets'] }
  ],
  educationalContent = {
    title: 'Understanding Ayurvedic Wellness',
    body: 'Ayurveda is a 5,000-year-old holistic system of natural health that focuses on balance between mind, body, and spirit. Herbal formulations synthesize botanical ingredients like Ashwagandha, Neem, and Tulsi to support body immunity, digestion, and daily vitality.'
  }
}) => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConcern, setSelectedConcern] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState(1000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/medicines?limit=1000`);
        const data = await res.json();
        const medArray = Array.isArray(data) ? data : (data.medicines || []);

        // Filter products matching categoryName
        const catFiltered = medArray.filter(item => {
          const cat = (item.category || '').toLowerCase().trim();
          const target = categoryName.toLowerCase().trim();
          return cat === target || (target === 'ayurveda' && (cat.includes('ayurveda') || cat.includes('herbal')));
        });

        setProducts(catFiltered);
      } catch (err) {
        console.error('Failed to fetch category products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  // Dynamic brand list with product counts
  const availableBrands = useMemo(() => {
    const brandCounts = {};
    products.forEach(p => {
      if (p.brand) {
        brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
      }
    });
    return Object.entries(brandCounts).map(([name, count]) => ({ name, count }));
  }, [products]);

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Concern / Subcategory filter
    if (selectedConcern !== 'all') {
      const concernObj = concernsList.find(c => c.id === selectedConcern);
      if (concernObj && concernObj.keywords.length > 0) {
        result = result.filter(p => {
          const text = `${p.name || ''} ${p.subCategory || ''} ${p.description || ''}`.toLowerCase();
          return concernObj.keywords.some(kw => text.includes(kw));
        });
      }
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // In Stock filter
    if (inStockOnly) {
      result = result.filter(p => (p.countInStock || 0) > 0);
    }

    // Price range filter
    result = result.filter(p => (p.discountPrice || p.price || 0) <= priceRange);

    // Sorting
    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    }

    return result;
  }, [products, searchQuery, selectedConcern, selectedBrand, inStockOnly, priceRange, sortBy, concernsList]);

  return (
    <div className="min-h-screen bg-[#FAFBFD] pb-24 pt-4 sm:pt-6">
      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1C2A1B] via-[#2A3F29] to-[#142013] border border-[#3E563B]/40 p-6 sm:p-8 shadow-[0_15px_35px_rgba(20,32,19,0.12)]">
          {/* Subtle olive ambient radial glow */}
          <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-[#4A6B49]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4A6B49]/30 border border-[#6B8E6A]/30 text-[9px] font-black uppercase tracking-[0.2em] text-[#A8C9A6] mb-2.5 backdrop-blur-xs">
              <Leaf size={11} className="text-[#A8C9A6]" /> Traditional Herbal Remedies
            </span>

            <h1 className="text-2xl sm:text-4xl font-normal text-white tracking-tight leading-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
              {heroTitle}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-4 max-w-xl">
              {heroSubtitle}
            </p>

            {/* Trust row */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-white/10">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200/90">
                  <ShieldCheck size={13} className="text-[#89B387]" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CONCERN */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Shop by Ayurveda Concern</h2>
            <p className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">Targeted Health Solutions</p>
          </div>
          {selectedConcern !== 'all' && (
            <button
              onClick={() => setSelectedConcern('all')}
              className="text-xs font-bold text-[#4A6B49] hover:underline cursor-pointer"
            >
              Reset Concern Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {concernsList.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedConcern === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedConcern(c.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer text-center ${
                  isSelected 
                    ? 'bg-[#4A6B49] border-[#4A6B49] text-white shadow-md shadow-[#4A6B49]/20' 
                    : 'bg-white border-slate-200/60 text-slate-700 hover:border-[#4A6B49]/40 hover:bg-[#FAFBFD]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#4A6B49]/10 text-[#4A6B49]'
                }`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-bold leading-tight">{c.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED BRANDS */}
      {availableBrands.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Featured Ayurveda Brands</span>
              {selectedBrand !== 'all' && (
                <button 
                  onClick={() => setSelectedBrand('all')} 
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Show All Brands
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {availableBrands.map((b) => {
                const isSelected = selectedBrand === b.name;
                return (
                  <button
                    key={b.name}
                    onClick={() => setSelectedBrand(isSelected ? 'all' : b.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200/70 hover:bg-slate-100'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {b.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. PRODUCT LISTING GRID WITH SIDEBAR */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 sticky top-28">
            
            {/* Search filter */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search Ayurveda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#4A6B49] shadow-xs"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category summary badge */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 block mb-1">Category</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">{categoryName} Catalog</span>
                <span className="px-2.5 py-1 rounded-full bg-[#4A6B49]/10 text-[#4A6B49] text-xs font-extrabold">
                  {products.length} Products
                </span>
              </div>
            </div>

            {/* Concern Refinement */}
            <div>
              <h3 className="text-[10px] font-bold tracking-[0.16em] text-slate-400 uppercase mb-3">Refine by Concern</h3>
              <div className="space-y-1">
                {concernsList.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConcern(c.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedConcern === c.id
                        ? 'bg-[#4A6B49]/10 text-[#4A6B49] font-bold'
                        : 'text-slate-600 hover:bg-slate-100/70'
                    }`}
                  >
                    <span>{c.label}</span>
                    {selectedConcern === c.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[10px] font-bold tracking-[0.16em] text-slate-400 uppercase">Max Price</h3>
                <span className="text-xs font-bold text-slate-800">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#4A6B49] cursor-pointer"
              />
            </div>

            {/* In Stock Only Toggle */}
            <label className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/60 shadow-xs cursor-pointer">
              <span className="text-xs font-bold text-slate-700">In Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#4A6B49] focus:ring-[#4A6B49] cursor-pointer"
              />
            </label>
          </aside>

          {/* MAIN PRODUCT GRID & CONTROLS */}
          <main className="flex-1 w-full">
            
            {/* Header controls bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/60">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> of <span className="font-bold text-slate-800">{products.length}</span> products
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 shadow-xs cursor-pointer"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400 hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-slate-200/80 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#4A6B49] cursor-pointer shadow-xs"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-3xl h-72 p-4 flex flex-col justify-between">
                    <div className="w-full h-36 bg-slate-100 rounded-2xl mb-4" />
                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                    <div className="h-4 w-1/2 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} {...product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center my-6">
                <Leaf size={40} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-base font-bold text-slate-800 mb-1">No Ayurvedic Products Found</h3>
                <p className="text-xs text-slate-400 mb-6">Try resetting filters or adjusting search keywords.</p>
                <button
                  onClick={() => {
                    setSelectedConcern('all');
                    setSelectedBrand('all');
                    setSearchQuery('');
                    setPriceRange(2000);
                    setInStockOnly(false);
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* 5. EDUCATIONAL "ABOUT AYURVEDA" SECTION */}
      {educationalContent && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-800/40 rounded-[32px] p-8 sm:p-10 text-white relative overflow-hidden shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white/10 text-emerald-300 backdrop-blur-xs flex-shrink-0">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight mb-2 text-emerald-100">{educationalContent.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-3xl">
                  {educationalContent.body}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MOBILE FILTER MODAL */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end lg:hidden">
          <div className="w-80 bg-white h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-sm font-bold text-slate-800">Filter Products</h2>
                <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search Ayurveda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              {/* Concerns */}
              <div className="mb-6">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Concern</h3>
                <div className="space-y-1">
                  {concernsList.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedConcern(c.id); setMobileFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                        selectedConcern === c.id ? 'bg-[#4A6B49] text-white font-bold' : 'text-slate-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-[#4A6B49] text-white rounded-full text-xs font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryLandingPage;
