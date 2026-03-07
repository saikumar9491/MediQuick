import React, { useState, useEffect } from 'react';
import MedicineCard from '../components/medicine/MedicineCard';

/**
 * @description Advanced Dermatology Center Page
 * Unique Features: Routine Step Navigator, "Glassmorphism" Spotlight, and Fade-in Effects.
 */
const SkinCarePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState('All');

  // unique skincare steps (can be added as 'tags' in seed.js)
  const routineSteps = [
    { id: 1, name: "All", icon: "✨" },
    { id: 2, name: "Cleanse", icon: "🧼" },
    { id: 3, name: "Treat", icon: "🧪" },
    { id: 4, name: "Hydrate", icon: "💧" },
    { id: 5, name: "Protect", icon: "☀️" }
  ];

  useEffect(() => {
    const fetchSkinCare = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE}/api/medicines`);
        const data = await res.json();
        
        // Filter to show ONLY Skin Care products
        const skinCareData = data.filter(item => item.category === 'Skin Care');
        setProducts(skinCareData);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkinCare();
  }, []);

  const filteredProducts = activeStep === 'All' 
    ? products 
    : products.filter(p => p.description?.toLowerCase().includes(activeStep.toLowerCase()));

  // Spotlight Product (First product found, just as a feature)
  const spotlight = products[0];

  return (
    <div className="min-h-screen bg-[#FFF5F6] pt-24 pb-12 px-4 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. INTERACTIVE "ROUTINE BUILDER" HEADER */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 bg-pink-100 px-4 py-1.5 rounded-full inline-block">
                Dermatology Hub Amritsar
              </span>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mt-4">
                The <span className="text-pink-600">Skincare</span> <br /> Formula
              </h1>
            </div>
            <div className="max-w-sm md:text-right">
              <p className="text-lg font-bold italic opacity-70 leading-relaxed text-slate-600">
                Unlock your glow with certified clinical solutions. Free analysis with every consultation.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-xl shadow-pink-100/50 flex flex-wrap gap-2 md:justify-around relative">
            {routineSteps.map(step => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.name)}
                className={`flex-grow flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${
                  activeStep === step.name 
                  ? 'bg-pink-600 text-white shadow-xl shadow-pink-100' 
                  : 'text-slate-500 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl transition-all ${
                  activeStep === step.name ? 'bg-white/20' : 'bg-slate-100'
                }`}>
                  {step.icon}
                </div>
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-tight ${
                    activeStep === step.name ? 'text-pink-100' : 'text-slate-400'
                  }`}>Step {step.id - 1}</span>
                  <h4 className="text-xs font-black uppercase tracking-widest">{step.name}</h4>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. PRODUCT GRID & SPOTLIGHT */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Main Grid */}
          <main className="flex-grow">
            <div className="flex justify-between items-end mb-8 px-2">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                {activeStep} <span className="text-pink-600">Collection</span>
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {filteredProducts.length} Items
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(n => <div key={n} className="h-80 bg-slate-200 rounded-[2.5rem]" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => (
                  <div key={p._id} className="animate-fadeIn">
                    <MedicineCard {...p} /> 
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* 3. UNIQUE "GLASSMORPHISM" SPOTLIGHT CARD */}
          {!loading && spotlight && (
            <aside className="w-full md:w-80 flex-shrink-0 relative">
               <div className="sticky top-28 bg-white/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/50 shadow-2xl shadow-pink-100 overflow-hidden text-center flex flex-col items-center">
                   <div className="absolute top-0 right-0 p-10 opacity-10 text-[10rem]">✨</div>
                   
                   <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest mb-6">Product Spotlight</span>
                   
                   <div className="w-40 h-40 rounded-full bg-white shadow-xl flex items-center justify-center p-4 mb-6 relative">
                       <img src={spotlight.image} alt={spotlight.name} className="w-full h-full object-contain" />
                       <span className="absolute -top-3 -right-3 bg-slate-900 text-white font-black text-xs px-3 py-1 rounded-full">{spotlight.category}</span>
                   </div>
                   
                   <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-900 mb-2">{spotlight.name}</h3>
                   <p className="text-[10px] font-bold text-slate-500 mb-6 line-clamp-2 italic">{spotlight.description}</p>
                   
                   <div className="text-3xl font-black text-slate-900 mb-6">₹{spotlight.price}</div>
                   
                   <button className="bg-slate-900 text-white w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-600 transition-colors shadow-lg">
                       Quick Add to Hub
                   </button>
               </div>
            </aside>
          )}

        </div>

      </div>

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default SkinCarePage;