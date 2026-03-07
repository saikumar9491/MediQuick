import React, { useState, useEffect, useMemo } from 'react';
import MedicineCard from '../components/medicine/MedicineCard';

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [currentBanner, setCurrentBanner] = useState(0);

  // 1. DYNAMIC CATEGORY BANNERS
  const banners = useMemo(() => [
    { title: "Diabetes Care Hub", desc: "Up to 30% off on premium insulin & monitors.", bg: "bg-blue-600", tag: "DIABETES" },
    { title: "Cardiac Essentials", desc: "Save big on daily heart health maintenance.", bg: "bg-rose-600", tag: "CARDIAC" },
    { title: "Winter Wellness", desc: "Immunity boosters and vitamins at flat 25% off.", bg: "bg-emerald-600", tag: "VITAMINS" }
  ], []);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE}/api/medicines`);
        const data = await res.json();
        setMedicines(data);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();

    // Auto-rotate banner every 5 seconds
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const categories = ['All', 'Diabetes', 'Cardiac', 'Pain Relief', 'Vitamins', 'Skin Care', 'Ayurveda'];

  const filteredMedicines = filter === 'All' 
    ? medicines 
    : medicines.filter(m => m.category === filter);

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* 1. AUTO-ROTATING CATEGORY BANNER */}
        <div className={`relative h-[160px] md:h-[240px] rounded-[2.5rem] overflow-hidden text-white shadow-xl transition-all duration-700 mb-10 px-8 md:px-16 flex flex-col justify-center ${banners[currentBanner].bg}`}>
           {/* Decorative Background Elements */}
           <div className="absolute top-0 right-0 p-10 opacity-10 text-[10rem] pointer-events-none">💊</div>
           
           <div className="relative z-10">
             <span className="text-[10px] font-black tracking-[0.3em] bg-white/20 px-3 py-1 rounded-full uppercase mb-4 inline-block">
               {banners[currentBanner].tag} COLLECTION
             </span>
             <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none mb-2">
               {banners[currentBanner].title}
             </h1>
             <p className="text-sm md:text-lg font-bold italic opacity-90">{banners[currentBanner].desc}</p>
           </div>

           {/* Progress Dots */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
             {banners.map((_, i) => (
               <div key={i} className={`h-1 rounded-full transition-all duration-300 ${currentBanner === i ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />
             ))}
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* 2. SIDEBAR FILTER */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-28">
              <h3 className="text-lg font-black italic uppercase tracking-tighter mb-4 text-slate-800">Shop by Category</h3>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`text-left px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      filter === cat ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* 3. PRODUCT GRID */}
          <main className="flex-grow">
            <div className="flex justify-between items-end mb-8 px-2">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                {filter} <span className="text-blue-600">Items</span>
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredMedicines.length} Products Found</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1,2,3,4,5,6].map(n => <div key={n} className="h-80 bg-slate-200 rounded-[2.5rem]" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedicines.map(med => (
                  <div key={med._id} className="animate-fadeIn">
                    <MedicineCard {...med} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default MedicinesPage;