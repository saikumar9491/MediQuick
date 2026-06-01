import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ChevronRight, 
  ShoppingBag, 
  Search,
  LayoutGrid,
  ListFilter,
  CheckCircle2
} from 'lucide-react';
import MedicineCard from '../components/medicine/MedicineCard';
import { API_BASE } from '../utils/apiConfig';

import { useLocation, useNavigate } from 'react-router-dom';

const MedicinesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [subFilter, setSubFilter] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = useMemo(() => [
    {
      title: "Diabetes Care Hub",
      desc: "Up to 30% off on premium insulin & monitors.",
      bg: "from-[#00a2a4] to-[#008296]",
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
      bg: "from-[#ff6f61] to-[#e65a50]",
      tag: "VITAMINS",
      icon: "🍎"
    },
  ], []);

  // Map slugs to readable names
  const categoryMap = {
    'hair-care': 'Hair Care',
    'fitness': 'Fitness & Health',
    'sexual-wellness': 'Sexual Wellness',
    'vitamins': 'Vitamins & Nutrition',
    'supports': 'Supports & Braces',
    'immunity': 'Immunity Boosters',
    'homeopathy': 'Homeopathy',
    'pet-care': 'Pet Care',
    'flash': 'Flash Deals',
    'skin-care': 'Skin Care',
    'oral-care': 'Oral Care',
    'elderly-care': 'Elderly Care',
    'baby-care': 'Baby Care',
    'women-care': 'Women Care',
    'men-grooming': 'Men Grooming'
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      const queryParams = new URLSearchParams(location.search);
      const rawFilter = queryParams.get('filter');
      const rawSub = queryParams.get('sub');

      // Update state for UI
      let displayFilter = 'All';
      if (rawFilter) {
        displayFilter = categoryMap[rawFilter] || rawFilter.charAt(0).toUpperCase() + rawFilter.slice(1).replace(/-/g, ' ');
      }
      setFilter(displayFilter);
      
      let displaySub = '';
      if (rawSub) {
        displaySub = rawSub
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      setSubFilter(displaySub);

      try {
        let url = `${API_BASE}/api/medicines`;
        const params = new URLSearchParams();
        if (rawFilter && rawFilter !== 'flash') params.append('category', displayFilter);
        if (rawSub) params.append('subCategory', displaySub);
        
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url);
        let data = await res.json();
        
        if (rawFilter === 'flash') {
          data = data.filter(m => m.isFlashDeal);
        }
        
        setMedicines(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [location.search]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const categories = [
    { name: 'All', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop' },
    { name: 'Flash Deals', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100&h=100&fit=crop' },
    { name: 'Hair Care', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=100&h=100&fit=crop' },
    { name: 'Fitness & Health', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&h=100&fit=crop' },
    { name: 'Sexual Wellness', image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=100&h=100&fit=crop' },
    { name: 'Vitamins & Nutrition', image: 'https://images.unsplash.com/photo-1550572017-edb79903ccfb?w=100&h=100&fit=crop' },
    { name: 'Diabetes', image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=100&h=100&fit=crop' },
    { name: 'Cardiac', image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=100&h=100&fit=crop' },
    { name: 'Pain Relief', image: 'https://images.unsplash.com/photo-1550572017-edb79903ccfb?w=100&h=100&fit=crop' },
    { name: 'Skin Care', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100&h=100&fit=crop' },
    { name: 'Oral Care', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=100&h=100&fit=crop' },
    { name: 'Elderly Care', image: 'https://images.unsplash.com/photo-1516302752946-60124f464010?w=100&h=100&fit=crop' },
    { name: 'Baby Care', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=100&h=100&fit=crop' },
    { name: 'Women Care', image: 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?w=100&h=100&fit=crop' },
    { name: 'Men Grooming', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=100&h=100&fit=crop' },
    { name: 'Ayurveda', image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=100&h=100&fit=crop' },
  ];

  const filteredMedicines = medicines; 

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        
        {/* Portal Banner - Hidden on mobile to save space for grid */}
        <section className="hidden md:block mb-10 overflow-hidden rounded-2xl bg-slate-900 shadow-sm border border-slate-100 mx-4 sm:mx-0">
          <div className="relative h-[180px] sm:h-[240px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-br ${banners[currentBanner].bg} p-8 sm:p-12`}
              >
                <div className="absolute right-10 top-1/2 -translate-y-1/2 text-8xl opacity-10 select-none">
                  {banners[currentBanner].icon}
                </div>
                
                <div className="relative z-10 flex h-full flex-col justify-center">
                  <span className="mb-3 w-fit rounded bg-white/20 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                    {banners[currentBanner].tag} COLLECTION
                  </span>
                  <h1 className="max-w-xl text-2xl font-black tracking-tight text-white sm:text-4xl">
                    {banners[currentBanner].title}
                  </h1>
                  <p className="mt-2 max-w-md text-xs font-bold text-white/80 sm:text-sm uppercase tracking-wider">
                    {banners[currentBanner].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentBanner === i ? 'w-6 bg-white' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-row gap-0 sm:gap-8 bg-white sm:bg-transparent min-h-screen sm:min-h-0">
          
          {/* Sidebar */}
          <aside className="w-[80px] sm:w-64 shrink-0 bg-[#f4f6f9] sm:bg-transparent border-r border-slate-100 sm:border-0 h-[calc(100vh-64px)] sm:h-auto overflow-y-auto custom-scrollbar-hidden sticky top-16 sm:top-28">
            <div className="space-y-0 sm:space-y-6 sm:bg-white sm:p-5 sm:rounded-xl sm:shadow-sm sm:border sm:border-slate-100">
              <div className="hidden sm:flex mb-6 items-center justify-between border-b border-slate-50 pb-4">
                <div className="flex items-center gap-2">
                  <ListFilter className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Categories</h3>
                </div>
              </div>

              <div className="flex flex-col gap-0 sm:gap-1">
                {categories.map((catObj) => {
                  const cat = catObj.name;
                  const isActive = filter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        if (cat === 'All') {
                          navigate('/medicines');
                        } else if (cat === 'Flash Deals') {
                          navigate('/medicines?filter=flash');
                        } else if (cat === 'Ayurveda') {
                          navigate('/ayurveda');
                        } else {
                          const slug = cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                          navigate(`/medicines?filter=${slug}`);
                        }
                      }}
                      className={`relative flex flex-col sm:flex-row items-center justify-center sm:justify-between py-3 sm:px-4 sm:py-2.5 text-center sm:text-left transition-all ${
                        isActive
                          ? 'bg-white sm:bg-blue-600 text-slate-900 sm:text-white shadow-sm sm:shadow-md sm:shadow-blue-100 sm:rounded-lg'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 sm:rounded-lg'
                      }`}
                    >
                      {/* Active indicator bar on mobile */}
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00a2a4] sm:hidden rounded-r-full" />}
                      
                      <div className="w-12 h-12 sm:hidden mb-1 bg-white rounded-xl shadow-sm overflow-hidden p-1 border border-slate-100">
                        <img src={catObj.image} alt={cat} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <span className="text-[9px] sm:text-xs font-bold leading-tight">{cat}</span>
                      {isActive && <ChevronRight className="hidden sm:block h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust Section - Hidden on mobile */}
            <div className="hidden sm:block mt-6 rounded-xl bg-slate-900 p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-blue-600/20 blur-xl" />
                <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-blue-400" /> Guaranteed Quality
                </h4>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  All products at MediQuick are sourced from verified manufacturers and stored at optimal temperatures.
                </p>
              </div>
          </aside>

          {/* Grid Container */}
          <main className="flex-1 min-w-0 bg-white sm:bg-transparent p-2 sm:p-0">
            <div className="hidden sm:flex mb-8 flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                  {filter} {subFilter && <span className="text-blue-600">› {subFilter}</span>} <span className="text-blue-600">Items</span>
                </h2>
                <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Showing {filteredMedicines.length} verified products
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-lg bg-white p-1 shadow-sm border border-slate-100">
                  <button className="rounded-md bg-slate-50 p-2 text-slate-900"><LayoutGrid size={14} /></button>
                  <button className="rounded-md p-2 text-slate-400 hover:bg-slate-50"><Search size={14} /></button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="aspect-[4/5] animate-pulse rounded-xl bg-slate-100 border border-slate-100" />
                ))}
              </div>
            ) : filteredMedicines.length > 0 ? (
              <motion.div layout className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                <AnimatePresence>
                  {filteredMedicines.map((med) => (
                    <motion.div
                      key={med._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <MedicineCard {...med} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-slate-100">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="mt-6 text-sm font-black uppercase tracking-widest text-slate-900">No items found</h3>
                <p className="mt-1 text-[10px] font-bold text-slate-400">Try adjusting your filters or search criteria.</p>
                <button 
                  onClick={() => setFilter('All')}
                  className="mt-8 rounded-lg bg-slate-900 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg active:scale-95 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default MedicinesPage;