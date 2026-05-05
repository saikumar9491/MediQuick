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

  return (
    <section className="bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-slate-800">
            Featured brands
          </h2>

          <button
            onClick={() => navigate('/all-brands')}
            className="flex items-center gap-1.5 text-[#ff6f61] font-medium text-[13px] px-3 py-1.5 rounded-lg border border-[#ff6f61] hover:bg-[#ff6f61]/5 transition-all"
          >
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div className="w-[120px] h-[2px] bg-[#ff6f61] mb-8"></div>

        <div className="relative group">
          <div 
            ref={scrollRef}
            className="custom-scrollbar-hidden flex gap-4 overflow-x-auto pb-4 scroll-smooth"
          >
            {brands.map((brand, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/brand/${encodeURIComponent(brand.name)}`)}
                className="min-w-[120px] max-w-[120px] cursor-pointer"
              >
                <div className="aspect-square bg-white border border-slate-100 rounded-lg flex items-center justify-center p-2.5">
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-slate-50 transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)]">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-[75%] h-[75%] object-contain"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
            className="absolute -left-3 top-[35%] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#ef4444] shadow-[0_4px_15px_rgb(0,0,0,0.1)] transition-all hover:scale-110 active:scale-95 border border-slate-100 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={20} strokeWidth={3} className="rotate-180" />
          </button>

          <button 
            onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
            className="absolute -right-3 top-[35%] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#ef4444] shadow-[0_4px_15px_rgb(0,0,0,0.1)] transition-all hover:scale-110 active:scale-95 border border-slate-100 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>
          
          <style>{`
            .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
            .custom-scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;