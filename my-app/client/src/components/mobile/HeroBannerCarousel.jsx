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

  const list = banners.filter(b => b.status === 'active' || b.isActive !== false);

  if (list.length === 0) {
    return null;
  }

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
        {list.map((banner, i) => {
          const imgSource = banner.mobileImageUrl || banner.imageUrl || banner.image;
          const bannerTitle = banner.headline || banner.title || banner.name || 'Special Offer';
          const bannerDesc = banner.subtext || banner.desc || 'Healthcare delivered to your doorstep.';
          const bannerLink = banner.ctaUrl || banner.link || '/medicines';
          const bgStyle = banner.bgColor || banner.bg || 'from-[#0057FF] to-blue-800';

          return (
            <Link
              key={banner._id || i}
              to={bannerLink}
              className="w-full shrink-0 aspect-[20/9] relative block overflow-hidden"
            >
              {imgSource ? (
                <img 
                  src={imgSource} 
                  alt={bannerTitle} 
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-r ${bgStyle} p-4 flex flex-col justify-center text-white`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-200">
                    {banner.badgeText || 'Special Offer'}
                  </span>
                  <h4 className="text-sm font-black mt-1 line-clamp-1">{bannerTitle}</h4>
                  <p className="text-[10px] text-blue-50/80 font-medium mt-0.5 line-clamp-1">{bannerDesc}</p>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Slide Dot Indicators */}
      {list.length > 1 && (
        <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10">
          {list.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-4 bg-[#0057FF]' : 'w-1.5 bg-slate-300/80'
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
