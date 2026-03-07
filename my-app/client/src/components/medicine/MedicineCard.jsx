import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const MedicineCard = ({ _id, name, price, brand, needsPrescription, category, image }) => {
  const navigate = useNavigate();
  const { addToCart, showNotification } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(savedWishlist.some(item => item._id === _id));
  }, [_id]);

  const safePrice = price || 0;
  const mrp = Math.round(safePrice * 1.33); 
  const discount = mrp > 0 ? Math.round(((mrp - safePrice) / mrp) * 100) : 0;

  // --- KEPT ORIGINAL LOGIC ---
  const toggleWishlist = (e) => {
    e.stopPropagation(); 
    let savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (isWishlisted) {
      savedWishlist = savedWishlist.filter(item => item._id !== _id);
      setIsWishlisted(false);
      if (showNotification) showNotification("Removed from Wishlist", "error");
    } else {
      const product = { _id, name, price: safePrice, brand, category, image };
      savedWishlist.push(product);
      setIsWishlisted(true);
      if (showNotification) showNotification("Added to Wishlist!");
    }
    localStorage.setItem('wishlist', JSON.stringify(savedWishlist));
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); 
    addToCart({ _id, name, price: safePrice, brand, category, image });
  };

  return (
    <div 
      onClick={() => navigate(`/product/${_id}`)}
      className="group bg-white cursor-pointer border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] transition-all duration-500 flex flex-col h-full rounded-2xl overflow-hidden relative border border-transparent hover:border-blue-100"
    >
      {/* 1. Floating Badge System (Unique Feature) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg rotate-[-2deg]">
            {discount}% OFF
          </span>
        )}
        {needsPrescription && (
          <span className="bg-white/90 backdrop-blur-sm text-red-500 border border-red-100 text-[9px] font-black px-2 py-1 rounded-md uppercase">
            Rx Required
          </span>
        )}
      </div>

      {/* 2. Image Section (Glass Background) */}
      <div className="relative p-6 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center h-56 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <img 
          src={image || `https://placehold.co/400x400/f3f4f6/3b82f6?text=${name || 'Medicine'}`} 
          alt={name}
          className="object-contain w-full h-full group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700"
        />
        
        {/* Wishlist Button - Kept logic */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-md transition-all z-20 hover:scale-110 active:scale-90 ${
            isWishlisted ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
          }`}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      {/* 3. Product Details (Clean Typography) */}
      <div className="p-5 flex flex-col flex-grow relative bg-white">
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">
          {brand || "Generic"}
        </p>
        
        <h3 className="text-base font-extrabold text-slate-800 line-clamp-2 h-12 leading-tight group-hover:text-blue-600 transition-colors">
          {name || "Unnamed Medicine"}
        </h3>
        
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
            <span className="text-amber-600 text-[10px] font-black">4.4</span>
            <span className="text-amber-500 text-[10px]">★</span>
          </div>
          <span className="text-slate-400 text-[10px] font-bold">1,240 Verified</span>
        </div>

        {/* 4. Pricing Section (Premium Style) */}
        <div className="mt-5 flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{safePrice}</span>
            {mrp > safePrice && (
              <span className="text-sm text-slate-300 line-through font-bold">₹{mrp}</span>
            )}
          </div>
          <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mt-1">
            Free Delivery on Hub
          </p>
        </div>

        {/* 5. Action Button - Kept logic */}
        <button 
          onClick={handleAddToCart}
          className="mt-6 w-full bg-slate-900 text-white py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-[0.98]"
        >
          Add to Bag — ₹{safePrice}
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;