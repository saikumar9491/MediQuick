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
    <div className="mb-10 w-full sm:mb-12">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-gray-900">
            Browse by <span className="text-[#ff6f61]">Department</span>
          </h2>
          <p className="mt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[2px] sm:tracking-[3px] text-gray-400">
            Amritsar Hub Verified Specialized Care
          </p>
        </div>

        <button className="self-start text-[10px] sm:text-xs font-black uppercase text-[#ff6f61] border-b-2 border-[#ff6f61] pb-1 transition-colors hover:text-orange-700">
          View Medical Directory
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`group relative overflow-hidden rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] border-2 transition-all duration-500 h-32 sm:h-36 lg:h-40 ${
              activeCategory === cat.name
                ? `scale-[1.03] shadow-2xl border-white`
                : `bg-white border-gray-50 hover:border-orange-100 hover:-translate-y-1 hover:shadow-xl`
            }`}
          >
            {activeCategory === cat.name && (
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.theme} opacity-20`}></div>
            )}

            <div className="relative z-10 flex h-full flex-col items-center justify-center p-3 sm:p-4">
              <div
                className={`mb-3 flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl text-2xl sm:text-3xl shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12 ${
                  activeCategory === cat.name ? 'bg-white shadow-lg' : cat.bg
                }`}
              >
                {cat.icon}
              </div>

              <span
                className={`text-[9px] sm:text-[10px] lg:text-[11px] font-black uppercase tracking-[2px] sm:tracking-widest text-center leading-tight transition-colors ${
                  activeCategory === cat.name
                    ? 'text-gray-900'
                    : 'text-gray-400 group-hover:text-gray-900'
                }`}
              >
                {cat.name}
              </span>

              <div className="absolute bottom-3 sm:bottom-4 h-1 w-8 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full transition-all duration-700 ${
                    activeCategory === cat.name
                      ? `w-full bg-gradient-to-r ${cat.theme}`
                      : 'w-0'
                  }`}
                ></div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Status Strip */}
      <div className="mt-6 sm:mt-8 flex flex-col gap-3 rounded-2xl bg-[#2874f0] p-4 shadow-lg shadow-blue-100 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 animate-pulse">
            <span className="text-xs text-white">✓</span>
          </div>

          <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[1.5px] sm:tracking-[2px] text-white leading-relaxed">
            Currently Viewing:{' '}
            <span className="italic underline">{activeCategory} Hub Inventory</span>
          </p>
        </div>

        <div className="md:block">
          <p className="text-[8px] font-bold uppercase tracking-widest text-blue-100 leading-relaxed">
            Licensed Pharmacist Verified • 120 Min Delivery @ Amritsar
          </p>
        </div>
      </div>
    </div>
  );
};

export default Categories;