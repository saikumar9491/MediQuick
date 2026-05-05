import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Filter,
  Heart,
  Droplets,
  Sparkles,
  Zap,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AyurvedaPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', icon: <Leaf size={18} /> },
    { name: 'Immunity', icon: <ShieldCheck size={18} /> },
    { name: 'Skin Care', icon: <Sparkles size={18} /> },
    { name: 'Digestion', icon: <Zap size={18} /> },
    { name: 'Hair Care', icon: <Droplets size={18} /> },
    { name: 'Stress Relief', icon: <Heart size={18} /> }
  ];

  const products = [
    {
      id: 'chyawanprash',
      name: 'Pure Herbal Chyawanprash',
      brand: 'Dabur',
      desc: 'Boosts immunity and improves respiratory health with 50+ herbs.',
      price: 349,
      mrp: 450,
      rating: 4.8,
      reviews: 1500,
      category: 'Immunity',
      image: 'https://images.unsplash.com/photo-1615485240384-552e40df19c1?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'ashwagandha',
      name: 'Ashwagandha Stress Relief',
      brand: 'Himalaya',
      desc: 'Natural adaptogen to reduce stress and anxiety while boosting energy.',
      price: 199,
      mrp: 250,
      rating: 4.9,
      reviews: 2100,
      category: 'Stress Relief',
      image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'triphala',
      name: 'Triphala Digestive Care',
      brand: 'Baidyanath',
      desc: 'Supports healthy digestion and detoxifies the body naturally.',
      price: 149,
      mrp: 200,
      rating: 4.7,
      reviews: 800,
      category: 'Digestion',
      image: 'https://images.unsplash.com/photo-1540439867361-137d03a4cf13?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'aloe-vera',
      name: 'Pure Aloe Vera Gel',
      brand: 'Patanjali',
      desc: 'Natural hydration and cooling for healthy skin and hair.',
      price: 99,
      mrp: 120,
      rating: 4.6,
      reviews: 3500,
      category: 'Skin Care',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'brahmi-oil',
      name: 'Brahmi Hair Revitalizer',
      brand: 'Kama Ayurveda',
      desc: 'Nourishes scalp and strengthens hair roots with traditional herbs.',
      price: 799,
      mrp: 950,
      rating: 4.9,
      reviews: 450,
      category: 'Hair Care',
      image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const filteredProducts = products.filter(prod => {
    const matchesCategory = activeCategory === 'All' || prod.category === activeCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         prod.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (name) => {
    toast.success(`${name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header Section */}
        <section className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100"
          >
            <Leaf size={14} /> 100% Natural & Ayurvedic
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black uppercase italic tracking-tight text-slate-800 sm:text-6xl"
          >
            Ayurvedic <span className="text-[#00a2a4]">Care & Wellness</span>
          </motion.h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm font-bold uppercase tracking-widest text-slate-400 leading-relaxed">
            Discover the ancient wisdom of Ayurveda with our curated collection of pure, herbal remedies for a balanced life.
          </p>

          <div className="mx-auto mt-12 max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#00a2a4] transition-colors">
                <Search size={22} />
              </div>
              <input
                type="text"
                placeholder="Search herbs, products or brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-[2rem] border-none bg-white py-6 pl-16 pr-6 text-sm font-bold shadow-2xl shadow-slate-200/50 outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-[#00a2a4] transition-all"
              />
            </div>
          </div>
        </section>

        {/* 2. Categories Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1 bg-[#00a2a4] rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Shop by Concern</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar-hidden">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex shrink-0 items-center gap-4 rounded-3xl px-8 py-5 text-xs font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat.name
                    ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300'
                    : 'bg-white text-slate-500 border border-slate-100 hover:border-[#00a2a4] hover:text-[#00a2a4]'
                }`}
              >
                <span className={activeCategory === cat.name ? 'text-[#00a2a4]' : ''}>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Product Listing Section */}
        <section className="mb-24">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-800">
              Curated <span className="text-[#00a2a4]">Ayurvedic Essentials</span>
            </h2>
            <div className="rounded-full bg-white px-4 py-1 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {filteredProducts.length} Items Found
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((prod) => (
              <motion.div
                layout
                key={prod.id}
                className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-50 bg-white shadow-sm transition-all hover:shadow-2xl hover:shadow-teal-100/50"
              >
                {/* Product Image */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-50">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 backdrop-blur-md shadow-sm">
                      Best Seller
                    </span>
                  </div>
                  <button className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 text-slate-400 hover:text-rose-500 transition-colors shadow-sm">
                    <Heart size={18} />
                  </button>
                </div>

                <div className="flex flex-col p-6 flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#00a2a4]">{prod.brand}</span>
                    <div className="flex items-center gap-1 text-[10px] font-black text-amber-500">
                      <Star size={12} className="fill-current" /> {prod.rating}
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-black uppercase italic tracking-tight text-slate-800 line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="mb-6 text-[10px] font-bold leading-relaxed text-slate-400 line-clamp-2 uppercase">
                    {prod.desc}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price</span>
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-black text-slate-800">₹{prod.price}</span>
                        <span className="mb-0.5 text-xs font-bold text-slate-300 line-through">₹{prod.mrp}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => addToCart(prod.name)}
                      className="h-14 w-14 flex items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-[#00a2a4] hover:shadow-teal-100 transition-all active:scale-95"
                    >
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose Ayurveda? */}
        <section className="mb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-[3rem] bg-emerald-50 p-10 border border-emerald-100">
            <CheckCircle2 className="mb-6 text-emerald-600" size={40} />
            <h4 className="mb-4 text-xl font-black uppercase italic tracking-tight text-slate-800">Zero Side Effects</h4>
            <p className="text-[10px] font-bold text-emerald-800 uppercase leading-relaxed">
              Our products are formulated using pure herbs and traditional processes, ensuring complete safety for long-term use.
            </p>
          </div>
          <div className="rounded-[3rem] bg-teal-50 p-10 border border-teal-100">
            <Zap className="mb-6 text-[#00a2a4]" size={40} />
            <h4 className="mb-4 text-xl font-black uppercase italic tracking-tight text-slate-800">Holistic Healing</h4>
            <p className="text-[10px] font-bold text-teal-800 uppercase leading-relaxed">
              We focus on treating the root cause of ailments by balancing your Doshas (Vata, Pitta, Kapha).
            </p>
          </div>
          <div className="rounded-[3rem] bg-amber-50 p-10 border border-amber-100">
            <Sparkles className="mb-6 text-amber-500" size={40} />
            <h4 className="mb-4 text-xl font-black uppercase italic tracking-tight text-slate-800">Certified Purity</h4>
            <p className="text-[10px] font-bold text-amber-800 uppercase leading-relaxed">
              Every batch is lab-tested and certified by AYUSH for quality and authenticity.
            </p>
          </div>
        </section>

        {/* Free Consultation Banner */}
        <section className="rounded-[4rem] bg-slate-900 p-12 text-white shadow-2xl relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00a2a4]/10 via-transparent to-[#00a2a4]/10" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter sm:text-5xl">
              Confused about which <span className="text-[#00a2a4]">herb</span> to choose?
            </h2>
            <p className="mt-6 text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              Get a free consultation with our Ayurvedic experts to find the perfect remedy for your health concerns.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/consult')}
                className="w-full sm:w-auto rounded-2xl bg-[#00a2a4] px-10 py-5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-teal-900/20 hover:bg-teal-700 transition-all"
              >
                Book Free Consultation
              </button>
              <div className="flex items-center gap-3 text-slate-400">
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                  <PhoneCall size={20} />
                </div>
                <div className="text-left">
                  <p className="text-[8px] font-black uppercase tracking-widest">Call our Expert</p>
                  <p className="text-xs font-black text-white">+91 800 555 0123</p>
                </div>
              </div>
            </div>
          </div>
        </section>

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