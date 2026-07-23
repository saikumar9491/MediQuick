import React, { useState, useRef } from 'react';
import { ShieldCheck, ClipboardList } from 'lucide-react';

export const ImageGallery = ({ image, name, verifiedAuthentic, needsRx, additionalImages = [] }) => {
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imgRef = useRef(null);

  const images = Array.from(new Set([image, ...(additionalImages || [])])).filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(image);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Sync state if image from prop changes
  React.useEffect(() => {
    setSelectedImage(image);
  }, [image]);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // threshold
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = images.indexOf(selectedImage);
      if (isLeftSwipe && currentIndex < images.length - 1) {
        setSelectedImage(images[currentIndex + 1]);
      } else if (isRightSwipe && currentIndex > 0) {
        setSelectedImage(images[currentIndex - 1]);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Primary Image Container */}
      <div 
        className="relative aspect-square w-full rounded-2xl bg-slate-50/40 overflow-hidden flex items-center justify-center p-8 cursor-zoom-in group transition-colors hover:bg-slate-50/60"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={imgRef}
      >
        <img 
          src={selectedImage} 
          alt={name} 
          className={`max-h-full max-w-full object-contain transition-transform duration-200 ease-out ${
            isHovering ? 'scale-135' : 'scale-100'
          }`}
          style={isHovering ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
        />

        {/* Badges Overlaid on Image Top-Left */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {verifiedAuthentic && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-blue-600 border border-blue-100 rounded-full shadow-xs text-[10px] font-medium tracking-wide">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Authentic</span>
            </div>
          )}
          {needsRx && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-orange-600 border border-orange-100 rounded-full shadow-xs text-[10px] font-medium tracking-wide">
              <ClipboardList className="h-3.5 w-3.5" />
              <span>Rx Required</span>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 justify-center">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`w-16 h-16 rounded-xl border overflow-hidden p-2 flex items-center justify-center transition-all ${
                selectedImage === img 
                  ? 'border-slate-400 bg-slate-50/60 shadow-xs opacity-100 scale-102' 
                  : 'border-slate-200/60 bg-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt={`${name} thumb ${idx}`} className="max-h-full max-w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
