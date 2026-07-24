import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  FlaskConical, 
  Stethoscope, 
  LayoutGrid,
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Upload,
  Plus,
  ArrowRight,
  Zap,
  Activity,
  Heart,
  Baby,
  Dna
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import MedicineCard from '../components/medicine/MedicineCard';
import { API_BASE } from '../utils/apiConfig';
import toast from 'react-hot-toast';

import FeaturedBrands from '../components/common/FeaturedBrands';
import MobileHomeView from '../components/mobile/MobileHomeView';


const Home = ({ medicines = [], featured = [], loading = true }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { token, user } = useAuth();
  const fileInputRef = useRef(null);
  
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return <MobileHomeView medicines={medicines} featured={featured} loading={loading} />;
  }

  const categoryScrollRef = useRef(null);
  const trendingScrollRef = useRef(null);
  const skinCareScrollRef = useRef(null);
  const ayurScrollRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dbBanners, setDbBanners] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentAyurBanner, setCurrentAyurBanner] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/banners`);
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDbBanners(data);
        }
      } catch (err) {
        console.error("Banner fetch failed, using fallbacks:", err);
      } finally {
        setIsBannerLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const displayBanners = dbBanners.filter(b => b.category === 'main');
  const ayurBanners = dbBanners.filter(b => b.category === 'ayurveda-promo');

  useEffect(() => {
    if (displayBanners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [displayBanners.length]);

  useEffect(() => {
    if (ayurBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentAyurBanner((prev) => (prev === ayurBanners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [ayurBanners.length]);

  const mainCategories = [
    { name: 'Skin care', path: '/medicines?filter=skin-care', image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443647_skinn.webp?format=auto', bgColor: '#ccd1a1' },
    { name: 'Hair Care', path: '/medicines?filter=hair-care', image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443670_hairr.webp?format=auto', bgColor: '#8ecda6' },
    { name: 'Sexual Wellness', path: '/medicines?filter=sexual-wellness', image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443681_sexuall.webp?format=auto', bgColor: '#fbb381' },
    { name: 'Oral Care', path: '/medicines?filter=oral-care', image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443695_orall.webp?format=auto', bgColor: '#e3b1ac' },
    { name: 'Elderly Care', path: '/medicines?filter=elderly-care', image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443705_elderly.webp?format=auto', bgColor: '#4ec9cc' },
    { name: 'Baby Care', path: '/medicines?filter=baby-care', image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443714_baby.webp?format=auto', bgColor: '#afb6e6' },
    { name: 'Women Care', path: '/medicines?filter=women-care', image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443722_womenn.webp?format=auto', bgColor: '#ff9ec2' },
    { name: 'Men Grooming', path: '/medicines?filter=men-grooming', image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443735_menn.webp?format=auto', bgColor: '#94b2c5' }
  ];

  const handleUpload = async () => {
    if (!user) return toast.error('Please login first');
    if (!selectedFile) return toast.error('Select a prescription file');
    
    setIsUploading(true);
    // Simulation for demo
    setTimeout(() => {
      setIsUploading(false);
      setSelectedFile(null);
      toast.success('Prescription uploaded for review!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* MOBILE HERO Mockup Style */}
      <div className="block sm:hidden px-4 pt-4 pb-2">
        {/* Dark Hero Banner Box */}
        <div className="bg-[#181d28] rounded-3xl p-6 text-left shadow-lg relative overflow-hidden">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7ba9e0]">WINTER WELLNESS</p>
          <h1 className="text-2xl font-black text-white mt-1 leading-tight">Flat 25% off</h1>
          <button 
            onClick={() => navigate('/medicines')} 
            className="mt-4 bg-white hover:bg-slate-100 h-7 px-5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#181d28] flex items-center justify-center shadow-xs transition-transform active:scale-95"
          >
            Shop
          </button>
        </div>
      </div>

      {/* MOBILE CATEGORIES BAR (Mockup Dark Boxes) */}
      <div className="block sm:hidden py-4 px-4">
        <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
          {[
            { label: 'Skin', path: '/medicines?filter=skin-care', icon: '✨' },
            { label: 'Hair', path: '/medicines?filter=hair-care', icon: '🌿' },
            { label: 'Meds', path: '/medicines?filter=prescription', icon: '💊' },
            { label: 'Fit', path: '/medicines?filter=fitness', icon: '⚡' }
          ].map((cat, idx) => (
            <button
              key={idx}
              onClick={() => navigate(cat.path)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-14 h-14 bg-[#181d28] rounded-2xl flex items-center justify-center shadow-xs text-lg group-active:scale-95 transition-transform">
                <span>{cat.icon}</span>
              </div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section (Desktop Only) */}
      {displayBanners.length > 0 && (
        <section className="hidden sm:block bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="relative h-[160px] overflow-hidden rounded-2xl bg-slate-900 sm:h-[320px] group">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${currentBanner}-${displayBanners[currentBanner]?._id || 'default'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 flex items-center transition-colors duration-500 ${displayBanners[currentBanner]?.bg || 'bg-gradient-to-r from-[#6b21a8] to-[#9333ea]'}`}
              >
                {/* Right Side Image with Premium Curve - Increased Width */}
                <div className="absolute right-0 h-full w-[75%] overflow-hidden lg:w-[65%]">
                  <motion.img 
                    key={currentBanner + (displayBanners[currentBanner]?._id || 'img')}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src={displayBanners[currentBanner]?.image} 
                    className="h-full w-full object-cover rounded-l-[150px] sm:rounded-l-[350px] border-l-4 sm:border-l-8 border-white/20 shadow-[-20px_0_40px_rgba(0,0,0,0.3)]" 
                    alt="banner" 
                  />
                </div>

                {/* Left Side Content */}
                <div className="relative z-10 w-full px-6 sm:w-[40%] sm:px-16">
                  <motion.h1 
                    key={currentBanner + (displayBanners[currentBanner]?._id || 'h1')}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg sm:text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tighter text-white uppercase"
                  >
                    {displayBanners[currentBanner]?.title}
                  </motion.h1>
                  <motion.p 
                    key={currentBanner + (displayBanners[currentBanner]?._id || 'p')}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-1.5 max-w-md text-[9px] font-bold text-purple-100 uppercase tracking-[0.2em] sm:text-sm"
                  >
                    {displayBanners[currentBanner]?.desc || "Healthcare delivered to your doorstep."}
                  </motion.p>
                  <motion.button 
                    key={currentBanner + (displayBanners[currentBanner]?._id || 'btn')}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    onClick={() => navigate(displayBanners[currentBanner]?.link || '/medicines')}
                    className="mt-3.5 flex w-fit items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-[9px] font-black text-white shadow-xl hover:bg-white hover:text-blue-600 sm:mt-10 sm:px-12 sm:py-4 sm:text-xs transition-all active:scale-95"
                  >
                    SHOP NOW <ArrowRight size={14} />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Manual Navigation Controls */}
            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentBanner(prev => (prev === 0 ? displayBanners.length - 1 : prev - 1));
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white hover:text-blue-600 transition-all shadow-lg"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentBanner(prev => (prev === displayBanners.length - 1 ? 0 : prev + 1));
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white hover:text-blue-600 transition-all shadow-lg"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {displayBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentBanner(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${currentBanner === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Featured Brands Section - Replaced Service Hub (Desktop Only) */}
      <div className="hidden sm:block">
        <FeaturedBrands />
      </div>

      {/* Quick Order with Prescription */}
      <section className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-white px-6 py-4 sm:px-10 sm:py-5 shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff6f61]/10 text-[#ff6f61]">
                  <Upload size={20} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#212121] tracking-tight">Quick Order with Prescription</h2>
              </div>
              <p className="text-[12px] sm:text-sm font-semibold text-slate-400 max-w-md mx-auto md:mx-0">
                Upload your prescription and our experts will fulfill your order with 100% genuine medicines.
              </p>
            </div>

          <div className="flex w-full md:w-auto items-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[11px] font-black uppercase tracking-widest transition-all ${selectedFile ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-[#ff6f61] bg-[#ff6f61]/5 border border-[#ff6f61]/10 hover:bg-[#ff6f61]/10'}`}
            >
              {selectedFile ? 'READY' : 'SELECT FILE'}
            </button>
            <button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl bg-[#ff6f61] px-10 py-4 text-[11px] font-black uppercase tracking-widest text-white hover:bg-[#ee5e50] active:scale-95 disabled:bg-slate-200 transition-all"
            >
              {isUploading ? 'UPLOADING...' : 'ORDER NOW'}
            </button>
          </div>
        </div>
      </section>

      {/* Shop by Categories */}
      <section style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f0fafa 100%)', padding: '48px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,162,164,0.08)', border: '1px solid rgba(0,162,164,0.2)', borderRadius: '100px', padding: '4px 12px', marginBottom: '10px' }}>
                <span style={{ fontSize: '16px' }}>🛍️</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#00a2a4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Browse Categories</span>
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
                Shop by Category
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px', fontWeight: 500 }}>
                Find exactly what you need, fast
              </p>
            </div>
          </div>

          <style>{`
            .cat-scroll-container { scrollbar-width: none; -ms-overflow-style: none; }
            .cat-scroll-container::-webkit-scrollbar { display: none; }
            .cat-card {
              cursor: pointer;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
              transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .cat-card:hover .cat-img-wrapper {
              transform: translateY(-8px) scale(1.03);
              box-shadow: 0 16px 40px rgba(0,0,0,0.14) !important;
            }
            .cat-card:hover .cat-label {
              color: #00a2a4 !important;
            }
            .cat-img-wrapper {
              transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
              box-shadow: 0 4px 16px rgba(0,0,0,0.08);
            }
            .cat-group:hover .cat-nav-btn { opacity: 1 !important; }
            .cat-nav-btn:hover {
              background: linear-gradient(135deg, #00a2a4, #007b7d) !important;
              color: white !important;
              border-color: transparent !important;
              box-shadow: 0 4px 20px rgba(0,162,164,0.4) !important;
            }
          `}</style>

          <div className="cat-group" style={{ position: 'relative' }}>
            {/* Left Arrow */}
            <button
              onClick={() => categoryScrollRef.current?.scrollBy({ left: -360, behavior: 'smooth' })}
              className="cat-nav-btn"
              style={{
                position: 'absolute', left: '-18px', top: '42%', transform: 'translateY(-50%)',
                zIndex: 30, width: '42px', height: '42px',
                display: 'none',
                alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', background: 'white', border: '1.5px solid #e2e8f0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                cursor: 'pointer', color: '#475569', opacity: 0, transition: 'all 0.2s',
              }}
            >
              <ChevronLeft size={19} />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => categoryScrollRef.current?.scrollBy({ left: 360, behavior: 'smooth' })}
              className="cat-nav-btn"
              style={{
                position: 'absolute', right: '-18px', top: '42%', transform: 'translateY(-50%)',
                zIndex: 30, width: '42px', height: '42px',
                display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', background: 'white', border: '1.5px solid #e2e8f0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                cursor: 'pointer', color: '#475569', opacity: 0, transition: 'all 0.2s',
              }}
            >
              <ChevronRight size={19} />
            </button>

            {/* Categories — 4-col grid on mobile, horizontal scroll on desktop */}
            <div
              ref={categoryScrollRef}
              className="cat-scroll-container"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '14px',
              }}
            >
              {mainCategories.map((cat, idx) => (
                <motion.div
                  key={idx}
                  className="cat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.4, ease: 'easeOut' }}
                  onClick={() => navigate(cat.path)}
                >
                  {/* Image Card */}
                  <div
                    className="cat-img-wrapper"
                    style={{
                      width: '100%',
                      aspectRatio: '1/1',
                      borderRadius: '20px',
                      background: cat.bgColor,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {/* Subtle gradient overlay at top */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.08) 100%)', zIndex: 1 }} />
                    {/* Category name tag */}
                    <div style={{
                      position: 'absolute', top: '10px', left: '10px', right: '10px',
                      background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
                      borderRadius: '10px', padding: '4px 8px', zIndex: 3,
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: 'white', letterSpacing: '0.02em', textAlign: 'center', display: 'block', lineHeight: 1.3 }}>
                        {cat.name}
                      </span>
                    </div>
                    {/* Product Image */}
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{ width: '85%', height: '75%', objectFit: 'contain', position: 'relative', zIndex: 2, transition: 'transform 0.4s ease' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <style>{`
            @media (min-width: 768px) {
              .cat-scroll-container {
                display: flex !important;
                flex-direction: row !important;
                gap: 20px !important;
                overflow-x: auto !important;
                padding: 16px 4px 24px !important;
              }
              .cat-card {
                flex: none !important;
                width: 160px !important;
              }
              .cat-img-wrapper {
                width: 160px !important;
                height: 160px !important;
                border-radius: 24px !important;
              }
              .cat-group .cat-nav-btn:first-of-type {
                display: flex !important;
              }
            }
          `}</style>

        </div>
      </section>

      {/* Trending Products */}
      <section className="bg-white py-6 md:py-12">
        <div className="mx-auto max-w-[1400px] px-4 md:px-5">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">
                Trending
              </h2>
              <p className="hidden md:block text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">Top rated picks by our community</p>
            </div>
            <button 
              onClick={() => navigate('/medicines')} 
              className="flex items-center gap-1 text-[#00a2a4] hover:text-[#007b7d] font-bold text-xs md:text-sm transition-colors uppercase tracking-wider"
            >
              See all <ChevronRight size={16} />
            </button>
          </div>

          <div className="relative group">
            {loading ? (
              <div className="grid grid-cols-2 gap-3.5 sm:flex sm:gap-6 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-56 md:h-72 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : (
              <div 
                ref={trendingScrollRef}
                className="grid grid-cols-2 gap-3.5 sm:flex sm:items-stretch sm:gap-6 sm:overflow-x-auto md:pt-4 pb-4 md:pb-8 scroll-smooth md:px-2"
              >
                {medicines.filter(m => m.isTrending).length > 0 ? (
                  medicines.filter(m => m.isTrending).map((med) => (
                    <div key={med._id} className="w-full sm:min-w-[220px] sm:max-w-[220px] flex">
                      <MedicineCard {...med} />
                    </div>
                  ))
                ) : (
                  medicines.slice(0, 10).map((med) => (
                    <div key={med._id} className="w-full sm:min-w-[220px] sm:max-w-[220px] flex">
                      <MedicineCard {...med} />
                    </div>
                  ))
                )}
              </div>
            )}

            {!loading && (
              <button 
                onClick={() => trendingScrollRef.current?.scrollBy({ left: 440, behavior: 'smooth' })}
                className="hidden md:flex absolute -right-4 top-[40%] -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#ff6f61]"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Skin Care Products (Desktop Only) */}
      <section className="hidden sm:block bg-white py-6 md:py-12">
        <div className="mx-auto max-w-[1400px] px-4 md:px-5">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">
                Skin Care
              </h2>
              <p className="hidden md:block text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">Nourish and protect your skin</p>
            </div>
            <button 
              onClick={() => navigate('/medicines?filter=skin-care')} 
              className="flex items-center gap-1 text-[#00a2a4] hover:text-[#007b7d] font-bold text-xs md:text-sm transition-colors uppercase tracking-wider"
            >
              See all <ChevronRight size={16} />
            </button>
          </div>

          <div className="relative group">
            {loading ? (
              <div className="flex gap-4 md:gap-6 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="min-w-[150px] md:min-w-[200px] h-56 md:h-72 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : (
              <div 
                ref={skinCareScrollRef}
                className="custom-scrollbar-hidden flex items-stretch gap-4 md:gap-6 overflow-x-auto md:pt-4 pb-4 md:pb-8 scroll-smooth md:px-2"
              >
                {medicines.filter(m => m.category === 'Skin Care').length > 0 ? (
                  medicines.filter(m => m.category === 'Skin Care').map((med) => (
                    <div key={med._id} className="min-w-[140px] max-w-[140px] md:min-w-[220px] md:max-w-[220px] flex">
                      <MedicineCard {...med} />
                    </div>
                  ))
                ) : (
                   <div className="w-full py-10 text-center">
                     <p className="text-sm font-medium text-slate-400">No Skin Care products available currently.</p>
                   </div>
                )}
              </div>
            )}

            {!loading && medicines.filter(m => m.category === 'Skin Care').length > 0 && (
              <button 
                onClick={() => skinCareScrollRef.current?.scrollBy({ left: 440, behavior: 'smooth' })}
                className="hidden md:flex absolute -right-4 top-[40%] -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#ff6f61]"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Middle Banner (Ayurveda Promo - Desktop Only) */}
      {ayurBanners.length > 0 && (
        <section className="hidden sm:block bg-white py-10">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="relative h-[150px] overflow-hidden rounded-2xl bg-slate-900 sm:h-[240px] group">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`${currentAyurBanner}-${ayurBanners[currentAyurBanner]?._id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-0 flex items-center transition-colors duration-500 ${ayurBanners[currentAyurBanner]?.bg || 'bg-gradient-to-r from-emerald-600 to-teal-700'}`}
                >
                  {/* Right Side Image */}
                  <div className="absolute right-0 h-full w-[70%] overflow-hidden">
                    <img 
                      src={ayurBanners[currentAyurBanner]?.image} 
                      alt="Ayurveda" 
                      className="h-full w-full object-cover rounded-l-[150px] sm:rounded-l-[300px] border-l-4 sm:border-l-8 border-white/20 shadow-[-20px_0_40px_rgba(0,0,0,0.3)]"
                    />
                  </div>

                  {/* Left Side Content */}
                  <div className="relative z-10 w-full px-8 sm:w-1/2 sm:px-16">
                    <span className="mb-1.5 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                      SPECIAL OFFER
                    </span>
                    <h2 className="text-lg sm:text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase line-clamp-1">
                      {ayurBanners[currentAyurBanner]?.title}
                    </h2>
                    <p className="mt-1 max-w-md text-[9px] font-bold uppercase tracking-[0.2em] text-white/80 sm:text-sm line-clamp-2">
                      {ayurBanners[currentAyurBanner]?.desc || "Redefine the way you live with Ayurveda."}
                    </p>
                    <button 
                      onClick={() => navigate(ayurBanners[currentAyurBanner]?.link || '/ayurveda')}
                      className="mt-2.5 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-[9px] font-black text-white shadow-xl hover:bg-blue-750 transition-all active:scale-95 sm:mt-6 sm:px-10 sm:py-3.5 sm:text-xs"
                    >
                      SHOP NOW <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Arrows - Always Visible */}
              {ayurBanners.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
                  <button 
                    onClick={() => setCurrentAyurBanner(prev => (prev === 0 ? ayurBanners.length - 1 : prev - 1))}
                    className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 transition-all shadow-lg"
                  >
                    <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                  </button>
                  <button 
                    onClick={() => setCurrentAyurBanner(prev => (prev === ayurBanners.length - 1 ? 0 : prev + 1))}
                    className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 transition-all shadow-lg"
                  >
                    <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Ayurveda Products (Desktop Only) */}
      <section className="hidden sm:block bg-white py-6 md:py-12">
        <div className="mx-auto max-w-[1400px] px-4 md:px-5">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">
                Ayurveda
              </h2>
              <p className="hidden md:block text-slate-400 mt-1 text-xs font-bold uppercase tracking-wider">Natural Vedic healing therapies</p>
            </div>
            <button 
              onClick={() => navigate('/ayurveda')} 
              className="flex items-center gap-1 text-[#00a2a4] hover:text-[#007b7d] font-bold text-xs md:text-sm transition-colors uppercase tracking-wider"
            >
              See all <ChevronRight size={16} />
            </button>
          </div>

          <div className="relative group">
            {loading ? (
              <div className="flex gap-4 md:gap-6 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="min-w-[150px] md:min-w-[200px] h-56 md:h-72 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : (
              <div 
                ref={ayurScrollRef}
                className="custom-scrollbar-hidden flex items-stretch gap-4 md:gap-6 overflow-x-auto md:pt-4 pb-4 md:pb-8 scroll-smooth md:px-2"
              >
                {medicines.filter(m => m.category === 'Ayurveda').length > 0 ? (
                  medicines.filter(m => m.category === 'Ayurveda').map((med) => (
                    <div key={med._id} className="min-w-[140px] max-w-[140px] md:min-w-[220px] md:max-w-[220px] flex">
                      <MedicineCard {...med} />
                    </div>
                  ))
                ) : (
                   <div className="w-full py-10 text-center">
                     <p className="text-sm font-medium text-slate-400">No Ayurveda products available currently.</p>
                   </div>
                )}
              </div>
            )}

            {!loading && medicines.filter(m => m.category === 'Ayurveda').length > 0 && (
              <button 
                onClick={() => ayurScrollRef.current?.scrollBy({ left: 440, behavior: 'smooth' })}
                className="hidden md:flex absolute -right-4 top-[40%] -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#ff6f61]"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
