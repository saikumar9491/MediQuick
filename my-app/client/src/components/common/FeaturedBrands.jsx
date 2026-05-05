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
    { name: "Tata 1mg", logo: "https://onemg.gumlet.io/diagnostics%2F2024-06%2F1719206984_Tata+1mg.png?format=auto" }
  ];

  return (
    <section className="bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Featured brands
          </h2>

          <button
            onClick={() => navigate('/all-brands')}
            className="flex items-center gap-1.5 text-[#ff6f61] font-black text-[10px] tracking-wider px-2.5 py-1.5 rounded border border-[#ff6f61]/10 hover:bg-[#ff6f61]/5 transition-all"
          >
            SEE ALL <ChevronRight size={12} strokeWidth={3} />
          </button>
        </div>

        <div className="relative group">
          <div 
            ref={scrollRef}
            className="custom-scrollbar-hidden flex gap-4 overflow-x-auto pb-4 scroll-smooth"
          >
            {brands.map((brand, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/brand/${encodeURIComponent(brand.name)}`)}
                className="min-w-[120px] max-w-[120px] sm:min-w-[140px] sm:max-w-[140px] cursor-pointer group"
              >
                <div className="aspect-square bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-blue-100">
                  <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] border border-slate-50">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-[85%] h-[85%] object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
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