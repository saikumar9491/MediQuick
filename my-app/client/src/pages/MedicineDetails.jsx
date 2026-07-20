import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Star,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  ChevronRight,
  ArrowRight,
  Info,
  Clock,
  MapPin,
  BadgeCheck,
  CreditCard,
  Maximize2,
  Sliders,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import MedicineCard from '../components/medicine/MedicineCard';
import { API_BASE } from '../utils/apiConfig';
import toast from 'react-hot-toast';

const MedicineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, setUser, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  const [medicine, setMedicine] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Zoom Effect State
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const imgRef = useRef(null);

  const packVariants = [
    { label: 'Whole', multiplier: 1.0, info: '', icon: '🐟' },
    { label: 'Cleaned & Gutted', multiplier: 1.05, info: '+5%', icon: '🍤' },
    { label: 'Steaks', multiplier: 1.10, info: '+10%', icon: '🥩' },
    { label: 'Fillets', multiplier: 1.15, info: '+15%', icon: '🍣' },
    { label: 'Boneless Cubes', multiplier: 1.20, info: '+20%', icon: '🧊' }
  ];

  const [selectedVariant, setSelectedVariant] = useState(packVariants[2]);
  const [pincode, setPincode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [checkedBundleItems, setCheckedBundleItems] = useState([]);

  // Real Delivery Estimation States
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isServiceable, setIsServiceable] = useState(true);
  const [countdownTime, setCountdownTime] = useState(0);

  const fetchDeliveryEstimate = async (targetPincode) => {
    try {
      const res = await fetch(`${API_BASE}/api/delivery/estimate?pincode=${targetPincode}`);
      const data = await res.json();
      if (data.isServiceable) {
        setDeliveryInfo(data);
        setIsServiceable(true);
        setCountdownTime(data.cutoffCountdownMs);
        setDeliveryMessage(`✓ Serviced by ${data.hubName} Hub. Delivery expected ${data.deliveryDateString}.`);
      } else {
        setDeliveryInfo(null);
        setIsServiceable(false);
        setDeliveryMessage('Delivery not available in your area.');
      }
    } catch (err) {
      console.error('Error estimating delivery:', err);
    }
  };

  useEffect(() => {
    if (medicine && related.length > 0) {
      setCheckedBundleItems([medicine._id, ...related.slice(0, 3).map(r => r._id)]);
    }
  }, [medicine, related]);

  // Sync with global location change & initial load
  useEffect(() => {
    const currentPincode = localStorage.getItem('userPincode') || '110001';
    setPincode(currentPincode);
    fetchDeliveryEstimate(currentPincode);

    const handleLocationChange = () => {
      const freshPincode = localStorage.getItem('userPincode') || '110001';
      setPincode(freshPincode);
      fetchDeliveryEstimate(freshPincode);
    };

    window.addEventListener('locationChanged', handleLocationChange);
    return () => window.removeEventListener('locationChanged', handleLocationChange);
  }, []);

  // Countdown timer decrementer
  useEffect(() => {
    if (countdownTime <= 0) return;
    const interval = setInterval(() => {
      setCountdownTime(prev => {
        if (prev <= 1000) {
          const currentPincode = localStorage.getItem('userPincode') || '110001';
          fetchDeliveryEstimate(currentPincode);
          clearInterval(interval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdownTime]);

  const formatCountdown = (ms) => {
    if (ms <= 0) return '0 hrs 0 mins';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleCheckDelivery = () => {
    if (/^\d{6}$/.test(pincode)) {
      fetchDeliveryEstimate(pincode);
    } else {
      toast.error('Please enter a valid 6-digit Pincode');
    }
  };

  const handleAddBundleToCart = () => {
    let count = 0;
    if (checkedBundleItems.includes(medicine._id)) {
      addToCart(medicine, quantity);
      count++;
    }
    related.slice(0, 3).forEach(item => {
      if (checkedBundleItems.includes(item._id)) {
        addToCart(item, 1);
        count++;
      }
    });
    toast.success(`Added ${count} bundle items to your cart!`);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);

        const res = await fetch(`${API_BASE}/api/medicines/${id}`);
        if (!res.ok) throw new Error('Medicine not found');
        const data = await res.json();
        setMedicine(data);

        if (user?.wishlist) {
          setIsWishlisted(
            user.wishlist.some(
              (item) => (item._id ? item._id.toString() : item.toString()) === id.toString()
            )
          );
        }

        const relRes = await fetch(`${API_BASE}/api/medicines/related/${id}`);
        if (relRes.ok) {
          const relData = await relRes.json();
          setRelated(Array.isArray(relData) ? relData : []);
        }
      } catch (err) {
        console.error('Hub data sync failed:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchProductData();
  }, [id, authLoading, user?.wishlist]);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to use wishlist');
      navigate('/login');
      return;
    }

    const originalState = isWishlisted;
    setIsWishlisted(!isWishlisted);

    try {
      const action = originalState ? 'remove' : 'add';
      const res = await fetch(`${API_BASE}/api/users/wishlist/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      if (res.ok) {
        let updatedWishlist;
        if (originalState) {
          updatedWishlist = user.wishlist.filter(
            (item) => (item._id ? item._id.toString() : item.toString()) !== id.toString()
          );
          toast.success('Removed from wishlist');
        } else {
          updatedWishlist = [...(user.wishlist || []), medicine];
          toast.success('Added to wishlist');
        }
        setUser({ ...user, wishlist: updatedWishlist });
      } else {
        throw new Error('Sync failed');
      }
    } catch (err) {
      setIsWishlisted(originalState);
      toast.error('Wishlist sync failed');
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#00a2a4] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Product Data...</p>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <AlertCircle className="h-16 w-16 text-slate-200" />
        <h1 className="mt-6 text-xl font-black text-slate-900 uppercase tracking-tighter">Product Not Found</h1>
        <button onClick={() => navigate('/medicines')} className="mt-4 bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
          Return to Shop
        </button>
      </div>
    );
  }

  const finalPrice = medicine.discountPrice || medicine.price;
  const mrp = Math.round(medicine.price * 1.33);
  const discountPercent = Math.round(((mrp - finalPrice) / mrp) * 100);

  const bundleTotal = (medicine ? (checkedBundleItems.includes(medicine._id) ? Math.round(finalPrice * selectedVariant.multiplier) * quantity : 0) : 0) +
    related.slice(0, 3).reduce((sum, item) => {
      return sum + (checkedBundleItems.includes(item._id) ? (item.discountPrice || item.price) : 0);
    }, 0);

  const handleAddToCart = () => {
    addToCart({
      ...medicine,
      price: Math.round(medicine.price * selectedVariant.multiplier),
      discountPrice: medicine.discountPrice ? Math.round(medicine.discountPrice * selectedVariant.multiplier) : null
    }, quantity);
    toast.success(`${medicine.name} (${selectedVariant.label}) added to cart!`);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    if (medicine) {
      navigate('/checkout', {
        state: { 
          isDirectBuy: true, 
          directItem: { 
            ...medicine, 
            price: Math.round(medicine.price * selectedVariant.multiplier),
            discountPrice: medicine.discountPrice ? Math.round(medicine.discountPrice * selectedVariant.multiplier) : null,
            quantity 
          } 
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs & Sold Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <span className="cursor-pointer hover:text-[#00a2a4] transition-colors" onClick={() => navigate('/')}>Home</span>
            <ChevronRight size={10} strokeWidth={3} className="opacity-30" />
            <span className="cursor-pointer hover:text-[#00a2a4] transition-colors" onClick={() => navigate('/medicines')}>Medicines</span>
            <ChevronRight size={10} strokeWidth={3} className="opacity-30" />
            <span className="text-slate-900 truncate max-w-[200px] italic">{medicine.name}</span>
          </nav>

          <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 font-bold text-[10px] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span>42 units sold in last 24 hrs</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Image Section with Zoom */}
          <div className="lg:w-1/2">
            <div className="sticky top-32 space-y-8">
              <div 
                className="relative aspect-square overflow-hidden rounded-[48px] bg-[#f8fafc] border border-slate-100 flex items-center justify-center p-12 group cursor-crosshair"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
                ref={imgRef}
              >
                {/* Floating Badges */}
                <div className="absolute top-8 left-8 z-10 flex flex-col gap-2">
                  <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
                    <BadgeCheck size={14} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Verified Authentic</span>
                  </div>
                </div>

                <div className="absolute top-8 right-8 z-10 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={toggleWishlist}
                    className={`h-12 w-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer ${isWishlisted ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="h-12 w-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-[#00a2a4] transition-all active:scale-95">
                    <Share2 size={20} />
                  </button>
                </div>

                {/* Normal Image */}
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={medicine.image || 'https://placehold.co/600x600?text=Medicine'} 
                  alt={medicine.name}
                  className={`max-h-full w-full object-contain mix-blend-multiply transition-opacity duration-300 ${showZoom ? 'opacity-0' : 'opacity-100'}`}
                />

                {/* Zoomed Image Container */}
                <AnimatePresence>
                  {showZoom && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[48px]"
                      style={{
                        backgroundImage: `url(${medicine.image || 'https://placehold.co/600x600?text=Medicine'})`,
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundSize: '250%',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: '#f8fafc'
                      }}
                    >
                      <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-white">
                        <Maximize2 size={12} className="text-teal-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Detail View Active</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Offer Badge */}
                {!showZoom && (
                  <div className="absolute bottom-8 right-8 bg-[#ff6f61] text-white px-4 py-2 rounded-2xl shadow-xl shadow-red-100 transition-opacity">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">Flat</p>
                    <p className="text-xl font-black italic tracking-tighter">{discountPercent}% OFF</p>
                  </div>
                )}
              </div>

              {/* Trust Pillars */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Truck, label: 'Express Delivery', desc: 'Ships in 4-6 Hours' },
                  { icon: ShieldCheck, label: 'Quality Tested', desc: 'Clinical Grade' },
                  { icon: RotateCcw, label: 'Easy Returns', desc: '7 Day Policy' }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto text-[#00a2a4]">
                      <item.icon size={18} />
                    </div>
                    <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-800 leading-none">{item.label}</h5>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Information Section */}
          <div className="lg:w-1/2">
            <div className="space-y-8">
              
              {/* Brand and reviews header */}
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {medicine.category}
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-100 font-bold text-[10px] uppercase tracking-wider self-start">
                    <span className="h-1.5 w-1.5 bg-teal-500 rounded-full animate-ping"></span>
                    <span>42 units sold in last 24 hrs</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                  {medicine.name}
                </h1>
              </div>

              {/* Price Block */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-slate-800">₹</span>
                  <span className="text-3xl font-extrabold text-slate-900 leading-none">
                    {Math.round(finalPrice * selectedVariant.multiplier)}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
                  <span className="text-red-500">-{discountPercent}%</span>
                  <span>M.R.P.: <span className="line-through">₹{Math.round(mrp * selectedVariant.multiplier)}</span></span>
                </div>
              </div>

              {/* Stock Status & Delivery Promise */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-emerald-600">In Stock</p>
                {isServiceable ? (
                  <p className="text-xs text-slate-500 font-medium">
                    FREE delivery <span className="font-bold text-slate-800">{deliveryInfo?.deliveryDateString || 'Tomorrow'}</span>
                    {countdownTime > 0 && (
                      <>
                        . Order within <span className="text-orange-500 font-bold">{formatCountdown(countdownTime)}</span>
                      </>
                    )}
                  </p>
                ) : (
                  <p className="text-xs text-red-650 font-bold bg-red-50 px-3 py-1.5 rounded-lg inline-block border border-red-105">
                    ⚠️ Delivery not available in your area
                  </p>
                )}
              </div>

              {/* LIVE Quality Index circular meter (Screenshot style freshness meter) */}
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 flex items-center justify-center bg-sky-50 rounded-full">
                    <svg className="absolute transform -rotate-90 w-full h-full">
                      <circle cx="20" cy="20" r="16" stroke="#E2E8F0" strokeWidth="2.5" fill="transparent" />
                      <circle cx="20" cy="20" r="16" stroke="#0ea5e9" strokeWidth="2.5" fill="transparent" strokeDasharray={100} strokeDashoffset={100 - 73} />
                    </svg>
                    <span className="text-xs relative z-10">🔬</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black uppercase text-slate-800">Premium Potency</span>
                      <span className="bg-[#0ea5e9] text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full">LIVE</span>
                    </div>
                    <p className="text-[10px] text-slate-450 font-bold mt-0.5">Tested <span className="font-black text-slate-700">13h ago</span> (at 01:57).</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <span className="text-xl font-black text-sky-500 leading-none">99%</span>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">METER</p>
                  </div>
                </div>
              </div>

              {/* Delivery Checker Box */}
              <div className="p-4 rounded-2xl border border-slate-100 bg-[#f4f7f6]">
                <div className="flex items-center gap-2 mb-3">
                  <Truck size={14} className="text-slate-500" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Check Expected Delivery</span>
                </div>
                <div className="flex bg-white rounded-xl overflow-hidden border border-slate-200 p-0.5 shadow-sm">
                  <input 
                    type="text" 
                    placeholder="Enter Pincode" 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                  />
                  <button 
                    onClick={handleCheckDelivery}
                    className="px-5 py-2 bg-[#ccd9d7] hover:bg-[#b0c0be] text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Check
                  </button>
                </div>
                {deliveryMessage && (
                  <p className="text-[10px] font-bold text-emerald-600 mt-2">{deliveryMessage}</p>
                )}
              </div>

              {/* Variant Selector Pills ("Choose Your Cut" Equivalent) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sliders size={14} className="text-slate-500" />
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-800">Choose Your Cut</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {packVariants.map((variant) => {
                    const isSelected = selectedVariant.label === variant.label;
                    return (
                      <button
                        key={variant.label}
                        onClick={() => setSelectedVariant(variant)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[11px] font-bold transition-all duration-205 cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'bg-[#1e293b] border-[#1e293b] text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <span>{variant.icon}</span>
                        <span>{variant.label}</span>
                        {variant.info && (
                          <span className={`text-[9px] font-black ${isSelected ? 'text-teal-400' : 'text-slate-400'}`}>
                            {variant.info}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedVariant && (
                  <p className="text-[10px] font-bold text-emerald-600">
                    ✓ {selectedVariant.label} selected ({selectedVariant.info ? `${selectedVariant.info} processing fee` : 'no extra fee'})
                  </p>
                )}
              </div>

              {/* Action Buttons & Quantity (Stacked layout exactly like screenshot 2) */}
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-[#1e293b] hover:bg-slate-800 text-white py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="w-full bg-[#52b5a5] hover:bg-[#43a393] text-white py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Quantity adjuster */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Quantity</p>
                    <p className="text-[11px] font-bold text-[#00a2a4]">{selectedVariant.label} package yield</p>
                  </div>
                  <div className="flex items-center gap-5 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-lg hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center active:scale-90"
                    >
                      <Minus size={12} strokeWidth={3} />
                    </button>
                    <span className="text-sm font-black text-slate-900 w-4 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-7 h-7 rounded-lg hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center active:scale-90"
                    >
                      <Plus size={12} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="space-y-6 pt-8 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">About This Item</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Origin', value: 'Amritsar Medical Hub' },
                    { label: 'Manufacturer', value: medicine.brand || 'Generic Pharma' },
                    { label: 'Storage', value: 'Cool & Dry Place' },
                    { label: 'Shelf Life', value: '24 Months' },
                    { label: 'Prescription', value: medicine.needsPrescription ? 'Required' : 'Not Required' },
                    { label: 'Quality Pass', value: 'Batch 2024-Verified' }
                  ].map((spec, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                      <span className="text-[11.5px] font-bold text-slate-800 uppercase tracking-tight">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description & Disclaimer */}
              <div className="space-y-4 pt-8 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Therapeutic Description</h3>
                <p className="text-[13.5px] font-medium leading-[1.7] text-slate-650">
                  {medicine.description || "This specialized formulation is sourced directly from certified clinical partners. Our quality assurance team at the Amritsar hub validates every batch to ensure it meets international pharmaceutical standards before dispatch."}
                </p>
                <div className="bg-amber-50/50 p-5 rounded-3xl border border-amber-100/70 flex gap-4">
                  <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-[10px] font-bold text-amber-900 leading-relaxed italic">
                    Disclaimer: This information is for clinical awareness. Please ensure you are under the supervision of a registered medical practitioner while using this product.
                  </p>
                </div>
            </div>
          </div>
        </div>
      </div>

        {/* Bundle Cross-sell Section ("Frequently Bought Together") */}
        {related.length > 0 && (
          <div className="mt-20 rounded-[36px] bg-white border border-slate-100 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#00a2a4] shadow-sm">
                <Package size={16} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">Frequently Bought Together</h4>
                <p className="text-[10px] font-bold text-slate-500">Save when you bundle these fresh picks</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              {/* Bundle Items Selection */}
              <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start w-full lg:w-auto">
                
                {/* Current Item */}
                <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-white border border-[#E5E7EB] w-36 relative shadow-sm hover:scale-[1.02] transition-all">
                  <div 
                    onClick={() => {
                      if (checkedBundleItems.includes(medicine._id)) {
                        setCheckedBundleItems(prev => prev.filter(id => id !== medicine._id));
                      } else {
                        setCheckedBundleItems(prev => [...prev, medicine._id]);
                      }
                    }}
                    className="absolute top-3.5 right-3.5 cursor-pointer z-10"
                  >
                    {checkedBundleItems.includes(medicine._id) ? (
                      <div className="h-5 w-5 rounded-full bg-[#52b5a5] flex items-center justify-center text-white border border-[#52b5a5]">
                        <CheckCircle2 size={12} className="text-white" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-white border-2 border-slate-300" />
                    )}
                  </div>
                  
                  <div className="h-16 w-16 flex items-center justify-center mb-2">
                    <img src={medicine.image} className="max-h-full max-w-full object-contain mix-blend-multiply" alt="" />
                  </div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-teal-50 text-[#00a2a4] px-2 py-0.5 rounded-full self-start mb-1">THIS ITEM</span>
                  <p className="text-[10px] font-bold text-slate-800 line-clamp-1 mt-1 text-left w-full">{medicine.name}</p>
                  <div className="flex items-center gap-2 mt-1 w-full text-left">
                    <span className="text-[11px] font-black text-slate-900">₹{Math.round(finalPrice * selectedVariant.multiplier)}</span>
                    <span className="text-[9px] font-bold text-slate-450 line-through">₹{Math.round(mrp * selectedVariant.multiplier)}</span>
                  </div>
                </div>

                {/* Related items */}
                {related.slice(0, 3).map((item) => {
                  const itemPrice = item.discountPrice || item.price;
                  const itemMrp = Math.round(item.price * 1.33);
                  return (
                    <React.Fragment key={item._id}>
                      <span className="text-lg font-black text-slate-300 select-none">+</span>
                      <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-white border border-[#E5E7EB] w-36 relative shadow-sm hover:scale-[1.02] transition-all">
                        <div 
                          onClick={() => {
                            if (checkedBundleItems.includes(item._id)) {
                              setCheckedBundleItems(prev => prev.filter(id => id !== item._id));
                            } else {
                              setCheckedBundleItems(prev => [...prev, item._id]);
                            }
                          }}
                          className="absolute top-3.5 right-3.5 cursor-pointer z-10"
                        >
                          {checkedBundleItems.includes(item._id) ? (
                            <div className="h-5 w-5 rounded-full bg-[#52b5a5] flex items-center justify-center text-white border border-[#52b5a5]">
                              <CheckCircle2 size={12} className="text-white" />
                            </div>
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-white border-2 border-slate-300" />
                          )}
                        </div>

                        <div className="h-16 w-16 flex items-center justify-center mb-2">
                          <img src={item.image} className="max-h-full max-w-full object-contain mix-blend-multiply" alt="" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-800 line-clamp-2 min-h-[30px] leading-tight text-left w-full">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1 w-full text-left">
                          <span className="text-[11px] font-black text-slate-900">₹{itemPrice}</span>
                          <span className="text-[9px] font-bold text-slate-450 line-through">₹{itemMrp}</span>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Bundle Calculation Card */}
              <div className="w-full lg:w-64 rounded-3xl bg-[#f4f7f6] border border-slate-100 p-6 flex flex-col justify-between items-center text-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#00a2a4] bg-teal-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-[#00a2a4] rounded-full"></span> RECENTLY VIEWED
                </span>
                <div className="my-5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{checkedBundleItems.length} Items Total</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">₹{bundleTotal}</h3>
                </div>
                <button 
                  onClick={handleAddBundleToCart}
                  className="w-full bg-[#1e293b] text-white hover:bg-slate-800 py-3.5 rounded-full text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-md cursor-pointer"
                >
                  Add Bundle to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Similar Clinical Hits */}
        <section className="mt-32">
          <div className="flex items-end justify-between mb-12 px-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Similar <span className="text-[#00a2a4]">Clinical Hits</span></h2>
              <p className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Curated Expert Recommendations</p>
            </div>
            <button 
              onClick={() => navigate('/medicines')} 
              className="group hidden sm:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-[#00a2a4] transition-colors"
            >
              View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {related.length > 0 ? (
              related.slice(0, 5).map((item) => (
                <MedicineCard key={item._id} {...item} />
              ))
            ) : (
              [1,2,3,4,5].map(i => (
                <div key={i} className="aspect-[4/5] bg-slate-50 rounded-[32px] animate-pulse border border-slate-100" />
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default MedicineDetails;
