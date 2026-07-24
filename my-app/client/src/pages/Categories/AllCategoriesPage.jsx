import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  LayoutGrid,
  Package,
  ChevronRight,
  Pill,
  Leaf,
  Activity,
  Apple,
  Heart,
  Shield,
  Baby,
  Dog,
  BookOpen,
  Stethoscope,
  Dumbbell,
  FlaskConical,
  Scissors,
  Smile,
  ShoppingBag
} from 'lucide-react';
import CategoryCard from './components/CategoryCard';
import { API_BASE } from '../../utils/apiConfig';

const iconMap = {
  Pill, Leaf, Activity, Apple, Heart, Shield, Baby, Dog,
  BookOpen, Stethoscope, Dumbbell, Sparkles, FlaskConical,
  Scissors, Smile, Layers, LayoutGrid, ShoppingBag
};

const cardGradients = [
  {
    bg: 'from-violet-600 via-purple-600 to-indigo-700',
    light: 'from-violet-50 to-purple-50',
    accent: '#7c3aed',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-violet-200'
  },
  {
    bg: 'from-teal-500 via-[#00a2a4] to-emerald-600',
    light: 'from-teal-50 to-emerald-50',
    accent: '#00a2a4',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-teal-200'
  },
  {
    bg: 'from-rose-500 via-pink-600 to-red-500',
    light: 'from-rose-50 to-pink-50',
    accent: '#e11d48',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-rose-200'
  },
  {
    bg: 'from-amber-500 via-orange-500 to-yellow-500',
    light: 'from-amber-50 to-orange-50',
    accent: '#d97706',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-amber-200'
  },
  {
    bg: 'from-blue-600 via-sky-500 to-cyan-500',
    light: 'from-blue-50 to-sky-50',
    accent: '#0284c7',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-blue-200'
  },
  {
    bg: 'from-green-500 via-emerald-500 to-teal-500',
    light: 'from-green-50 to-emerald-50',
    accent: '#10b981',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-emerald-200'
  },
  {
    bg: 'from-slate-700 via-slate-600 to-slate-800',
    light: 'from-slate-50 to-slate-100',
    accent: '#475569',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-slate-200'
  },
  {
    bg: 'from-fuchsia-500 via-purple-500 to-pink-500',
    light: 'from-fuchsia-50 to-pink-50',
    accent: '#a21caf',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-fuchsia-200'
  },
  {
    bg: 'from-lime-500 via-green-500 to-emerald-600',
    light: 'from-lime-50 to-green-50',
    accent: '#65a30d',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-lime-200'
  },
];

const THEMED_ROUTES = {
  'ayurveda': '/ayurveda',
  'lab tests': '/lab-tests',
  'diagnostics': '/lab-tests',
  'doctor consultations': '/consult',
  'consult top doctors': '/consult',
};

const AllCategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/categories/with-counts`);
        const data = await res.json();
        setCategories(data.categories || []);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        console.error('Failed to load categories directory:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoriesData();
  }, []);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter(cat => {
      const nameMatches = cat.name.toLowerCase().includes(q);
      const subMatches = (cat.subOptions || []).some(sub => {
        const subName = typeof sub === 'object' ? sub.name : sub;
        return subName.toLowerCase().includes(q);
      });
      return nameMatches || subMatches;
    });
  }, [categories, searchQuery]);

  const activeCategories = filteredCategories.filter(c => c.count > 0);
  const totalDepts = categories.filter(c => c.count > 0).length;

  const handleCategoryClick = (category) => {
    const nameLower = (category.name || '').toLowerCase().trim();
    const themed = THEMED_ROUTES[nameLower];
    if (themed) {
      navigate(themed);
    } else {
      navigate(`/medicines?category=${encodeURIComponent(category.name)}`);
    }
  };

  const handleSubClick = (catName, subName) => {
    navigate(`/medicines?category=${encodeURIComponent(catName)}&subCategory=${encodeURIComponent(subName)}`);
  };

  // Render Mobile Viewport Explorer
  if (isMobile) {
    const selectedCategory = activeCategories[activeCategoryIdx] || activeCategories[0];
    const palette = cardGradients[activeCategoryIdx % cardGradients.length] || cardGradients[0];

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col pt-0 pb-16">
        {/* Header Bar */}
        <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-14 z-20 shadow-3xs">
          <h1 className="text-sm font-black text-slate-800 tracking-tight">Departments</h1>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-[IBM_Plex_Mono]">
            {totalDepts} categories
          </span>
        </div>

        {/* Categories Explorer Content Grid */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20 bg-white">
            <span className="w-8 h-8 border-3 border-[#0057FF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeCategories.length > 0 ? (
          <div className="flex flex-1 h-[calc(100vh-180px)] overflow-hidden">
            
            {/* Left Sidebar */}
            <div className="w-24 bg-slate-100 border-r border-slate-200/50 overflow-y-auto flex-shrink-0 flex flex-col h-full">
              {activeCategories.map((cat, idx) => {
                const isActive = idx === activeCategoryIdx;
                const IconComponent = iconMap[cat.iconName] || ShoppingBag;
                return (
                  <button
                    key={cat._id || cat.name}
                    onClick={() => setActiveCategoryIdx(idx)}
                    className={`py-3.5 px-2 flex flex-col items-center text-center justify-center border-b border-slate-150/40 transition-all select-none focus:outline-none ${
                      isActive 
                        ? 'bg-white border-l-4 border-[#0057FF] text-[#0057FF] font-bold' 
                        : 'text-slate-500 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 ${
                      isActive ? 'bg-[#0057FF]/10 text-[#0057FF]' : 'bg-slate-200/60 text-slate-400'
                    }`}>
                      <IconComponent size={16} />
                    </div>
                    <span className="text-[8.5px] font-bold leading-tight tracking-tight uppercase break-words w-full px-0.5">
                      {cat.name.replace('Consultations', 'Consult')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Active Panel */}
            {selectedCategory && (
              <div className="flex-1 bg-white overflow-y-auto p-4 flex flex-col h-full">
                {/* Category Banner Card */}
                <div className={`rounded-2xl p-4 bg-gradient-to-br ${palette.bg} text-white mb-4 relative overflow-hidden shadow-xs flex-shrink-0`}>
                  <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/10 blur-md" />
                  <span className="text-[8px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full border border-white/20 inline-block font-[IBM_Plex_Mono]">
                    {selectedCategory.count} Products
                  </span>
                  <h2 className="text-base font-black tracking-tight mt-1.5 leading-tight">{selectedCategory.name}</h2>
                  
                  <button 
                    onClick={() => handleCategoryClick(selectedCategory)}
                    className="mt-3.5 inline-flex items-center gap-1.5 bg-white text-slate-900 font-extrabold text-[9px] uppercase tracking-wider px-3.5 py-2 rounded-full hover:scale-102 active:scale-98 transition-all"
                  >
                    <span>View All</span>
                    <ChevronRight size={10} />
                  </button>
                </div>

                {/* Subcategories Header Label */}
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2.5 block font-[IBM_Plex_Mono]">
                  Subcategories
                </span>

                {/* Subcategories list grid */}
                {selectedCategory.subOptions && selectedCategory.subOptions.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 pb-8">
                    {selectedCategory.subOptions.map((sub, i) => {
                      const subName = typeof sub === 'object' ? sub.name : sub;
                      const subCount = typeof sub === 'object' ? sub.count : 0;
                      return (
                        <button
                          key={i}
                          onClick={() => handleSubClick(selectedCategory.name, subName)}
                          className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col justify-between text-left hover:border-[#0057FF]/30 hover:bg-[#0057FF]/5 active:scale-[0.98] transition-all min-h-[76px]"
                        >
                          <span className="text-[10px] font-bold text-slate-800 leading-snug line-clamp-2 w-full">{subName}</span>
                          {subCount > 0 ? (
                            <span className="text-[8px] font-extrabold text-slate-400 bg-slate-100 border border-slate-200/50 px-1.5 py-0.5 rounded-md inline-block max-w-max mt-2 font-[IBM_Plex_Mono]">
                              {subCount} items
                            </span>
                          ) : (
                            <span className="text-[8px] font-extrabold text-[#0057FF] uppercase tracking-wider mt-2 font-[IBM_Plex_Mono]">
                              Explore
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-10 text-center border border-dashed border-slate-200 rounded-xl">
                    <span className="text-xs font-semibold text-slate-400">No subcategories listed.</span>
                  </div>
                )}
              </div>
            )}

          </div>
        ) : (
          <div className="py-16 text-center">
            <span className="text-xs font-semibold text-slate-400">No categories found.</span>
          </div>
        )}
      </div>
    );
  }

  // Render Desktop Layout (original design)
  return (
    <div className="min-h-screen pb-24 pt-4 sm:pt-6" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-slate-700 cursor-pointer transition-colors">Home</button>
          <span>/</span>
          <span className="text-slate-800 font-bold">Shop by Category</span>
        </nav>

        {/* ─── HERO SECTION ─── */}
        <section className="relative mb-12 overflow-hidden rounded-[32px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(0,162,164,0.15)_0%,transparent_70%),radial-gradient(circle_at_20%_80%,rgba(124,58,237,0.1)_0%,transparent_60%),linear-gradient(135deg,#0a1628_0%,#0c2340_40%,#062a2b_100%)]" />
          <div className="absolute top-6 right-20 w-48 h-48 rounded-full bg-[#00a2a4]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-40 w-64 h-32 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 px-8 py-12 sm:px-14 sm:py-16 flex flex-col lg:flex-row items-center lg:items-start gap-8 justify-between">
            <div className="max-w-xl text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00a2a4]/20 border border-[#00a2a4]/30 text-[10px] font-black uppercase tracking-[0.18em] text-[#00d4d6] mb-4">
                <Layers size={12} /> Complete Health Directory
              </span>

              <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-3" style={{ letterSpacing: '-0.02em' }}>
                Shop by
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00d4d6] to-[#7c3aed]">
                  Category
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md mb-6">
                Browse our complete range of health & wellness products. Every department stocked with 100% genuine certified brands.
              </p>

              <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-black text-white">{totalCount}+</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Products</p>
                </div>
                <div className="w-px h-10 bg-white/10 hidden sm:block" />
                <div className="text-center">
                  <p className="text-2xl font-black text-white">{totalDepts}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Departments</p>
                </div>
                <div className="w-px h-10 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
                  <ShieldCheck size={15} className="text-[#00d4d6]" />
                  <span className="text-xs font-bold text-slate-200">100% Genuine</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-3 gap-3 flex-shrink-0">
              {['Vitamins', 'Skin Care', 'Diabetes', 'Heart Health', 'Ayurveda', 'Fitness'].map((name, i) => {
                const colors = [
                  'from-violet-500 to-indigo-600',
                  'from-teal-500 to-[#00a2a4]',
                  'from-rose-500 to-pink-600',
                  'from-amber-500 to-orange-500',
                  'from-green-500 to-emerald-600',
                  'from-blue-500 to-sky-600',
                ];
                return (
                  <div
                    key={name}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors[i]} flex flex-col items-center justify-center shadow-lg border border-white/10`}
                  >
                    <Sparkles size={20} className="text-white/80 mb-1" />
                    <span className="text-[9px] font-bold text-white/90 text-center leading-tight px-1">{name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── SEARCH BAR ─── */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search any category or subcategory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 pl-13 pr-12 py-4 rounded-full text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#00a2a4] focus:shadow-[0_0_0_4px_rgba(0,162,164,0.1)] transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer transition-all"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {searchQuery && (
            <p className="text-center text-xs text-slate-400 font-semibold mt-3">
              Found <span className="font-bold text-slate-700">{activeCategories.length}</span> departments matching "{searchQuery}"
            </p>
          )}
        </div>

        {/* ─── CATEGORY GRID ─── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-[20px] sm:rounded-[28px] bg-white border border-slate-100 overflow-hidden animate-pulse">
                <div className="h-24 sm:h-36 bg-slate-100" />
                <div className="p-3 sm:p-5 space-y-2">
                  <div className="h-3 w-2/3 bg-slate-100 rounded" />
                  <div className="flex gap-1.5 flex-wrap">
                    <div className="h-5 w-12 bg-slate-100 rounded-xl" />
                    <div className="h-5 w-10 bg-slate-100 rounded-xl" />
                  </div>
                  <div className="h-8 w-full bg-slate-100 rounded-full mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : activeCategories.length > 0 ? (
          <>
            {!searchQuery && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-slate-200/80" />
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-2">
                  <LayoutGrid size={14} className="text-[#00a2a4]" />
                  {totalDepts} Health Departments
                </span>
                <div className="flex-1 h-px bg-slate-200/80" />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
              {activeCategories.map((cat, idx) => (
                <CategoryCard key={cat._id || cat.name} category={cat} index={idx} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white border border-slate-200/60 rounded-[28px] p-16 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">No Departments Found</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
              No health department matches your search for "{searchQuery}". Try a different keyword.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-2.5 bg-slate-900 hover:bg-[#00a2a4] text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              View All Categories
            </button>
          </div>
        )}

        {/* Bottom CTA Banner */}
        {!loading && activeCategories.length > 0 && !searchQuery && (
          <div className="mt-14 bg-gradient-to-r from-slate-900 to-[#032d2e] rounded-[28px] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/5 shadow-xl">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00d4d6] mb-1">Not sure where to start?</p>
              <h2 className="text-xl sm:text-2xl font-bold text-white" style={{ letterSpacing: '-0.01em' }}>
                Browse All Medicines
              </h2>
              <p className="text-sm text-slate-400 mt-1">All {totalCount}+ products in one searchable catalog</p>
            </div>
            <button
              onClick={() => navigate('/medicines')}
              className="flex-shrink-0 px-7 py-3.5 bg-gradient-to-r from-[#00a2a4] to-teal-500 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-[#00a2a4]/30 transition-all cursor-pointer flex items-center gap-2 group"
            >
              <span>View All Medicines</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

      </div>

      <style>{`
        .pl-13 { padding-left: 3.25rem; }
      `}</style>
    </div>
  );
};

export default AllCategoriesPage;
