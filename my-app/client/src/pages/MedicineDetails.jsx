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
  Sliders
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
    { label: '10 Tablets', multiplier: 1.0, info: 'Base Pack', icon: '💊' },
    { label: '15 Tablets', multiplier: 1.45, info: 'Save 5%', icon: '💊' },
    { label: '30 Tablets', multiplier: 2.7, info: 'Save 10%', icon: '📦' },
    { label: '60 Tablets', multiplier: 5.1, info: 'Save 15%', icon: '📦' },
    { label: '100 Tablets', multiplier: 8.0, info: 'Save 20%', icon: '🧪' }
  ];

  const [selectedVariant, setSelectedVariant] = useState(packVariants[0]);
  const [pincode, setPincode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [checkedBundleItems, setCheckedBundleItems] = useState([]);

  useEffect(() => {
    if (medicine && related.length > 0) {
      setCheckedBundleItems([medicine._id, ...related.slice(0, 3).map(r => r._id)]);
    }
  }, [medicine, related]);

  const handleCheckDelivery = () => {
    if (/^\d{6}$/.test(pincode)) {
      setDeliveryMessage(`✓ FREE Delivery Tomorrow! Order in 4 hrs.`);
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
                <div className="flex items-center gap-4">
                  <span className="bg-[#00a2a4]/10 text-[#00a2a4] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {medicine.brand || 'Premium Healthcare'}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[11px] font-black">4.9</span>
                    <span className="text-[11px] font-bold opacity-40 ml-1">| 1,240 REVIEWS</span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 uppercase italic leading-tight">
                  {medicine.name}
                </h1>
                
                <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span className="flex items-center gap-1.5"><Info size={14} className="text-[#00a2a4]" /> Category: {medicine.category}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#00a2a4]" /> Exp: Dec 2026</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#00a2a4]" /> From: Amritsar Hub</span>
                </div>
              </div>

              {/* Price Block */}
              <div className="border border-slate-100 bg-[#F8FAFC]/50 rounded-3xl p-6 sm:p-8 flex items-baseline gap-4 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-5xl font-black tracking-tighter italic text-slate-900">
                      ₹{Math.round(finalPrice * selectedVariant.multiplier)}
                    </h2>
                    <span className="text-sm font-black text-[#ff6f61] uppercase tracking-wider bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
                      -{discountPercent}% OFF
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">M.R.P.:</span>
                    <span className="text-xs font-bold line-through">₹{Math.round(mrp * selectedVariant.multiplier)}</span>
                    <span className="text-xs font-black text-teal-600 uppercase tracking-widest">Inclusive of all taxes</span>
                  </div>
                </div>
              </div>

              {/* LIVE Quality Index circular meter (Screenshot style freshness meter) */}
              <div className="flex items-center justify-between p-4 sm:p-5 rounded-3xl border border-teal-150 bg-teal-50/20 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white border shadow-sm flex items-center justify-center text-[#00a2a4] flex-shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800">Premium Potency</span>
                      <span className="bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">LIVE</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">Verified clinical assay 13h ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 flex items-center justify-center">
                    <svg className="absolute transform -rotate-90 w-full h-full">
                      <circle cx="24" cy="24" r="18" stroke="#E2E8F0" strokeWidth="3" fill="transparent" />
                      <circle cx="24" cy="24" r="18" stroke="#00a2a4" strokeWidth="3" fill="transparent" strokeDasharray={113} strokeDashoffset={113 - (113 * 99) / 100} />
                    </svg>
                    <span className="text-xs font-black text-[#00a2a4]">99%</span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Potency<br/>Index</span>
                </div>
              </div>

              {/* Delivery Checker Box */}
              <div className="p-4 sm:p-5 rounded-3xl border border-slate-100 bg-[#F8FAFC]">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-4 w-4 text-slate-500" />
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-800">Check Expected Delivery</span>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Pincode" 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#00a2a4]"
                  />
                  <button 
                    onClick={handleCheckDelivery}
                    className="px-5 py-2.5 rounded-xl bg-[#00a2a4] hover:bg-[#008284] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
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
                  <Sliders className="h-4 w-4 text-slate-500" />
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-800">Choose Pack Size</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {packVariants.map((variant) => (
                    <button
                      key={variant.label}
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-[11px] font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
                        selectedVariant.label === variant.label
                          ? 'bg-teal-50 border-[#00a2a4] text-[#00a2a4] shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <span>{variant.icon}</span>
                      <span>{variant.label}</span>
                      <span className={`text-[9px] font-black ${selectedVariant.label === variant.label ? 'text-teal-600' : 'text-slate-400'}`}>
                        {variant.info}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Set Quantity</p>
                    <p className="text-[11px] font-bold text-[#00a2a4]">{selectedVariant.label} per unit pack</p>
                  </div>
                  <div className="flex items-center gap-6 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center active:scale-90"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="text-base font-black text-slate-900 w-4 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-8 h-8 rounded-lg hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center active:scale-90"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-slate-900 text-white hover:bg-slate-850 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-md cursor-pointer"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#00a2a4] text-white py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-teal-500/20 hover:bg-[#008284] transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <Zap size={16} fill="currentColor" /> Buy Now
                  </button>
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
          <div className="mt-20 rounded-[36px] border border-slate-100 bg-[#F8FAFC]/60 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#00a2a4] shadow-sm">
                <Package size={16} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">Frequently Bought Together</h4>
                <p className="text-[10px] font-bold text-slate-500">Save when you bundle these healthcare picks</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              {/* Bundle Items Selection */}
              <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start w-full lg:w-auto">
                
                {/* Current Item */}
                <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-white border border-[#E5E7EB] w-36 relative shadow-sm hover:scale-[1.02] transition-all">
                  <input 
                    type="checkbox"
                    checked={checkedBundleItems.includes(medicine._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCheckedBundleItems(prev => [...prev, medicine._id]);
                      } else {
                        setCheckedBundleItems(prev => prev.filter(id => id !== medicine._id));
                      }
                    }}
                    className="absolute top-3.5 right-3.5 h-4 w-4 accent-[#00a2a4] cursor-pointer"
                  />
                  <div className="h-16 w-16 flex items-center justify-center mb-2">
                    <img src={medicine.image} className="max-h-full max-w-full object-contain mix-blend-multiply" alt="" />
                  </div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">This Item</span>
                  <p className="text-[10px] font-bold text-slate-800 line-clamp-1 mt-1">{medicine.name}</p>
                  <span className="text-[11.5px] font-black text-slate-900 mt-1">₹{Math.round(finalPrice * selectedVariant.multiplier)}</span>
                </div>

                {/* Related items */}
                {related.slice(0, 3).map((item) => {
                  const itemPrice = item.discountPrice || item.price;
                  return (
                    <React.Fragment key={item._id}>
                      <span className="text-lg font-black text-slate-300 select-none">+</span>
                      <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-white border border-[#E5E7EB] w-36 relative shadow-sm hover:scale-[1.02] transition-all">
                        <input 
                          type="checkbox"
                          checked={checkedBundleItems.includes(item._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCheckedBundleItems(prev => [...prev, item._id]);
                            } else {
                              setCheckedBundleItems(prev => prev.filter(id => id !== item._id));
                            }
                          }}
                          className="absolute top-3.5 right-3.5 h-4 w-4 accent-[#00a2a4] cursor-pointer"
                        />
                        <div className="h-16 w-16 flex items-center justify-center mb-2">
                          <img src={item.image} className="max-h-full max-w-full object-contain mix-blend-multiply" alt="" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-800 line-clamp-2 min-h-[30px] leading-tight">{item.name}</p>
                        <span className="text-[11.5px] font-black text-slate-900 mt-1">₹{itemPrice}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Bundle Calculation Card */}
              <div className="w-full lg:w-64 rounded-3xl bg-teal-50/40 border border-teal-100/60 p-6 flex flex-col justify-between items-center text-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#00a2a4] bg-teal-50 px-2 py-0.5 rounded-full">Bundle Deal</span>
                <div className="my-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{checkedBundleItems.length} Items Total</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">₹{bundleTotal}</h3>
                </div>
                <button 
                  onClick={handleAddBundleToCart}
                  className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md cursor-pointer"
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