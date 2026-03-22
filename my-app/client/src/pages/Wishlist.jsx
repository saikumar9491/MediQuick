import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const { user, token, setUser, loading } = useAuth();
  const { addToCart, showNotification } = useCart();
  const navigate = useNavigate();

  const wishlist = user?.wishlist || [];

  const removeFromWishlist = async (id) => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/users/wishlist/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      if (res.ok) {
        const updatedWishlist = wishlist.filter((item) => item._id !== id);
        setUser({ ...user, wishlist: updatedWishlist });
        if (showNotification) showNotification('Removed from wishlist', 'error');
      }
    } catch (err) {
      console.error('Wishlist remove failed:', err);
    }
  };

  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400">
            Syncing Wishlist...
          </p>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex flex-col items-center justify-center pt-20 sm:pt-24 px-4">
        <div className="bg-white p-6 sm:p-8 md:p-12 shadow-sm text-center rounded-xl sm:rounded-sm max-w-2xl w-full border border-gray-200">
          <img
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_39f7a5.png"
            className="w-32 sm:w-40 md:w-48 mx-auto mb-5 sm:mb-6 opacity-80"
            alt="Empty Wishlist"
          />
          <h2 className="text-lg sm:text-xl font-black uppercase italic tracking-tighter text-gray-800">
            Your Wishlist is Empty!
          </h2>
          <p className="text-gray-400 text-[10px] sm:text-xs font-bold mt-2 uppercase tracking-tight leading-relaxed">
            Add items that you like to your wishlist to review them later.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 sm:mt-8 w-full sm:w-auto bg-[#2874f0] text-white px-8 sm:px-12 py-3 font-black uppercase text-xs sm:text-sm shadow-xl hover:bg-blue-700 transition-all active:scale-95 rounded-lg sm:rounded-sm"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-12 sm:pb-16 lg:pb-20 pt-20 sm:pt-24">
      <div className="max-w-[1000px] mx-auto px-3 sm:px-4">
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl sm:rounded-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h2 className="text-base sm:text-lg font-black uppercase italic tracking-tighter">
              My Wishlist ({wishlist.length})
            </h2>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] sm:text-[10px] font-black text-blue-600 uppercase tracking-widest">
                Cloud Hub Secured
              </span>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-gray-100">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="p-4 sm:p-5 md:p-6 flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-6 items-center hover:bg-gray-50/50 transition-colors group"
              >
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>

                <div className="flex-1 text-center md:text-left min-w-0 w-full">
                  <h3
                    className="font-black text-gray-800 text-sm sm:text-base uppercase italic tracking-tighter hover:text-blue-600 cursor-pointer break-words"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-center md:justify-start gap-2 mt-1 flex-wrap">
                    <span className="bg-green-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      4.4 ★
                    </span>
                    <span className="text-gray-400 text-[10px] font-bold">(1,240)</span>
                  </div>

                  <div className="mt-3 flex items-center justify-center md:justify-start gap-2 sm:gap-3 font-black flex-wrap">
                    <span className="text-lg sm:text-xl text-gray-900 tracking-tighter italic">
                      ₹{item.price}
                    </span>
                    <span className="text-gray-400 line-through text-[11px] sm:text-xs italic opacity-50">
                      ₹{Math.round(item.price * 1.33)}
                    </span>
                    <span className="text-green-600 text-[10px] uppercase italic">
                      25% off
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-48 shrink-0">
                  <button
                    onClick={() => moveToCart(item)}
                    className="bg-[#fb641b] text-white py-3 font-black uppercase text-[10px] shadow-md hover:bg-[#f05a18] transition-all active:scale-95 rounded-lg sm:rounded-sm w-full"
                  >
                    Move to Cart
                  </button>

                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="text-gray-400 py-2 font-black uppercase text-[9px] hover:text-red-500 flex items-center justify-center gap-1 border border-transparent hover:border-red-100 rounded-lg sm:rounded-sm transition-all w-full"
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