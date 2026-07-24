import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HeroBannerCarousel = ({ banners = [], loading = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  // Auto-play
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="w-full aspect-[21/9] bg-slate-100 animate-pulse rounded-2xl border border-slate-200"></div>
    );
  }

  // Fallbacks if no banners are returned
  const defaultBanners = [
    {
      _id: 'default-1',
      title: 'Monsoon Wellness Sale',
      desc: 'Flat 25% Off on Prescriptions',
      image: 'https://img.freepik.com/free-vector/flat-medical-healthcare-sales-banner-template_23-2149511116.jpg',
      bg: 'from-teal-600 to-cyan-700',
      link: '/medicines'
    },
    {
      _id: 'default-2',
      title: 'Free Diagnostic Lab Tests',
      desc: 'Free Consultation with Doctor',
      image: 'https://img.freepik.com/free-vector/medical-healthcare-banner-design_23-2149488424.jpg',
      bg: 'from-blue-600 to-indigo-700',
      link: '/lab-tests'
    }
  ];

  const list = banners.length > 0 ? banners : defaultBanners;

  const handleTouchStart = (e) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStart.current - touchEnd.current > 75) {
      // Swipe left -> Next
      setActiveIndex((prev) => (prev === list.length - 1 ? 0 : prev + 1));
    }
    if (touchStart.current - touchEnd.current < -75) {
      // Swipe right -> Prev
      setActiveIndex((prev) => (prev === 0 ? list.length - 1 : prev - 1));
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-sm bg-slate-50 border border-slate-200">
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {list.map((banner, i) => (
          <Link
            key={banner._id || i}
            to={banner.link || '/medicines'}
            className="w-full shrink-0 aspect-[20/9] relative block overflow-hidden"
          >
            {banner.image ? (
              <img 
                src={banner.image} 
                alt={banner.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-r ${banner.bg || 'from-teal-600 to-cyan-700'} p-4 flex flex-col justify-center text-white`}>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-100">Special Offer</span>
                <h4 className="text-sm font-black mt-1">{banner.title}</h4>
                <p className="text-[10px] text-teal-50/80 font-medium mt-0.5">{banner.desc}</p>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Slide Dot Indicators */}
      {list.length > 1 && (
        <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10">
          {list.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-4 bg-[#00a2a4]' : 'w-1.5 bg-slate-300/80'
              }`}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBannerCarousel;
