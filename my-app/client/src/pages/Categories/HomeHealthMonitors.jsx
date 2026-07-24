import React, { useState, useEffect } from 'react';

// Handdrawn SVGs for Device illustrations
const BPCuffSVG = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#2E8B76]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Monitor device */}
    <rect x="15" y="45" width="45" height="35" rx="4" fill="white" />
    <rect x="20" y="50" width="35" height="20" rx="2" strokeWidth="1.5" />
    {/* Screen reading */}
    <path d="M23 60 h10 m3-5 l3 10 l3-15 l3 5 h7" strokeWidth="1" stroke="#D9614C" />
    {/* Cuff */}
    <path d="M70 30 C 85 30, 85 70, 70 70 C 65 70, 65 30, 70 30" fill="#748482" opacity="0.2" />
    <path d="M70 30 C 85 30, 85 70, 70 70" strokeWidth="2.5" />
    <rect x="68" y="40" width="6" height="20" rx="1" fill="#122E2A" />
    {/* Tube connecting monitor and cuff */}
    <path d="M45 80 C 45 90, 72 90, 72 65" strokeWidth="1.5" strokeDasharray="3,1" />
  </svg>
);

const ThermometerSVG = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#2E8B76]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Thermometer body */}
    <path d="M30 70 L65 35 A 5 5 0 0 1 72 42 L37 77 Z" fill="white" />
    {/* Metal tip */}
    <path d="M30 70 L34 66 L30 62 L26 66 Z" fill="#748482" />
    <path d="M23 77 L30 70" strokeWidth="3" stroke="#748482" />
    {/* Digital display */}
    <rect x="46" y="46" width="14" height="7" rx="1" strokeWidth="1" transform="rotate(-45 53 49.5)" />
    <text x="50" y="51" fontSize="4" fontFamily="monospace" fill="#122E2A" transform="rotate(-45 53 49.5)" fontWeight="bold">98.6</text>
    {/* Heat waves */}
    <path d="M70 25 C 72 23, 73 25, 75 23" stroke="#D9614C" strokeWidth="1.5" />
    <path d="M75 28 C 77 26, 78 28, 80 26" stroke="#D9614C" strokeWidth="1.5" />
  </svg>
);

const OximeterSVG = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#2E8B76]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Main device body (clip-on) */}
    <rect x="25" y="25" width="50" height="50" rx="8" fill="white" />
    <path d="M25 55 h50" strokeWidth="1" strokeDasharray="2,2" />
    {/* Opening clip mouth */}
    <path d="M25 60 C 20 60, 20 65, 25 65 h40" strokeWidth="1.5" />
    {/* LED Screen */}
    <rect x="35" y="32" width="30" height="18" rx="2" fill="#122E2A" />
    {/* SpO2 Reading */}
    <text x="39" y="44" fontSize="10" fontFamily="monospace" fill="#D9614C" fontWeight="bold">98</text>
    <text x="54" y="40" fontSize="4" fontFamily="sans-serif" fill="#2E8B76" fontWeight="bold">SpO2</text>
    <text x="54" y="46" fontSize="4" fontFamily="monospace" fill="#2E8B76">72</text>
  </svg>
);

const GlucoseMeterSVG = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#2E8B76]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Handheld meter */}
    <rect x="30" y="20" width="40" height="60" rx="10" fill="white" />
    {/* Screen */}
    <rect x="36" y="28" width="28" height="22" rx="2" strokeWidth="1.5" />
    <text x="40" y="42" fontSize="9" fontFamily="monospace" fill="#122E2A" fontWeight="bold">104</text>
    <text x="40" y="48" fontSize="4" fontFamily="sans-serif" fill="#748482">mg/dL</text>
    {/* Buttons */}
    <circle cx="50" cy="65" r="4" fill="#2E8B76" />
    <circle cx="40" cy="65" r="2.5" fill="#748482" />
    <circle cx="60" cy="65" r="2.5" fill="#748482" />
    {/* Test strip inserted at bottom */}
    <rect x="47" y="80" width="6" height="12" rx="1" fill="#748482" opacity="0.5" />
    <line x1="50" y1="80" x2="50" y2="92" stroke="#2E8B76" strokeWidth="1.5" />
    {/* Blood drop icon on strip */}
    <path d="M50 82 C 48 84, 48 86, 50 87 C 52 86, 52 84, 50 82" fill="#D9614C" stroke="none" />
  </svg>
);

const NebulizerSVG = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#2E8B76]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Nebulizer box unit */}
    <rect x="20" y="40" width="50" height="40" rx="5" fill="white" />
    <circle cx="30" cy="55" r="3" fill="#122E2A" />
    <line x1="25" y1="70" x2="45" y2="70" stroke="#748482" strokeWidth="1.5" />
    {/* Air outlet node */}
    <rect x="63" y="48" width="7" height="6" rx="1" fill="#748482" />
    {/* Mask Cup */}
    <path d="M78 25 L88 35 L78 45 L72 35 Z" fill="#748482" opacity="0.2" />
    <path d="M78 25 L88 35 L78 45 Z" strokeWidth="1.5" />
    {/* Tubing */}
    <path d="M66 54 C 66 70, 80 65, 80 43" strokeWidth="1.5" strokeDasharray="3,1" />
    {/* Mist vapor coming out of mask */}
    <path d="M86 28 C 91 26, 91 22, 94 20" stroke="#2E8B76" strokeWidth="1" strokeDasharray="1,1" />
    <path d="M89 33 C 94 32, 94 28, 97 27" stroke="#2E8B76" strokeWidth="1" strokeDasharray="1,1" />
  </svg>
);

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    brand: 'OMRON',
    name: 'Automatic Upper Arm BP Monitor',
    price: 2499,
    oldPrice: 2999,
    rating: 4.8,
    badge: 'FDA CLEARED',
    deviceType: 'bp',
    certifications: ['FDA Cleared', 'Clinically Validated'],
    connectivity: 'Bluetooth',
    subcategory: 'Blood Pressure'
  },
  {
    id: 2,
    brand: 'BRAUN',
    name: 'ThermoScan 7 Digital Ear Thermometer',
    price: 3299,
    oldPrice: 3899,
    rating: 4.9,
    badge: 'CLINICALLY VALIDATED',
    deviceType: 'thermometer',
    certifications: ['FDA Cleared', 'CE Marked', 'Clinically Validated'],
    connectivity: 'Manual',
    subcategory: 'Thermometers'
  },
  {
    id: 3,
    brand: 'OXYREAD',
    name: 'Fingertip Pulse Oximeter OLED',
    price: 1199,
    oldPrice: 1599,
    rating: 4.7,
    badge: 'FDA CLEARED',
    deviceType: 'oximeter',
    certifications: ['FDA Cleared', 'CE Marked'],
    connectivity: 'Manual',
    subcategory: 'Pulse Oximeters'
  },
  {
    id: 4,
    brand: 'ACCU-CHEK',
    name: 'Instant Blood Glucose Monitoring Kit',
    price: 1599,
    oldPrice: null,
    rating: 4.6,
    badge: 'FDA CLEARED',
    deviceType: 'glucose',
    certifications: ['FDA Cleared', 'Clinically Validated'],
    connectivity: 'Bluetooth',
    subcategory: 'Glucose Meters'
  },
  {
    id: 5,
    brand: 'PHILIPS',
    name: 'InnoSpire Portable Mesh Nebulizer',
    price: 2999,
    oldPrice: 3499,
    rating: 4.5,
    badge: 'CE MARKED',
    deviceType: 'nebulizer',
    certifications: ['CE Marked'],
    connectivity: 'Manual',
    subcategory: 'Nebulizers'
  },
  {
    id: 6,
    brand: 'BEURER',
    name: 'Arm BP Monitor with App Sync',
    price: 3899,
    oldPrice: 4499,
    rating: 4.7,
    badge: 'CLINICALLY VALIDATED',
    deviceType: 'bp',
    certifications: ['FDA Cleared', 'CE Marked', 'Clinically Validated'],
    connectivity: 'App Sync',
    subcategory: 'Blood Pressure'
  },
  {
    id: 7,
    brand: 'OMRON',
    name: 'Eco Temp Smart Digital Thermometer',
    price: 499,
    oldPrice: null,
    rating: 4.4,
    badge: 'CLINICALLY VALIDATED',
    deviceType: 'thermometer',
    certifications: ['CE Marked', 'Clinically Validated'],
    connectivity: 'Manual',
    subcategory: 'Thermometers'
  },
  {
    id: 8,
    brand: 'ACCU-CHEK',
    name: 'Guide Me Blood Glucose Meter',
    price: 1899,
    oldPrice: 2199,
    rating: 4.8,
    badge: 'FDA CLEARED',
    deviceType: 'glucose',
    certifications: ['FDA Cleared', 'CE Marked', 'Clinically Validated'],
    connectivity: 'Bluetooth',
    subcategory: 'Glucose Meters'
  }
];

const HomeHealthMonitors = () => {
  // Styles load injection
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const [activeSub, setActiveSub] = useState('All');
  const [favorites, setFavorites] = useState(new Set());
  const [cartCount, setCartCount] = useState(2);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Filters State
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState(new Set());
  const [selectedCertifications, setSelectedCertifications] = useState(new Set());
  const [selectedConnectivity, setSelectedConnectivity] = useState(new Set());
  const [sortBy, setSortBy] = useState('popular');

  const subcategories = ['All', 'Blood Pressure', 'Thermometers', 'Pulse Oximeters', 'Glucose Meters', 'Nebulizers'];

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDeviceTypeToggle = (type) => {
    setSelectedDeviceTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleCertToggle = (cert) => {
    setSelectedCertifications(prev => {
      const next = new Set(prev);
      if (next.has(cert)) next.delete(cert);
      else next.add(cert);
      return next;
    });
  };

  const handleConnectivityToggle = (conn) => {
    setSelectedConnectivity(prev => {
      const next = new Set(prev);
      if (next.has(conn)) next.delete(conn);
      else next.add(conn);
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedDeviceTypes(new Set());
    setSelectedCertifications(new Set());
    setSelectedConnectivity(new Set());
  };

  // Filter & Sort Logic
  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    // 1. Subcategory Chip filter
    if (activeSub !== 'All' && product.subcategory !== activeSub) {
      return false;
    }
    // 2. Device Type Filter sheet
    if (selectedDeviceTypes.size > 0 && !selectedDeviceTypes.has(product.deviceType)) {
      return false;
    }
    // 3. Certifications Filter sheet
    if (selectedCertifications.size > 0 && !product.certifications.some(c => selectedCertifications.has(c))) {
      return false;
    }
    // 4. Connectivity Filter sheet
    if (selectedConnectivity.size > 0 && !selectedConnectivity.has(product.connectivity)) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'low-high') return a.price - b.price;
    if (sortBy === 'high-low') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.id - a.id; // default popular
  });

  const renderIllustration = (type) => {
    switch (type) {
      case 'bp': return <BPCuffSVG />;
      case 'thermometer': return <ThermometerSVG />;
      case 'oximeter': return <OximeterSVG />;
      case 'glucose': return <GlucoseMeterSVG />;
      case 'nebulizer': return <NebulizerSVG />;
      default: return <BPCuffSVG />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F3F6F5] font-['IBM_Plex_Sans',sans-serif] text-[#122E2A] flex justify-center pb-12">
      {/* Constraints wrapper to mimic mobile layout on wide monitors */}
      <div className="w-full max-w-[420px] bg-[#F3F6F5] shadow-xl relative min-h-screen flex flex-col">
        
        {/* 1. STICKY HEADER */}
        <header className="sticky top-0 bg-[#F3F6F5]/95 backdrop-blur-md border-b border-[#748482]/20 px-4 py-3 z-30 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button 
              className="w-8 h-8 rounded-full flex items-center justify-center border border-[#748482]/30 hover:bg-slate-100/50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#2E8B76]"
              aria-label="Go Back"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#122E2A]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>

            {/* Breadcrumb Eyebrow */}
            <span className="text-[9px] font-bold tracking-widest uppercase text-[#748482] truncate max-w-[200px]">
              Shop / Health / Monitors
            </span>

            {/* Right Buttons */}
            <div className="flex items-center gap-2">
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center border border-[#748482]/30 hover:bg-slate-100/50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#2E8B76]"
                aria-label="Search items"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#122E2A]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center border border-[#748482]/30 hover:bg-slate-100/50 active:scale-95 transition-all relative focus:outline-none focus:ring-2 focus:ring-[#2E8B76]"
                aria-label="Open Cart"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#122E2A]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#D9614C] text-white text-[8px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center font-[IBM_Plex_Mono]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-lg font-black tracking-tight text-[#122E2A]">Home Health Monitors</h1>
            <p className="text-[10px] text-[#748482] leading-none mt-0.5">Clinically accurate monitoring from the comfort of home.</p>
          </div>
        </header>

        {/* 2. ECG WAVEFORM DIVIDER */}
        <div className="w-full px-4 py-1">
          <svg viewBox="0 0 400 30" className="w-full h-8 text-[#2E8B76]/40" fill="none">
            <polyline 
              points="0,15 120,15 130,15 135,5 140,25 145,0 150,20 155,15 160,15 165,10 170,15 180,15 280,15 285,15 290,5 295,25 300,0 305,20 310,15 315,15 320,15 400,15" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>

        {/* 3. SUBCATEGORY CHIP ROW */}
        <div className="w-full overflow-x-auto no-scrollbar py-2 px-4 flex gap-2 scroll-smooth">
          {subcategories.map((sub) => {
            const isActive = activeSub === sub;
            return (
              <button
                key={sub}
                onClick={() => {
                  setActiveSub(sub);
                  setVisibleCount(6); // reset pagination
                }}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#2E8B76] ${
                  isActive
                    ? 'bg-[#2E8B76] text-white border-[#2E8B76]'
                    : 'bg-white text-[#122E2A] border-[#748482]/20 hover:border-[#748482]/40'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* 4. UTILITY BAR & FILTERS */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#748482]/10 bg-white">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#748482] font-[IBM_Plex_Mono]">
            {filteredProducts.length} devices found
          </span>

          <div className="flex items-center gap-1.5">
            {/* Sort Select Custom */}
            <div className="relative border border-[#748482]/30 rounded-lg px-2 py-1 flex items-center bg-[#F3F6F5] hover:border-[#748482]/50">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-[10px] font-bold text-[#122E2A] bg-transparent outline-none pr-4 cursor-pointer focus:ring-2 focus:ring-[#2E8B76] rounded"
                aria-label="Sort products by"
              >
                <option value="popular">Popular</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
              <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 absolute right-1.5 pointer-events-none text-[#748482]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-1 border border-[#748482]/30 hover:border-[#2E8B76] hover:text-[#2E8B76] rounded-lg px-3 py-1 text-[10px] font-bold bg-white active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#2E8B76]"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              <span>Filter</span>
              {(selectedDeviceTypes.size > 0 || selectedCertifications.size > 0 || selectedConnectivity.size > 0) && (
                <span className="w-2 h-2 rounded-full bg-[#D9614C] animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* 5. TRUST STRIP */}
        <div className="w-full overflow-x-auto no-scrollbar py-2.5 px-4 flex gap-4 bg-[#2E8B76]/5 border-b border-[#2E8B76]/10">
          <div className="flex-shrink-0 flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2E8B76]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#122E2A]">FDA-cleared devices</span>
          </div>

          <div className="flex-shrink-0 flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2E8B76]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#122E2A]">Clinically validated</span>
          </div>

          <div className="flex-shrink-0 flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2E8B76]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#122E2A]">Free returns, 30 days</span>
          </div>
        </div>

        {/* 6. RESPONSIVE PRODUCT GRID */}
        <main className="flex-1 p-4">
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#748482]/40 flex items-center justify-center mx-auto text-[#748482]/50">
                🔍
              </div>
              <p className="text-xs font-semibold text-[#748482]">No matching medical devices found.</p>
              <button 
                onClick={clearFilters}
                className="text-xs font-bold text-[#2E8B76] hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.slice(0, visibleCount).map((product) => {
                const isFav = favorites.has(product.id);
                const hasDiscount = !!product.oldPrice && product.oldPrice > product.price;
                const discountPercent = hasDiscount ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

                return (
                  <div
                    key={product.id}
                    className="relative flex flex-col bg-white border border-[#748482]/10 rounded-2xl p-2.5 hover:shadow-md transition-all duration-300 group overflow-hidden"
                  >
                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                      {hasDiscount ? (
                        <span className="bg-[#D9614C] text-white text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-2xs font-[IBM_Plex_Mono]">
                          -{discountPercent}%
                        </span>
                      ) : (
                        <span className="bg-[#2E8B76] text-white text-[7px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-3xs">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Wishlist Heart Toggle */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center border border-slate-100 hover:border-slate-200 transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#2E8B76] ${
                        isFav ? 'text-[#D9614C]' : 'text-[#748482]/70'
                      }`}
                      aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : 'fill-none'}`} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>

                    {/* Illustration Container */}
                    <div className="h-28 flex items-center justify-center bg-[#F3F6F5]/50 rounded-xl mb-2.5 p-1 group-hover:scale-102 transition-transform duration-300 border border-[#748482]/5">
                      {renderIllustration(product.deviceType)}
                    </div>

                    {/* Brand */}
                    <span className="text-[7.5px] uppercase font-bold tracking-widest text-[#748482] font-[IBM_Plex_Mono] block leading-none mb-1">
                      {product.brand}
                    </span>

                    {/* Product Name */}
                    <h4 className="text-[11px] font-bold text-[#122E2A] leading-snug line-clamp-2 min-h-[32px] mb-1">
                      {product.name}
                    </h4>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-2.5">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} viewBox="0 0 24 24" className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? 'text-amber-500 fill-current' : 'text-slate-200'}`} fill="none" stroke="currentColor" strokeWidth="1.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[8px] font-bold text-[#748482] font-[IBM_Plex_Mono]">
                        {product.rating}
                      </span>
                    </div>

                    {/* Price & Action Bottom Row */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#122E2A] font-[IBM_Plex_Mono] leading-none">
                          ₹{product.price}
                        </span>
                        {hasDiscount && (
                          <span className="text-[8.5px] text-[#748482] line-through font-[IBM_Plex_Mono] leading-none mt-0.5">
                            ₹{product.oldPrice}
                          </span>
                        )}
                      </div>

                      {/* Quick Add To Cart Button */}
                      <button
                        onClick={() => {
                          setCartCount(prev => prev + 1);
                          import('react-hot-toast').then(({ default: toast }) => {
                            toast.success(`${product.name.split(' ').slice(0, 3).join(' ')} added to cart`);
                          });
                        }}
                        className="w-7 h-7 bg-[#2E8B76] hover:bg-[#122E2A] text-white rounded-lg flex items-center justify-center transition-all active:scale-90 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B76]"
                        aria-label={`Quick add ${product.name} to cart`}
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {filteredProducts.length > visibleCount && (
            <div className="w-full flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount(prev => prev + 4)}
                className="w-full max-w-[200px] border border-[#748482]/45 hover:border-[#2E8B76] hover:text-[#2E8B76] rounded-xl py-2 text-xs font-bold text-[#122E2A] bg-white active:scale-98 transition-all focus:outline-none focus:ring-2 focus:ring-[#2E8B76]"
              >
                Load More Devices
              </button>
            </div>
          )}
        </main>

        {/* 7. SLIDING FILTER SHEET / BOTTOM DRAWER */}
        {isFilterOpen && (
          <div className="absolute inset-0 z-50 overflow-hidden flex flex-col justify-end">
            {/* Sheet semi-transparent dark overlay background */}
            <div 
              onClick={() => setIsFilterOpen(false)}
              className="absolute inset-0 bg-[#122E2A]/40 transition-opacity duration-300"
              aria-hidden="true"
            />

            {/* Sliding Drawer Container */}
            <div className="w-full max-h-[85%] bg-white rounded-t-3xl border-t border-[#748482]/20 z-10 flex flex-col shadow-2xl relative animate-in slide-in-from-bottom duration-300">
              
              {/* Drawer Header */}
              <div className="px-4 py-4.5 flex items-center justify-between border-b border-[#748482]/10">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#2E8B76] text-sm">🎛️</span>
                  <h3 className="text-sm font-black text-[#122E2A]">Filter Options</h3>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-7 h-7 rounded-full border border-[#748482]/30 flex items-center justify-center text-[#748482] hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#2E8B76] active:scale-90 transition-transform"
                  aria-label="Close filters sheet"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Drawer Scrollable Body Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5.5 no-scrollbar">
                
                {/* Device Type group */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-black tracking-wider text-[#748482] font-[IBM_Plex_Mono]">Device Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'bp', label: 'Blood Pressure' },
                      { key: 'thermometer', label: 'Thermometers' },
                      { key: 'oximeter', label: 'Pulse Oximeters' },
                      { key: 'glucose', label: 'Glucose Meters' },
                      { key: 'nebulizer', label: 'Nebulizers' }
                    ].map((opt) => {
                      const isSelected = selectedDeviceTypes.has(opt.key);
                      return (
                        <button
                          key={opt.key}
                          onClick={() => handleDeviceTypeToggle(opt.key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                            isSelected
                              ? 'bg-[#2E8B76] text-white border-[#2E8B76]'
                              : 'bg-[#F3F6F5] text-[#122E2A] border-[#748482]/10 hover:border-[#748482]/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price range static/decorative slider mockup */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase font-black tracking-wider text-[#748482] font-[IBM_Plex_Mono]">Price Range</h4>
                  <div className="px-2">
                    <div className="relative h-1 bg-[#748482]/20 rounded-full">
                      {/* Active green range bar */}
                      <div className="absolute left-[15%] right-[25%] h-full bg-[#2E8B76] rounded-full" />
                      {/* Left circular thumb */}
                      <div className="absolute left-[15%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#2E8B76] shadow-sm cursor-pointer active:scale-110 transition-transform" />
                      {/* Right circular thumb */}
                      <div className="absolute right-[25%] top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#2E8B76] shadow-sm cursor-pointer active:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#122E2A] font-[IBM_Plex_Mono] px-1 pt-1">
                    <span>₹499</span>
                    <span>₹3,499</span>
                  </div>
                </div>

                {/* Certifications group */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-black tracking-wider text-[#748482] font-[IBM_Plex_Mono]">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {['FDA Cleared', 'CE Marked', 'Clinically Validated'].map((cert) => {
                      const isSelected = selectedCertifications.has(cert);
                      return (
                        <button
                          key={cert}
                          onClick={() => handleCertToggle(cert)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                            isSelected
                              ? 'bg-[#2E8B76] text-white border-[#2E8B76]'
                              : 'bg-[#F3F6F5] text-[#122E2A] border-[#748482]/10 hover:border-[#748482]/30'
                          }`}
                        >
                          {cert}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Connectivity group */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-black tracking-wider text-[#748482] font-[IBM_Plex_Mono]">Connectivity</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Bluetooth', 'App Sync', 'Manual'].map((conn) => {
                      const isSelected = selectedConnectivity.has(conn);
                      return (
                        <button
                          key={conn}
                          onClick={() => handleConnectivityToggle(conn)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                            isSelected
                              ? 'bg-[#2E8B76] text-white border-[#2E8B76]'
                              : 'bg-[#F3F6F5] text-[#122E2A] border-[#748482]/10 hover:border-[#748482]/30'
                          }`}
                        >
                          {conn}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Drawer Sticky bottom actions footer */}
              <div className="p-4 border-t border-[#748482]/10 bg-white flex items-center gap-3">
                <button
                  onClick={clearFilters}
                  disabled={selectedDeviceTypes.size === 0 && selectedCertifications.size === 0 && selectedConnectivity.size === 0}
                  className="flex-1 py-3 border border-[#748482]/35 hover:border-[#D9614C] hover:text-[#D9614C] disabled:border-[#748482]/20 disabled:text-slate-350 disabled:cursor-not-allowed rounded-2xl text-xs font-bold transition-all text-[#122E2A] active:scale-98"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-[2] py-3 bg-[#2E8B76] hover:bg-[#122E2A] text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-98"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HomeHealthMonitors;
