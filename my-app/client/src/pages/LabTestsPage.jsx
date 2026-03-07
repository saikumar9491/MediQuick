import React, { useState, useEffect } from 'react';

const LabTestsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);

  // 1. DYNAMIC HUB BANNERS
  const hubBanners = [
    {
      title: "Reports in 24 Hours",
      desc: "Fastest digital report delivery in Amritsar Hub.",
      icon: "⚡",
      bg: "from-blue-600 to-indigo-700",
      accent: "bg-blue-400"
    },
    {
      title: "100% Safe Home Pickup",
      desc: "Vaccinated phlebotomists with sterilized kits.",
      icon: "🛡️",
      bg: "from-emerald-600 to-teal-700",
      accent: "bg-emerald-400"
    },
    {
      title: "NABL Certified Labs",
      desc: "Precision diagnostics with international standards.",
      icon: "🔬",
      bg: "from-slate-800 to-slate-900",
      accent: "bg-slate-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === hubBanners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [hubBanners.length]);

  const filters = [
    { name: 'All', icon: '📋' },
    { name: 'Full Body', icon: '👤' },
    { name: 'Diabetes', icon: '🩸' },
    { name: 'Heart', icon: '🫀' },
    { name: 'Immunity', icon: '🛡️' },
  ];

  const packages = [
    {
      id: 1,
      name: "Comprehensive Hub Checkup",
      tests: "85+ Tests (Includes CBC, Liver, Kidney, Thyroid, Vitamins)",
      price: 1499,
      mrp: 3999,
      tag: "Best Value",
      category: "Full Body",
      color: "from-blue-600 to-indigo-600",
      isPremium: true
    },
    {
      id: 2,
      name: "Sugar Control Profile",
      tests: "HbA1c, Fasting Blood Sugar, Insulin Resistance",
      price: 699,
      mrp: 1500,
      tag: "Specialist",
      category: "Diabetes",
      color: "from-orange-500 to-red-500",
      isPremium: false
    },
    {
      id: 3,
      name: "Vital Heart Screen",
      tests: "Lipid Profile, Cardiac Risk Markers, Homocysteine",
      price: 1199,
      mrp: 2800,
      tag: "Life Saver",
      category: "Heart",
      color: "from-rose-500 to-pink-600",
      isPremium: false
    }
  ];

  const filteredPackages = activeFilter === 'All' 
    ? packages 
    : packages.filter(pkg => pkg.category === activeFilter);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* 1. UNIQUE SMART-SLIDE BANNER */}
        <div className="relative mb-16 group">
          <div className={`relative h-[250px] md:h-[350px] rounded-[3rem] overflow-hidden text-white shadow-2xl transition-all duration-1000 bg-gradient-to-br ${hubBanners[currentSlide].bg}`}>
            
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 p-12 opacity-10 text-[15rem] md:text-[20rem] pointer-events-none transition-transform duration-1000 group-hover:scale-110">
              {hubBanners[currentSlide].icon}
            </div>

            <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between px-8 md:px-16 z-10 gap-8">
              <div className="max-w-xl text-center md:text-left">
                <span className={`text-[10px] font-black uppercase tracking-[0.4em] px-4 py-1 rounded-full mb-4 inline-block backdrop-blur-md ${hubBanners[currentSlide].accent} text-white`}>
                   Amritsar Hub Diagnostics
                </span>
                <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4 animate-fadeIn">
                  {hubBanners[currentSlide].title}
                </h1>
                <p className="text-sm md:text-xl font-bold italic opacity-80 mb-6">
                  {hubBanners[currentSlide].desc}
                </p>
                <button className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                  Book A Slot Now
                </button>
              </div>

              {/* Glassmorphism Report Widget */}
              <div className="hidden lg:flex flex-col bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] w-72 shadow-2xl animate-pulse">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-3 w-20 bg-white/30 rounded-full" />
                  <div className="h-3 w-10 bg-emerald-400 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-white/20 rounded-full" />
                  <div className="h-2 w-3/4 bg-white/20 rounded-full" />
                  <div className="h-10 w-full bg-white/10 rounded-xl mt-4 border border-white/5 flex items-center px-4">
                    <div className="h-2 w-8 bg-emerald-400 rounded-full mr-2" />
                    <div className="h-2 w-16 bg-white/30 rounded-full" />
                  </div>
                </div>
                <p className="text-[8px] font-black uppercase tracking-widest mt-6 text-white/50 text-center">Digital Report Sample</p>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-8 left-8 md:left-16 flex gap-2">
              {hubBanners.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-12 bg-white' : 'w-3 bg-white/30'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. CATEGORY SELECTOR */}
        <div className="flex gap-4 overflow-x-auto pb-6 mb-12 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.name}
              onClick={() => setActiveFilter(f.name)}
              className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${
                activeFilter === f.name 
                ? 'bg-slate-900 text-white border-slate-900 scale-105' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200 hover:text-blue-600'
              }`}
            >
              <span>{f.icon}</span>
              {f.name}
            </button>
          ))}
        </div>

        {/* 3. STEP-BY-STEP STRIP */}
        <div className="bg-white/40 backdrop-blur-md rounded-[3rem] p-8 border border-white/60 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-2xl font-black text-xl italic shadow-lg shadow-blue-200">01</div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-tight">Book Test</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Select Hub Package</p>
            </div>
          </div>
          <div className="hidden md:block h-px flex-grow bg-slate-200" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-2xl font-black text-xl italic">02</div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-tight">Sample Pickup</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Home Collection</p>
            </div>
          </div>
          <div className="hidden md:block h-px flex-grow bg-slate-200" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 text-white flex items-center justify-center rounded-2xl font-black text-xl italic shadow-lg shadow-emerald-100">03</div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-tight">Digital Report</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Within 24 Hours</p>
            </div>
          </div>
        </div>

        {/* 4. PACKAGE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative bg-white rounded-[3rem] border border-slate-100 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group flex flex-col ${pkg.isPremium ? 'scale-105 shadow-2xl shadow-blue-100 border-blue-100 z-10' : ''}`}
            >
              <div className={`h-3 bg-gradient-to-r ${pkg.color}`} />
              
              <div className="p-10 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-6">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${pkg.isPremium ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    {pkg.tag}
                  </span>
                  {pkg.isPremium && <span className="text-xl">⭐</span>}
                </div>

                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800 leading-none mb-4 group-hover:text-blue-600 transition-colors">
                  {pkg.name}
                </h3>
                
                <p className="text-[11px] font-bold text-slate-400 mb-8 leading-relaxed uppercase tracking-wide">
                  {pkg.tests}
                </p>

                <div className="mt-auto">
                  <div className="flex items-end gap-3 mb-8">
                    <div className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{pkg.price}</div>
                    <div className="text-base text-slate-300 line-through font-bold mb-1">₹{pkg.mrp}</div>
                    <div className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg mb-1">
                      {Math.round((pkg.mrp-pkg.price)/pkg.mrp*100)}% OFF
                    </div>
                  </div>

                  <button className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${pkg.isPremium ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700' : 'bg-slate-900 text-white shadow-slate-200 hover:bg-blue-600'}`}>
                    Schedule Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LabTestsPage;