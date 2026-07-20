import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const FeaturedBrands = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const brands = [
    { name: "Himalaya", logo: "https://i.pinimg.com/1200x/b2/16/ae/b216aeadcf434aff0f744cd316441109.jpg" },
    { name: "Horlicks", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYGZBK5fqq4DOF1ncMX9x8j5buAtfyvXl6Eg&s" },
    { name: "Omron", logo: "https://logowik.com/content/uploads/images/omron5779.jpg" },
    { name: "Moov", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzbV10OmJFxQiUVwIPUFjflSmVHaZyRxQFGA&s" },
    { name: "Dr. Morepen", logo: "https://media.licdn.com/dms/image/v2/C4E0BAQFj9xmjoi9Ccg/company-logo_200_200/company-logo_200_200/0/1630643946445?e=2147483647&v=beta&t=EGJjuMhTrRnMXN4MN74ZpN6nj5f0jjjOPC1NphqvgfE" },
    { name: "Bare Anatomy", logo: "https://i0.wp.com/www.hamroshringar.com/wp-content/uploads/2022/03/bare-anatomy-logo.webp?fit=600%2C400&ssl=1" },
    { name: "Dabur", logo: "https://static.wikia.nocookie.net/logopedia/images/6/62/Dabur_new.jpg/revision/latest?cb=20200323060319" },
    { name: "Chemist at Play", logo: "https://m.media-amazon.com/images/I/31VHGbtF85L.jpg" },
    { name: "Nivea", logo: "https://cdn.freebiesupply.com/logos/large/2x/nivea-2-logo-png-transparent.png" },
    { name: "Protinex", logo: "https://www.protinex.com/wp-content/themes/protinex/assets/images/logo.svg" },
    { name: "Cetaphil", logo: "https://i.pinimg.com/1200x/4b/c7/1b/4bc71be1e103635a2f5d1ca0299e42a8.jpg" }
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-white py-6 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-5">
        {/* Header Section */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Top Brands
            </h2>
            <p className="hidden md:block text-slate-500 mt-1 text-sm">Explore our premium selection of trusted brands</p>
          </div>
          
          {/* Show See All only on desktop since mobile is a grid */}
          <button
            onClick={() => navigate('/all-brands')}
            className="hidden md:flex group items-center gap-2 text-[#ff6f61] font-semibold text-sm px-5 py-2.5 rounded-full bg-[#ff6f61]/10 hover:bg-[#ff6f61] hover:text-white transition-all duration-300"
          >
            Explore All 
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid/Carousel Container */}
        <div className="relative group">
          <div 
            ref={scrollRef}
            className="grid grid-cols-4 gap-x-2 gap-y-4 md:flex md:gap-6 md:overflow-x-auto md:py-4 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {brands.map((brand, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/brand/${encodeURIComponent(brand.name)}`)}
                className="flex flex-col items-center gap-2 cursor-pointer md:flex-none md:w-[130px] group/item md:justify-center"
              >
                {/* MOBILE VIEW: Blinkit style light teal rounded square */}
                <div className="md:hidden w-full aspect-square rounded-2xl bg-[#e8f4f4] hover:bg-[#d8ecec] transition-colors duration-300 flex items-center justify-center p-3 sm:p-4">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover/item:scale-105"
                  />
                </div>
                <span className="md:hidden text-[11px] sm:text-sm font-medium text-slate-800 text-center leading-tight line-clamp-2 px-1">
                  {brand.name}
                </span>

                {/* DESKTOP VIEW: White circle with gray border (no text) */}
                <div className="hidden md:flex w-[120px] h-[120px] rounded-full bg-white border border-gray-300 hover:-translate-y-1 transition-all duration-300 items-center justify-center p-5">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover/item:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows (Desktop Only) */}
          <button 
            onClick={() => scroll('left')}
            className="hidden md:flex absolute -left-5 top-[40%] -translate-y-1/2 z-30 h-12 w-12 items-center justify-center rounded-full bg-white text-slate-600 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-slate-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:text-[#ff6f61]"
          >
            <ChevronLeft size={24} />
          </button>

          <button 
            onClick={() => scroll('right')}
            className="hidden md:flex absolute -right-5 top-[40%] -translate-y-1/2 z-30 h-12 w-12 items-center justify-center rounded-full bg-white text-slate-600 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-slate-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:text-[#ff6f61]"
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
