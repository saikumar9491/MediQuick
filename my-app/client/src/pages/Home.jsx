import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  FlaskConical, 
  Stethoscope, 
  Leaf, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Upload,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle
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
  const [isUploading, setIsUploading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [dbBanners, setDbBanners] = useState([]);
  const [dbBrands, setDbBrands] = useState([]);

  useEffect(() => {
    const fetchHomeAssets = async () => {
      try {
        const [bRes, brRes] = await Promise.all([
          fetch(`${API_BASE}/api/banners`),
          fetch(`${API_BASE}/api/brands`)
        ]);
        const [bData, brData] = await Promise.all([bRes.json(), brRes.json()]);
        setDbBanners(Array.isArray(bData) ? bData : []);
        setDbBrands(Array.isArray(brData) ? brData : []);
      } catch (err) {
        console.error("Home sync failed:", err);
      }
    };
    fetchHomeAssets();
  }, []);

  const activeBanners = dbBanners.filter(b => b.category !== 'flash');
  const flashBanner = dbBanners.find(b => b.category === 'flash');

  useEffect(() => {
    if (activeBanners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === activeBanners.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const handleUploadPrescription = async () => {
    if (!user) return toast.error('Please login to upload prescriptions');
    if (!selectedFile) return toast.error('Please select a file first');

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('prescription', selectedFile);

      const response = await fetch(`${API_BASE}/api/prescriptions/scan-and-check`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setScanResult(data.foundProduct);
        setSelectedFile(null);
        toast.success('Prescription scanned successfully');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const services = [
    { title: 'Medicines', icon: <ShoppingBag className="h-6 w-6" />, desc: 'Flat 25% Off', color: 'bg-orange-50 text-orange-600', path: '/medicines' },
    { title: 'Lab Tests', icon: <FlaskConical className="h-6 w-6" />, desc: 'Up to 70% Off', color: 'bg-blue-50 text-blue-600', path: '/lab-tests' },
    { title: 'Consult', icon: <Stethoscope className="h-6 w-6" />, desc: 'Online Chat', color: 'bg-teal-50 text-teal-600', path: '/consult' },
    { title: 'Ayurveda', icon: <Leaf className="h-6 w-6" />, desc: 'Pure Herbal', color: 'bg-green-50 text-green-600', path: '/ayurveda' },
    { title: 'Care Plan', icon: <ShieldCheck className="h-6 w-6" />, desc: 'Extra Savings', color: 'bg-red-50 text-red-600', path: '/care-plan' },
    { title: 'Skin Care', icon: <Sparkles className="h-6 w-6" />, desc: 'Derm Approved', color: 'bg-pink-50 text-pink-600', path: '/skin-care' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Hero Banner Section */}
      <section className="relative w-full bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative h-[180px] sm:h-[320px] md:h-[420px] overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl">
            <AnimatePresence mode="wait">
              {activeBanners.length > 0 ? (
                <motion.div
                  key={currentBanner}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => activeBanners[currentBanner].link && navigate(activeBanners[currentBanner].link)}
                >
                  {activeBanners[currentBanner].image && (
                    <img 
                      src={activeBanners[currentBanner].image} 
                      className="h-full w-full object-cover opacity-60 transition-transform duration-[10s] hover:scale-110" 
                      alt="banner" 
                    />
                  )}
                  <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20">
                    <motion.span 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-block w-fit rounded-full bg-blue-600/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md"
                    >
                      Exclusive Deal
                    </motion.span>
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 max-w-2xl text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight"
                    >
                      {activeBanners[currentBanner].title}
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 max-w-md text-xs sm:text-lg font-medium text-slate-300 opacity-90"
                    >
                      {activeBanners[currentBanner].desc || "High-quality healthcare essentials delivered to your doorstep."}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-8"
                    >
                      <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-slate-900 transition-all hover:bg-blue-600 hover:text-white sm:px-8 sm:py-4 sm:text-sm">
                        Shop Now <ChevronRight className="h-4 w-4" />
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
              )}
            </AnimatePresence>

            {/* Slider Dots */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 z-20">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBanner(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentBanner === idx ? 'w-8 bg-blue-500' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              onClick={() => navigate(service.path)}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:border-blue-100"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${service.color} transition-transform group-hover:scale-110`}>
                {service.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{service.title}</h3>
              <p className="mt-1 text-[10px] font-semibold text-slate-400 group-hover:text-blue-500 transition-colors">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Prescription Upload Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-900 to-blue-900 p-8 sm:p-12 text-white shadow-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          
          <div className="relative flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                <Upload className="h-6 w-6 text-blue-400" />
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl leading-tight">
                Quick Order with Prescription
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                Don't waste time searching. Just upload your prescription and our experts will handle the rest.
              </p>
              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-slate-200">Verified Pharmacists</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-slate-200">Instant Review</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md space-y-4">
              <div 
                onClick={() => fileInputRef.current.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 transition-all ${
                  selectedFile ? 'border-green-500 bg-green-500/10' : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                {selectedFile ? (
                  <div className="text-center">
                    <p className="text-sm font-bold text-green-400">File Selected!</p>
                    <p className="mt-1 text-xs text-slate-400 truncate max-w-[200px]">{selectedFile.name}</p>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-4 h-10 w-10 text-blue-400" />
                    <p className="text-center text-sm font-bold">Select Image or PDF</p>
                    <p className="mt-1 text-xs text-slate-400">Max size 5MB</p>
                  </>
                )}
              </div>

              <button 
                onClick={handleUploadPrescription}
                disabled={isUploading || !selectedFile}
                className={`w-full rounded-2xl py-4 text-sm font-bold shadow-xl transition-all active:scale-95 ${
                  selectedFile ? 'bg-white text-slate-900 hover:bg-blue-50' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isUploading ? "Scanning..." : "Process Prescription"}
              </button>
            </div>
          </div>
        </div>

        {/* Scan Result Dropdown */}
        <AnimatePresence>
          {scanResult && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 overflow-hidden rounded-3xl bg-white p-6 shadow-xl border border-slate-100"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="h-24 w-24 rounded-2xl bg-slate-50 p-3 border border-slate-100">
                  <img src={scanResult.image} className="h-full w-full object-contain" alt="" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase text-green-600">Medicine Identified</span>
                  </div>
                  <h4 className="mt-2 text-xl font-bold text-slate-900">{scanResult.name}</h4>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{scanResult.brand}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-bold text-blue-600">₹{scanResult.price}</p>
                  <button 
                    onClick={() => {
                      addToCart(scanResult);
                      setScanResult(null);
                      toast.success("Added to bag!");
                    }}
                    className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-blue-600 active:scale-95"
                  >
                    Add to Bag
                  </button>
                  <button onClick={() => setScanResult(null)} className="p-2 text-slate-300 hover:text-red-500">
                    <AlertCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Daily Flash Deals Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Flash Deals</h2>
            <p className="text-sm font-medium text-slate-400">Best offers updated every 24 hours</p>
          </div>
          <button onClick={() => navigate('/medicines')} className="text-sm font-bold text-blue-600 hover:underline">
            View All
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-slate-200" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {featured.slice(0, 5).map(med => (
              <MedicineCard key={med._id} {...med} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-12 text-center border border-slate-100">
            <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-slate-200" />
            <p className="text-lg font-bold text-slate-900">No active flash deals</p>
            <p className="text-sm text-slate-400">Check back tomorrow for exciting offers!</p>
          </div>
        )}
      </section>

      {/* Trust & Features Banner */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Lightning Fast Delivery</p>
              <p className="text-xs text-slate-400">Under 6 hours in Amritsar Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">100% Genuine Medicine</p>
              <p className="text-xs text-slate-400">Directly sourced from companies</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">24/7 Support Available</p>
              <p className="text-xs text-slate-400">Ready to help anytime, anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[3rem] bg-slate-900 p-8 sm:p-12 shadow-2xl">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Amritsar Bestsellers</h2>
              <p className="mt-2 text-slate-400">Most trusted products by our local community</p>
            </div>
            <button 
              onClick={() => navigate('/medicines')}
              className="group flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300"
            >
              Explore Full Catalog <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {medicines.slice(0, 10).map((med) => (
              <MedicineCard key={med._id} {...med} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;