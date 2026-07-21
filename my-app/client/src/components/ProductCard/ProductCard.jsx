import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Heart, 
  Loader2, 
  Bell, 
  CheckCircle2, 
  Zap, 
  Plus, 
  Minus,
  ShieldCheck,
  FileText,
  Sparkles,
  Flame,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/apiConfig';
import { subscribeToRestock } from '../../api/wishlist';
import toast from 'react-hot-toast';

const ProductCard = ({
  _id,
  name,
  brand,
  price,
  image,
  discountPrice,
  isFlashDeal,
  category,
  rating = 4.7,
  numReviews = 84,
  countInStock,
  needsRx = false,
  onRemove,
  onUndo
}) => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { user, token, setUser } = useAuth();
  
  const [addingToCart, setAddingToCart] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if item is already in cart & get its current quantity
  const cartItem = cart?.find(item => (item._id || item.productId) === _id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  // Pricing calculations
  const hasDiscount = !!discountPrice && discountPrice < price;
  const finalPrice = hasDiscount ? discountPrice : price;
  const mrp = price;
  const discountPercent = hasDiscount ? Math.round(((mrp - finalPrice) / mrp) * 100) : 0;
  const savingsAmount = hasDiscount ? mrp - finalPrice : 0;
  
  const isOutOfStock = countInStock === 0;

  // Wishlist state check
  const isInWishlist = user?.wishlist?.some(item => 
    (typeof item === 'string' ? item : item._id) === _id
  );

  const handleAdd = async (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    setAddingToCart(true);
    try {
      await addToCart({ _id, name, brand, price: finalPrice, image, countInStock });
      toast.success('Added to bag', { duration: 1500 });
    } catch (err) {
      toast.error('Failed to add to bag');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (currentQuantity >= countInStock) {
      toast.error('Max available stock reached');
      return;
    }
    updateQuantity(_id, currentQuantity + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (currentQuantity <= 1) {
      removeFromCart(_id);
      toast.success('Removed from bag', { duration: 1500 });
    } else {
      updateQuantity(_id, currentQuantity - 1);
    }
  };

  const handleSubscribe = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to subscribe for restock notifications');
      return navigate('/login');
    }
    setSubscribing(true);
    try {
      await subscribeToRestock(token, _id);
      setIsSubscribed(true);
      toast.success('You will be notified when restocked!');
    } catch (err) {
      toast.error(err.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to save favorites');
      return navigate('/login');
    }

    if (onRemove && isInWishlist) {
      onRemove(_id);
      if (onUndo) {
        toast((t) => (
          <span className="flex items-center gap-2 text-xs font-semibold">
            Removed from favorites
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onUndo({ _id, name, brand, price, image, discountPrice, countInStock, category });
              }}
              className="text-[#00a2a4] font-extrabold hover:underline"
            >
              Undo
            </button>
          </span>
        ), { duration: 5000 });
      }
      return;
    }

    const originalWishlist = [...(user.wishlist || [])];
    let updatedWishlist;
    if (isInWishlist) {
      updatedWishlist = originalWishlist.filter(item => 
        (typeof item === 'string' ? item : item._id) !== _id
      );
    } else {
      updatedWishlist = [...originalWishlist, _id];
    }
    
    setUser({ ...user, wishlist: updatedWishlist });
    toast.success(isInWishlist ? 'Removed from favorites' : 'Saved to favorites', { duration: 1500 });

    try {
      const action = isInWishlist ? 'remove' : 'add';
      await fetch(`${API_BASE}/api/users/wishlist/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: _id })
      });
    } catch (err) {
      setUser({ ...user, wishlist: originalWishlist });
    }
  };

  const cleanName = name ? name.split(' (')[0].split(' - ')[0] : 'Healthcare Product';

  return (
    <motion.div
      onClick={() => navigate(`/product/${_id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex w-full h-full flex-col bg-white border border-slate-200/90 rounded-[26px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(0,162,164,0.15)] hover:border-[#00a2a4]/50 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Glow aura accent behind card on hover */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#00a2a4]/10 blur-2xl group-hover:bg-[#00a2a4]/20 transition-all duration-500 pointer-events-none" />

      {/* ─── TOP BADGES & GLASS WISHLIST BUTTON ─── */}
      <div className="flex items-center justify-between gap-1.5 z-10 mb-2.5">
        
        {/* Left Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {hasDiscount && (
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-0.5">
              <Sparkles size={10} className="fill-white/80 text-white/80" />
              <span>{discountPercent}% OFF</span>
            </span>
          )}

          {isFlashDeal && (
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-0.5">
              <Flame size={10} className="fill-white text-white" />
              <span>Flash Deal</span>
            </span>
          )}

          {/* Express 10-min Delivery Pill */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[9px] font-extrabold">
            <Zap size={10} className="fill-amber-500 text-amber-500" />
            <span>10 MINS</span>
          </span>

          {needsRx && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-[9px] font-extrabold">
              <FileText size={10} /> Rx Required
            </span>
          )}
        </div>

        {/* Floating Glass Heart */}
        <motion.button
          whileTap={{ scale: 0.75 }}
          onClick={handleWishlistToggle}
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all cursor-pointer ml-auto flex-shrink-0"
          title={isInWishlist ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart
            size={15}
            className={`${
              isInWishlist ? 'fill-rose-500 stroke-rose-500 text-rose-500' : 'stroke-[2.2]'
            }`}
          />
        </motion.button>
      </div>

      {/* ─── PRODUCT IMAGE SHOWCASE ─── */}
      <div className="relative flex h-[150px] sm:h-[165px] w-full items-center justify-center bg-gradient-to-b from-slate-50 via-slate-50/50 to-slate-100/30 rounded-[20px] p-3 mb-3 border border-slate-100/80 overflow-hidden group/img">
        
        {/* Soft radial backdrop highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8)_0%,transparent_100%)] opacity-80" />

        <img
          src={image || 'https://placehold.co/300x300?text=Medicine'}
          alt={name}
          loading="lazy"
          className="relative z-10 h-full w-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x300?text=No+Image';
          }}
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 bg-slate-900/65 backdrop-blur-[3px] flex items-center justify-center p-2 rounded-[20px]">
            <span className="px-3.5 py-1.5 bg-white text-rose-600 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border border-rose-100">
              Temporarily Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ─── DETAILS AREA ─── */}
      <div className="flex flex-1 flex-col justify-between space-y-2">
        <div>
          {/* Brand Name & Star Rating Pill */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00a2a4] truncate max-w-[130px]">
              {brand || 'Generic'}
            </span>

            {rating > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[10px] font-extrabold flex-shrink-0">
                <Star size={10} className="fill-emerald-600 text-emerald-600" />
                <span>{rating}</span>
                <span className="text-slate-400 font-medium text-[9px]">({numReviews})</span>
              </div>
            )}
          </div>
          
          {/* Product Title (2-line clamp) */}
          <h3 className="line-clamp-2 text-xs font-bold leading-relaxed text-slate-900 group-hover:text-[#00a2a4] transition-colors min-h-[36px]">
            {cleanName}
          </h3>
        </div>

        {/* ─── PRICING & BLINKIT-STYLE BUTTON ─── */}
        <div className="pt-2.5 border-t border-slate-100 space-y-2.5">
          
          {/* Price & Savings Row */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">₹{finalPrice}</span>
              {hasDiscount && (
                <span className="text-[11px] text-slate-400 font-semibold line-through">₹{mrp}</span>
              )}
            </div>

            {hasDiscount && (
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                Save ₹{savingsAmount}
              </span>
            )}
          </div>

          {/* Blinkit/Zepto Style Dynamic Controller */}
          {isOutOfStock ? (
            <button
              onClick={handleSubscribe}
              disabled={subscribing || isSubscribed}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full border border-slate-200 text-[11px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
            >
              {subscribing ? (
                <Loader2 size={13} className="animate-spin text-[#00a2a4]" />
              ) : isSubscribed ? (
                <CheckCircle2 size={13} className="text-emerald-600" />
              ) : (
                <Bell size={13} className="text-slate-500" />
              )}
              <span>{isSubscribed ? 'Notified' : 'Notify Me'}</span>
            </button>
          ) : currentQuantity > 0 ? (
            /* Blinkit Quantity Modifier (- QTY +) */
            <div className="w-full flex items-center justify-between bg-gradient-to-r from-[#00a2a4] to-teal-600 text-white rounded-full p-1 shadow-md shadow-[#00a2a4]/20">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleDecrement}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Decrease quantity"
              >
                <Minus size={13} className="stroke-[3]" />
              </motion.button>

              <span className="text-xs font-black px-2 tracking-wider">{currentQuantity} in bag</span>

              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleIncrement}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Increase quantity"
              >
                <Plus size={13} className="stroke-[3]" />
              </motion.button>
            </div>
          ) : (
            /* Premium High-Contrast ADD Button */
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleAdd}
              disabled={addingToCart}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-white border border-[#00a2a4] text-[#00a2a4] hover:bg-gradient-to-r hover:from-[#00a2a4] hover:to-teal-600 hover:text-white text-xs font-black transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md hover:shadow-[#00a2a4]/20 active:scale-98 group/btn"
            >
              {addingToCart ? (
                <Loader2 size={14} className="animate-spin text-[#00a2a4]" />
              ) : (
                <>
                  <ShoppingBag size={13} className="group-hover/btn:scale-110 transition-transform" />
                  <span className="tracking-wider">ADD TO BAG</span>
                  <Plus size={13} className="stroke-[3] ml-auto group-hover/btn:rotate-90 transition-transform duration-300" />
                </>
              )}
            </motion.button>
          )}

        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
