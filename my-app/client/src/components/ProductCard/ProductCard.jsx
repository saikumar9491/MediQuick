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
  FileText
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
  rating = 4.5,
  numReviews = 48,
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

  // Check if item is already in cart & get its current quantity (Blinkit style)
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
      toast.error('Max stock limit reached');
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
      toast.error('Please login to use wishlist');
      return navigate('/login');
    }

    if (onRemove && isInWishlist) {
      onRemove(_id);
      if (onUndo) {
        toast((t) => (
          <span className="flex items-center gap-2 text-xs">
            Removed from wishlist
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onUndo({ _id, name, brand, price, image, discountPrice, countInStock, category });
              }}
              className="text-[#00a2a4] font-bold hover:underline"
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
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Saved to wishlist', { duration: 1500 });

    try {
      const action = isInWishlist ? 'remove' : 'add';
      const res = await fetch(`${API_BASE}/api/users/wishlist/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: _id })
      });
      if (!res.ok) throw new Error('Sync failed');
    } catch (err) {
      setUser({ ...user, wishlist: originalWishlist });
    }
  };

  const cleanName = name ? name.split(' (')[0].split(' - ')[0] : 'Healthcare Product';

  return (
    <motion.div
      onClick={() => navigate(`/product/${_id}`)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex w-full h-full flex-col bg-white border border-slate-200/80 rounded-[22px] p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_35px_rgba(0,162,164,0.12)] hover:border-[#00a2a4]/40 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* ─── TOP BADGES & WISHLIST HEART ─── */}
      <div className="flex items-center justify-between gap-2 z-10 mb-2">
        {/* Left Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black tracking-wider shadow-xs">
              {discountPercent}% OFF
            </span>
          )}

          {/* Express Delivery Badge (Blinkit style) */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[9px] font-extrabold">
            <Zap size={10} className="fill-amber-500 text-amber-500" />
            <span>10 mins</span>
          </span>

          {needsRx && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-[9px] font-bold">
              <FileText size={9} /> Rx
            </span>
          )}
        </div>

        {/* Wishlist Glassmorphic Floating Heart */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleWishlistToggle}
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer ml-auto flex-shrink-0"
          title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            size={15}
            className={`${
              isInWishlist ? 'fill-rose-500 stroke-rose-500 text-rose-500' : 'stroke-2'
            }`}
          />
        </motion.button>
      </div>

      {/* ─── PRODUCT IMAGE SHOWCASE ─── */}
      <div className="relative flex h-[140px] sm:h-[155px] w-full items-center justify-center bg-gradient-to-b from-slate-50/80 to-slate-100/30 rounded-[16px] p-3 mb-3 border border-slate-100/80 overflow-hidden">
        <img
          src={image || 'https://placehold.co/300x300?text=Medicine'}
          alt={name}
          loading="lazy"
          className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ease-out"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x300?text=No+Image';
          }}
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-2 rounded-[16px]">
            <span className="px-3 py-1 bg-white text-rose-600 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ─── CONTENT AREA ─── */}
      <div className="flex flex-1 flex-col justify-between space-y-2">
        <div>
          {/* Brand Name & Rating Pill (Amazon/Flipkart style) */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#00a2a4] truncate max-w-[120px]">
              {brand || 'Generic'}
            </span>

            {rating > 0 && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                <Star size={10} className="fill-emerald-600 text-emerald-600" />
                <span>{rating}</span>
                <span className="text-slate-400 text-[9px]">({numReviews})</span>
              </div>
            )}
          </div>
          
          {/* Product Title (2-line clamp) */}
          <h3 className="line-clamp-2 text-xs font-bold leading-snug text-slate-900 group-hover:text-[#00a2a4] transition-colors min-h-[34px]">
            {cleanName}
          </h3>
        </div>

        {/* ─── PRICING & ACTION BUTTON (Blinkit / Amazon style) ─── */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          {/* Price & Savings Row */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-slate-900">₹{finalPrice}</span>
              {hasDiscount && (
                <span className="text-[11px] text-slate-400 line-through">₹{mrp}</span>
              )}
            </div>

            {hasDiscount && (
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                Save ₹{savingsAmount}
              </span>
            )}
          </div>

          {/* Blinkit-Style Interactive Button / Counter */}
          {isOutOfStock ? (
            <button
              onClick={handleSubscribe}
              disabled={subscribing || isSubscribed}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-full border border-slate-200 text-[11px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
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
            /* Blinkit/Zepto Quantity Controller (- 1 +) */
            <div className="w-full flex items-center justify-between bg-[#00a2a4] text-white rounded-full p-1 shadow-md">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleDecrement}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Decrease"
              >
                <Minus size={14} className="stroke-[3]" />
              </motion.button>

              <span className="text-xs font-black px-2">{currentQuantity}</span>

              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleIncrement}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Increase"
              >
                <Plus size={14} className="stroke-[3]" />
              </motion.button>
            </div>
          ) : (
            /* Premium ADD Button */
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleAdd}
              disabled={addingToCart}
              className="w-full flex items-center justify-center gap-1 py-2 px-4 rounded-full border border-[#00a2a4] bg-white text-[#00a2a4] hover:bg-[#00a2a4] hover:text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs active:scale-98 group/btn"
            >
              {addingToCart ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <span>ADD</span>
                  <Plus size={14} className="stroke-[2.5] group-hover/btn:rotate-90 transition-transform duration-200" />
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
