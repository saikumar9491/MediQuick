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

const Home = ({ medicines = [], featured = [], loading = true }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { token, user } = useAuth();
  const fileInputRef = useRef(null);
  const categoryScrollRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const defaultBanners = [
    {
      _id: 'default1',
      title: 'Genuine Medicines. Guaranteed.',
      desc: 'Sourced from verified manufacturers and stored at optimal temperatures.',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=2000',
      category: 'general'
    },
    {
      _id: 'default2',
      title: 'Flat 25% Off on First Order',
      desc: 'Use code MEDI25 at checkout. Rapid delivery to your doorstep.',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000',
      category: 'general'
    }
  ];

  const [dbBanners, setDbBanners] = useState(defaultBanners);
  const [isUploading, setIsUploading] = useState(false);
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

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

  const activeBanners = dbBanners.filter(b => b.category !== 'flash');

  useEffect(() => {
    if (activeBanners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === activeBanners.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

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
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* Hero Section */}
      <section className="bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative h-[160px] overflow-hidden rounded-2xl bg-slate-900 sm:h-[320px]">
            <AnimatePresence mode="wait">
              {activeBanners.length > 0 ? (
                <motion.div
                  key={currentBanner}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => navigate('/medicines')}
                >
                  <img 
                    src={activeBanners[currentBanner].image} 
                    className="h-full w-full object-cover opacity-80" 
                    alt="banner" 
                  />
                  <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-16">
                    <motion.h1 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-xl font-black tracking-tight text-white sm:text-5xl"
                    >
                      {activeBanners[currentBanner].title}
                    </motion.h1>
                    <p className="mt-2 max-w-md text-[10px] font-bold text-slate-200 uppercase tracking-widest sm:text-sm">
                      {activeBanners[currentBanner].desc || "Healthcare delivered to your doorstep."}
                    </p>
                    <button className="mt-6 flex w-fit items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-[10px] font-black text-white shadow-xl hover:bg-white hover:text-slate-900 sm:px-10 sm:py-4 sm:text-xs">
                      SHOP NOW <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-100">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Featured Brands Section - Replaced Service Hub */}
      <FeaturedBrands />

      {/* Quick Order with Prescription */}
      <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-white px-8 py-6 sm:px-12 sm:py-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 shadow-inner">
                  <Upload size={24} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Quick Order with Prescription</h2>
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-500 max-w-md mx-auto md:mx-0 leading-relaxed">
                Upload your prescription and our experts will fulfill your order with 100% genuine medicines.
              </p>
            </div>

          <div className="flex w-full md:w-auto items-center gap-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-[11px] font-black uppercase tracking-widest border-2 transition-all ${selectedFile ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : 'text-slate-900 border-slate-100 hover:bg-slate-50'}`}
            >
              {selectedFile ? 'READY' : 'SELECT FILE'}
            </button>
            <button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-10 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-slate-900 active:scale-95 disabled:bg-slate-200 transition-all shadow-blue-200"
            >
              {isUploading ? 'UPLOADING...' : 'ORDER NOW'}
            </button>
          </div>
        </div>
      </section>

      {/* Shop by Categories */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between px-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">Shop by <span className="text-blue-600">Categories</span></h2>
          <button onClick={() => navigate('/categories')} className="text-[11px] font-black text-blue-600 uppercase tracking-[2px] hover:underline">View All</button>
        </div>
        <style>{`
          .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
          .custom-scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
          .category-card {
            min-width: 150px;
            background: white;
            border: 1px solid #eef2f6;
            border-radius: 16px;
            padding: 8px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          }
          .category-card:hover {
            box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.08);
            transform: translateY(-4px);
            border-color: #cbd5e1;
          }
          .category-inner {
            height: 140px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            overflow: hidden;
            transition: all 0.4s ease;
          }
          .category-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 5;
            transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .category-card:hover .category-image {
            transform: scale(1.1);
          }
        `}</style>
        
        <div className="relative group">
          <div 
            ref={categoryScrollRef}
            className="custom-scrollbar-hidden flex gap-5 overflow-x-auto pb-8 scroll-smooth px-2"
          >
            {mainCategories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(cat.path)}
                className="category-card"
              >
                <div className="category-inner" style={{ backgroundColor: cat.bgColor }}>
                  <img src={cat.image} className="category-image" alt={cat.name} />
                </div>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={() => categoryScrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
            className="absolute -right-3 top-[42%] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#ef4444] shadow-[0_4px_15px_rgb(0,0,0,0.1)] transition-all hover:scale-110 active:scale-95 border border-slate-100 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </div>
      </section>

      {/* Trending Products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">Trending <span className="text-blue-600">Products</span></h2>
          <button onClick={() => navigate('/all-medicines')} className="text-[11px] font-black text-blue-600 uppercase tracking-[2px] hover:underline">See All</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-[2rem] bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
            {medicines.slice(0, 6).map((med) => (
              <MedicineCard key={med._id} {...med} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;