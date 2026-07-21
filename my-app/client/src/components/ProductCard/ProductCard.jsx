import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  Loader2, 
  Bell, 
  CheckCircle2, 
  Zap, 
  Plus, 
  Minus,
  FileText,
  ShoppingBag,
  ShieldCheck
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
  numReviews = 52,
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

  return (
    <div
      onClick={() => navigate(`/product/${_id}`)}
      className="group relative flex w-full h-full flex-col bg-white border border-slate-200/90 rounded-2xl p-3 transition-all duration-200 hover:border-[#00a2a4] hover:shadow-md overflow-hidden cursor-pointer"
    >
      {/* Top Bar: Official Badges & Wishlist Button */}
      <div className="flex items-start justify-between gap-1.5 z-10 mb-1.5">
        <div className="flex items-center gap-1 flex-wrap">
          {hasDiscount && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}

          {needsRx && (
            <span className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-bold flex items-center gap-0.5">
              <FileText size={9} /> Rx
            </span>
          )}
        </div>

        {/* Clean Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all cursor-pointer ml-auto flex-shrink-0"
          title={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            size={13}
            className={`${
              isInWishlist ? 'fill-rose-600 stroke-rose-600 text-rose-600' : ''
            }`}
          />
        </button>
      </div>

      {/* Image Stage Container - Reduced Height to h-28 */}
      <div className="relative flex h-28 w-full items-center justify-center bg-slate-50/70 rounded-xl p-2 mb-2 border border-slate-100 overflow-hidden">
        <img
          src={image || 'https://placehold.co/300x300?text=Medicine'}
          alt={name}
          loading="lazy"
          className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x300?text=No+Image';
          }}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] flex items-center justify-center p-2 rounded-xl">
            <span className="px-3 py-1 bg-white text-rose-600 rounded-full text-xs font-bold shadow-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="flex flex-1 flex-col justify-between space-y-2">
        <div>
          {/* Brand & Official Rating */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00a2a4]">
              {brand || 'Generic'}
            </span>

            {rating > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span>{rating}</span>
              </div>
            )}
          </div>

          {/* Product Title */}
          <h3 className="line-clamp-2 text-xs font-bold leading-normal text-slate-800 group-hover:text-[#00a2a4] transition-colors min-h-[36px]">
            {cleanName}
          </h3>
        </div>

        {/* Official Pricing & Action Button */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900">₹{finalPrice}</span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">MRP ₹{mrp}</span>
              )}
            </div>

            {hasDiscount && (
              <span className="text-[11px] font-bold text-emerald-600">
                Save ₹{mrp - finalPrice}
              </span>
            )}
          </div>

          {/* Official Pharmacy Add Button / Quantity Counter */}
          {isOutOfStock ? (
            <button
              onClick={handleSubscribe}
              disabled={subscribing || isSubscribed}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
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
            /* Official Pharmacy Quantity Controller */
            <div className="w-full flex items-center justify-between bg-[#00a2a4] text-white rounded-lg p-1">
              <button
                onClick={handleDecrement}
                className="w-7 h-7 rounded bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Decrease"
              >
                <Minus size={14} className="stroke-[3]" />
              </button>

              <span className="text-xs font-bold px-2">{currentQuantity} added</span>

              <button
                onClick={handleIncrement}
                className="w-7 h-7 rounded bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Increase"
              >
                <Plus size={14} className="stroke-[3]" />
              </button>
            </div>
          ) : (
            /* Official Primary Button */
            <button
              onClick={handleAdd}
              disabled={addingToCart}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-[#00a2a4] hover:bg-[#00898b] text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-98"
            >
              {addingToCart ? (
                <Loader2 size={14} className="animate-spin text-white" />
              ) : (
                <>
                  <ShoppingBag size={13} />
                  <span>ADD TO CART</span>
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
