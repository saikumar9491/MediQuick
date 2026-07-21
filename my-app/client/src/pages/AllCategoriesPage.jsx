import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  Grid, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard/ProductCard';
import { API_BASE } from '../utils/apiConfig';

const AllCategoriesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryNav, setSelectedCategoryNav] = useState('All');
  const navigate = useNavigate();
  const scrollRefs = useRef({});

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/medicines?limit=1000`);
        const data = await res.json();
        const medArray = Array.isArray(data) ? data : (data.medicines || []);
        setMedicines(medArray);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const groupedMedicines = medicines.reduce((acc, med) => {
    const cat = med.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(med);
    return acc;
  }, {});

  const categoryNames = Object.keys(groupedMedicines);

  const scroll = (catName, direction) => {
    const container = scrollRefs.current[catName];
    if (container) {
      const scrollAmount = 340;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredCategories = selectedCategoryNav === 'All'
    ? categoryNames
    : categoryNames.filter(c => c.toLowerCase() === selectedCategoryNav.toLowerCase());

  return (
    <div className="min-h-screen bg-[#FAFBFD] pb-24 pt-4 sm:pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
          <button onClick={() => navigate('/')} className="hover:text-slate-700 cursor-pointer">Home</button>
          <span>/</span>
          <span className="text-slate-800 font-bold">All Categories</span>
        </nav>

        {/* Compact Hero Banner */}
        <section className="mb-8 overflow-hidden rounded-[24px] shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(0,162,164,0.12)_0%,transparent_100%),linear-gradient(135deg,#0a1525_0%,#032d2e_100%)]" />
          
          <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <span className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00a2a4]/20 border border-[#00a2a4]/30 text-[9px] font-black uppercase tracking-[0.2em] text-[#00d4d6]">
                <Layers size={12} className="text-[#00d4d6]" /> Complete Department Directory
              </span>

              <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Health & Wellness Categories
              </h1>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300 max-w-md">
                Browse verified medicines and healthcare essentials curated by specialty medical departments.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-white max-w-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00d4d6]">Platform Summary</span>
              <p className="text-xs font-bold text-slate-100">
                {medicines.length} Products across {categoryNames.length} Departments
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300 pt-1">
                <ShieldCheck size={13} className="text-[#00d4d6]" />
                <span>100% Genuine Certified Brands</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Category Jump Bar */}
        <section className="mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 custom-scrollbar">
            <button
              onClick={() => setSelectedCategoryNav('All')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                selectedCategoryNav === 'All'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Departments ({categoryNames.length})
            </button>

            {categoryNames.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryNav(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                  selectedCategoryNav === cat
                    ? 'bg-[#00a2a4] text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat} ({groupedMedicines[cat].length})
              </button>
            ))}
          </div>
        </section>

        {/* Category Sections */}
        {loading ? (
          <div className="space-y-12 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <div className="h-6 w-48 bg-slate-100 rounded" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(j => (
                    <div key={j} className="h-72 bg-white rounded-3xl border border-slate-100" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {filteredCategories.map(catName => (
              <section key={catName} className="relative group">
                
                {/* Department Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/70">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#00a2a4]/10 text-[#00a2a4] flex items-center justify-center font-bold">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight">{catName}</h2>
                      <span className="text-[11px] font-medium text-slate-400">
                        {groupedMedicines[catName].length} Verified Products
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/medicines?category=${encodeURIComponent(catName)}`)}
                    className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-[#00a2a4] text-slate-700 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View All {catName}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Left/Right Scroll Control Buttons */}
                {groupedMedicines[catName].length > 3 && (
                  <>
                    <button
                      onClick={() => scroll(catName, 'left')}
                      className="absolute left-[-16px] top-[55%] -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white text-slate-800 shadow-lg border border-slate-200 flex items-center justify-center hover:bg-[#00a2a4] hover:text-white transition-all cursor-pointer"
                      title="Scroll Left"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => scroll(catName, 'right')}
                      className="absolute right-[-16px] top-[55%] -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white text-slate-800 shadow-lg border border-slate-200 flex items-center justify-center hover:bg-[#00a2a4] hover:text-white transition-all cursor-pointer"
                      title="Scroll Right"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                {/* Horizontal Scroll Product Carousel */}
                <div
                  ref={el => scrollRefs.current[catName] = el}
                  className="flex gap-4 overflow-x-auto pt-2 pb-4 scroll-smooth custom-scrollbar-hidden snap-x"
                >
                  {groupedMedicines[catName].map(product => (
                    <div 
                      key={product._id} 
                      className="min-w-[170px] max-w-[170px] sm:min-w-[195px] sm:max-w-[195px] snap-start"
                    >
                      <ProductCard {...product} />
                    </div>
                  ))}
                </div>

              </section>
            ))}
          </div>
        )}

        {!loading && medicines.length === 0 && (
          <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center my-6">
            <ShoppingBag size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Catalog Update In Progress</h3>
            <p className="text-xs text-slate-400">Our pharmacy inventory is currently syncing. Please check back shortly.</p>
          </div>
        )}

      </div>

      <style>{`
        .custom-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AllCategoriesPage;
