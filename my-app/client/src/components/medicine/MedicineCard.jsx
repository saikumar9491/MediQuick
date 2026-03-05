import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

/**
 * @description MedicineCard Component
 * Fixed: Added Wishlist Toggle logic with stopPropagation to prevent accidental navigation.
 */
const MedicineCard = ({ _id, name, price, brand, needsPrescription, category, image }) => {
  const navigate = useNavigate();
  const { addToCart, showNotification } = useCart();
  
  // --- 1. WISHLIST STATE SYNC ---
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    // Check if this specific MongoDB _id is in the saved list
    setIsWishlisted(savedWishlist.some(item => item._id === _id));
  }, [_id]);

  /**
   * Pricing Logic:
   * Prevents "NaN" errors by ensuring price is at least 0.
   */
  const safePrice = price || 0;
  const mrp = Math.round(safePrice * 1.33); // Updated to 33% markup to match your 25% off display
  const discount = mrp > 0 ? Math.round(((mrp - safePrice) / mrp) * 100) : 0;

  // --- 2. TOGGLE WISHLIST (STOPS NAVIGATION) ---
  const toggleWishlist = (e) => {
    e.stopPropagation(); // CRITICAL: Stops the card from navigating to Product Details
    
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
    e.stopPropagation(); // Prevents card's onClick navigation
    addToCart({ _id, name, price: safePrice, brand, category, image });
  };

  return (
    <div 
      onClick={() => navigate(`/product/${_id}`)}
      className="bg-white group cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full rounded-sm overflow-hidden relative"
    >
      {/* 1. Image Section */}
      <div className="relative p-4 bg-white flex items-center justify-center h-52">
        <img 
          src={image || `https://placehold.co/400x400/f3f4f6/3b82f6?text=${name || 'Medicine'}`} 
          alt={name}
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Heart Icon Button - Fixed logic */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 transition-all text-xl z-20 hover:scale-125 active:scale-90 ${
            isWishlisted ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
          }`}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      {/* 2. Product Details */}
      <div className="p-4 flex flex-col flex-grow border-t border-gray-50">
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 h-10 group-hover:text-blue-600 uppercase italic tracking-tighter leading-none">
          {name || "Unnamed Medicine"}
        </h3>
        
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-green-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
            4.4 ★
          </span>
          <span className="text-gray-400 text-[10px] font-bold">(1,240)</span>
          
          <span className="ml-auto text-[9px] font-black italic text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 uppercase">
            Hub Verified <span className="text-yellow-500">✔</span>
          </span>
        </div>

        {/* 3. Pricing Section */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-lg font-black text-gray-900 tracking-tighter">₹{safePrice}</span>
          {mrp > safePrice && (
            <>
              <span className="text-xs text-gray-400 line-through">₹{mrp}</span>
              <span className="text-xs font-black text-green-600 italic uppercase">Save {discount}%</span>
            </>
          )}
        </div>

        <p className="text-[9px] font-black text-gray-400 mt-1 uppercase tracking-widest leading-none">
          {brand || "Generic"} • {category}
        </p>

        {needsPrescription && (
          <p className="text-[9px] font-black text-red-500 mt-2 uppercase flex items-center gap-1">
            <span className="text-xs">📋</span> Prescription Required
          </p>
        )}

        {/* 4. Action Button */}
        <button 
          onClick={handleAddToCart}
          className="mt-4 w-full bg-[#2874f0] text-white py-2.5 rounded-sm font-black text-[10px] uppercase hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;