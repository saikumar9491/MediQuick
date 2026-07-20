import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Plus, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/apiConfig';
import toast from 'react-hot-toast';

const MedicineCard = ({ _id, name, brand, price, image, discountPrice, isFlashDeal, category, rating = 4.3, numReviews = 1240 }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, token, setUser } = useAuth();

  const finalPrice = discountPrice || price;
  const mrp = isFlashDeal ? price : Math.round(price * 1.33);
  const discountPercent = Math.round(((mrp - finalPrice) / mrp) * 100);

  const isInWishlist = user?.wishlist?.some(item => 
    (typeof item === 'string' ? item : item._id) === _id
  );

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart({ _id, name, brand, price: finalPrice, image });
    toast.success('Added to bag');
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to use wishlist');
      return navigate('/login');
    }

    // 🚀 OPTIMISTIC UI UPDATE: Toggle state immediately
    const originalWishlist = [...(user.wishlist || [])];
    let updatedWishlist;
    if (isInWishlist) {
      updatedWishlist = originalWishlist.filter(item => 
        (typeof item === 'string' ? item : item._id) !== _id
      );
    } else {
      updatedWishlist = [...originalWishlist, _id];
    }
    
    // Update local state instantly
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

      if (!res.ok) {
        throw new Error('Sync failed');
      }
    } catch (err) {
      // Revert state if API fails
      setUser({ ...user, wishlist: originalWishlist });
      toast.error('Wishlist sync failed. Reverting...');
    }
  };

  return (
    <>
      {/* ---------------- MOBILE VIEW (Blinkit Style) ---------------- */}
      <motion.div
        onClick={() => navigate(`/product/${_id}`)}
        className="group md:hidden relative flex w-full h-full flex-col bg-white border border-slate-200 rounded-xl overflow-hidden"
      >
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-0 left-0 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg z-10">
            {discountPercent}% OFF
          </div>
        )}

        {/* Image Container */}
        <div className="relative flex h-[110px] w-full items-center justify-center p-2 bg-white">
          <img
            src={image || 'https://placehold.co/300x300?text=Medicine'}
            alt={name}
            className="h-full w-full object-contain mix-blend-multiply"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-2 pb-2">
          {/* Delivery Tag */}
          <div className="flex items-center text-[9px] font-bold text-slate-500 mb-1 bg-slate-50 w-fit px-1 py-0.5 rounded">
            <span className="text-[10px] mr-1">⏱</span> 10 MINS
          </div>

          <h3 className="line-clamp-2 text-[11px] font-bold leading-tight text-slate-800">
            {name}
          </h3>
          <span className="text-[10px] text-slate-400 mt-0.5 mb-2 line-clamp-1">
            {category || brand}
          </span>

          <div className="mt-auto flex items-end justify-between w-full">
            <div className="flex flex-col">
              <span className="text-[14px] font-black text-slate-900 leading-none">₹{finalPrice}</span>
              {mrp > finalPrice && (
                <span className="text-[10px] text-slate-400 line-through leading-none mt-1">₹{mrp}</span>
              )}
            </div>
            
            <button
              onClick={handleAdd}
              className="rounded-md border border-green-600 bg-green-50 px-4 py-1 text-[11px] font-bold text-green-700 active:bg-green-100 transition-colors"
            >
              ADD
            </button>
          </div>
        </div>
      </motion.div>

      {/* ---------------- DESKTOP VIEW (Original Style) ---------------- */}
      <motion.div
        onClick={() => navigate(`/product/${_id}`)}
        className="hidden md:flex group relative w-full h-full flex-col bg-white transition-all duration-300 border border-slate-100 hover:border-black rounded-xl overflow-hidden"
      >
        {/* Wishlist Icon */}
        <button 
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-20 transition-colors bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm md:opacity-0 group-hover:opacity-100 transition-all ${
            isInWishlist ? 'text-red-500 md:opacity-100' : 'text-slate-300 hover:text-red-500'
          }`}
        >
          <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} />
        </button>

        {/* Image Container */}
        <div className="relative flex h-[180px] w-full items-center justify-center bg-white p-4">
          <img
            src={image || 'https://placehold.co/300x300?text=Medicine'}
            alt={name}
            className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Flash Deal Tag */}
          {isFlashDeal && (
            <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg shadow-red-200">
              Flash Deal
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-3 pb-3 pt-1">
          <p className="mb-0.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
            {brand}
          </p>
          <h3 className="mb-1 line-clamp-2 min-h-[30px] text-[12px] font-bold leading-tight text-slate-800 group-hover:text-[#00a2a4] transition-colors">
            {name}
          </h3>
          
          {/* Rating Pill */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5 bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] font-black">
              {rating} <Star size={8} fill="white" stroke="white" />
            </div>
            <span className="text-[10px] text-slate-400 font-bold">({numReviews})</span>
          </div>

          <div className="mt-auto space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[15px] font-black text-slate-900 leading-none">₹{finalPrice}</span>
              <span className="text-[11px] text-slate-400 line-through leading-none mt-0.5">₹{mrp}</span>
              <span className="text-[11px] font-black text-green-600 leading-none mt-0.5">{discountPercent}% off</span>
            </div>
            
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center rounded-lg border-2 border-[#ff6f61]/10 bg-[#ff6f61]/5 py-2 text-[10px] font-black uppercase tracking-widest text-[#ff6f61] transition-all hover:bg-[#ff6f61] hover:text-white hover:border-[#ff6f61] shadow-sm active:scale-95"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MedicineCard;
