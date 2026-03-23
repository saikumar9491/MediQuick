import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const MedicineCard = ({ _id, name, price, brand, needsPrescription, category, image }) => {
  const navigate = useNavigate();
  const { addToCart, showNotification } = useCart();
  const { user, token, setUser } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (user && user.wishlist) {
      const found = user.wishlist.some(
        (item) => (item._id ? item._id.toString() : item.toString()) === _id.toString()
      );
      setIsWishlisted(found);
    } else {
      setIsWishlisted(false);
    }
  }, [user?.wishlist, _id]);

  const safePrice = price || 0;
  const mrp = Math.round(safePrice * 1.33);
  const discount = mrp > 0 ? Math.round(((mrp - safePrice) / mrp) * 100) : 0;

  const toggleWishlist = async (e) => {
    e.stopPropagation();

    if (!user || !token) {
      if (showNotification) showNotification("Please Login First!", "error");
      return;
    }

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const isRemoving = isWishlisted;

    setIsWishlisted(!isRemoving);

    const endpoint = isRemoving ? '/api/users/wishlist/remove' : '/api/users/wishlist/add';

    try {
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
          if (showNotification) showNotification("Removed from Wishlist", "error");
        } else {
          const productSnapshot = { _id, name, price: safePrice, brand, category, image };
          updatedWishlist = [...user.wishlist, productSnapshot];
          if (showNotification) showNotification("Added to Wishlist!");
        }

        setUser({ ...user, wishlist: updatedWishlist });
      } else {
        setIsWishlisted(isRemoving);
        if (showNotification) showNotification("Sync failed. Try again.", "error");
      }
    } catch (err) {
      console.error("Wishlist sync error:", err);
      setIsWishlisted(isRemoving);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ _id, name, price: safePrice, brand, category, image });
  };

  return (
    <div
      onClick={() => navigate(`/product/${_id}`)}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-transparent bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:border-blue-100 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)]"
    >
      <div className="absolute left-2 top-2 sm:left-3 sm:top-3 z-10 flex flex-col gap-1.5 sm:gap-2">
        {discount > 0 && (
          <span className="rounded-lg bg-blue-600 px-2 py-1 text-[9px] sm:text-[10px] font-black text-white shadow-lg rotate-[-2deg]">
            {discount}% OFF
          </span>
        )}

        {needsPrescription && (
          <span className="rounded-md border border-red-100 bg-white/90 px-2 py-1 text-[8px] sm:text-[9px] font-black uppercase text-red-500 backdrop-blur-sm">
            Rx Required
          </span>
        )}
      </div>

      <div className="relative flex h-44 sm:h-52 md:h-56 items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white p-4 sm:p-5 md:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

        <img
          src={image || `https://placehold.co/400x400/f3f4f6/3b82f6?text=${name || 'Medicine'}`}
          alt={name}
          className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
        />

        <button
          onClick={toggleWishlist}
          className="absolute right-2 top-2 sm:right-3 sm:top-3 z-20 rounded-full border border-gray-50 bg-white p-2 sm:p-2.5 shadow-lg transition-all hover:scale-110 active:scale-90"
        >
          {isWishlisted ? (
            <span className="block text-lg sm:text-xl leading-none text-red-500">❤️</span>
          ) : (
            <span className="block text-lg sm:text-xl leading-none text-gray-300 hover:text-red-400">🤍</span>
          )}
        </button>
      </div>

      <div className="relative flex flex-grow flex-col bg-white p-4 sm:p-5">
        <p className="mb-1 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] sm:tracking-[0.2em] text-blue-500">
          {brand || "Generic"}
        </p>

        <h3 className="line-clamp-2 h-11 sm:h-12 text-sm sm:text-base font-extrabold leading-tight text-slate-800 transition-colors group-hover:text-blue-600">
          {name || "Unnamed Medicine"}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5">
            <span className="text-[9px] sm:text-[10px] font-black text-amber-600">4.4</span>
            <span className="text-[9px] sm:text-[10px] text-amber-500">★</span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">1,240 Verified</span>
        </div>

        <div className="mt-4 sm:mt-5 flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900">
              ₹{safePrice}
            </span>
            {mrp > safePrice && (
              <span className="text-xs sm:text-sm font-bold text-slate-300 line-through">
                ₹{mrp}
              </span>
            )}
          </div>

          <p className="mt-1 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.18em] sm:tracking-widest text-green-600">
            Free Delivery on Hub
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          className="hidden sm:block mt-5 sm:mt-6 w-full rounded-xl bg-slate-900 py-3 sm:py-3.5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] sm:tracking-widest text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
        >
          Add to Bag — ₹{safePrice}
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;