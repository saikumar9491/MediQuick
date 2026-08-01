import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { API_BASE } from '../../utils/apiConfig';

const FloatingVideoBanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);

  const [banner, setBanner] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);

  // LEVEL 1: Check screen width on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch floating video banner & handle session dismiss state
  useEffect(() => {
    // LEVEL 1 & ROUTE ENFORCEMENT: Never run on desktop or outside allowed routes
    if (isDesktop) return;

    const allowedRoutes = ['/', '/medicines'];
    const isAllowedRoute = allowedRoutes.includes(location.pathname);
    if (!isAllowedRoute) return;

    // Check session dismiss flag
    const isDismissed = sessionStorage.getItem('mq_floating_video_dismissed');
    if (isDismissed === 'true') return;

    const fetchFloatingVideoBanner = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/banners?placement=floating-video&targetDevice=mobile`);
        if (!res.ok) return;
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const activeBanner = data.find(b => b.status === 'active' || b.isActive !== false);
          if (activeBanner) {
            setBanner(activeBanner);
            
            // Auto-appear 2.5 seconds after load
            const timer = setTimeout(() => {
              setIsVisible(true);
            }, 2500);

            return () => clearTimeout(timer);
          }
        }
      } catch (err) {
        console.error('Error loading floating video banner:', err);
      }
    };

    fetchFloatingVideoBanner();
  }, [isDesktop, location.pathname]);

  // LEVEL 1 & 2 SAFETY: Completely unmount on desktop or if not visible/dismissed
  if (isDesktop || !isVisible || !banner) {
    return null;
  }

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem('mq_floating_video_dismissed', 'true');
  };

  const handleCardClick = () => {
    const targetUrl = banner.ctaUrl || banner.link || '/medicines';
    if (targetUrl.startsWith('http')) {
      window.open(targetUrl, banner.openInNewTab ? '_blank' : '_self');
    } else {
      navigate(targetUrl);
    }
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const videoSource = banner.videoUrl || banner.imageUrl || banner.image;
  const headline = banner.headline || banner.name || banner.title || 'Special Offer';
  const subtext = banner.subtext || banner.desc || 'Tap to view details';
  const isLive = Boolean(banner.isLive);
  const badgeLabel = banner.badgeText || (isLive ? 'LIVE' : 'OFFER');

  return (
    /* LEVEL 2 SAFETY: CSS media query forces display:none on 768px and above */
    <div className="fixed bottom-20 right-4 z-40 md:hidden print:hidden select-none">
      <div
        onClick={handleCardClick}
        className="w-[125px] h-[165px] rounded-[18px] bg-slate-900 shadow-2xl border-2 border-white/20 overflow-hidden relative flex flex-col justify-between cursor-pointer group active:scale-95 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6"
      >
        {/* Background Video / Animated Graphic */}
        {videoSource && videoSource.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i) ? (
          <video
            ref={videoRef}
            src={videoSource}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            webkit-playsinline="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={videoSource || 'https://img.freepik.com/free-vector/flat-medical-healthcare-sales-banner-template_23-2149511116.jpg'}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Top Header Controls Bar */}
        <div className="relative z-10 p-2 flex items-center justify-between">
          {/* LIVE or OFFER Pill Badge */}
          <div
            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md backdrop-blur-md ${
              isLive
                ? 'bg-rose-600 text-white'
                : 'bg-gradient-to-r from-[#FF6B00] to-amber-500 text-white'
            }`}
          >
            {isLive ? (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                </span>
                <span>LIVE</span>
              </>
            ) : (
              <span>{badgeLabel}</span>
            )}
          </div>

          {/* Dismiss X Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="w-5 h-5 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer shadow-md"
            title="Close banner"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>

        {/* Mute/Sound Toggle (if video exists) */}
        {videoSource && videoSource.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i) && (
          <button
            type="button"
            onClick={toggleSound}
            className="absolute top-2 right-8 z-10 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={10} /> : <Volume2 size={10} />}
          </button>
        )}

        {/* Bottom Offer Overlay with Dark Gradient */}
        <div className="relative z-10 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent p-2.5 pt-6 text-left">
          <h4 className="text-[11px] font-black text-white leading-tight uppercase line-clamp-2 drop-shadow-md">
            {headline}
          </h4>
          <p className="text-[9px] font-extrabold text-amber-300 line-clamp-1 mt-0.5 drop-shadow-xs">
            {subtext}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FloatingVideoBanner;
