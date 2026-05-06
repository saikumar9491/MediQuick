import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const FeaturedBrands = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const brands = [
    { name: "Horlicks", logo: "https://onemg.gumlet.io/2026-05%2F1777961506_Horlicks.png?format=auto" },
    { name: "Omron", logo: "https://onemg.gumlet.io/2026-05%2F1777961524_Omron.png?format=auto" },
    { name: "Moov", logo: "https://onemg.gumlet.io/2026-05%2F1777961541_Moov.png?format=auto" },
    { name: "Dr. Morepen", logo: "https://onemg.gumlet.io/2026-05%2F1777961564_Morepen.png?format=auto" },
    { name: "Bare Anatomy", logo: "https://onemg.gumlet.io/2026-05%2F1777961589_Bare+Anatomy-1.png?format=auto" },
    { name: "Dabur", logo: "https://onemg.gumlet.io/2026-05%2F1777961622_Dabur.png?format=auto" },
    { name: "Chemist at Play", logo: "https://onemg.gumlet.io/2026-05%2F1777961631_Chemist+at+play-1.png?format=auto" },
    { name: "Tata 1mg", logo: "https://onemg.gumlet.io/diagnostics%2F2024-06%2F1719206984_Tata+1mg.png?format=auto" },
    { name: "Dettol", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Dettol_brand_wordmark.png/640px-Dettol_brand_wordmark.png" },
    { name: "Nivea", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Nivea_logo.svg/1024px-Nivea_logo.svg.png" },
    { name: "Protinex", logo: "https://www.protinex.com/wp-content/themes/protinex/assets/images/logo.svg" },
    { name: "Cetaphil", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Cetaphil_Logo.svg/1024px-Cetaphil_Logo.svg.png" }
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-white py-10">
      <div className="max-w-[1400px] mx-auto px-5">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[22px] font-semibold text-[#212121] tracking-tight">
            Featured brands
          </h2>

          <button
            onClick={() => navigate('/all-brands')}
            className="flex items-center gap-1 text-[#ff6f61] font-medium text-[14px] px-3.5 py-1.5 rounded-[4px] border border-[#ff6f61] hover:bg-[#ff6f61] hover:text-white transition-all duration-200"
          >
            See all <ChevronRight size={16} />
          </button>
        </div>

        {/* Gradient Underline */}
        <div className="w-full h-[1.5px] bg-gradient-to-r from-[#ff6f61] via-[#ff6f61]/20 to-transparent mb-8"></div>

        {/* Carousel Container */}
        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-6 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {brands.map((brand, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/brand/${encodeURIComponent(brand.name)}`)}
                className="flex-none w-[165px] group/item cursor-pointer"
              >
                {/* Square outer container with softer shadow and more rounding */}
                <div className="aspect-square bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-50/50 rounded-[1.25rem] flex items-center justify-center p-3.5 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                  {/* Circular inner container - no border, subtle shadow */}
                  <div className="w-full h-full rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-center p-4 transition-transform duration-500 group-hover/item:scale-110">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
                <p className="text-center mt-3 text-[13px] text-[#212121] font-normal truncate">
                  {brand.name}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-4 top-[40%] -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#ff6f61]"
          >
            <ChevronRight size={24} className="rotate-180" />
          </button>

          <button 
            onClick={() => scroll('right')}
            className="absolute -right-4 top-[40%] -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#ff6f61]"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedBrands;