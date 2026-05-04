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
  ChevronRight
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
        
        {/* Breadcrumbs - Minimalist */}
        <nav className="flex items-center gap-2 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          <span className="cursor-pointer hover:text-[#00a2a4] transition-colors" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={12} className="opacity-50" />
          <span className="cursor-pointer hover:text-[#00a2a4] transition-colors" onClick={() => navigate('/medicines')}>Medicines</span>
          <ChevronRight size={12} className="opacity-50" />
          <span className="text-slate-900 truncate max-w-[200px]">{medicine.name}</span>
        </nav>

        <div className="flex flex-col gap-12 lg:flex-row">
          
          {/* Left Column: Image & Gallery */}
          <div className="lg:w-7/12">
            <div className="sticky top-28">
              <div className="group relative aspect-square overflow-hidden rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center p-12 transition-all hover:shadow-2xl hover:shadow-teal-50">
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={medicine.image || 'https://placehold.co/600x600?text=Medicine'} 
                  alt={medicine.name}
                  className="max-h-full w-full object-contain mix-blend-multiply"
                />
                
                <div className="absolute top-6 right-6 flex flex-col gap-3">
                  <button 
                    onClick={toggleWishlist}
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 transition-all active:scale-90 ${isWishlisted ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 text-slate-400 hover:text-blue-600 transition-all active:scale-90">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>

                {medicine.isFlashDeal && (
                  <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full bg-[#ff6f61] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                    <Zap size={12} className="fill-white" /> Flash Deal
                  </div>
                )}
              </div>

              {/* Info Blocks Below Image */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-teal-50/50 p-6 border border-teal-100/50">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-teal-800 mb-3 flex items-center gap-2">
                    <ShieldCheck size={16} /> Quality Assurance
                  </h4>
                  <p className="text-xs font-medium text-teal-700/80 leading-relaxed">
                    Sourced from verified manufacturers and stored at optimal temperatures to ensure maximum potency.
                  </p>
                </div>
                <div className="rounded-2xl bg-orange-50/50 p-6 border border-orange-100/50">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-orange-800 mb-3 flex items-center gap-2">
                    <RotateCcw size={16} /> 7-Day Returns
                  </h4>
                  <p className="text-xs font-medium text-orange-700/80 leading-relaxed">
                    Hassle-free returns on damaged or incorrect items. Genuine policy to ensure peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information & CTAs */}
          <div className="lg:w-5/12">
            <div className="space-y-8">
              {/* Brand & Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                    {medicine.brand}
                  </span>
                  {medicine.category && (
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      • {medicine.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-green-50 px-2.5 py-1 text-green-700 border border-green-100">
                  <Star size={14} className="fill-current" />
                  <span className="text-xs font-black">4.8</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl leading-[1.1]">
                {medicine.name}
              </h1>

              {/* Pricing Block */}
              <div className="rounded-3xl bg-slate-50 p-6 sm:p-8 border border-slate-100">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{medicine.price}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-400 line-through">MRP ₹{Math.round(medicine.price * 1.3)}</span>
                    <span className="text-xs font-black text-green-600">SAVE 25% ON THIS ORDER</span>
                  </div>
                </div>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Inclusive of all taxes</p>
                
                {/* Delivery Checker Mockup */}
                <div className="mt-8 border-t border-slate-200 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Truck size={16} className="text-[#00a2a4]" />
                      <span>Delivery to 143001</span>
                    </div>
                    <button className="text-[10px] font-black text-[#00a2a4] uppercase tracking-widest hover:underline">Change</button>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500">Delivery by <span className="font-bold text-slate-900">Tomorrow, 10:00 AM</span></p>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900">Select Quantity</span>
                  <div className="flex items-center gap-4 rounded-xl bg-white p-1.5 border border-slate-200 shadow-sm">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="w-8 text-center text-sm font-black">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-900 bg-white py-4 text-xs font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-900 hover:text-white active:scale-95"
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to Bag
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-3 rounded-2xl bg-[#00a2a4] py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-teal-100 transition-all hover:bg-slate-900 active:scale-95"
                  >
                    <Zap className="h-4 w-4 fill-current" /> Buy Now
                  </button>
                </div>
              </div>

              {/* Prescription Banner (if needed) */}
              {medicine.needsPrescription && (
                <div className="flex items-center gap-4 rounded-2xl bg-blue-50 p-6 border border-blue-100">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-blue-900">Prescription Required</h4>
                    <p className="mt-1 text-[11px] font-medium text-blue-700/70 leading-relaxed">
                      Please upload a valid prescription after checkout to process this order.
                    </p>
                  </div>
                </div>
              )}

              {/* Description & More Info */}
              <div className="space-y-6 pt-8 border-t border-slate-100">
                <div className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Product Description</h3>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                  <p className="text-[13px] font-medium leading-relaxed text-slate-600 line-clamp-3">
                    {medicine.description || "Premium pharmaceutical grade product sourced from trusted manufacturers. This medicine is stored in climate-controlled facilities at our Amritsar hub to ensure maximum efficacy and safety for our patients."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                    100% GENUINE PRODUCT
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                    VERIFIED SELLER
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <section className="mt-32">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl uppercase">
                Similar <span className="text-[#00a2a4]">Products</span>
              </h2>
              <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Handpicked alternatives for you</p>
            </div>
            <button 
              onClick={() => navigate('/medicines')} 
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 hover:text-[#00a2a4] transition-colors"
            >
              View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
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
              <p className="mt-6 text-xl font-bold text-slate-900">Finding matches...</p>
              <p className="text-sm text-slate-400">Our medical experts are curating similar items.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MedicineDetails;