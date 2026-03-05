import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { addToCart, showNotification } = useCart();
  const navigate = useNavigate();

  // 1. Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(savedWishlist);
  }, []);

  // 2. Remove item from wishlist
  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(item => item._id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    if (showNotification) showNotification("Removed from wishlist", "error");
  };

  // 3. Move item to cart
  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id); // Remove from wishlist after adding to cart
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex flex-col items-center justify-center pt-20">
        <div className="bg-white p-12 shadow-sm text-center rounded-sm max-w-2xl w-full border border-gray-200">
          <img 
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_39f7a5.png" 
            className="w-48 mx-auto mb-6 opacity-80" 
            alt="Empty Wishlist" 
          />
          <h2 className="text-xl font-black uppercase italic tracking-tighter">Your Wishlist is Empty!</h2>
          <p className="text-gray-400 text-xs font-bold mt-2 uppercase">Add items that you like to your wishlist to review them later.</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-8 bg-[#2874f0] text-white px-12 py-3 font-black uppercase text-sm shadow-xl hover:bg-blue-700 transition-all"
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
          
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-black uppercase italic tracking-tighter">
              My Wishlist ({wishlist.length})
            </h2>
          </div>

          {/* List Section */}
          <div className="flex flex-col divide-y divide-gray-100">
            {wishlist.map((item) => (
              <div key={item._id} className="p-6 flex flex-col md:flex-row gap-6 items-center hover:bg-gray-50/50 transition-colors">
                
                {/* Product Image */}
                <div 
                  className="w-20 h-20 flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>

                {/* Product Info */}
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
                  <div className="mt-3 flex items-center justify-center md:justify-start gap-3">
                    <span className="text-xl font-black text-gray-900 tracking-tighter italic">₹{item.price}</span>
                    <span className="text-gray-400 line-through text-xs font-bold">₹{Math.round(item.price * 1.33)}</span>
                    <span className="text-green-600 text-[10px] font-black uppercase italic">25% off</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 w-full md:w-48">
                  <button 
                    onClick={() => moveToCart(item)}
                    className="bg-[#fb641b] text-white py-3 font-black uppercase text-[10px] shadow-md hover:bg-[#f05a18] transition-all"
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