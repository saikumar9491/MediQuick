import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const FeaturedBrands = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const brands = [
    { name: "Horlicks", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYGZBK5fqq4DOF1ncMX9x8j5buAtfyvXl6Eg&s" },
    { name: "Omron", logo: "https://logowik.com/content/uploads/images/omron5779.jpg" },
    { name: "Moov", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzbV10OmJFxQiUVwIPUFjflSmVHaZyRxQFGA&s" },
    { name: "Dr. Morepen", logo: "https://media.licdn.com/dms/image/v2/C4E0BAQFj9xmjoi9Ccg/company-logo_200_200/company-logo_200_200/0/1630643946445?e=2147483647&v=beta&t=EGJjuMhTrRnMXN4MN74ZpN6nj5f0jjjOPC1NphqvgfE" },
    { name: "Bare Anatomy", logo: "https://i0.wp.com/www.hamroshringar.com/wp-content/uploads/2022/03/bare-anatomy-logo.webp?fit=600%2C400&ssl=1" },
    { name: "Dabur", logo: "https://static.wikia.nocookie.net/logopedia/images/6/62/Dabur_new.jpg/revision/latest?cb=20200323060319" },
    { name: "Chemist at Play", logo: "https://m.media-amazon.com/images/I/31VHGbtF85L.jpg" },
    { name: "Tata 1mg", logo: "https://cloudfront.stockifyfintech.co.in/wp-content/uploads/2024/05/Tata-1mg.png" },
   
    { name: "Nivea", logo: "https://cdn.freebiesupply.com/logos/large/2x/nivea-2-logo-png-transparent.png" },
    { name: "Protinex", logo: "https://www.protinex.com/wp-content/themes/protinex/assets/images/logo.svg" },
    { name: "Cetaphil", logo: "https://i.pinimg.com/1200x/4b/c7/1b/4bc71be1e103635a2f5d1ca0299e42a8.jpg" }
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
            className="flex gap-5 overflow-x-auto pt-4 pb-6 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {brands.map((brand, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/brand/${encodeURIComponent(brand.name)}`)}
                className="flex-none w-[165px] group/item cursor-pointer"
              >
                {/* Square outer border matching Image A */}
                <div className="aspect-square bg-white border border-[#f1f4f6] rounded-md flex items-center justify-center p-3 hover:shadow-sm transition-all duration-300">
                  {/* Circular inner container with shadow */}
                  <div className="w-full h-full rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-[#f1f4f6]/50 flex items-center justify-center p-4 transition-transform duration-300 group-hover/item:scale-105">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
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