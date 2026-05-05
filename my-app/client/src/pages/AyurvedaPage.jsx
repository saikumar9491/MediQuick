import React, { useState, useRef } from 'react';
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
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AyurvedaPage = () => {
  const navigate = useNavigate();
  const scrollRefs = useRef({});

  const products = [
    {
      id: 'chyawanprash',
      name: 'Pure Herbal Chyawanprash',
      brand: 'Dabur',
      desc: 'Boosts immunity and improves respiratory health.',
      price: 349,
      mrp: 450,
      rating: 4.8,
      category: 'Immunity',
      image: 'https://images.unsplash.com/photo-1615485240384-552e40df19c1?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'giloy',
      name: 'Giloy Ghan Vati',
      brand: 'Patanjali',
      desc: 'Natural immune system booster and fever reducer.',
      price: 120,
      mrp: 150,
      rating: 4.7,
      category: 'Immunity',
      image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'ashwagandha',
      name: 'Ashwagandha Stress Relief',
      brand: 'Himalaya',
      desc: 'Natural adaptogen to reduce stress and anxiety.',
      price: 199,
      mrp: 250,
      rating: 4.9,
      category: 'Stress Relief',
      image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'triphala',
      name: 'Triphala Digestive Care',
      brand: 'Baidyanath',
      desc: 'Supports healthy digestion and detoxifies body.',
      price: 149,
      mrp: 200,
      rating: 4.7,
      category: 'Digestion',
      image: 'https://images.unsplash.com/photo-1540439867361-137d03a4cf13?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'aloe-vera',
      name: 'Pure Aloe Vera Gel',
      brand: 'Patanjali',
      desc: 'Natural hydration for healthy skin and hair.',
      price: 99,
      mrp: 120,
      rating: 4.6,
      category: 'Skin Care',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'kumkumadi',
      name: 'Kumkumadi Face Oil',
      brand: 'Kama Ayurveda',
      desc: 'Miraculous beauty fluid for glowing skin.',
      price: 2495,
      mrp: 2995,
      rating: 4.9,
      category: 'Skin Care',
      image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const categories = [
    { name: 'Immunity', icon: <ShieldCheck size={20} /> },
    { name: 'Skin Care', icon: <Sparkles size={20} /> },
    { name: 'Digestion', icon: <Zap size={20} /> },
    { name: 'Stress Relief', icon: <Heart size={20} /> }
  ];

  const groupedProducts = products.reduce((acc, prod) => {
    if (!acc[prod.category]) acc[prod.category] = [];
    acc[prod.category].push(prod);
    return acc;
  }, {});

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

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
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
            Explore traditional remedies grouped by health department
          </p>
        </div>

        {/* Categories Section */}
        <div className="space-y-16">
          {categories.map((cat) => (
            groupedProducts[cat.name] && (
              <section key={cat.name} className="animate-fadeIn relative group">
                <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100">
                      {cat.icon}
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black uppercase tracking-[2px] text-slate-800">
                        {cat.name}
                      </h2>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {groupedProducts[cat.name].length} NATURAL REMEDIES
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/medicines?filter=${cat.name.toLowerCase().replace(/ /g, '-')}`)}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 hover:border-[#00a2a4] hover:text-[#00a2a4] transition-all shadow-sm"
                  >
                    View All
                    <ChevronRight size={14} />
                  </button>
                </div>
                
                {/* Scroll Buttons */}
                <button 
                  onClick={() => scroll(cat.name, 'left')}
                  className="absolute left-[-20px] top-[60%] z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white text-slate-800 shadow-xl border border-slate-100 transition-all hover:bg-[#00a2a4] hover:text-white md:flex group-hover:left-[-10px] opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => scroll(cat.name, 'right')}
                  className="absolute right-[-20px] top-[60%] z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white text-slate-800 shadow-xl border border-slate-100 transition-all hover:bg-[#00a2a4] hover:text-white md:flex group-hover:right-[-10px] opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={24} />
                </button>

                <div 
                  ref={el => scrollRefs.current[cat.name] = el}
                  className="custom-scrollbar-hidden flex gap-6 overflow-x-auto pt-4 pb-8 scroll-smooth snap-x"
                >
                  {groupedProducts[cat.name].map((prod) => (
                    <motion.div 
                      key={prod.id} 
                      className="min-w-[240px] max-w-[240px] snap-start group/card"
                      whileHover={{ y: -10 }}
                    >
                      <div className="relative overflow-hidden rounded-[2rem] border border-slate-50 bg-white shadow-sm transition-all hover:shadow-2xl hover:shadow-teal-100/50">
                        <div className="relative h-48 w-full overflow-hidden bg-slate-50">
                          <img src={prod.image} alt={prod.name} className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110" />
                          <div className="absolute top-3 left-3">
                            <span className="rounded-full bg-white/90 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-emerald-600 backdrop-blur-sm shadow-sm">
                              Pure Herb
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#00a2a4]">{prod.brand}</span>
                            <div className="flex items-center gap-1 text-[9px] font-black text-amber-500">
                              <Star size={10} className="fill-current" /> {prod.rating}
                            </div>
                          </div>
                          <h3 className="mb-4 text-sm font-black uppercase italic tracking-tight text-slate-800 line-clamp-1">
                            {prod.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black text-slate-800">₹{prod.price}</span>
                              <span className="text-[9px] font-bold text-slate-300 line-through">₹{prod.mrp}</span>
                            </div>
                            <button 
                              onClick={() => addToCart(prod.name)}
                              className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg hover:bg-[#00a2a4] transition-all"
                            >
                              <ShoppingBag size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )
          ))}
        </div>

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