import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  FlaskConical, 
  Stethoscope, 
  LayoutGrid,
  ShieldCheck, 
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ClipboardList,
  Zap,
  User,
  Shield
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import MedicineCard from '../components/medicine/MedicineCard';
import { API_BASE } from '../utils/apiConfig';
import toast from 'react-hot-toast';

const Home = ({ medicines = [], loading = true }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const mainCategories = [
    { name: 'Skin Care', path: '/medicines?filter=skin-care', image: 'https://i.pinimg.com/1200x/8c/9f/a7/8c9fa7dbc6e87d9a2d83c5bf0acf7874.jpg', bg: 'bg-yellow-100/50' },
    { name: 'Hair Care', path: '/medicines?filter=hair-care', image: 'https://i.pinimg.com/1200x/33/5d/60/335d60b4559e4623f2406bc3b0e30ffd.jpg', bg: 'bg-emerald-100/50' },
    { name: 'Sexual Wellness', path: '/medicines?filter=sexual-wellness', image: 'https://i.pinimg.com/736x/bf/31/97/bf3197b411beb6ba42a4388bb3d748e8.jpg', bg: 'bg-orange-100/50' },
    { name: 'Oral Care', path: '/medicines?filter=oral-care', image: 'https://i.pinimg.com/1200x/fb/9c/41/fb9c41e93cfea49347d0b3185ef22dfa.jpg', bg: 'bg-rose-100/50' },
    { name: 'Elderly Care', path: '/medicines?filter=elderly-care', image: 'https://i.pinimg.com/736x/af/0d/c1/af0dc1cc90a563d04dada004faa08fc9.jpg', bg: 'bg-cyan-100/50' },
    { name: 'Baby Care', path: '/medicines?filter=baby-care', image: 'https://i.pinimg.com/1200x/8b/e2/e9/8be2e9392f247ba5023e358f5e680e07.jpg', bg: 'bg-indigo-100/50' },
    { name: 'Women Care', path: '/medicines?filter=women-care', image: 'https://i.pinimg.com/736x/af/5a/48/af5a48eee0368a39893111da34873dcc.jpg', bg: 'bg-pink-100/50' },
    { name: 'Men Grooming', path: '/medicines?filter=men-grooming', image: 'https://i.pinimg.com/736x/92/4e/62/924e627a91885b5a0ff6067af986f6b4.jpg', bg: 'bg-slate-100/50' }
  ];

  const handleUpload = async () => {
    if (!user) return toast.error('Please login first');
    if (!selectedFile) return toast.error('Select a prescription file');
    
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setSelectedFile(null);
      toast.success('Prescription uploaded for review!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <style>{`
        .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
        .custom-scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Hero Section */}
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative h-[200px] sm:h-[320px] overflow-hidden rounded-[2.5rem] bg-blue-600 p-8 sm:p-16 flex flex-col justify-center shadow-2xl shadow-blue-100">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-6xl font-[1000] italic uppercase tracking-tighter text-white leading-[0.9]">
                2-HOUR EXPRESS <br /> DELIVERY
              </h1>
              <p className="mt-4 text-xs sm:text-xl font-bold italic text-blue-100 uppercase tracking-widest">
                Fastest pharmacy delivery in Amritsar.
              </p>
            </motion.div>
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
              <ShoppingBag className="h-full w-full rotate-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[3rem] bg-blue-50/50 p-8 sm:p-12 border border-blue-100/50">
          <div className="mb-8 flex items-center justify-between px-2">
            <h2 className="text-xl sm:text-2xl font-[1000] italic uppercase tracking-tighter text-slate-800">Quick Services</h2>
            <div className="flex gap-3">
              <button onClick={() => categoryScrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm border border-slate-100 active:scale-90 transition-all">
                <ChevronLeft size={22} />
              </button>
              <button onClick={() => categoryScrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-600 shadow-md border border-slate-100 active:scale-90 transition-all">
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
          
          <div ref={categoryScrollRef} className="flex gap-5 overflow-x-auto pb-4 custom-scrollbar-hidden scroll-smooth">
            {[
              { title: 'Medicines', icon: '💊', desc: 'Flat 25% Off', color: 'text-rose-500' },
              { title: 'Lab Tests', icon: '🔬', desc: 'Up to 70% Off', color: 'text-blue-500' },
              { title: 'Doctor', icon: '👨‍⚕️', desc: 'Online Chat', color: 'text-emerald-500' },
              { title: 'Ayurveda', icon: '🌿', desc: 'Pure Herbal', color: 'text-green-500' },
              { title: 'Care Plan', icon: '🛡️', desc: 'Extra Savings', color: 'text-red-500' },
            ].map((s, i) => (
              <div key={i} className="min-w-[150px] sm:min-w-[240px] flex flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-50 text-center transition-all hover:shadow-xl hover:-translate-y-2 group cursor-pointer">
                <div className="mb-5 text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
                <h3 className="text-xs sm:text-base font-black uppercase tracking-tight text-slate-900">{s.title}</h3>
                <p className={`mt-2 text-[10px] sm:text-xs font-black ${s.color} uppercase tracking-tighter`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prescription Card */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[3rem] bg-[#fff3e0] p-10 sm:p-16 border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/20 blur-[100px] rounded-full" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-100 text-orange-500 shadow-inner">
                <ClipboardList size={40} />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-[1000] italic uppercase tracking-tighter text-[#9a6a38] leading-none">
                  Order with <br className="hidden sm:block" /> Prescription
                </h2>
                <p className="mt-4 text-xs font-black uppercase tracking-[2px] text-[#9a6a38]/60">
                  Verified Pharmacists will review your order
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 w-full lg:w-auto">
              <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
              <button 
                onClick={() => fileInputRef.current.click()}
                className="flex items-center justify-center rounded-2xl border-2 border-orange-400 bg-white px-10 py-5 text-[11px] font-[1000] uppercase tracking-[2px] text-orange-500 hover:bg-orange-50 transition-all shadow-sm"
              >
                {selectedFile ? 'FILE READY' : 'Select Prescription'}
              </button>
              <button 
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="flex items-center justify-center rounded-2xl bg-slate-800 px-10 py-5 text-[11px] font-[1000] uppercase tracking-[2px] text-white hover:bg-slate-900 transition-all shadow-lg disabled:bg-slate-300"
              >
                {isUploading ? 'SENDING...' : 'Upload Now'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 p-10 sm:p-20 shadow-2xl shadow-orange-100">
          <div className="relative z-10">
            <div className="inline-block rounded-full bg-white/20 px-4 py-1 mb-4 backdrop-blur-md">
              <span className="text-[10px] font-black italic uppercase tracking-[3px] text-white">Daily Deals</span>
            </div>
            <h2 className="text-5xl sm:text-8xl font-[1000] italic uppercase tracking-tighter text-white leading-[0.8]">
              Flash <br /> Sale
            </h2>
            <p className="mt-8 text-sm sm:text-xl font-bold italic text-white/90 uppercase tracking-widest max-w-lg">
              Best offers on top medicines and wellness products
            </p>
          </div>
          <div className="absolute top-0 right-0 h-full w-1/2 bg-white/10 -skew-x-12 translate-x-32" />
          <Zap size={200} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
        </div>
      </section>

      {/* Shop by Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between px-2">
          <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter text-slate-900">Shop by Categories</h2>
          <button onClick={() => navigate('/all-medicines')} className="text-xs font-black text-blue-600 uppercase tracking-[2px] hover:underline">View All</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {mainCategories.map((cat, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(cat.path)}
              className="flex cursor-pointer flex-col overflow-hidden rounded-[2rem] bg-white shadow-sm border border-slate-100 group transition-all hover:shadow-xl"
            >
              <div className={`relative aspect-square overflow-hidden ${cat.bg}`}>
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-125" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-800 truncate">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between px-2">
          <div>
            <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter text-slate-900">Trending Near You</h2>
            <p className="mt-1 text-[10px] font-black text-blue-500 uppercase tracking-widest">Amritsar Hub Selection</p>
          </div>
          <button onClick={() => navigate('/all-medicines')} className="text-xs font-black text-blue-600 uppercase tracking-[2px]">See All</button>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[3/4] animate-pulse rounded-[2rem] bg-slate-50 border border-slate-100" />)
          ) : (
            medicines.slice(0, 6).map(med => <MedicineCard key={med._id} {...med} />)
          )}
        </div>
      </section>

      {/* Featured Brands */}
      <section className="bg-slate-50/50 py-20 border-y border-slate-100 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter text-slate-900">Trusted Global Brands</h2>
            <p className="mt-3 text-sm font-bold text-slate-400 uppercase tracking-widest">Collaborating with leaders in healthcare</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {['Himalaya', 'Cipla', 'Dabur', 'Abbott', 'GSK', 'Glenmark'].map(brand => (
              <span key={brand} className="text-3xl font-black tracking-[4px] uppercase italic text-slate-900">{brand}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;