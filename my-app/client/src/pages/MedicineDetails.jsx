import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import MedicineCard from '../components/medicine/MedicineCard';

const MedicineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, setUser, loading: authLoading } = useAuth(); // Added token & setUser
  const { addToCart, showNotification } = useCart();

  const [medicine, setMedicine] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // FIX 1: Use dynamic API_BASE for Render Deployment
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);

        // Fetch Medicine Details
        const res = await fetch(`${API_BASE}/api/medicines/${id}`);
        if (!res.ok) throw new Error("Medicine not found");
        const data = await res.json();
        setMedicine(data);

        // SYNC WISHLIST STATE WITH CLOUD
        if (user?.wishlist) {
          setIsWishlisted(user.wishlist.some(item => 
            (item._id ? item._id.toString() : item.toString()) === id.toString()
          ));
        }

        // Fetch Related Products
        const relRes = await fetch(`${API_BASE}/api/medicines/related/${id}`);
        if (relRes.ok) {
          const relData = await relRes.json();
          setRelated(Array.isArray(relData) ? relData : []);
        }
      } catch (err) {
        console.error("Hub data sync failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchProductData();
  }, [id, authLoading, user?.wishlist, API_BASE]);

  // FIX 2: Cloud-Synced Wishlist Logic
  const toggleWishlist = async () => {
    if (!user) {
      if (showNotification) showNotification("Please Login First!", "error");
      return;
    }

    const isRemoving = isWishlisted;
    const endpoint = isRemoving ? '/api/users/wishlist/remove' : '/api/users/wishlist/add';

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: id }),
      });

      if (res.ok) {
        let updatedWishlist;
        if (isRemoving) {
          updatedWishlist = user.wishlist.filter(item => 
            (item._id ? item._id.toString() : item.toString()) !== id.toString()
          );
          setIsWishlisted(false);
        } else {
          updatedWishlist = [...user.wishlist, medicine];
          setIsWishlisted(true);
        }
        setUser({ ...user, wishlist: updatedWishlist });
      }
    } catch (err) {
      console.error("Wishlist sync error:", err);
    }
  };

  const handleBuyNow = () => {
    if (medicine) {
      navigate('/checkout', { 
        state: { isDirectBuy: true, directItem: { ...medicine, quantity: 1 } } 
      }); 
    }
  };

  // --- UI REMAINS THE SAME ---
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="animate-spin text-5xl mb-4">💊</div>
      <p className="font-black text-gray-400 uppercase tracking-widest italic">Syncing with Amritsar Hub...</p>
    </div>
  );

  if (!medicine) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-20 text-center">
      <h1 className="text-2xl font-black uppercase italic text-gray-400">Medicine Not Found</h1>
      <button onClick={() => navigate('/')} className="mt-4 text-blue-600 font-bold uppercase underline">Return to Shop</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-20">
      <div className="max-w-7xl mx-auto p-2 md:p-6 lg:p-10">
        <div className="bg-white shadow-sm flex flex-col md:flex-row gap-8 p-4 md:p-10 rounded-sm">
          <div className="w-full md:w-[45%] flex flex-col gap-4 sticky top-24 h-fit">
            <div className="border border-gray-100 flex items-center justify-center p-12 h-[450px] md:h-[550px] bg-[#fdfdfd] relative overflow-hidden group">
              <img src={medicine.image || 'https://placehold.co/600x600?text=Medicine'} alt={medicine.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-700" />
              <button onClick={toggleWishlist} className={`absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 transition-all z-10 hover:scale-110 active:scale-95 ${isWishlisted ? 'text-red-500' : 'text-gray-300'}`}>
                <span className="text-2xl">{isWishlisted ? '❤️' : '🤍'}</span>
              </button>
              <div className="absolute top-4 left-4 bg-green-600 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse uppercase shadow-md">25% Off</div>
            </div>
            <div className="flex gap-3 w-full">
              <button onClick={() => { addToCart(medicine); alert("Added to cart!"); }} className="flex-1 bg-[#ff9f00] text-white py-4 font-black uppercase text-sm shadow-lg hover:bg-[#f39700] transition-colors flex items-center justify-center gap-2">🛒 ADD TO CART</button>
              <button onClick={handleBuyNow} className="flex-1 bg-[#fb641b] text-white py-4 font-black uppercase text-sm shadow-lg hover:bg-[#f05a18] transition-colors flex items-center justify-center gap-2">⚡ BUY NOW</button>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <nav className="text-[11px] text-gray-400 mb-2 font-black uppercase tracking-widest">Home {'>'} {medicine.category || 'Pharmacy'} {'>'} {medicine.brand}</nav>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter leading-none">{medicine.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-green-700 text-white text-[12px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">4.4 ★</span>
              <span className="text-gray-400 text-[11px] font-black uppercase tracking-widest">1,240 Ratings & 158 Reviews</span>
              <span className="ml-auto text-blue-600 font-black italic text-[10px] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1 uppercase">MediQuick Verified <span className="text-yellow-500">✔</span></span>
            </div>
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-5xl font-black text-gray-900 tracking-tighter">₹{medicine.price}</span>
              <span className="text-gray-400 line-through text-lg">₹{Math.round(medicine.price * 1.33)}</span>
              <span className="text-green-600 font-black text-sm uppercase italic tracking-widest animate-bounce">Special Offer Applied</span>
            </div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[2px] mb-8">Inclusive of all taxes</p>
            <div className="bg-gray-50 border border-dashed border-gray-300 p-5 rounded-sm mb-10">
              <h3 className="font-black text-[11px] text-gray-800 uppercase mb-4 tracking-[2px] border-b border-gray-200 pb-2">Available Offers</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm"><span className="text-green-600 font-bold">🏷️</span><p className="text-gray-600 text-xs"><span className="font-bold text-gray-900">Bank Offer</span> 10% instant discount on HDFC Bank Credit Cards. <span className="text-blue-600 font-bold cursor-pointer underline">T&C</span></p></div>
                <div className="flex items-start gap-3 text-sm"><span className="text-green-600 font-bold">🏷️</span><p className="text-gray-600 text-xs"><span className="font-bold text-gray-900">Amritsar Exclusive</span> Get free express delivery within 2 hours for orders above ₹499.</p></div>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-8">
              <h3 className="font-black uppercase text-xs text-gray-400 mb-4 tracking-[3px] border-b-2 border-blue-600 w-fit pb-1">Product Description</h3>
              <p className="text-gray-700 text-sm italic font-medium leading-relaxed">{medicine.description || "Source: Verified Amritsar Hub. Guaranteed quality and strictly monitored temperature-controlled storage."}</p>
            </div>
          </div>
        </div>
        <div className="mt-16 bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter border-l-4 border-blue-600 pl-4">Similar Products You Might Like</h2>
            <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline decoration-2">View All Category</button>
          </div>
          {related.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {related.map(item => (<MedicineCard key={item._id} {...item} />))}
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center border border-dashed border-gray-100">
              <span className="text-4xl grayscale mb-2">📦</span>
              <p className="text-gray-400 font-black uppercase italic text-sm tracking-widest">No similar items currently in stock at the Hub.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineDetails;