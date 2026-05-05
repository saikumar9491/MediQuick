import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const FeaturedBrands = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const brands = [
    { name: "Horlicks", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/720d6f46-4a1e-4537-83f1-0a6d0800b652.png" },
    { name: "Omron", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/72574e4c-1e81-432d-82d2-83b53c713b1d.png" },
    { name: "Moov", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/351600c5-555e-4361-8255-0a9960761e3f.png" },
    { name: "Dr. Morepen", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/6ec7a4f5-9377-4959-992e-360e676104bc.png" },
    { name: "Bare Anatomy", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/8b46e9df-9884-482d-8007-881b212f0290.png" },
    { name: "Dabur", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/d6f4661a-283e-4d4b-97e3-0c460d3d5f57.png" },
    { name: "Chemist at Play", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/43773177-3e2b-435f-846c-2f941198642a.png" },
    { name: "Tata 1mg", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/80d07525-412f-48e0-a430-671c08007323.png" },
    { name: "Tejasya", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/273d6118-977a-426b-967b-232506e76315.png" }
  ];

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Featured brands
          </h2>

          <button
            onClick={() => navigate('/all-brands')}
            className="flex items-center gap-1 text-[#ff6f61] font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg border border-[#ff6f61]/20 hover:bg-[#ff6f61] hover:text-white transition-all shadow-sm"
          >
            See all <ChevronRight size={14} />
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