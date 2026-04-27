import React, { useState, useEffect, useMemo } from 'react';
import MedicineCard from '../components/medicine/MedicineCard';
import { API_BASE } from '../utils/apiConfig';

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = useMemo(
    () => [
      {
        title: "Diabetes Care Hub",
        desc: "Up to 30% off on premium insulin & monitors.",
        bg: "bg-blue-600",
        tag: "DIABETES",
      },
      {
        title: "Cardiac Essentials",
        desc: "Save big on daily heart health maintenance.",
        bg: "bg-rose-600",
        tag: "CARDIAC",
      },
      {
        title: "Winter Wellness",
        desc: "Immunity boosters and vitamins at flat 25% off.",
        bg: "bg-emerald-600",
        tag: "VITAMINS",
      },
    ],
    []
  );

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
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

    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

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

  const filteredMedicines =
    filter === 'All'
      ? medicines
      : medicines.filter((m) => m.category === filter);

  return (
    <div className="min-h-screen bg-slate-50/50  sm:pt-20 pb-10 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* 1. AUTO-ROTATING CATEGORY BANNER */}
        <div
          className={`relative mb-8 sm:mb-10 flex h-[180px] sm:h-[220px] md:h-[240px] flex-col justify-center overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] px-5 sm:px-8 md:px-16 text-white shadow-xl transition-all duration-700 ${banners[currentBanner].bg}`}
        >
          <div className="pointer-events-none absolute top-0 right-0 p-4 sm:p-6 md:p-10 text-[5rem] sm:text-[7rem] md:text-[10rem] opacity-10">
            💊
          </div>

          <div className="relative z-10 max-w-2xl">
            <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">
              {banners[currentBanner].tag} COLLECTION
            </span>

            <h1 className="mb-2 text-2xl sm:text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
              {banners[currentBanner].title}
            </h1>

            <p className="text-xs sm:text-sm md:text-lg font-bold italic opacity-90">
              {banners[currentBanner].desc}
            </p>
          </div>

          <div className="absolute bottom-4 sm:bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentBanner === i ? 'w-8 bg-white' : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* 2. FILTER SECTION */}
          <aside className="w-full lg:w-64">
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-slate-100 lg:sticky lg:top-28">
              <h3 className="mb-4 text-base sm:text-lg font-black italic uppercase tracking-tighter text-slate-800">
                Shop by Category
              </h3>

              <div className="flex lg:flex-col flex-wrap gap-2 sm:gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.12em] sm:tracking-widest transition-all text-left ${
                      filter === cat
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                        : 'text-slate-400 hover:bg-slate-50 border border-slate-100 lg:border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* 3. PRODUCT GRID */}
          <main className="flex-grow min-w-0">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 px-1 sm:px-2">
              <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                {filter} <span className="text-blue-600">Items</span>
              </h2>

              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-widest">
                {filteredMedicines.length} Products Found
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-64 sm:h-72 lg:h-80 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] bg-slate-200"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {filteredMedicines.map((med) => (
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
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MedicinesPage;