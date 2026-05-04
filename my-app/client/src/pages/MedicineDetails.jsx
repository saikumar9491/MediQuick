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
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/')}>Home</span>
          <ChevronRight className="h-3 w-3" />
          <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/medicines')}>Pharmacy</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900">{medicine.name}</span>
        </nav>

        <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl border border-slate-100 lg:flex">
          
          {/* Image Gallery */}
          <div className="relative lg:w-1/2 p-8 lg:p-12 bg-white">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center p-12 group">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                src={medicine.image || 'https://placehold.co/600x600?text=Medicine'} 
                alt={medicine.name}
                className="max-h-full w-full object-contain"
              />
              
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <button 
                  onClick={toggleWishlist}
                  className={`flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 transition-all active:scale-90 ${isWishlisted ? 'text-red-500' : 'text-slate-400'}`}
                >
                  <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 text-slate-400 transition-all active:scale-90">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {medicine.isFlashDeal && (
                <div className="absolute top-6 left-6 rounded-full bg-orange-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-orange-100 animate-pulse">
                  ⚡ Flash Deal
                </div>
              )}
            </div>

            {/* Thumbnail Placeholder */}
            <div className="mt-8 flex gap-4 overflow-x-auto no-scrollbar">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 w-20 shrink-0 cursor-pointer rounded-2xl bg-slate-50 border-2 border-transparent hover:border-blue-500 transition-all flex items-center justify-center p-3">
                  <img src={medicine.image} className="max-h-full max-w-full object-contain" alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 p-8 lg:p-16 border-l border-slate-50">
            <div className="flex items-center gap-3 mb-6">
              <span className="rounded-full bg-blue-50 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                {medicine.brand}
              </span>
              <div className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-green-700">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-[10px] font-bold">4.8</span>
              </div>
            </div>

            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl leading-tight">
              {medicine.name}
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-400 uppercase tracking-widest">
              Category: {medicine.category || 'General'}
            </p>

            <div className="mt-10 flex items-baseline gap-4">
              <span className="text-4xl font-black text-slate-900">₹{medicine.price}</span>
              <span className="text-xl font-medium text-slate-400 line-through">₹{Math.round(medicine.price * 1.3)}</span>
              <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-bold text-green-600">30% OFF</span>
            </div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Inclusive of all taxes</p>

            {/* Quantity Selector */}
            <div className="mt-12 flex items-center gap-6">
              <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">Quantity</span>
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-2 border border-slate-100">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm border border-slate-100 active:scale-95 transition-all"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-lg font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm border border-slate-100 active:scale-95 transition-all"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-blue-600 active:scale-95"
              >
                <ShoppingCart className="h-5 w-5" /> Add to Bag
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-xl shadow-blue-100 transition-all hover:bg-slate-900 active:scale-95"
              >
                <Zap className="h-5 w-5 fill-current" /> Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-slate-100 pt-10">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">100% Genuine</h4>
                  <p className="text-[10px] text-slate-400">Directly from Amritsar Hub</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Express Delivery</h4>
                  <p className="text-[10px] text-slate-400">Under 6 hours available</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Easy Returns</h4>
                  <p className="text-[10px] text-slate-400">7-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Certified Hub</h4>
                  <p className="text-[10px] text-slate-400">ISO 9001:2015 Approved</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-12">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900 border-b-2 border-blue-600 w-fit pb-1 mb-6">Description</h3>
              <p className="text-[15px] font-medium leading-relaxed text-slate-600">
                {medicine.description || "Premium quality pharmaceutical grade product. Sourced directly from verified manufacturers and stored in temperature-controlled environments at our Amritsar hub to ensure maximum potency and safety."}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-20">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl italic">Similar Products</h2>
            <button onClick={() => navigate('/medicines')} className="text-sm font-bold text-blue-600 hover:underline">View All</button>
          </div>

          {related.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {related.map((item) => (
                <MedicineCard key={item._id} {...item} />
              ))}
            </div>
          ) : (
            <div className="rounded-[3rem] bg-white p-20 text-center border border-slate-100">
              <ShoppingCart className="mx-auto h-12 w-12 text-slate-200" />
              <p className="mt-6 text-xl font-bold text-slate-900">No similar items found</p>
              <p className="text-sm text-slate-400">Check our other categories for more products.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MedicineDetails;