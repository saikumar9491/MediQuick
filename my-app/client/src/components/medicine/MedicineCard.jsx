import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Star, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/apiConfig';

const MedicineCard = ({ _id, name, price, brand, needsPrescription, category, image, isFlashDeal, discountPrice }) => {
  const navigate = useNavigate();
  const { addToCart, showNotification } = useCart();
  const { user, token, setUser } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (user?.wishlist) {
      const found = user.wishlist.some(
        (item) => (item._id ? item._id.toString() : item.toString()) === _id.toString()
      );
      setIsWishlisted(found);
    }
  }, [user?.wishlist, _id]);

  const activePrice = isFlashDeal && discountPrice ? discountPrice : (price || 0);
  const safePrice = price || 0;
  const mrp = Math.round(safePrice * 1.33);
  const discount = isFlashDeal && discountPrice 
    ? Math.round(((safePrice - discountPrice) / safePrice) * 100)
    : (mrp > 0 ? Math.round(((mrp - safePrice) / mrp) * 100) : 0);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!user || !token) {
      if (showNotification) showNotification("Please login to wishlist items", "error");
      return;
    }

    const isRemoving = isWishlisted;
    setIsWishlisted(!isRemoving);

    try {
      const endpoint = isRemoving ? '/api/users/wishlist/remove' : '/api/users/wishlist/add';
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: _id }),
      });

      if (res.ok) {
        let updatedWishlist;
        if (isRemoving) {
          updatedWishlist = user.wishlist.filter(
            (item) => (item._id ? item._id.toString() : item.toString()) !== _id.toString()
          );
          if (showNotification) showNotification("Removed from wishlist", "error");
        } else {
          updatedWishlist = [...user.wishlist, { _id, name, price: safePrice, brand, category, image }];
          if (showNotification) showNotification("Added to wishlist!");
        }
        setUser({ ...user, wishlist: updatedWishlist });
      } else {
        setIsWishlisted(isRemoving);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      setIsWishlisted(isRemoving);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ _id, name, price: activePrice, brand, category, image });
    if (showNotification) showNotification(`${name} added to cart!`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${_id}`)}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
    >
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {discount > 0 && (
          <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-sm ${isFlashDeal ? 'bg-orange-500' : 'bg-blue-600'}`}>
            {isFlashDeal && <span className="animate-pulse text-xs">⚡</span>}
            {discount}% OFF
          </div>
        )}
        {needsPrescription && (
          <div className="rounded-full bg-slate-100/90 backdrop-blur-sm px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-600 border border-slate-200">
            Rx Required
          </div>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-slate-50 transition-all duration-300 hover:scale-110 active:scale-90 ${
          isWishlisted ? 'text-red-500' : 'text-slate-300 hover:text-red-400'
        }`}
      >
        <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 flex items-center justify-center p-6">
        <motion.img
          animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? -2 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          src={image || `https://placehold.co/400x400/f3f4f6/3b82f6?text=${name}`}
          alt={name}
          className="h-full w-full object-contain"
        />
        
        {/* Quick Add Button (Desktop Only) */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={handleAddToCart}
              className="absolute bottom-4 hidden md:flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-xl hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Quick Add
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Content Section */}
      <div className="flex flex-grow flex-col p-4 sm:p-5">
        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-blue-600/80">
          {brand || "Health Essentials"}
        </div>
        
        <h3 className="line-clamp-2 h-10 text-sm sm:text-base font-semibold leading-tight text-slate-800 transition-colors group-hover:text-blue-600">
          {name}
        </h3>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 rounded bg-amber-50 px-1.5 py-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-700">4.4</span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">(1,240)</span>
        </div>

        {/* Pricing */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                ₹{activePrice}
              </span>
              {(isFlashDeal || mrp > activePrice) && (
                <span className="text-xs font-medium text-slate-400 line-through">
                  ₹{isFlashDeal ? safePrice : mrp}
                </span>
              )}
            </div>
            <p className="text-[10px] font-medium text-green-600">Free Shipping</p>
          </div>

          {/* Mobile Add Button */}
          <button
            onClick={handleAddToCart}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md active:scale-95 transition-all hover:bg-blue-600"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop Detailed Button */}
        <button
          onClick={handleAddToCart}
          className="mt-5 hidden md:flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-xs font-bold text-slate-900 border border-slate-200 transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-[0.98]"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Bag
        </button>
      </div>
    </motion.div>
  );
};

export default MedicineCard;