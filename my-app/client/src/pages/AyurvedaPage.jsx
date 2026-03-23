import React, { useState, useEffect } from 'react';
import MedicineCard from '../components/medicine/MedicineCard';

const AyurvedaPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDosha, setActiveDosha] = useState('All');

  const doshas = [
    { name: 'All', icon: '🌿', desc: 'Universal Wellness' },
    { name: 'Vata', icon: '💨', desc: 'Energy & Movement' },
    { name: 'Pitta', icon: '🔥', desc: 'Metabolism & Focus' },
    { name: 'Kapha', icon: '💧', desc: 'Structure & Calm' },
  ];

  useEffect(() => {
    const fetchAyurveda = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE}/api/medicines`);
        const data = await res.json();
        const ayurvedaData = data.filter((item) => item.category === 'Ayurveda');
        setProducts(ayurvedaData);
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAyurveda();
  }, []);

  const filteredProducts =
    activeDosha === 'All'
      ? products
      : products.filter((p) =>
          p.description?.toLowerCase().includes(activeDosha.toLowerCase())
        );

  return (
    <div className="min-h-screen bg-[#fcfdfa] px-4 pb-12  sm:pt-24 sm:pb-14 font-serif text-[#2d4d3a]">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <div className="relative mb-10 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] bg-[#2d4d3a] p-5 sm:p-8 md:p-12 lg:p-14 text-white shadow-xl">
          <div className="pointer-events-none absolute right-0 top-0 translate-x-10 -translate-y-6 rotate-45 text-[7rem] sm:text-[10rem] md:text-[13rem] lg:text-[15rem] opacity-5">
            🌿
          </div>

          <div className="relative z-10 max-w-2xl">
            <span className="mb-3 block text-[8px] sm:text-[9px] font-black uppercase tracking-[0.35em] sm:tracking-[0.5em] text-emerald-400">
              Amritsar Hub Official
            </span>

            <h1 className="mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-tight">
              Ancient <span className="text-emerald-200">Healing</span>
            </h1>

            <p className="max-w-lg text-sm sm:text-base font-medium italic leading-relaxed opacity-80">
              Ethically sourced formulations designed to restore your natural
              biological rhythm.
            </p>
          </div>
        </div>

        {/* Dosha Navigator */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <div className="mb-6 sm:mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-[#2d4d3a]">
                Dosha Navigator
              </h2>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-600/60">
                Select your energy type
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {doshas.map((dosha) => (
              <button
                key={dosha.name}
                onClick={() => setActiveDosha(dosha.name)}
                className={`group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] border-2 p-4 sm:p-5 md:p-6 transition-all duration-500 ${
                  activeDosha === dosha.name
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg -translate-y-1'
                    : 'bg-white text-slate-400 border-emerald-50 hover:border-emerald-100 hover:shadow-md hover:-translate-y-1'
                }`}
              >
                <div
                  className={`mb-2 sm:mb-3 text-2xl sm:text-3xl transition-transform duration-500 group-hover:scale-110 ${
                    activeDosha === dosha.name ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  {dosha.icon}
                </div>

                <div className="text-[10px] sm:text-xs font-black uppercase italic tracking-tight sm:tracking-tighter">
                  {dosha.name}
                </div>

                <p
                  className={`mt-1 text-[8px] sm:text-[9px] font-bold ${
                    activeDosha === dosha.name
                      ? 'text-emerald-100'
                      : 'text-slate-400'
                  }`}
                >
                  {dosha.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="mb-16 sm:mb-20">
          <div className="mb-6 sm:mb-8 flex items-end justify-between gap-3 border-b border-emerald-50 pb-4">
            <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter">
              {activeDosha}{' '}
              <span className="text-emerald-600 opacity-50">Collection</span>
            </h3>

            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-emerald-800/40">
              {filteredProducts.length} Results
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8 animate-pulse">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-64 sm:h-72 lg:h-80 rounded-[1.75rem] sm:rounded-[2rem] md:rounded-[2.5rem] bg-emerald-50"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
              {filteredProducts.map((med, index) => (
                <div
                  key={med._id}
                  className="animate-fadeIn hover:scale-[1.01] transition-transform duration-500"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <MedicineCard {...med} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
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

export default AyurvedaPage;