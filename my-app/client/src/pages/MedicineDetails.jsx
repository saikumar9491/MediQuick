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
  ArrowRight
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

    const isRemoving = isWishlisted;
    const endpoint = isRemoving ? '/api/users/wishlist/remove' : '/api/users/wishlist/add';

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      if (res.ok) {
        let updatedWishlist;
        if (isRemoving) {
          updatedWishlist = user.wishlist.filter(
            (item) => (item._id ? item._id.toString() : item.toString()) !== id.toString()
          );
          setIsWishlisted(false);
          toast.success('Removed from wishlist');
        } else {
          updatedWishlist = [...user.wishlist, medicine];
          setIsWishlisted(true);
          toast.success('Added to wishlist');
        }
        setUser({ ...user, wishlist: updatedWishlist });
      }
    } catch (err) {
      console.error('Wishlist sync error:', err);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-bold text-slate-400">Syncing Amritsar Hub...</p>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <AlertCircle className="h-16 w-16 text-slate-200" />
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Medicine Not Found</h1>
        <button onClick={() => navigate('/medicines')} className="mt-4 text-blue-600 font-bold hover:underline">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs - Ultra Minimalist */}
        <nav className="flex items-center gap-2 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span className="cursor-pointer hover:text-[#00a2a4] transition-colors" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={10} strokeWidth={3} className="opacity-30" />
          <span className="cursor-pointer hover:text-[#00a2a4] transition-colors" onClick={() => navigate('/medicines')}>Medicines</span>
          <ChevronRight size={10} strokeWidth={3} className="opacity-30" />
          <span className="text-slate-900 truncate max-w-[200px]">{medicine.name}</span>
        </nav>

        <div className="flex flex-col gap-12 lg:flex-row">
          
          {/* Left Column: Image & Clinical Info */}
          <div className="lg:w-7/12">
            <div className="sticky top-28 space-y-12">
              <div className="group relative aspect-square overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center p-12 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-teal-100/50">
                <motion.img 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  src={medicine.image || 'https://placehold.co/600x600?text=Medicine'} 
                  alt={medicine.name}
                  className="max-h-full w-full object-contain mix-blend-multiply"
                />
                
                <div className="absolute top-8 right-8 flex flex-col gap-4">
                  <button 
                    onClick={toggleWishlist}
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 transition-all active:scale-90 ${isWishlisted ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 text-slate-400 hover:text-[#00a2a4] transition-all active:scale-90">
                    <Share2 size={20} />
                  </button>
                </div>

                <div className="absolute bottom-8 left-8 flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur-md px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 border border-white shadow-sm">
                  <ShieldCheck size={14} className="text-[#00a2a4]" /> 100% Genuine
                </div>
              </div>

              {/* Safety Advice Grid (Clinical) */}
              <div className="rounded-[2rem] bg-slate-50/50 p-8 border border-slate-100">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-8 pb-2 border-b border-slate-200 w-fit">Safety Advice</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                  {[
                    { label: 'Alcohol', status: 'Unsafe', color: 'text-red-500', icon: '🍺' },
                    { label: 'Pregnancy', status: 'Consult Doctor', color: 'text-orange-500', icon: '🤰' },
                    { label: 'Driving', status: 'Safe', color: 'text-green-500', icon: '🚗' },
                    { label: 'Kidney', status: 'Caution', color: 'text-orange-500', icon: '🩺' },
                    { label: 'Liver', status: 'Safe', color: 'text-green-500', icon: '🔬' },
                    { label: 'Stomach', status: 'With Food', color: 'text-blue-500', icon: '🍽️' },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center text-center gap-2">
                      <span className="text-2xl grayscale hover:grayscale-0 transition-all cursor-default">{item.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                      <span className={`text-[9px] font-bold ${item.color} uppercase tracking-wider`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information & CTAs */}
          <div className="lg:w-5/12">
            <div className="space-y-10">
              {/* Product Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-[#00a2a4] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
                    {medicine.brand}
                  </span>
                  <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-green-700 border border-green-100">
                    <Star size={12} className="fill-current" />
                    <span className="text-[10px] font-black">4.8</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">| 2.5k Ratings</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl leading-[1.05]">
                  {medicine.name}
                </h1>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">
                  {medicine.category} • <span className="text-[#00a2a4]">In Stock</span>
                </div>
              </div>

              {/* Pricing Section (Apollo Style) */}
              <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-500/10 blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-black tracking-tighter">₹{medicine.price}</span>
                    <span className="text-lg font-bold text-slate-500 line-through">₹{Math.round(medicine.price * 1.3)}</span>
                    <span className="rounded bg-[#ff6f61] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">25% OFF</span>
                  </div>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Best Price Guaranteed from Amritsar Hub</p>
                  
                  {/* Quick Features */}
                  <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                      <Truck size={14} className="text-teal-400" /> Fast Delivery
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                      <ShieldCheck size={14} className="text-teal-400" /> Quality Verified
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Select Quantity</span>
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="text-lg font-black text-slate-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="group flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-900 py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-900 hover:text-white active:scale-95"
                  >
                    <ShoppingCart size={18} /> Add to Bag
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-3 rounded-2xl bg-[#00a2a4] py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-teal-100 transition-all hover:bg-slate-900 active:scale-95"
                  >
                    <Zap size={18} className="fill-white" /> Quick Buy
                  </button>
                </div>
              </div>

              {/* Technical Specifications (Apollo Clinical Look) */}
              <div className="space-y-6 pt-10 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Product Specifications</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Manufacturer', value: medicine.brand || 'Generic Pharma' },
                    { label: 'Pack Size', value: '10 Units / Pack' },
                    { label: 'Composition', value: medicine.category === 'Vitamins' ? 'Multi-vitamin Blend' : 'Pharmaceutical Formulation' },
                    { label: 'Storage', value: 'Cool and Dry Place' },
                    { label: 'Prescription', value: medicine.needsPrescription ? 'Required' : 'Not Required' },
                  ].map((spec) => (
                    <div key={spec.label} className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{spec.label}</span>
                      <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description Block */}
              <div className="space-y-4 pt-10">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Health Information</h3>
                <p className="text-[14px] font-medium leading-relaxed text-slate-600">
                  {medicine.description || "This product is sourced directly from certified manufacturers. Our quality control team at the Amritsar hub ensures that every unit meets strict pharmaceutical standards before being dispatched to your location."}
                </p>
                <div className="rounded-2xl bg-blue-50 p-6 border border-blue-100">
                  <p className="text-[11px] font-bold italic text-blue-800 leading-relaxed">
                    Disclaimer: The information provided above is for educational purposes only. Please consult your physician before using any new medication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <section className="mt-32 border-t border-slate-100 pt-20">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl uppercase">
                Similar <span className="text-[#00a2a4]">Products</span>
              </h2>
              <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended by our clinical experts</p>
            </div>
            <button 
              onClick={() => navigate('/medicines')} 
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 hover:text-[#00a2a4] transition-colors"
            >
              Explore All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {related.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {related.map((item) => (
                <MedicineCard key={item._id} {...item} />
              ))}
            </div>
          ) : (
            <div className="rounded-[3rem] bg-slate-50 p-20 text-center border border-slate-100 border-dashed">
              <ShoppingCart className="mx-auto h-12 w-12 text-slate-200" />
              <p className="mt-6 text-xl font-bold text-slate-900">Curating Results...</p>
              <p className="text-sm text-slate-400">Please wait while we fetch similar medical items.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MedicineDetails;