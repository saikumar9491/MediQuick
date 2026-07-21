import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

const FeaturedBrands = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const brands = [
    { name: "Himalaya", logo: "https://i.pinimg.com/1200x/b2/16/ae/b216aeadcf434aff0f744cd316441109.jpg", color: "#e8f5e9" },
    { name: "Horlicks", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYGZBK5fqq4DOF1ncMX9x8j5buAtfyvXl6Eg&s", color: "#fff8e1" },
    { name: "Omron", logo: "https://logowik.com/content/uploads/images/omron5779.jpg", color: "#e3f2fd" },
    { name: "Moov", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzbV10OmJFxQiUVwIPUFjflSmVHaZyRxQFGA&s", color: "#fce4ec" },
    { name: "Dr. Morepen", logo: "https://media.licdn.com/dms/image/v2/C4E0BAQFj9xmjoi9Ccg/company-logo_200_200/company-logo_200_200/0/1630643946445?e=2147483647&v=beta&t=EGJjuMhTrRnMXN4MN74ZpN6nj5f0jjjOPC1NphqvgfE", color: "#e8eaf6" },
    { name: "Bare Anatomy", logo: "https://i0.wp.com/www.hamroshringar.com/wp-content/uploads/2022/03/bare-anatomy-logo.webp?fit=600%2C400&ssl=1", color: "#f3e5f5" },
    { name: "Dabur", logo: "https://static.wikia.nocookie.net/logopedia/images/6/62/Dabur_new.jpg/revision/latest?cb=20200323060319", color: "#fff3e0" },
    { name: "Chemist at Play", logo: "https://m.media-amazon.com/images/I/31VHGbtF85L.jpg", color: "#e0f7fa" },
    { name: "Nivea", logo: "https://cdn.freebiesupply.com/logos/large/2x/nivea-2-logo-png-transparent.png", color: "#e3f2fd" },
    { name: "Protinex", logo: "https://www.protinex.com/wp-content/themes/protinex/assets/images/logo.svg", color: "#fce4ec" },
    { name: "Cetaphil", logo: "https://i.pinimg.com/1200x/4b/c7/1b/4bc71be1e103635a2f5d1ca0299e42a8.jpg", color: "#e8f5e9" },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ background: 'linear-gradient(180deg, #f8fffe 0%, #ffffff 100%)', padding: '48px 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,162,164,0.08)', border: '1px solid rgba(0,162,164,0.2)', borderRadius: '100px', padding: '4px 12px', marginBottom: '10px' }}>
              <Sparkles size={12} color="#00a2a4" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#00a2a4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Trusted Partners</span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
              Top Brands
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px', fontWeight: 500 }}>
              Shop from 500+ trusted healthcare brands
            </p>
          </div>

          <button
            onClick={() => navigate('/all-brands')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px',
              borderRadius: '100px',
              background: 'linear-gradient(135deg, #00a2a4, #007b7d)',
              color: 'white',
              fontWeight: 700,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,162,164,0.3)',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,162,164,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,162,164,0.3)'; }}
          >
            Explore All <ChevronRight size={15} />
          </button>
        </div>

        {/* Scrollable Brands Container */}
        <div style={{ position: 'relative' }} className="brand-scroll-group">

          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="brand-nav-btn brand-nav-left"
            style={{
              position: 'absolute', left: '-18px', top: '50%', transform: 'translateY(-50%)',
              zIndex: 30, width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', background: 'white', border: '1.5px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              cursor: 'pointer', color: '#475569',
              opacity: 0, transition: 'all 0.2s',
            }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="brand-nav-btn brand-nav-right"
            style={{
              position: 'absolute', right: '-18px', top: '50%', transform: 'translateY(-50%)',
              zIndex: 30, width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', background: 'white', border: '1.5px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              cursor: 'pointer', color: '#475569',
              opacity: 0, transition: 'all 0.2s',
            }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Brands Row - Mobile: 4-col grid, Desktop: horizontal scroll */}
          <div
            ref={scrollRef}
            className="brands-scroller"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {brands.map((brand, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/brand/${encodeURIComponent(brand.name)}`)}
                className="brand-card"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
              >
                {/* Logo card */}
                <div
                  className="brand-logo-wrapper"
                  style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '20px',
                    background: brand.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '18px',
                    transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                    border: '1.5px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', position: 'relative', zIndex: 1, transition: 'transform 0.25s ease' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
                {/* Brand name */}
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textAlign: 'center', lineHeight: 1.3, maxWidth: '110px' }}>
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .brands-scroller {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (min-width: 768px) {
          .brands-scroller {
            display: flex;
            flex-direction: row;
            gap: 20px;
            overflow-x: auto;
            padding: 12px 4px 20px;
            scroll-snap-type: x mandatory;
          }
          .brand-card {
            flex: none;
            scroll-snap-align: start;
          }
          .brand-logo-wrapper {
            width: 120px !important;
            height: 120px !important;
          }
        }

        .brands-scroller::-webkit-scrollbar {
          display: none;
        }

        .brand-card:hover .brand-logo-wrapper {
          transform: translateY(-6px) scale(1.04);
          box-shadow: 0 12px 28px rgba(0,0,0,0.12) !important;
        }

        .brand-scroll-group:hover .brand-nav-btn {
          opacity: 1 !important;
        }

        .brand-nav-btn:hover {
          background: linear-gradient(135deg, #00a2a4, #007b7d) !important;
          color: white !important;
          border-color: transparent !important;
          transform: translateY(-50%) scale(1.1) !important;
        }
      `}</style>
    </section>
  );
};

export default FeaturedBrands;
