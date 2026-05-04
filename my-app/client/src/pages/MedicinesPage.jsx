import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ChevronRight, 
  ShoppingBag, 
  Search,
  LayoutGrid,
  ListFilter
} from 'lucide-react';
import MedicineCard from '../components/medicine/MedicineCard';
import { API_BASE } from '../utils/apiConfig';

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = useMemo(() => [
    {
      title: "Diabetes Care Hub",
      desc: "Up to 30% off on premium insulin & monitors.",
      bg: "from-blue-600 to-blue-800",
      tag: "DIABETES",
      icon: "💉"
    },
    {
      title: "Cardiac Essentials",
      desc: "Save big on daily heart health maintenance.",
      bg: "from-rose-500 to-rose-700",
      tag: "CARDIAC",
      icon: "❤️"
    },
    {
      title: "Winter Wellness",
      desc: "Immunity boosters and vitamins at flat 25% off.",
      bg: "from-emerald-500 to-emerald-700",
      tag: "VITAMINS",
      icon: "🍎"
    },
  ], []);

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

    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const categories = [
    'All',
    'Diabetes',
    'Cardiac',
    'Pain Relief',
    'Vitamins',
    'Skin Care',
    'Ayurveda',
  ];

  const filteredMedicines = useMemo(() => {
    if (filter === 'All') return medicines;
    return medicines.filter((m) => m.category?.toLowerCase() === filter.toLowerCase());
  }, [filter, medicines]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Category Banner */}
        <section className="mb-10 overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl">
          <div className="relative h-[200px] sm:h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`absolute inset-0 bg-gradient-to-br ${banners[currentBanner].bg} p-8 sm:p-12 md:p-16`}
              >
                <div className="absolute right-10 top-1/2 -translate-y-1/2 text-9xl opacity-10 select-none">
                  {banners[currentBanner].icon}
                </div>
                
                <div className="relative z-10 flex h-full flex-col justify-center">
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 w-fit rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md"
                  >
                    {banners[currentBanner].tag} COLLECTION
                  </motion.span>
                  <h1 className="max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                    {banners[currentBanner].title}
                  </h1>
                  <p className="mt-4 max-w-md text-sm font-medium text-white/80 sm:text-lg">
                    {banners[currentBanner].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-6 left-8 flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentBanner === i ? 'w-8 bg-white' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28 space-y-8">
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListFilter className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900">Categories</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Filter</span>
                </div>

                <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                        filter === cat
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>{cat}</span>
                      {filter === cat && <ChevronRight className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Widget */}
              <div className="hidden lg:block overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl relative group">
                <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-blue-600/20 blur-2xl group-hover:bg-blue-600/40 transition-colors" />
                <h4 className="relative z-10 text-xl font-bold leading-tight">Join MediCare Plus</h4>
                <p className="relative z-10 mt-2 text-xs text-slate-400">Save up to 10% extra on every order.</p>
                <button className="relative z-10 mt-6 w-full rounded-xl bg-white py-3 text-xs font-bold text-slate-900 transition-all hover:bg-blue-600 hover:text-white">
                  Join Now
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid Container */}
          <main className="flex-1 min-w-0">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {filter} <span className="text-blue-600">Pharmacy</span>
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-400">
                  Showing {filteredMedicines.length} premium products
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-xl bg-white p-1 shadow-sm border border-slate-100">
                  <button className="rounded-lg bg-slate-50 p-2 text-slate-900"><LayoutGrid className="h-4 w-4" /></button>
                  <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 transition-colors"><Search className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="aspect-[3/4] animate-pulse rounded-3xl bg-slate-200" />
                ))}
              </div>
            ) : filteredMedicines.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredMedicines.map((med) => (
                    <motion.div
                      key={med._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MedicineCard {...med} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">No items found</h3>
                <p className="mt-2 text-sm text-slate-400">Try adjusting your filters or search criteria.</p>
                <button 
                  onClick={() => setFilter('All')}
                  className="mt-8 rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-600 active:scale-95"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MedicinesPage;