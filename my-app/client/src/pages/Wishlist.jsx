import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  // 1. Destructure 'loading' to prevent premature "Empty" state
  const { user, token, setUser, loading } = useAuth(); 
  const { addToCart, showNotification } = useCart();
  const navigate = useNavigate();

  const wishlist = user?.wishlist || [];

  // 2. Remove item logic
  const removeFromWishlist = async (id) => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/users/wishlist/remove`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: id }),
      });

      if (res.ok) {
        const updatedWishlist = wishlist.filter(item => item._id !== id);
        setUser({ ...user, wishlist: updatedWishlist });
        if (showNotification) showNotification("Removed from wishlist", "error");
      }
    } catch (err) {
      console.error("Wishlist remove failed:", err);
    }
  };

  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id); 
  };

  // --- NEW: THE GLOBAL LOADING SHIELD ---
  // If AuthContext is still fetching fresh profile data, don't show "Empty" yet
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Wishlist...</p>
        </div>
      </div>
    );
  }

  // --- Empty State UI ---
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex flex-col items-center justify-center pt-20">
        <div className="bg-white p-12 shadow-sm text-center rounded-sm max-w-2xl w-full border border-gray-200">
          <img 
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_39f7a5.png" 
            className="w-48 mx-auto mb-6 opacity-80" 
            alt="Empty Wishlist" 
          />
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-800">Your Wishlist is Empty!</h2>
          <p className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-tight">Add items that you like to your wishlist to review them later.</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-8 bg-[#2874f0] text-white px-12 py-3 font-black uppercase text-sm shadow-xl hover:bg-blue-700 transition-all active:scale-95"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-20 pt-24">
      <div className="max-w-[1000px] mx-auto px-4">
        <div className="bg-white shadow-sm border border-gray-200 rounded-sm">
          
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-black uppercase italic tracking-tighter">
              My Wishlist ({wishlist.length})
            </h2>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Cloud Hub Secured</span>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-gray-100">
            {wishlist.map((item) => (
              <div key={item._id} className="p-6 flex flex-col md:flex-row gap-6 items-center hover:bg-gray-50/50 transition-colors group">
                
                <div 
                  className="w-20 h-20 flex-shrink-0 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 
                    className="font-black text-gray-800 text-md uppercase italic tracking-tighter hover:text-blue-600 cursor-pointer"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                    <span className="bg-green-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      4.4 ★
                    </span>
                    <span className="text-gray-400 text-[10px] font-bold">(1,240)</span>
                  </div>
                  <div className="mt-3 flex items-center justify-center md:justify-start gap-3 font-black">
                    <span className="text-xl text-gray-900 tracking-tighter italic">₹{item.price}</span>
                    <span className="text-gray-400 line-through text-xs italic opacity-50">₹{Math.round(item.price * 1.33)}</span>
                    <span className="text-green-600 text-[10px] uppercase italic">25% off</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-48">
                  <button 
                    onClick={() => moveToCart(item)}
                    className="bg-[#fb641b] text-white py-3 font-black uppercase text-[10px] shadow-md hover:bg-[#f05a18] transition-all active:scale-95"
                  >
                    Move to Cart
                  </button>
                  <button 
                    onClick={() => removeFromWishlist(item._id)}
                    className="text-gray-400 py-2 font-black uppercase text-[9px] hover:text-red-500 flex items-center justify-center gap-1 border border-transparent hover:border-red-100 rounded-sm transition-all"
                  >
                    🗑 Remove from List
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;