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

  const services = [
    { title: 'Medicines', icon: <ShoppingBag className="h-6 w-6" />, desc: 'Flat 25% Off', color: 'bg-orange-50 text-orange-600', path: '/categories' },
    { title: 'Lab Tests', icon: <FlaskConical className="h-6 w-6" />, desc: 'Up to 70% Off', color: 'bg-blue-50 text-blue-600', path: '/lab-tests' },
    { title: 'Consult', icon: <Stethoscope className="h-6 w-6" />, desc: 'Online Chat', color: 'bg-teal-50 text-teal-600', path: '/consult' },
    { title: 'Ayurveda', icon: <LayoutGrid className="h-6 w-6" />, desc: 'Pure Herbal', color: 'bg-green-50 text-green-600', path: '/ayurveda' },
    { title: 'Care Plan', icon: <ShieldCheck className="h-6 w-6" />, desc: 'Extra Savings', color: 'bg-red-50 text-red-600', path: '/care-plan' },
  ];

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
    // Simulation for demo
    setTimeout(() => {
      setIsUploading(false);
      setSelectedFile(null);
      toast.success('Prescription uploaded for review!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Hero Section - 2-Hour Express Delivery */}
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative h-[180px] sm:h-[300px] overflow-hidden rounded-3xl bg-blue-600 p-8 sm:p-16 flex flex-col justify-center shadow-xl shadow-blue-100">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-6xl font-[1000] italic uppercase tracking-tighter text-white leading-none">
                2-HOUR EXPRESS <br /> DELIVERY
              </h1>
              <p className="mt-4 text-xs sm:text-xl font-bold italic text-blue-100 uppercase tracking-widest">
                Fastest pharmacy delivery in Amritsar.
              </p>
            </motion.div>
            
            {/* Decorative Pill Background */}
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
              <ShoppingBag className="h-full w-full rotate-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services Carousel */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] bg-blue-50/50 p-8 sm:p-10 border border-blue-100/50">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-black italic uppercase tracking-tight text-slate-800">Quick Services</h2>
            <div className="flex gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm border border-slate-100">
                <ChevronLeft size={20} />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-md border border-slate-100">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar-hidden">
            {[
              { title: 'Medicines', icon: '💊', desc: 'Flat 25% Off', color: 'text-rose-500' },
              { title: 'Lab Tests', icon: '🔬', desc: 'Up to 70% Off', color: 'text-blue-500' },
              { title: 'Doctor', icon: '👨‍⚕️', desc: 'Online Chat', color: 'text-emerald-500' },
              { title: 'Ayurveda', icon: '🌿', desc: 'Pure Herbal', color: 'text-green-500' },
              { title: 'Care Plan', icon: '🛡️', desc: 'Extra Savings', color: 'text-red-500' },
            ].map((s, i) => (
              <div key={i} className="min-w-[140px] sm:min-w-[220px] flex flex-col items-center justify-center rounded-[2rem] bg-white p-6 shadow-sm border border-slate-50 text-center transition-transform hover:scale-105">
                <div className="mb-4 text-4xl sm:text-5xl">{s.icon}</div>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-900">{s.title}</h3>
                <p className={`mt-1 text-[9px] sm:text-[11px] font-black ${s.color} uppercase tracking-tighter`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order with Prescription - Orange Card */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] bg-[#fff3e0] p-8 sm:p-12 border border-orange-100">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
              <ClipboardList size={32} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-[1000] italic uppercase tracking-tighter text-[#9a6a38]">
                Order with Prescription
              </h2>
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[1px] text-[#9a6a38]/60">
                Verified Pharmacists will review your order
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button 
              onClick={() => fileInputRef.current.click()}
              className="flex items-center justify-center rounded-2xl border-2 border-orange-400 bg-white py-5 text-[11px] font-[1000] uppercase tracking-[2px] text-orange-500 hover:bg-orange-50 transition-all"
            >
              Select Prescription
            </button>
            <button 
              className="flex items-center justify-center rounded-2xl bg-slate-300 py-5 text-[11px] font-[1000] uppercase tracking-[2px] text-white hover:bg-slate-400 transition-all"
            >
              Upload Now
            </button>
          </div>
        </div>
      </section>

      {/* Daily Deals / Flash Sale Banner */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-red-500 to-orange-500 p-8 sm:p-12 shadow-xl shadow-orange-100">
          <div className="relative z-10">
            <span className="text-[10px] font-black italic uppercase tracking-[3px] text-white/80">Daily Deals</span>
            <h2 className="mt-2 text-4xl sm:text-6xl font-[1000] italic uppercase tracking-tighter text-white leading-none">
              Flash Sale
            </h2>
            <p className="mt-4 text-xs sm:text-base font-bold italic text-white uppercase tracking-widest">
              Best offers on top medicines and wellness products
            </p>
          </div>
          
          {/* Slanted Background Effect */}
          <div className="absolute top-0 right-0 h-full w-1/2 bg-white/10 -skew-x-12 translate-x-20" />
        </div>
      </section>

      {/* Shop by Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <style>{`
          .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
          .custom-scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-black italic uppercase tracking-tight text-slate-900">Shop by Categories</h2>
          <button onClick={() => navigate('/all-medicines')} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
        </div>
        
        <div className="relative group">
          <div 
            ref={categoryScrollRef}
            className="custom-scrollbar-hidden flex gap-4 overflow-x-auto pb-4"
          >
            {mainCategories.map((cat, idx) => (
              <div 
                key={idx}
                onClick={() => navigate(cat.path)}
                className="flex min-w-[140px] cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100 group/card transition-all hover:shadow-xl sm:min-w-[180px]"
              >
                <div className={`relative aspect-square overflow-hidden ${cat.bg}`}>
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-800 truncate">{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

      {/* Shop by Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <style>{`
          .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
          .custom-scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Shop by Categories</h2>
          <button onClick={() => navigate('/all-medicines')} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
        </div>
        
        <div className="relative group">
          {/* Scroll Buttons */}
          <button 
            onClick={() => categoryScrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
            className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-3 text-slate-900 shadow-xl transition-all hover:scale-110 hover:bg-white sm:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => categoryScrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
            className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-3 text-slate-900 shadow-xl transition-all hover:scale-110 hover:bg-white sm:flex"
          >
            <ChevronRight size={20} />
          </button>

          <div 
            ref={categoryScrollRef}
            className="custom-scrollbar-hidden flex gap-4 overflow-x-auto pb-2 scroll-smooth"
          >
            {mainCategories.map((cat, idx) => (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                key={idx} 
                onClick={() => navigate(cat.path)}
                className="group relative min-w-[150px] h-[150px] sm:min-w-[200px] sm:h-[200px] cursor-pointer overflow-hidden rounded-[1.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className={`absolute inset-0 ${cat.bg} mix-blend-multiply opacity-50 group-hover:opacity-30 transition-opacity`} />
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center bg-black/10 group-hover:bg-transparent transition-all">
                  <h3 className="text-base sm:text-xl font-black uppercase tracking-tighter text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    {cat.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Trending Near You</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amritsar Hub Selection</p>
          </div>
          <button onClick={() => navigate('/all-medicines')} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">See All</button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-white border border-slate-100" />)
          ) : (
            medicines.slice(0, 6).map(med => <MedicineCard key={med._id} {...med} />)
          )}
        </div>
      </section>

      {/* Featured Brands */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Trusted Global Brands</h2>
            <p className="mt-2 text-sm font-medium text-slate-400">Collaborating with the leaders in healthcare</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12 grayscale opacity-40">
            {['Himalaya', 'Cipla', 'Dabur', 'Abbott', 'GSK', 'Glenmark'].map(brand => (
              <span key={brand} className="text-2xl font-black tracking-tighter uppercase italic">{brand}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;