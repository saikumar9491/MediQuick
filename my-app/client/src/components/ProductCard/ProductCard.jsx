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
  ShoppingBag,
  ChevronRight,
  Lock
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

  // Live stock pill color configurations
  let stockStatusColor = 'bg-emerald-500';
  let stockStatusBg = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  let stockStatusText = 'In Stock';

  if (isOutOfStock) {
    stockStatusColor = 'bg-rose-500';
    stockStatusBg = 'bg-rose-50 text-rose-700 border-rose-100';
    stockStatusText = 'Out of Stock';
  } else if (countInStock < 10) {
    stockStatusColor = 'bg-amber-500';
    stockStatusBg = 'bg-amber-50 text-amber-700 border-amber-100';
    stockStatusText = `Only ${countInStock} Left`;
  }

  // Filter displayAttributes to exclude empty values
  const activeAttributes = (displayAttributes || []).filter(attr => attr && attr.label && attr.value);

  return (
    <div
      onClick={() => navigate(`/product/${_id}`)}
      className="group relative flex w-full h-full flex-col bg-white border border-slate-200 rounded-2xl p-3.5 transition-all duration-200 hover:border-[#00a2a4] hover:shadow-lg overflow-hidden cursor-pointer"
    >
      {/* 1. TOP STATUS ROW */}
      <div className="flex items-center justify-between gap-2 z-10 mb-2.5">
        {/* Wishlist Heart Icon (Left) */}
        <button
          onClick={handleWishlistToggle}
          className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
            isInWishlist
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-650'
          }`}
          title={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            size={13}
            className={`${isInWishlist ? 'fill-rose-500 stroke-rose-500 text-rose-500' : ''}`}
          />
        </button>

        {/* Stock Status Pill (Right) */}
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold ${stockStatusBg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${stockStatusColor} animate-pulse`} />
          <span>{stockStatusText}</span>
        </div>
      </div>

      {/* 2. PRODUCT IMAGE CONTAINER */}
      <div className="relative flex h-28 w-full items-center justify-center bg-slate-50/70 rounded-xl p-2 mb-3 border border-slate-100 overflow-hidden">
        <img
          src={image || 'https://placehold.co/300x300?text=Medicine'}
          alt={name}
          loading="lazy"
          className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x300?text=No+Image';
          }}
        />
      </div>

      {/* 3. BRAND + TAGLINE / DESCRIPTION */}
      <div className="space-y-1 mb-2">
        <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
          {brand || 'Generic'}
        </p>
        <h3 className="line-clamp-2 text-xs font-bold leading-normal text-slate-800 group-hover:text-[#00a2a4] transition-colors min-h-[36px]">
          {tagline && tagline.trim() ? tagline : cleanName}
        </h3>
      </div>

      {/* 4. FLEXIBLE ATTRIBUTE ROW */}
      {activeAttributes.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {activeAttributes.slice(0, 2).map((attr, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 text-center flex flex-col justify-center min-h-[38px]">
              <span className="text-[8px] uppercase font-extrabold text-slate-400 leading-none mb-0.5 truncate">{attr.label}</span>
              <span className="text-[10px] font-bold text-slate-700 leading-tight truncate">{attr.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Push everything below to the bottom */}
      <div className="mt-auto pt-2.5 border-t border-slate-100 space-y-3">
        {/* 5. PRICE SECTION */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-slate-900">₹{finalPrice}</span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">MRP ₹{mrp}</span>
            )}
          </div>
          {hasDiscount && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* 6. CTA BUTTON ROW */}
        <div>
          {isOutOfStock ? (
            <button
              onClick={handleSubscribe}
              disabled={subscribing || isSubscribed}
              className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
            >
              {subscribing ? (
                <Loader2 size={13} className="animate-spin text-[#00a2a4]" />
              ) : isSubscribed ? (
                <CheckCircle2 size={13} className="text-emerald-600" />
              ) : (
                <Bell size={13} className="text-slate-500" />
              )}
              <span>{isSubscribed ? 'Alert Set' : 'Notify Me'}</span>
            </button>
          ) : currentQuantity > 0 ? (
            /* Quantity Modifier counter */
            <div className="w-full flex items-center justify-between bg-[#00a2a4] text-white rounded-lg p-1">
              <button
                onClick={handleDecrement}
                className="w-7.5 h-7.5 rounded bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Decrease"
              >
                <Minus size={13} className="stroke-[3]" />
              </button>

              <span className="text-xs font-bold px-2">{currentQuantity} in cart</span>

              <button
                onClick={handleIncrement}
                className="w-7.5 h-7.5 rounded bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Increase"
              >
                <Plus size={13} className="stroke-[3]" />
              </button>
            </div>
          ) : (
            /* Full-width primary CTA button with right-arrow */
            <button
              onClick={handleAdd}
              disabled={addingToCart}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-[#00a2a4] hover:bg-[#00898b] text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-98"
            >
              {addingToCart ? (
                <Loader2 size={14} className="animate-spin text-white" />
              ) : (
                <>
                  {needsRx && <Lock size={12} className="text-white/90" />}
                  <span>{needsRx ? 'Add to Cart (Rx Required)' : 'Add to Cart'}</span>
                  <ChevronRight size={14} className="ml-auto text-white/80" />
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
