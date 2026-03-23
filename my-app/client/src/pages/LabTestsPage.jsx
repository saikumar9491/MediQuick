import React, { useState, useEffect } from 'react';

const LabTestsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const filteredPackages =
    activeFilter === 'All'
      ? packages
      : packages.filter((pkg) => pkg.category === activeFilter);

  return (
    <div className="min-h-screen bg-slate-50 px-4  pb-14 font-sans text-slate-900 sm:pt-24 sm:pb-20">
      <div className="mx-auto max-w-7xl">
        {/* 1. UNIQUE SMART-SLIDE BANNER */}
        <div className="group relative mb-10 sm:mb-12 md:mb-16">
          <div
            className={`relative h-[220px] sm:h-[260px] md:h-[350px] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-br text-white shadow-2xl transition-all duration-1000 ${hubBanners[currentSlide].bg}`}
          >
            <div className="pointer-events-none absolute top-0 right-0 p-6 sm:p-8 md:p-12 text-[7rem] sm:text-[10rem] md:text-[15rem] lg:text-[20rem] opacity-10 transition-transform duration-1000 group-hover:scale-110">
              {hubBanners[currentSlide].icon}
            </div>

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-5 sm:px-8 md:flex-row md:justify-between md:px-12 lg:px-16">
              <div className="max-w-xl text-center md:text-left">
                <span
                  className={`mb-3 inline-block rounded-full px-3 sm:px-4 py-1 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.25em] sm:tracking-[0.35em] md:tracking-[0.4em] text-white backdrop-blur-md ${hubBanners[currentSlide].accent}`}
                >
                  Amritsar Hub Diagnostics
                </span>

                <h1 className="animate-fadeIn mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase italic tracking-tighter leading-none">
                  {hubBanners[currentSlide].title}
                </h1>

                <p className="mb-5 sm:mb-6 text-sm sm:text-base md:text-xl font-bold italic opacity-80">
                  {hubBanners[currentSlide].desc}
                </p>

                <button className="rounded-2xl bg-white px-5 sm:px-6 md:px-8 py-3 text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-widest text-slate-900 shadow-xl transition-transform hover:scale-105">
                  Book A Slot Now
                </button>
              </div>

              <div className="hidden lg:flex w-72 flex-col rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl animate-pulse">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-3 w-20 rounded-full bg-white/30" />
                  <div className="h-3 w-10 rounded-full bg-emerald-400" />
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full rounded-full bg-white/20" />
                  <div className="h-2 w-3/4 rounded-full bg-white/20" />
                  <div className="mt-4 flex h-10 w-full items-center rounded-xl border border-white/5 bg-white/10 px-4">
                    <div className="mr-2 h-2 w-8 rounded-full bg-emerald-400" />
                    <div className="h-2 w-16 rounded-full bg-white/30" />
                  </div>
                </div>
                <p className="mt-6 text-center text-[8px] font-black uppercase tracking-widest text-white/50">
                  Digital Report Sample
                </p>
              </div>
            </div>

            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 md:left-8 md:translate-x-0 lg:left-16">
              {hubBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    currentSlide === i ? 'w-10 sm:w-12 bg-white' : 'w-3 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. CATEGORY SELECTOR */}
        <div className="scrollbar-hide mb-10 sm:mb-12 flex gap-3 sm:gap-4 overflow-x-auto pb-4 sm:pb-6">
          {filters.map((f) => (
            <button
              key={f.name}
              onClick={() => setActiveFilter(f.name)}
              className={`whitespace-nowrap rounded-2xl sm:rounded-3xl border px-5 sm:px-6 md:px-8 py-3 sm:py-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.12em] sm:tracking-widest shadow-sm transition-all ${
                activeFilter === f.name
                  ? 'scale-105 border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-100 bg-white text-slate-400 hover:border-blue-200 hover:text-blue-600'
              } flex items-center gap-2 sm:gap-3`}
            >
              <span>{f.icon}</span>
              {f.name}
            </button>
          ))}
        </div>

        {/* 3. STEP-BY-STEP STRIP */}
        <div className="mb-10 sm:mb-12 md:mb-16 flex flex-col items-start gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] border border-white/60 bg-white/40 p-5 sm:p-6 md:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg sm:text-xl font-black italic text-white shadow-lg shadow-blue-200">
              01
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-tight">Book Test</h4>
              <p className="text-[10px] font-bold uppercase text-slate-400">Select Hub Package</p>
            </div>
          </div>

          <div className="hidden h-px flex-grow bg-slate-200 md:block" />

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg sm:text-xl font-black italic text-white">
              02
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-tight">Sample Pickup</h4>
              <p className="text-[10px] font-bold uppercase text-slate-400">Home Collection</p>
            </div>
          </div>

          <div className="hidden h-px flex-grow bg-slate-200 md:block" />

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-emerald-500 text-lg sm:text-xl font-black italic text-white shadow-lg shadow-emerald-100">
              03
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-tight">Digital Report</h4>
              <p className="text-[10px] font-bold uppercase text-slate-400">Within 24 Hours</p>
            </div>
          </div>
        </div>

        {/* 4. PACKAGE GRID */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`group relative flex flex-col overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 bg-white transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] ${
                pkg.isPremium ? 'z-10 border-blue-100 shadow-2xl shadow-blue-100 lg:scale-105' : ''
              }`}
            >
              <div className={`h-3 bg-gradient-to-r ${pkg.color}`} />

              <div className="flex flex-grow flex-col p-6 sm:p-8 md:p-10">
                <div className="mb-5 sm:mb-6 flex items-center justify-between">
                  <span
                    className={`rounded-full border px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${
                      pkg.isPremium
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-100 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {pkg.tag}
                  </span>
                  {pkg.isPremium && <span className="text-lg sm:text-xl">⭐</span>}
                </div>

                <h3 className="mb-4 text-2xl sm:text-3xl font-black uppercase italic tracking-tighter leading-none text-slate-800 transition-colors group-hover:text-blue-600">
                  {pkg.name}
                </h3>

                <p className="mb-6 sm:mb-8 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide leading-relaxed text-slate-400">
                  {pkg.tests}
                </p>

                <div className="mt-auto">
                  <div className="mb-6 sm:mb-8 flex flex-wrap items-end gap-2 sm:gap-3">
                    <div className="text-3xl sm:text-4xl font-black italic tracking-tighter text-slate-900">
                      ₹{pkg.price}
                    </div>
                    <div className="mb-1 text-sm sm:text-base font-bold text-slate-300 line-through">
                      ₹{pkg.mrp}
                    </div>
                    <div className="mb-1 rounded-lg bg-emerald-50 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-black text-emerald-600">
                      {Math.round(((pkg.mrp - pkg.price) / pkg.mrp) * 100)}% OFF
                    </div>
                  </div>

                  <button
                    className={`w-full rounded-2xl py-4 sm:py-5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-xl transition-all active:scale-95 ${
                      pkg.isPremium
                        ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
                        : 'bg-slate-900 text-white shadow-slate-200 hover:bg-blue-600'
                    }`}
                  >
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default LabTestsPage;