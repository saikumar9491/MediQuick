import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  ShoppingBag, 
  ChevronRight, 
  ChevronLeft,
  ShieldCheck,
  Sparkles,
  Zap,
  Heart,
  Droplets,
  Star,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE } from '../utils/apiConfig';
import MedicineCard from '../components/medicine/MedicineCard';

const AyurvedaPage = () => {
  const navigate = useNavigate();
  const scrollRefs = useRef({});
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAyurveda = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/medicines`);
        const data = await res.json();
        // Filter only Ayurvedic products
        const ayurvedaItems = (Array.isArray(data) ? data : []).filter(
          item => item.category === 'Ayurveda'
        );
        setMedicines(ayurvedaItems);
      } catch (err) {
        console.error("Ayurveda sync error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAyurveda();
  }, []);

  // Group by subCategory for the catalog view
  const groupedProducts = medicines.reduce((acc, prod) => {
    const sub = prod.subCategory || 'General Wellness';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(prod);
    return acc;
  }, {});

  const getIcon = (sub) => {
    switch(sub.toLowerCase()) {
      case 'chyawanprash': return <ShieldCheck size={20} />;
      case 'ashwagandha': return <Heart size={20} />;
      case 'triphala': return <Zap size={20} />;
      case 'herbal tea': return <Droplets size={20} />;
      default: return <Leaf size={20} />;
    }
  };

  const scroll = (catName, direction) => {
    const container = scrollRefs.current[catName];
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const addToCart = (name) => {
    toast.success(`${name} added to cart!`);
  };

  const banners = [
    {
      title: "Ancient Healing, Modern Wellness",
      desc: "Up to 40% off on pure herbal extracts & supplements.",
      bg: "from-emerald-600 to-teal-800",
      tag: "PURE HERBAL",
      icon: "🌿"
    },
    {
      title: "Immunity Shield Collection",
      desc: "Traditional Chyawanprash & Giloy at best prices.",
      bg: "from-amber-600 to-orange-800",
      tag: "IMMUNITY",
      icon: "🛡️"
    }
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Professional Banner */}
        <section className="mb-10 overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl border border-slate-100">
          <div className="relative h-[200px] sm:h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`absolute inset-0 bg-gradient-to-br ${banners[currentBanner].bg} p-8 sm:p-16`}
              >
                <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[10rem] opacity-10 select-none">
                  {banners[currentBanner].icon}
                </div>
                
                <div className="relative z-10 flex h-full flex-col justify-center">
                  <span className="mb-4 w-fit rounded-full bg-white/20 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/10">
                    {banners[currentBanner].tag} SPECIAL
                  </span>
                  <h2 className="max-w-2xl text-3xl font-black italic tracking-tighter text-white sm:text-5xl uppercase">
                    {banners[currentBanner].title}
                  </h2>
                  <p className="mt-4 max-w-md text-xs font-bold text-white/80 sm:text-base uppercase tracking-widest">
                    {banners[currentBanner].desc}
                  </p>
                  <button className="mt-8 w-fit rounded-xl bg-white px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl hover:bg-[#00a2a4] hover:text-white transition-all">
                    Shop Now
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentBanner === i ? 'w-10 bg-white' : 'w-3 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Header Section */}
        <div className="mb-16 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100"
          >
            <Leaf size={14} /> 100% Herbal Solutions
          </motion.div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-slate-800">
            Ayurvedic <span className="text-[#00a2a4]">Wellness Directory</span>
          </h1>
          <p className="mt-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
            Explore traditional remedies grouped by specialized categories
          </p>
        </div>

        {loading ? (
          <div className="space-y-12">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-8 w-48 bg-slate-200 rounded mb-6" />
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4].map(j => <div key={j} className="h-64 min-w-[240px] bg-white rounded-[2rem] border border-slate-100" />)}
                </div>
              </div>
            ))}
          </div>
        ) : medicines.length > 0 ? (
          <div className="space-y-16">
            {Object.keys(groupedProducts).map((subName) => (
              <section key={subName} className="animate-fadeIn relative group">
                <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100">
                      {getIcon(subName)}
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black uppercase tracking-[2px] text-slate-800">
                        {subName}
                      </h2>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {groupedProducts[subName].length} VERIFIED PRODUCTS
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/medicines?filter=ayurveda`)}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 hover:border-[#00a2a4] hover:text-[#00a2a4] transition-all shadow-sm"
                  >
                    Enter Hub
                    <ChevronRight size={14} />
                  </button>
                </div>
                
                {/* Scroll Buttons */}
                <button 
                  onClick={() => scroll(subName, 'left')}
                  className="absolute left-[-20px] top-[60%] z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white text-slate-800 shadow-xl border border-slate-100 transition-all hover:bg-[#00a2a4] hover:text-white md:flex group-hover:left-[-10px] opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => scroll(subName, 'right')}
                  className="absolute right-[-20px] top-[60%] z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white text-slate-800 shadow-xl border border-slate-100 transition-all hover:bg-[#00a2a4] hover:text-white md:flex group-hover:right-[-10px] opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={24} />
                </button>

                <div 
                  ref={el => scrollRefs.current[subName] = el}
                  className="custom-scrollbar-hidden flex gap-6 overflow-x-auto pt-4 pb-8 scroll-smooth snap-x"
                >
                  {groupedProducts[subName].map((prod) => (
                    <div 
                      key={prod._id} 
                      className="min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] snap-start"
                    >
                      <MedicineCard {...prod} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 h-20 w-20 flex items-center justify-center rounded-full bg-slate-50 text-slate-300">
               <Activity size={40} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-800">No Ayurvedic Products Yet</h3>
            <p className="mt-2 text-sm font-bold text-slate-400">Add products with 'Ayurveda' category in Admin to see them here.</p>
          </div>
        )}

      </div>

      <style>{`
        .custom-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AyurvedaPage;