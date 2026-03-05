import React from 'react';

const categories = [
  { name: 'All', icon: '🏥', theme: 'from-gray-500 to-gray-700', bg: 'bg-gray-50' },
  { name: 'Diabetes', icon: '🩸', theme: 'from-red-500 to-red-700', bg: 'bg-red-50' },
  { name: 'Pain Relief', icon: '💊', theme: 'from-orange-500 to-orange-700', bg: 'bg-orange-50' },
  { name: 'Baby Care', icon: '👶', theme: 'from-blue-500 to-blue-700', bg: 'bg-blue-50' },
  { name: 'Vitamins', icon: '🌿', theme: 'from-green-500 to-green-700', bg: 'bg-green-50' },
  { name: 'Skin Care', icon: '✨', theme: 'from-pink-500 to-pink-700', bg: 'bg-pink-50' },
];

const Categories = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="w-full mb-12">
      {/* 1. SECTION HEADER WITH CORAL ACCENT */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">
            Browse by <span className="text-[#ff6f61]">Department</span>
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[3px] mt-1">
            Amritsar Hub Verified Specialized Care
          </p>
        </div>
        <button className="text-[#ff6f61] font-black text-xs uppercase border-b-2 border-[#ff6f61] pb-1 hover:text-orange-700 transition-colors">
          View Medical Directory
        </button>
      </div>

      {/* 2. THE COMPASS GRID (Unique 3D-Card Layout) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`relative group h-40 rounded-[32px] transition-all duration-500 overflow-hidden border-2 ${
              activeCategory === cat.name 
              ? `shadow-2xl scale-105 border-white` 
              : `bg-white border-gray-50 hover:border-orange-100 hover:shadow-xl`
            }`}
          >
            {/* Background Glow for Active State */}
            {activeCategory === cat.name && (
              <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${cat.theme}`}></div>
            )}

            <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12 ${
                activeCategory === cat.name ? 'bg-white shadow-lg' : cat.bg
              }`}>
                {cat.icon}
              </div>
              
              <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                activeCategory === cat.name ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900'
              }`}>
                {cat.name}
              </span>

              {/* Unique Progress Bar Indicator */}
              <div className="absolute bottom-4 w-8 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-700 ${
                  activeCategory === cat.name ? `w-full bg-gradient-to-r ${cat.theme}` : 'w-0'
                }`}></div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 3. DYNAMIC STATUS STRIP */}
      <div className="mt-8 bg-[#2874f0] rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-blue-100">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs">✓</span>
          </div>
          <p className="text-[9px] font-black text-white uppercase tracking-[2px]">
            Currently Viewing: <span className="italic underline">{activeCategory} Hub Inventory</span>
          </p>
        </div>
        <div className="hidden md:block">
          <p className="text-[8px] font-bold text-blue-100 uppercase tracking-widest">
            Licensed Pharmacist Verified • 120 Min Delivery @ Amritsar
          </p>
        </div>
      </div>
    </div>
  );
};

export default Categories;