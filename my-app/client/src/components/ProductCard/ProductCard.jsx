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
  ShoppingCart,
  Sun,
  Zap,
  Shield,
  Sparkles,
  Flame
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/apiConfig';
import { subscribeToRestock } from '../../api/wishlist';
import toast from 'react-hot-toast';

const getAttributeIcon = (label) => {
  const l = (label || '').toLowerCase();
  if (l.includes('spf') || l.includes('sun')) return Sun;
  if (l.includes('strength') || l.includes('dose') || l.includes('mg') || l.includes('tablet') || l.includes('form')) return Zap;
  if (l.includes('skin') || l.includes('type')) return Shield;
  if (l.includes('serving') || l.includes('size') || l.includes('container') || l.includes('capsule')) return Sparkles;
  return FileText;
};

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
  isBestseller = false,
  keyFeatures = [],
  displayAttributes = [],
  rating = 0,
  numReviews = 0,
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
                onUndo({ _id, name, brand, price, image, discountPrice, countInStock, category, tagline, isBestseller, keyFeatures, displayAttributes });
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

  // Floating highlight badge configuration
  const validAttributes = (displayAttributes || []).filter(attr => attr && attr.label && attr.value);
  const firstAttr = validAttributes[0];
  const AttrIcon = firstAttr ? getAttributeIcon(firstAttr.label) : null;

  // Key features filter
  const validFeatures = (keyFeatures || []).map(f => f?.trim()).filter(Boolean);

  return (
    <div
      onClick={() => navigate(`/product/${_id}`)}
      className="group relative flex w-full h-full flex-col bg-white border border-slate-200 rounded-[28px] p-5 transition-all duration-300 hover:shadow-lg hover:border-slate-300 overflow-hidden cursor-pointer"
    >
      {/* 1. TOP ROW */}
      <div className="flex items-center justify-between gap-2 z-10 mb-4 min-h-[30px]">
        {/* BESTSELLER badge (left) */}
        {isBestseller ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[9px] font-black uppercase text-[#FF7A00] tracking-wider">
            <Flame size={12} className="fill-[#FF7A00] text-[#FF7A00] stroke-[2.5]" />
            <span>Bestseller</span>
          </div>
        ) : (
          <div /> // Spacer
        )}

        {/* Wishlist Heart Icon (right) */}
        <button
          onClick={handleWishlistToggle}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer bg-white shadow-sm ${
            isInWishlist
              ? 'border-rose-200 text-[#FF7A00]'
              : 'border-slate-200 text-slate-400 hover:text-slate-650'
          }`}
          title={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            size={14}
            className={`${isInWishlist ? 'fill-rose-500 stroke-rose-500 text-rose-500' : ''}`}
          />
        </button>
      </div>

      {/* 2. PRODUCT IMAGE AREA WITH PODESTAL & HALO BACKDROP */}
      <div className="relative flex h-36 w-full items-center justify-center rounded-2xl mb-4 overflow-hidden bg-slate-50/20">
        
        {/* Soft circular backdrop halo */}
        <div className="absolute top-2 w-32 h-32 rounded-full border-[6px] border-[#cbebec]/40 bg-gradient-to-b from-[#e3f7f7]/50 to-transparent z-0" />

        {/* 3D Cylindrical Pedestal */}
        <div className="absolute bottom-2.5 w-28 h-6 flex flex-col items-center justify-end z-0">
          <div className="w-28 h-4.5 bg-[#00b2b5] rounded-full border-b border-teal-700/20 z-10" />
          <div className="w-28 h-4.5 bg-[#009295] -mt-2.5 rounded-b-full shadow-[0_4px_10px_rgba(0,146,149,0.35)]" />
        </div>

        {/* Floating leaves for botantical touch */}
        <div className="absolute left-4 top-10 opacity-30 w-2.5 h-3 bg-emerald-400 rounded-tr-[100%] rounded-bl-[100%] rotate-[15deg] z-0" />
        <div className="absolute right-5 bottom-10 opacity-35 w-2 h-2.5 bg-emerald-400 rounded-tr-[100%] rounded-bl-[100%] rotate-[-45deg] z-0" />

        {/* Product Photo */}
        <img
          src={image || 'https://placehold.co/300x300?text=Medicine'}
          alt={name}
          loading="lazy"
          className="relative z-10 max-h-24 max-w-[80%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x300?text=No+Image';
          }}
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center p-2 rounded-2xl">
            <span className="px-2.5 py-1 bg-white text-rose-600 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md">
              Out of Stock
            </span>
          </div>
        )}

        {/* Overlapping feature highlight badge (floating) */}
        {firstAttr && (
          <div 
            className="absolute bottom-2 left-4 z-20 w-11 h-11 rounded-full bg-[#00a2a4] text-white flex flex-col items-center justify-center shadow-md"
            title={`${firstAttr.label}: ${firstAttr.value}`}
          >
            {AttrIcon && <AttrIcon size={12} className="stroke-[2.5]" />}
            <span className="text-[6.5px] font-black uppercase leading-none mt-0.5 max-w-[34px] truncate">{firstAttr.value}</span>
          </div>
        )}
      </div>

      {/* 3. BRAND + PRODUCT NAME */}
      <div className="space-y-1 mb-2">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#00a2a4]">
          {brand || 'Generic'}
        </p>
        <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-[#0c1e36] min-h-[40px]">
          {cleanName}
        </h3>
      </div>

      {/* 4. FEATURE BULLETS */}
      {validFeatures.length > 0 && (
        <div className="text-[10px] font-medium text-slate-400 mb-2 truncate">
          {validFeatures.slice(0, 3).join(' \u00b7 ')}
        </div>
      )}

      {/* 5. RATING ROW */}
      <div className="flex items-center gap-1 mb-4 text-xs font-semibold text-slate-600">
        {rating && rating > 0 ? (
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400 stroke-none" />
            <span className="text-slate-800 font-bold">{rating.toFixed(1)}</span>
            <span className="text-slate-400 text-[11px]">({numReviews} reviews)</span>
          </div>
        ) : (
          <span className="px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded text-[9px] font-black uppercase tracking-wider border border-sky-100">
            New
          </span>
        )}
      </div>

      {/* 6. PRICE + CIRCULAR CART BUTTON ROW */}
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Price & Discount */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-[#0c1e36] tracking-tight">₹{finalPrice}</span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through font-semibold">₹{mrp}</span>
            )}
          </div>
          {hasDiscount && (
            <div className="mt-1">
              <span className="text-[9px] font-bold text-[#00a2a4] bg-teal-50 border border-teal-200/50 px-2 py-0.5 rounded-full">
                {discountPercent}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div>
          {isOutOfStock ? (
            <button
              onClick={handleSubscribe}
              disabled={subscribing || isSubscribed}
              className="w-11 h-11 rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-all shadow-xs"
              title="Notify when back in stock"
            >
              {subscribing ? (
                <Loader2 size={13} className="animate-spin text-[#00a2a4]" />
              ) : isSubscribed ? (
                <CheckCircle2 size={13} className="text-emerald-600" />
              ) : (
                <Bell size={13} />
              )}
            </button>
          ) : currentQuantity > 0 ? (
            /* Circular Quantity Controller */
            <div className="flex items-center gap-1.5 bg-[#00a2a4] text-white rounded-full p-0.5 shadow-md">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Decrease"
              >
                <Minus size={12} className="stroke-[3]" />
              </button>

              <span className="text-xs font-black px-1">{currentQuantity}</span>

              <button
                onClick={handleIncrement}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Increase"
              >
                <Plus size={12} className="stroke-[3]" />
              </button>
            </div>
          ) : (
            /* Circular Cart Button */
            <button
              onClick={handleAdd}
              disabled={addingToCart}
              className="w-11 h-11 rounded-full bg-[#00a2a4] hover:bg-[#00898b] text-white flex items-center justify-center cursor-pointer transition-all shadow-[0_4px_12px_rgba(0,162,164,0.25)] hover:shadow-[#00a2a4]/40 hover:-translate-y-0.5 active:scale-95"
              title={needsRx ? "Add to Cart (Rx Required)" : "Add to Cart"}
            >
              {addingToCart ? (
                <Loader2 size={14} className="animate-spin text-white" />
              ) : (
                <ShoppingCart size={14} className="stroke-[2.5]" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
