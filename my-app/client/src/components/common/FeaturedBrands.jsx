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
    <section className="bg-white py-12">
      <div className="max-w-[1400px] mx-auto px-5">
        {/* Header Section */}
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Top Brands
          </h2>
          <p className="text-slate-500 mt-1 text-sm">Explore our premium selection of trusted brands</p>
        </div>

        {/* Gradient Underline */}
        <div className="w-full h-[1.5px] bg-gradient-to-r from-[#ff6f61] via-[#ff6f61]/20 to-transparent mb-8"></div>

        {/* Carousel Container */}
        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto py-4 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {brands.map((brand, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/brand/${encodeURIComponent(brand.name)}`)}
                className="flex-none w-[120px] group/item cursor-pointer flex justify-center"
              >
                <div className="w-[120px] h-[120px] rounded-full bg-white border border-gray-300 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center p-5">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover/item:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-5 top-[40%] -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-600 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-slate-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:text-[#ff6f61]"
          >
            <ChevronLeft size={24} />
          </button>

          <button 
            onClick={() => scroll('right')}
            className="absolute -right-5 top-[40%] -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-600 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-slate-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:text-[#ff6f61]"
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