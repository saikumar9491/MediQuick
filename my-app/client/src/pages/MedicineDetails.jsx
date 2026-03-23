import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import MedicineCard from '../components/medicine/MedicineCard';

const MedicineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, setUser, loading: authLoading } = useAuth();
  const { addToCart, showNotification } = useCart();

  const [medicine, setMedicine] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);

        const res = await fetch(`${API_BASE}/api/medicines/${id}`);
        if (!res.ok) throw new Error('Medicine not found');
        const data = await res.json();
        setMedicine(data);

        if (user?.wishlist) {
          setIsWishlisted(
            user.wishlist.some(
              (item) =>
                (item._id ? item._id.toString() : item.toString()) === id.toString()
            )
          );
        }

        const relRes = await fetch(`${API_BASE}/api/medicines/related/${id}`);
        if (relRes.ok) {
          const relData = await relRes.json();
          setRelated(Array.isArray(relData) ? relData : []);
        }
      } catch (err) {
        console.error('Hub data sync failed:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchProductData();
  }, [id, authLoading, user?.wishlist, API_BASE]);

  const toggleWishlist = async () => {
    if (!user) {
      if (showNotification) showNotification('Please Login First!', 'error');
      navigate('/login');
      return;
    }

    const isRemoving = isWishlisted;
    const endpoint = isRemoving
      ? '/api/users/wishlist/remove'
      : '/api/users/wishlist/add';

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      if (res.ok) {
        let updatedWishlist;
        if (isRemoving) {
          updatedWishlist = user.wishlist.filter(
            (item) =>
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
      console.error('Wishlist sync error:', err);
    }
  };

  const handleAddToCartClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    addToCart(medicine);
    if (showNotification) {
      showNotification('Added to cart!');
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (medicine) {
      navigate('/checkout', {
        state: { isDirectBuy: true, directItem: { ...medicine, quantity: 1 } },
      });
    }
  };

  const ActionButtons = () => (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button
        onClick={handleAddToCartClick}
        className="flex-1 bg-[#ff9f00] text-white py-3.5 sm:py-4 font-black uppercase text-xs sm:text-sm shadow-lg hover:bg-[#f39700] transition-colors flex items-center justify-center gap-2 rounded-lg"
      >
        🛒 Add to Cart
      </button>

      <button
        onClick={handleBuyNow}
        className="flex-1 bg-[#fb641b] text-white py-3.5 sm:py-4 font-black uppercase text-xs sm:text-sm shadow-lg hover:bg-[#f05a18] transition-colors flex items-center justify-center gap-2 rounded-lg"
      >
        ⚡ Buy Now
      </button>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        <div className="mb-4 text-4xl sm:text-5xl animate-spin">💊</div>
        <p className="text-xs sm:text-sm font-black text-gray-400 uppercase tracking-widest italic">
          Syncing with Amritsar Hub...
        </p>
      </div>
    );

  if (!medicine)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-xl sm:text-2xl font-black uppercase italic text-gray-400">
          Medicine Not Found
        </h1>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-sm sm:text-base text-blue-600 font-bold uppercase underline"
        >
          Return to Shop
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-12 sm:pb-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-3 py-4 sm:px-4 md:px-6 lg:px-8 lg:py-10">
        <div className="bg-white shadow-sm rounded-xl md:rounded-sm flex flex-col lg:flex-row gap-6 lg:gap-8 p-4 sm:p-5 md:p-8 lg:p-10 overflow-hidden">
          <div className="w-full lg:w-[45%] flex flex-col gap-4 lg:sticky lg:top-24 lg:h-fit">
            <div className="relative overflow-hidden border border-gray-100 bg-[#fdfdfd] flex items-center justify-center p-6 sm:p-8 md:p-10 h-[280px] sm:h-[360px] md:h-[450px] lg:h-[550px] group rounded-xl md:rounded-sm">
              <img
                src={medicine.image || 'https://placehold.co/600x600?text=Medicine'}
                alt={medicine.name}
                className="max-h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
              />

              <button
                onClick={toggleWishlist}
                className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 transition-all hover:scale-110 active:scale-95 ${
                  isWishlisted ? 'text-red-500' : 'text-gray-300'
                }`}
              >
                <span className="text-xl sm:text-2xl">
                  {isWishlisted ? '❤️' : '🤍'}
                </span>
              </button>

              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 rounded-full bg-green-600 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase text-white shadow-md animate-pulse">
                25% Off
              </div>
            </div>

            <div className="hidden lg:flex">
              <ActionButtons />
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <nav className="text-[9px] sm:text-[10px] md:text-[11px] text-gray-400 mb-2 font-black uppercase tracking-[0.15em] sm:tracking-widest break-words">
              Home {'>'} {medicine.category || 'Pharmacy'} {'>'} {medicine.brand}
            </nav>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3 uppercase italic tracking-tighter leading-tight">
              {medicine.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
              <span className="bg-green-700 text-white text-[10px] sm:text-[12px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                4.4 ★
              </span>
              <span className="text-gray-400 text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-wide sm:tracking-widest">
                1,240 Ratings & 158 Reviews
              </span>
              <span className="text-blue-600 font-black italic text-[9px] sm:text-[10px] bg-blue-50 px-2 sm:px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1 uppercase">
                MediQuick Verified <span className="text-yellow-500">✔</span>
              </span>
            </div>

            <div className="flex flex-wrap items-end gap-2 sm:gap-4 mb-2">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
                ₹{medicine.price}
              </span>
              <span className="text-gray-400 line-through text-base sm:text-lg">
                ₹{Math.round(medicine.price * 1.33)}
              </span>
              <span className="text-green-600 font-black text-[10px] sm:text-xs md:text-sm uppercase italic tracking-wide sm:tracking-widest">
                Special Offer Applied
              </span>
            </div>

            <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[1.5px] sm:tracking-[2px] mb-6 sm:mb-8">
              Inclusive of all taxes
            </p>

            <div className="bg-gray-50 border border-dashed border-gray-300 p-4 sm:p-5 rounded-xl md:rounded-sm mb-8 sm:mb-10">
              <h3 className="font-black text-[10px] sm:text-[11px] text-gray-800 uppercase mb-4 tracking-[1.5px] sm:tracking-[2px] border-b border-gray-200 pb-2">
                Available Offers
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-green-600 font-bold">🏷️</span>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-gray-900">Bank Offer</span> 10%
                    instant discount on HDFC Bank Credit Cards.{' '}
                    <span className="text-blue-600 font-bold cursor-pointer underline">
                      T&C
                    </span>
                  </p>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <span className="text-green-600 font-bold">🏷️</span>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-gray-900">Amritsar Exclusive</span>{' '}
                    Get free express delivery within 2 hours for orders above ₹499.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 sm:pt-8">
              <h3 className="font-black uppercase text-[10px] sm:text-xs text-gray-400 mb-4 tracking-[2px] sm:tracking-[3px] border-b-2 border-blue-600 w-fit pb-1">
                Product Description
              </h3>
              <p className="text-gray-700 text-sm sm:text-[15px] italic font-medium leading-relaxed">
                {medicine.description ||
                  'Source: Verified Amritsar Hub. Guaranteed quality and strictly monitored temperature-controlled storage.'}
              </p>
            </div>

            <div className="mt-6 lg:hidden">
              <ActionButtons />
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 lg:mt-16 bg-white p-4 sm:p-6 shadow-sm border border-gray-100 rounded-xl md:rounded-none">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 lg:mb-10 border-b border-gray-100 pb-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 uppercase italic tracking-tighter border-l-4 border-blue-600 pl-3 sm:pl-4">
              Similar Products You Might Like
            </h2>
            <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline decoration-2 self-start sm:self-auto">
              View All Category
            </button>
          </div>

          {related.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
              {related.map((item) => (
                <MedicineCard key={item._id} {...item} />
              ))}
            </div>
          ) : (
            <div className="py-14 sm:py-20 text-center flex flex-col items-center border border-dashed border-gray-100 rounded-lg">
              <span className="text-4xl grayscale mb-2">📦</span>
              <p className="text-gray-400 font-black uppercase italic text-xs sm:text-sm tracking-wide sm:tracking-widest">
                No similar items currently in stock at the Hub.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineDetails;