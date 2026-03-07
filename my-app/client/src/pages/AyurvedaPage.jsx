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
        const ayurvedaData = data.filter(item => item.category === 'Ayurveda');
        setProducts(ayurvedaData);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAyurveda();
  }, []);

  const filteredProducts = activeDosha === 'All' 
    ? products 
    : products.filter(p => p.description?.toLowerCase().includes(activeDosha.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#fcfdfa] pt-24 pb-12 px-4 font-serif text-[#2d4d3a]">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. COMPACT PREMIUM HERO */}
        <div className="relative rounded-[3rem] overflow-hidden bg-[#2d4d3a] p-8 md:p-14 mb-12 text-white shadow-xl">
          {/* Reduced Icon Size and Opacity */}
          <div className="absolute top-0 right-0 opacity-5 text-[15rem] translate-x-20 -translate-y-10 rotate-45 pointer-events-none">🌿</div>
          
          <div className="relative z-10 max-w-2xl">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-400 mb-4 block">Amritsar Hub Official</span>
            {/* Reduced Text Size */}
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-tight mb-4">
              Ancient <span className="text-emerald-200">Healing</span>
            </h1>
            <p className="text-base font-medium italic opacity-80 leading-relaxed max-w-lg">
              Ethically sourced formulations designed to restore your natural biological rhythm.
            </p>
          </div>
        </div>

        {/* 2. INTERACTIVE DOSHA NAVIGATOR */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
             <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-[#2d4d3a]">Dosha Navigator</h2>
                <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">Select your energy type</p>
             </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {doshas.map((dosha) => (
              <button
                key={dosha.name}
                onClick={() => setActiveDosha(dosha.name)}
                className={`group p-6 rounded-[2.5rem] border-2 transition-all duration-700 relative overflow-hidden ${
                  activeDosha === dosha.name 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg -translate-y-1' 
                  : 'bg-white text-slate-400 border-emerald-50 hover:border-emerald-100 hover:shadow-md'
                }`}
              >
                <div className={`text-3xl mb-3 transition-transform duration-500 group-hover:scale-110 ${activeDosha === dosha.name ? 'opacity-100' : 'opacity-40'}`}>
                    {dosha.icon}
                </div>
                <div className="font-black uppercase text-xs tracking-tighter italic">{dosha.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. PRODUCT GRID */}
        <div className="mb-20">
          <div className="flex justify-between items-baseline mb-8 border-b border-emerald-50 pb-4">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">
              {activeDosha} <span className="text-emerald-600 opacity-50">Collection</span>
            </h3>
            <span className="text-[9px] font-black text-emerald-800/40 uppercase tracking-widest">
                {filteredProducts.length} Results
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
              {[1,2,3,4].map(n => <div key={n} className="h-80 bg-emerald-50 rounded-[2.5rem]" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map(med => (
                <div key={med._id} className="animate-fadeIn transition-transform duration-500 hover:scale-[1.01]">
                  <MedicineCard {...med} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AyurvedaPage;