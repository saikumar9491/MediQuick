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
  Package
} from 'lucide-react';
import CategoryCard from './components/CategoryCard';
import { API_BASE } from '../../utils/apiConfig';

const AllCategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);

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
          {/* Background gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(0,162,164,0.15)_0%,transparent_70%),radial-gradient(circle_at_20%_80%,rgba(124,58,237,0.1)_0%,transparent_60%),linear-gradient(135deg,#0a1628_0%,#0c2340_40%,#062a2b_100%)]" />
          
          {/* Decorative blob shapes */}
          <div className="absolute top-6 right-20 w-48 h-48 rounded-full bg-[#00a2a4]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-40 w-64 h-32 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 px-8 py-12 sm:px-14 sm:py-16 flex flex-col lg:flex-row items-center lg:items-start gap-8 justify-between">
            
            {/* Hero Left Text */}
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

              {/* Stats Row */}
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

            {/* Hero Right — decorative grid preview */}
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
