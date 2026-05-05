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
    { title: 'Medicines', icon: <ShoppingBag className="h-6 w-6" />, desc: 'Flat 25% Off', color: 'bg-orange-50 text-orange-600', path: '/all-medicines' },
    { title: 'Lab Tests', icon: <FlaskConical className="h-6 w-6" />, desc: 'Up to 70% Off', color: 'bg-blue-50 text-blue-600', path: '/lab-tests' },
    { title: 'Consult', icon: <Stethoscope className="h-6 w-6" />, desc: 'Online Chat', color: 'bg-teal-50 text-teal-600', path: '/consult' },
    { title: 'Ayurveda', icon: <LayoutGrid className="h-6 w-6" />, desc: 'Pure Herbal', color: 'bg-green-50 text-green-600', path: '/ayurveda' },
    { title: 'Care Plan', icon: <ShieldCheck className="h-6 w-6" />, desc: 'Extra Savings', color: 'bg-red-50 text-red-600', path: '/care-plan' },
  ];

  const mainCategories = [
    { name: 'Skin Care', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400', bg: 'bg-yellow-100/50' },
    { name: 'Hair Care', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400', bg: 'bg-emerald-100/50' },
    { name: 'Sexual Wellness', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400', bg: 'bg-orange-100/50' },
    { name: 'Oral Care', image: 'https://images.unsplash.com/photo-1559599141-3816a0b721e4?auto=format&fit=crop&q=80&w=400', bg: 'bg-rose-100/50' },
    { name: 'Elderly Care', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=400', bg: 'bg-cyan-100/50' },
    { name: 'Baby Care', image: 'https://images.unsplash.com/photo-1515488764276-3850404988c2?auto=format&fit=crop&q=80&w=400', bg: 'bg-indigo-100/50' },
    { name: 'Women Care', image: 'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?auto=format&fit=crop&q=80&w=400', bg: 'bg-pink-100/50' },
    { name: 'Men Grooming', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=400', bg: 'bg-slate-100/50' }
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

      {/* Service Hub Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {services.map((service, idx) => (
            <motion.div
              whileHover={{ y: -5 }}
              key={idx}
              onClick={() => navigate(service.path)}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm border border-slate-100 text-center transition-all hover:shadow-xl hover:border-blue-100"
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${service.color} shadow-inner`}>
                {service.icon}
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">{service.title}</h3>
              <p className="mt-1 text-[9px] font-bold text-slate-400">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Prescription Quick Order */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Upload size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Quick Order with Prescription</h2>
            </div>
            <p className="text-sm font-medium text-slate-500 max-w-md">
              Upload your prescription and we'll fulfill your order with genuine medicines.
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
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-xs font-black uppercase tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all ${selectedFile ? 'text-green-600 border-green-100 bg-green-50' : 'text-slate-900'}`}
            >
              {selectedFile ? 'FILE SELECTED' : 'SELECT FILE'}
            </button>
            <button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl hover:bg-slate-900 active:scale-95 disabled:bg-slate-200 transition-all"
            >
              {isUploading ? 'UPLOADING...' : 'ORDER NOW'}
            </button>
          </div>
        </div>
      </section>

      {/* Shop by Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Shop by Categories</h2>
          <button onClick={() => navigate('/all-categories')} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
        </div>
        
        <div className="custom-scrollbar-hidden flex gap-4 overflow-x-auto pb-4 scroll-smooth">
          {mainCategories.map((cat, idx) => (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              key={idx} 
              onClick={() => navigate(`/medicines?category=${cat.name}`)}
              className="group relative min-w-[140px] h-[140px] sm:min-w-[180px] sm:h-[180px] cursor-pointer overflow-hidden rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-xl"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className={`absolute inset-0 ${cat.bg} mix-blend-multiply opacity-60 group-hover:opacity-40 transition-opacity`} />
              <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white drop-shadow-md">
                  {cat.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Trending Near You</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amritsar Hub Selection</p>
          </div>
          <button onClick={() => navigate('/medicines')} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">See All</button>
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