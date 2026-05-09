import React, { useState, useEffect } from 'react';
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
  CreditCard
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

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to use wishlist');
      navigate('/login');
      return;
    }

    // Optimistic UI
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

  const handleAddToCart = () => {
    addToCart({ ...medicine, quantity });
    toast.success('Added to bag!');
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (medicine) {
      navigate('/checkout', {
        state: { isDirectBuy: true, directItem: { ...medicine, quantity } },
      });
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

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs - High End Minimalist */}
        <nav className="flex items-center gap-2 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span className="cursor-pointer hover:text-[#00a2a4] transition-colors" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={10} strokeWidth={3} className="opacity-30" />
          <span className="cursor-pointer hover:text-[#00a2a4] transition-colors" onClick={() => navigate('/medicines')}>Medicines</span>
          <ChevronRight size={10} strokeWidth={3} className="opacity-30" />
          <span className="text-slate-900 truncate max-w-[200px] italic">{medicine.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Image Gallery Section */}
          <div className="lg:w-1/2">
            <div className="sticky top-32 space-y-8">
              <div className="relative aspect-square overflow-hidden rounded-[48px] bg-[#f8fafc] border border-slate-100 flex items-center justify-center p-12 sm:p-20 group">
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
                    className={`h-12 w-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all active:scale-90 ${isWishlisted ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="h-12 w-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-[#00a2a4] transition-all active:scale-90">
                    <Share2 size={20} />
                  </button>
                </div>

                <motion.img 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={medicine.image || 'https://placehold.co/600x600?text=Medicine'} 
                  alt={medicine.name}
                  className="max-h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                />

                {/* Offer Badge */}
                <div className="absolute bottom-8 right-8 bg-[#ff6f61] text-white px-4 py-2 rounded-2xl shadow-xl shadow-red-100">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">Flat</p>
                  <p className="text-xl font-black italic tracking-tighter">{discountPercent}% OFF</p>
                </div>
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

          {/* Right Column: Information & Checkout Flow */}
          <div className="lg:w-1/2">
            <div className="space-y-12">
              
              {/* Product Info Header */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="bg-[#00a2a4] text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {medicine.brand || 'Premium Healthcare'}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[11px] font-black">4.9</span>
                    <span className="text-[11px] font-bold opacity-40 ml-1">| 1,240 REVIEWS</span>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 uppercase italic leading-[1.1]">
                  {medicine.name}
                </h1>

                <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span className="flex items-center gap-1.5"><Info size={14} className="text-[#00a2a4]" /> Category: {medicine.category}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#00a2a4]" /> Exp: Dec 2026</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#00a2a4]" /> From: Amritsar Hub</span>
                </div>
              </div>

              {/* Modern Pricing Card */}
              <div className="relative rounded-[40px] bg-slate-900 p-10 text-white overflow-hidden shadow-2xl shadow-slate-200">
                <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-[80px]"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Special Online Price</p>
                    <div className="flex items-baseline gap-4">
                      <h2 className="text-6xl font-black tracking-tighter italic">₹{finalPrice}</h2>
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-600 line-through">₹{mrp}</span>
                        <span className="text-xs font-black text-teal-400 uppercase tracking-widest">You Save ₹{mrp - finalPrice}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                      <CreditCard size={14} className="text-teal-400" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Pay with UPI / Cards</span>
                    </div>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] text-left sm:text-right">Inclusive of all clinical taxes</p>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Set Quantity</p>
                    <p className="text-[11px] font-bold text-slate-500 italic">Pack of 10 Units</p>
                  </div>
                  <div className="flex items-center gap-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-xl hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center active:scale-90"
                    >
                      <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="text-xl font-black text-slate-900 w-4 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 rounded-xl hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center active:scale-90"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-white text-slate-900 border-2 border-slate-900 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <ShoppingCart size={18} /> Add to Bag
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#00a2a4] text-white py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-teal-100 hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Zap size={18} fill="currentColor" /> Quick Checkout
                  </button>
                </div>
              </div>

              {/* Professional Specs Grid */}
              <div className="space-y-8 pt-10 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Clinical Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: 'Origin', value: 'Amritsar Medical Hub' },
                    { label: 'Manufacturer', value: medicine.brand || 'Generic Pharma' },
                    { label: 'Storage', value: 'Cool & Dry Place' },
                    { label: 'Shelf Life', value: '24 Months' },
                    { label: 'Prescription', value: medicine.needsPrescription ? 'Required' : 'Not Required' },
                    { label: 'Quality Pass', value: 'Batch 2024-Verified' }
                  ].map((spec, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                      <span className="text-[12px] font-bold text-slate-800 uppercase tracking-tight">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description & Clinical Notes */}
              <div className="space-y-6 pt-10 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Therapeutic Description</h3>
                <p className="text-[15px] font-medium leading-[1.8] text-slate-600">
                  {medicine.description || "This specialized formulation is sourced directly from certified clinical partners. Our quality assurance team at the Amritsar hub validates every batch to ensure it meets international pharmaceutical standards before dispatch."}
                </p>
                <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex gap-4">
                  <AlertCircle className="text-amber-600 shrink-0 mt-1" size={18} />
                  <p className="text-[11px] font-bold text-amber-900 leading-relaxed italic">
                    Disclaimer: This information is for clinical awareness. Please ensure you are under the supervision of a registered medical practitioner while using this product.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* High-End Related Section */}
        <section className="mt-40">
          <div className="flex items-end justify-between mb-16 px-4">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 uppercase italic">Similar <span className="text-[#00a2a4]">Clinical Hits</span></h2>
              <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Curated Expert Recommendations</p>
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