import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, Loader2, Bell, CheckCircle2 } from 'lucide-react';
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
  rating,
  numReviews,
  countInStock,
  onRemove,
  onUndo
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, token, setUser } = useAuth();
  
  const [addingToCart, setAddingToCart] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

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
      await addToCart({ _id, name, brand, price: finalPrice, image });
      toast.success('Added to bag');
    } catch (err) {
      toast.error('Failed to add to bag');
    } finally {
      setAddingToCart(false);
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

    // Optimistic UI toggle
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
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');

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
      toast.error('Wishlist sync failed. Reverting...');
    }
  };

  // Clean short name helper
  const cleanName = name.split(' (')[0].split(' - ')[0];

  return (
    <motion.div
      onClick={() => navigate(`/product/${_id}`)}
      className="group relative flex w-full h-full flex-col bg-white border border-slate-200/50 rounded-[18px] p-4 transition-all duration-300 hover:border-[#00a2a4] hover:shadow-[0_12px_40px_rgba(0,162,164,0.05)] overflow-hidden cursor-pointer"
    >
      {/* Wishlist Heart Icon (Plain icon, top-right) */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3.5 right-3.5 z-20 transition-all hover:scale-110 active:scale-90"
      >
        <Heart
          size={16}
          className={`${
            isInWishlist
              ? 'fill-red-500 stroke-red-500 text-red-500'
              : 'text-slate-350 hover:text-red-500'
          } transition-colors`}
        />
      </button>

      {/* Image Container with more rounded corners */}
      <div className="relative flex h-[155px] w-full items-center justify-center bg-slate-50/50 rounded-[12px] p-4 mb-3.5 overflow-hidden border border-slate-100/50">
        <img
          src={image || 'https://placehold.co/300x300?text=Medicine'}
          alt={name}
          className="h-full w-full object-contain mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x300?text=No+Image';
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-1">
          {/* Brand Name */}
          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {brand || 'Generic'}
          </p>
          
          {/* Product Name with negative tracking */}
          <h3 className="line-clamp-2 text-xs font-semibold leading-normal text-slate-800 group-hover:text-[#00a2a4] tracking-tight transition-colors min-h-[36px]">
            {cleanName}
          </h3>
        </div>

        {/* Pricing & Button Area */}
        <div className="mt-4 space-y-3.5">
          {/* Price Row (Space between layout, quiet text status) */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-[13px] font-bold text-slate-800">₹{finalPrice}</span>
              {hasDiscount && (
                <span className="text-[10px] text-slate-400 line-through">₹{mrp}</span>
              )}
            </div>
            
            <div className="text-[11px] font-bold">
              {isOutOfStock ? (
                <span className="text-red-500/90">Out of Stock</span>
              ) : hasDiscount ? (
                <span className="text-[#00a2a4]">{discountPercent}% off</span>
              ) : rating && rating > 0 ? (
                <span className="text-slate-400 flex items-center gap-0.5"><Star size={10} fill="#ffc107" className="text-[#ffc107] stroke-none" /> {rating}</span>
              ) : (
                <span className="text-slate-400">New</span>
              )}
            </div>
          </div>

          {/* Add to Bag Button (Pill outline style) */}
          {isOutOfStock ? (
            <button
              onClick={handleSubscribe}
              disabled={subscribing || isSubscribed}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-full border border-slate-200 text-[11px] font-bold text-slate-450 bg-slate-50/50 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              {subscribing ? (
                <Loader2 size={12} className="animate-spin" />
              ) : isSubscribed ? (
                <CheckCircle2 size={12} className="text-emerald-600" />
              ) : (
                <Bell size={12} />
              )}
              <span>{isSubscribed ? 'Notified' : 'Notify Me'}</span>
            </button>
          ) : (
            <button
              onClick={handleAdd}
              disabled={addingToCart}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-full border border-slate-200 bg-transparent text-[11px] font-bold text-slate-700 hover:border-slate-800 hover:text-slate-900 transition-all cursor-pointer active:scale-98"
            >
              {addingToCart ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                'Add to Bag'
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
