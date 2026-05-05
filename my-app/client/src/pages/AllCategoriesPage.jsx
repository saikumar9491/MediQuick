import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MedicineCard from '../components/medicine/MedicineCard';
import { API_BASE } from '../utils/apiConfig';

const AllCategoriesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollRefs = useRef({});

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/medicines`);
        const data = await res.json();
        setMedicines(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const groupedMedicines = medicines.reduce((acc, med) => {
    if (!acc[med.category]) acc[med.category] = [];
    acc[med.category].push(med);
    return acc;
  }, {});

  const scroll = (catName, direction) => {
    const container = scrollRefs.current[catName];
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Catalog Banner */}
        <section className="mb-12 overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border border-white/10">
          <div className="relative h-[200px] sm:h-[260px]">
            <div className={`absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-800 p-8 sm:p-12`}>
              <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[10rem] opacity-10 select-none hidden sm:block">
                📑
              </div>
              
              <div className="relative z-10 flex h-full flex-col justify-center">
                <span className="mb-4 w-fit rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[3px] text-white backdrop-blur-xl border border-white/10">
                  DIRECTORY COLLECTION
                </span>
                <h1 className="max-w-2xl text-3xl font-black tracking-tight text-white sm:text-5xl uppercase italic leading-none">
                  Health & <span className="text-teal-200">Wellness</span> Catalog
                </h1>
                <p className="mt-4 max-w-md text-xs font-bold text-white/70 sm:text-sm uppercase tracking-[2px] leading-relaxed">
                  Premium verified selections across all specialized medical departments.
                </p>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
          </div>
        </section>

        {loading ? (
          <div className="space-y-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-8 w-48 bg-slate-200 rounded mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(j => <div key={j} className="h-64 bg-white rounded-xl border border-slate-100" />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {Object.keys(groupedMedicines).map(catName => (
              <section key={catName} className="animate-fadeIn relative group">
                <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-teal-50 text-[#00a2a4]">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-black uppercase tracking-[2px] text-slate-800">
                        {catName}
                      </h2>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {groupedMedicines[catName].length} VERIFIED PRODUCTS
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/medicines?filter=${catName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`)}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 hover:border-[#00a2a4] hover:text-[#00a2a4] transition-all shadow-sm"
                  >
                    Enter Hub
                    <ChevronRight size={14} />
                  </button>
                </div>
                
                {/* Scroll Buttons */}
                <button 
                  onClick={() => scroll(catName, 'left')}
                  className="absolute left-[-20px] top-[60%] z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-xl border border-slate-100 transition-all hover:bg-[#00a2a4] hover:text-white md:flex group-hover:left-[-10px] opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => scroll(catName, 'right')}
                  className="absolute right-[-20px] top-[60%] z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-xl border border-slate-100 transition-all hover:bg-[#00a2a4] hover:text-white md:flex group-hover:right-[-10px] opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={20} />
                </button>

                <div 
                  ref={el => scrollRefs.current[catName] = el}
                  className="custom-scrollbar-hidden flex gap-4 overflow-x-auto pt-4 pb-6 scroll-smooth snap-x"
                >
                  {groupedMedicines[catName].map((item) => (
                    <div key={item._id} className="min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] snap-start">
                      <MedicineCard {...item} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {!loading && medicines.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 h-20 w-20 flex items-center justify-center rounded-full bg-slate-50 text-slate-300">
               <ShoppingBag size={40} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-800">Hub Inventory Empty</h3>
            <p className="mt-2 text-sm font-bold text-slate-400">Our stock update is currently in progress. Please check back shortly.</p>
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
