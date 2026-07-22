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
      className="group relative flex w-full h-full flex-col bg-white border border-slate-200 rounded-[22px] p-4 transition-all duration-300 hover:border-[#00a2a4] hover:shadow-lg overflow-hidden cursor-pointer"
    >
      {/* 1. TOP ROW */}
      <div className="flex items-center justify-between gap-2 z-10 mb-3 min-h-[26px]">
        {/* BESTSELLER badge (left) */}
        {isBestseller ? (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
            <Flame size={10} className="fill-white animate-bounce" />
            <span>Bestseller</span>
          </div>
        ) : (
          <div /> // Empty spacer placeholder
        )}

        {/* Wishlist Heart Icon (right) */}
        <button
          onClick={handleWishlistToggle}
          className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
            isInWishlist
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
          }`}
          title={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            size={13}
            className={`${isInWishlist ? 'fill-rose-500 stroke-rose-500 text-rose-500' : ''}`}
          />
        </button>
      </div>

      {/* 2. PRODUCT IMAGE AREA WITH COLORED PEDESTAL & SHIELD RADIAL GLOW */}
      <div className="relative flex h-32 w-full items-center justify-center rounded-2xl mb-4 border border-slate-100 overflow-hidden bg-slate-50/50">
        {/* Soft radial backdrop gradient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,162,164,0.12)_0%,transparent_70%)] opacity-80" />

        {/* Oval colored pedestal/podium shape */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-3/4 h-2.5 bg-[#00a2a4]/10 rounded-[100%] border border-[#00a2a4]/15 blur-[0.5px]" />

        {/* Product Photo */}
        <img
          src={image || 'https://placehold.co/300x300?text=Medicine'}
          alt={name}
          loading="lazy"
          className="relative z-10 max-h-24 max-w-[85%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x300?text=No+Image';
          }}
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-2">
            <span className="px-2.5 py-1 bg-white text-rose-600 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md border border-rose-100">
              Out of Stock
            </span>
          </div>
        )}

        {/* Small floating circular feature-highlight badge (overlapping image) */}
        {firstAttr && (
          <div 
            className="absolute bottom-2 right-2 z-20 w-8 h-8 rounded-full bg-white border border-[#00a2a4]/30 shadow-md flex flex-col items-center justify-center text-[#00a2a4] hover:scale-110 transition-transform"
            title={`${firstAttr.label}: ${firstAttr.value}`}
          >
            {AttrIcon && <AttrIcon size={12} className="stroke-[2.5]" />}
            <span className="text-[6px] font-black uppercase leading-none mt-0.5 max-w-[28px] truncate">{firstAttr.value}</span>
          </div>
        )}
      </div>

      {/* 3. BRAND + PRODUCT NAME */}
      <div className="space-y-0.5 mb-2">
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#00a2a4]">
          {brand || 'Generic'}
        </p>
        <h3 className="line-clamp-2 text-xs font-bold leading-normal text-slate-800 transition-colors min-h-[36px]">
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
      <div className="flex items-center gap-1.5 mb-3 text-[11px] font-semibold text-slate-600">
        {rating && rating > 0 ? (
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-100">
              <Star size={11} className="fill-amber-400 text-amber-400 stroke-none" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-400 text-[10px]">({numReviews})</span>
          </div>
        ) : (
          <span className="px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded text-[10px] font-extrabold uppercase tracking-wider border border-sky-100">
            New
          </span>
        )}
      </div>

      {/* 6. PRICE + CART BUTTON ROW */}
      <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Price layout */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-extrabold text-slate-900">₹{finalPrice}</span>
            {hasDiscount && (
              <span className="text-[10px] text-slate-400 line-through">₹{mrp}</span>
            )}
          </div>
          {hasDiscount && (
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Circular Solid Cart Action Button */}
        <div>
          {isOutOfStock ? (
            <button
              onClick={handleSubscribe}
              disabled={subscribing || isSubscribed}
              className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-all shadow-xs"
              title="Notify when back in stock"
            >
              {subscribing ? (
                <Loader2 size={12} className="animate-spin text-[#00a2a4]" />
              ) : isSubscribed ? (
                <CheckCircle2 size={12} className="text-emerald-600" />
              ) : (
                <Bell size={12} />
              )}
            </button>
          ) : currentQuantity > 0 ? (
            /* Compact Circular Quantity Controller */
            <div className="flex items-center gap-1 bg-[#00a2a4] text-white rounded-full p-0.5 shadow-md">
              <button
                onClick={handleDecrement}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Decrease"
              >
                <Minus size={11} className="stroke-[3]" />
              </button>

              <span className="text-xs font-bold px-1.5">{currentQuantity}</span>

              <button
                onClick={handleIncrement}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Increase"
              >
                <Plus size={11} className="stroke-[3]" />
              </button>
            </div>
          ) : (
            /* Circular Cart Button */
            <button
              onClick={handleAdd}
              disabled={addingToCart}
              className="w-8 h-8 rounded-full bg-[#00a2a4] hover:bg-[#00898b] text-white flex items-center justify-center cursor-pointer transition-all shadow-md hover:shadow-[#00a2a4]/20 active:scale-95"
              title={needsRx ? "Add to Cart (Rx Required)" : "Add to Cart"}
            >
              {addingToCart ? (
                <Loader2 size={12} className="animate-spin text-white" />
              ) : (
                <ShoppingCart size={12} className="stroke-[2.5]" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
