import React, { useState, useEffect } from 'react';
import MedicineCard from '../components/medicine/MedicineCard';

/**
 * @description Advanced Dermatology Center Page
 * Responsive + mobile-friendly version
 */
const SkinCarePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState('All');

  const routineSteps = [
    { id: 1, name: 'All', icon: '✨' },
    { id: 2, name: 'Cleanse', icon: '🧼' },
    { id: 3, name: 'Treat', icon: '🧪' },
    { id: 4, name: 'Hydrate', icon: '💧' },
    { id: 5, name: 'Protect', icon: '☀️' },
  ];

  useEffect(() => {
    const fetchSkinCare = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE}/api/medicines`);
        const data = await res.json();

        const skinCareData = data.filter((item) => item.category === 'Skin Care');
        setProducts(skinCareData);
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkinCare();
  }, []);

  const filteredProducts =
    activeStep === 'All'
      ? products
      : products.filter((p) =>
          p.description?.toLowerCase().includes(activeStep.toLowerCase())
        );

  const spotlight = products[0];

  return (
    <div className="min-h-screen bg-[#FFF5F6] pt-20 sm:pt-24 pb-10 sm:pb-12 px-4 font-sans text-slate-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 sm:mb-12 lg:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 sm:mb-10">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-pink-500 bg-pink-100 px-3 sm:px-4 py-1.5 rounded-full inline-block">
                Dermatology Hub Amritsar
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none mt-4 break-words">
                The <span className="text-pink-600">Skincare</span> <br className="hidden sm:block" />
                Formula
              </h1>
            </div>

            <div className="max-w-sm lg:text-right">
              <p className="text-sm sm:text-base lg:text-lg font-bold italic opacity-70 leading-relaxed text-slate-600">
                Unlock your glow with certified clinical solutions. Free analysis with every consultation.
              </p>
            </div>
          </div>

          {/* ROUTINE BUTTONS */}
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 border border-slate-100 shadow-xl shadow-pink-100/50 flex flex-wrap gap-2 sm:gap-3 relative">
            {routineSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.name)}
                className={`flex-1 min-w-[140px] sm:min-w-[160px] flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-xl transition-all ${
                  activeStep === step.name
                    ? 'bg-pink-600 text-white shadow-xl shadow-pink-100'
                    : 'text-slate-500 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl sm:text-2xl transition-all ${
                    activeStep === step.name ? 'bg-white/20' : 'bg-slate-100'
                  }`}
                >
                  {step.icon}
                </div>

                <div className="text-left">
                  <span
                    className={`text-[9px] sm:text-[10px] font-black uppercase tracking-tight ${
                      activeStep === step.name ? 'text-pink-100' : 'text-slate-400'
                    }`}
                  >
                    Step {step.id - 1}
                  </span>
                  <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    {step.name}
                  </h4>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* MAIN GRID */}
          <main className="flex-grow min-w-0">
            <div className="flex items-end justify-between mb-6 sm:mb-8 px-1 sm:px-2 gap-4">
              <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                {activeStep} <span className="text-pink-600">Collection</span>
              </h2>
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                {filteredProducts.length} Items
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-60 sm:h-72 lg:h-80 bg-slate-200 rounded-[1.8rem] sm:rounded-[2.5rem]"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((p) => (
                  <div key={p._id} className="animate-fadeIn">
                    <MedicineCard {...p} />
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* SPOTLIGHT */}
          {!loading && spotlight && (
            <aside className="w-full xl:w-80 flex-shrink-0">
              <div className="xl:sticky xl:top-28 bg-white/50 backdrop-blur-xl p-5 sm:p-6 lg:p-8 rounded-[2rem] sm:rounded-[3rem] border border-white/60 shadow-2xl shadow-pink-100 overflow-hidden text-center flex flex-col items-center relative">
                <div className="absolute top-0 right-0 p-6 sm:p-10 opacity-10 text-[6rem] sm:text-[8rem] lg:text-[10rem]">
                  ✨
                </div>

                <span className="text-[9px] sm:text-[10px] font-black text-pink-600 uppercase tracking-widest mb-5 sm:mb-6 relative z-10">
                  Product Spotlight
                </span>

                <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full bg-white shadow-xl flex items-center justify-center p-4 mb-5 sm:mb-6 relative z-10">
                  <img
                    src={spotlight.image}
                    alt={spotlight.name}
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-slate-900 text-white font-black text-[9px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full">
                    {spotlight.category}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black italic uppercase tracking-tighter text-slate-900 mb-2 relative z-10">
                  {spotlight.name}
                </h3>

                <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 mb-5 sm:mb-6 line-clamp-2 italic relative z-10">
                  {spotlight.description}
                </p>

                <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-5 sm:mb-6 relative z-10">
                  ₹{spotlight.price}
                </div>

                <button className="bg-slate-900 text-white w-full py-3.5 sm:py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-600 transition-colors shadow-lg relative z-10">
                  Quick Add to Hub
                </button>
              </div>
            </aside>
          )}
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

export default SkinCarePage;