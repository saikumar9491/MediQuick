import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Loader2, 
  Bell, 
  CheckCircle2, 
  Plus, 
  Minus,
  FileText,
  Lock,
  ChevronRight,
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
  countInStock,
  needsRx = false,
  tagline,
  displayAttributes = [],
  category,
  onRemove,
  onUndo
}) => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { user, token, setUser } = useAuth();
  
  const [addingToCart, setAddingToCart] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Check if item is already in cart & get its current quantity
  const cartItem = cart?.find(item => (item._id || item.productId) === _id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  // Pricing calculations
  const hasDiscount = !!discountPrice && discountPrice < price;
  const finalPrice = hasDiscount ? discountPrice : price;
  const mrp = price;
  const discountPercent = hasDiscount ? Math.round(((mrp - finalPrice) / mrp) * 100) : 0;
  
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
      toast.success('Added to cart', { duration: 1500 });
    } catch (err) {
      toast.error('Failed to add to cart');
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
      toast.success('Removed from cart', { duration: 1500 });
    } else {
      updateQuantity(_id, currentQuantity - 1);
    }
  };

  const handleSubscribe = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to get restock alerts');
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
      toast.error('Please login to save items');
      return navigate('/login');
    }

    if (onRemove && isInWishlist) {
      onRemove(_id);
      if (onUndo) {
        toast((t) => (
          <span className="flex items-center gap-2 text-xs">
            Item removed
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onUndo({ _id, name, brand, price, image, discountPrice, countInStock, category, tagline, displayAttributes });
              }}
              className="text-[#0057FF] font-bold hover:underline"
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
    toast.success(isInWishlist ? 'Removed from saved items' : 'Saved to wishlist', { duration: 1500 });

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

  // Live stock pill configurations
  let stockStatusColor = 'bg-[#16A34A]';
  let stockStatusBg = 'bg-green-50 text-[#16A34A] border-green-200';
  let stockStatusText = 'In Stock';

  if (isOutOfStock) {
    stockStatusColor = 'bg-[#EF4444]';
    stockStatusBg = 'bg-red-50 text-[#EF4444] border-red-200';
    stockStatusText = 'Out of Stock';
  } else if (countInStock < 10) {
    stockStatusColor = 'bg-[#FF6B00]';
    stockStatusBg = 'bg-orange-50 text-[#FF6B00] border-orange-200';
    stockStatusText = `Only ${countInStock} Left`;
  }

  // Filter displayAttributes to exclude empty values
  const activeAttributes = (displayAttributes || []).filter(attr => attr && attr.label && attr.value);

  return (
    <div
      onClick={() => navigate(`/medicines/${_id}`)}
      className="group relative flex w-full h-full flex-col bg-white border border-slate-100/60 sm:border-slate-200 rounded-2xl p-2 sm:p-4 transition-all duration-200 hover:border-[#0057FF] hover:shadow-lg overflow-hidden cursor-pointer"
    >
      {/* 1. TOP STATUS ROW (Desktop Only) */}
      <div className="hidden sm:flex items-center justify-between gap-1 z-10 mb-2 min-h-[26px]">
        {/* Wishlist Heart Icon (Left) */}
        <button
          onClick={handleWishlistToggle}
          className={`w-7.5 h-7.5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
            isInWishlist
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-slate-50 border-slate-200 text-slate-450 hover:bg-slate-100 hover:text-slate-650'
          }`}
          style={{ minWidth: '30px', minHeight: '30px' }}
          title={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            size={13}
            className={`${isInWishlist ? 'fill-rose-500 stroke-rose-500 text-rose-500' : ''}`}
          />
        </button>

        {/* Stock Status Pill (Right) */}
        <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[8px] sm:text-[10px] font-bold ${stockStatusBg}`}>
          <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${stockStatusColor} animate-pulse`} />
          <span>{stockStatusText}</span>
        </div>
      </div>

      {/* 2. PRODUCT IMAGE CONTAINER */}
      <div className="relative flex h-28 sm:h-32 w-full items-center justify-center bg-[#181d28] sm:bg-slate-50/60 rounded-2xl sm:rounded-xl p-2 mb-2 border-0 sm:border border-slate-100/50 overflow-hidden">
        <img
          src={image || 'https://placehold.co/300x300?text=Medicine'}
          alt={name}
          loading="lazy"
          className="h-full w-full object-contain mix-blend-lighten sm:mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x300?text=No+Image';
          }}
        />
        {/* Mockup bottom-right white circle badge on mobile */}
        <div className="sm:hidden absolute bottom-2 right-2 w-5 h-5 rounded-full bg-white shadow-xs pointer-events-none" />
      </div>

      {/* 3. BRAND + TAGLINE / DESCRIPTION */}
      <div className="space-y-0.5 mb-1.5">
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {brand || 'Generic'}
        </p>
        <h3 className="line-clamp-2 text-[10px] sm:text-xs font-black leading-snug text-slate-800 group-hover:text-[#0057FF] transition-colors min-h-[30px] sm:min-h-[36px]">
          {tagline && tagline.trim() ? tagline : cleanName}
        </h3>
      </div>

      {/* 4. FLEXIBLE ATTRIBUTE ROW (Desktop only to prevent cramming) */}
      {activeAttributes.length > 0 && (
        <div className="hidden sm:grid grid-cols-2 gap-2 mb-3">
          {activeAttributes.slice(0, 2).map((attr, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 text-center flex flex-col justify-center min-h-[38px]">
              <span className="text-[8px] uppercase font-bold text-slate-400 leading-none mb-0.5 truncate">{attr.label}</span>
              <span className="text-[10px] font-extrabold text-slate-700 leading-tight truncate">{attr.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Push everything below to the bottom */}
      <div className="mt-auto pt-2 border-t border-slate-50 sm:border-slate-100 space-y-2">
        {/* 5. PRICE SECTION */}
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <div className="flex items-baseline gap-1">
            <span className="text-xs sm:text-base font-black text-slate-900">₹{finalPrice}</span>
            {hasDiscount && (
              <span className="text-[9px] sm:text-xs text-slate-400 line-through">₹{mrp}</span>
            )}
          </div>
          {hasDiscount && (
            <span className="text-[9px] sm:text-[10px] font-bold text-[#16A34A]">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* 6. CTA BUTTON ROW (Desktop Only) */}
        <div className="hidden sm:block pt-1">
          {isOutOfStock ? (
            <button
              onClick={handleSubscribe}
              disabled={subscribing || isSubscribed}
              className="w-full flex items-center justify-center gap-1 py-2 px-2 rounded-xl border border-slate-350 text-[10px] sm:text-xs font-bold text-slate-650 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
              style={{ minHeight: '36px' }}
            >
              {subscribing ? (
                <Loader2 size={12} className="animate-spin text-[#0057FF]" />
              ) : isSubscribed ? (
                <CheckCircle2 size={12} className="text-[#16A34A]" />
              ) : (
                <Bell size={12} className="text-slate-500" />
              )}
              <span>{isSubscribed ? 'Alert Set' : 'Notify Me'}</span>
            </button>
          ) : currentQuantity > 0 ? (
            /* Quantity Modifier counter */
            <div className="w-full flex items-center justify-between bg-[#0057FF] text-white rounded-xl p-0.5 sm:p-1 shadow-sm" style={{ minHeight: '36px' }}>
              <button
                onClick={handleDecrement}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Decrease"
              >
                <Minus size={12} className="stroke-[3]" />
              </button>

              <span className="text-[10px] sm:text-xs font-bold px-1">{currentQuantity} in cart</span>

              <button
                onClick={handleIncrement}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Increase"
              >
                <Plus size={12} className="stroke-[3]" />
              </button>
            </div>
          ) : (
            /* Full-width primary CTA button with right-arrow */
            <button
              onClick={handleAdd}
              disabled={addingToCart}
              className="w-full flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-[#0057FF] hover:bg-[#003BB5] text-white text-[10px] sm:text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-98"
              style={{ minHeight: '36px' }}
            >
              {addingToCart ? (
                <Loader2 size={12} className="animate-spin text-white" />
              ) : (
                <>
                  {needsRx && <Lock size={10} className="text-white/90 shrink-0" />}
                  <span className="truncate">{needsRx ? 'Add to Cart (Rx)' : 'Add to Cart'}</span>
                  <ChevronRight size={12} className="ml-auto text-white/80 shrink-0" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
