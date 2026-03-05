import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useCart } from '../context/CartContext';

const ProductDetail = ({ medicines = [], user, setUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, clearCart } = useCart(); 
  const [pincode, setPincode] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Safely find product by matching String IDs
  const product = medicines.find(m => String(m._id || m.id) === String(id));
  const related = medicines.filter(m => m.category === product?.category && String(m._id || m.id) !== String(id));

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(savedWishlist.some(item => String(item._id || item.id) === String(id)));
  }, [id]);

  const toggleWishlist = () => {
    let savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const productId = product?._id || product?.id;
    
    if (isWishlisted) {
      savedWishlist = savedWishlist.filter(item => String(item._id || item.id) !== String(productId));
      setIsWishlisted(false);
    } else {
      savedWishlist.push(product);
      setIsWishlisted(true);
    }
    localStorage.setItem('wishlist', JSON.stringify(savedWishlist));
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-pulse text-2xl font-black text-blue-600">MediQuick+</div>
        <p className="mt-4 text-gray-500 font-bold">Product not found...</p>
        <button onClick={() => navigate('/')} className="mt-6 bg-[#2874f0] text-white px-8 py-2 font-bold rounded-sm shadow-md">
          Back to Home
        </button>
      </div>
    );
  }

  const mrp = Math.round(product.price * 1.25);
  const discount = Math.round(((mrp - product.price) / mrp) * 100);

 // --- PERMANENT FIX FOR BUY NOW ---
  const handleBuyNow = () => {
    // 1. We DON'T call addToCart here because we want to bypass the cart.
    // 2. We trigger a navigation state that acts as a "Data Lock"
    navigate('/checkout', { 
      state: { 
        directItem: { ...product, quantity: 1 },
        isDirectBuy: true // This flag is crucial for the lock
      } 
    });
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen">
      <Navbar medicines={medicines} user={user} setUser={setUser} />
      
      <main className="max-w-[1200px] mx-auto bg-white shadow-sm mt-4 mb-10">
        <div className="flex flex-col md:flex-row">
          
          {/* LEFT COLUMN: Image & Buttons */}
          <div className="w-full md:w-[40%] p-4 md:sticky md:top-20 h-fit border-r border-gray-100">
            <div className="border border-gray-200 p-4 rounded-sm relative group mb-4 bg-white">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-[400px] object-contain mx-auto transition-transform duration-500 group-hover:scale-105" 
              />
              
              <button 
                onClick={toggleWishlist}
                className={`absolute top-4 right-4 text-xl shadow-md bg-white rounded-full w-10 h-10 flex items-center justify-center border transition-all active:scale-90 ${isWishlisted ? 'text-red-500 border-red-100' : 'text-gray-300 hover:text-red-400'}`}
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => { addToCart(product); alert(`${product.name} added to cart!`); }}
                className="flex-1 bg-[#ff9f00] text-white py-4 rounded-sm font-bold shadow-md hover:bg-[#f39700] transition-colors flex items-center justify-center gap-2 uppercase text-sm"
              >
                🛒 Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-[#fb641b] text-white py-4 rounded-sm font-bold shadow-md hover:bg-[#f05a18] transition-colors flex items-center justify-center gap-2 uppercase text-sm"
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Details */}
          <div className="w-full md:w-[60%] p-6">
            <nav className="text-xs text-gray-500 mb-2 flex gap-2">
              <span onClick={() => navigate('/')} className="hover:text-blue-600 cursor-pointer">Home</span> {">"} 
              <span className="text-gray-900 font-medium">{product.category}</span>
            </nav>

            <h1 className="text-xl md:text-2xl font-medium text-gray-900 mb-1">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">4.4 ★</span>
              <span className="text-gray-500 text-sm font-bold italic tracking-tight">1,420 Ratings & 240 Reviews</span>
              <span className="text-blue-600 font-bold italic text-xs bg-blue-50 px-2 py-1 rounded border border-blue-100">MediQuick Assured ✔</span>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-bold">₹{product.price}</span>
              <span className="text-gray-500 line-through text-lg font-medium">₹{mrp}</span>
              <span className="text-green-600 font-bold text-lg">{discount}% off</span>
            </div>

            {/* Delivery Section */}
            <div className="mt-8 border-y border-gray-100 py-6 flex items-start gap-10">
              <span className="text-gray-500 font-bold text-sm w-20 pt-1">Delivery</span>
              <div className="flex flex-col gap-2">
                <div className="flex border-b-2 border-[#2874f0] w-64 items-center">
                  <span className="text-gray-400 mr-2">📍</span>
                  <input 
                    type="text" 
                    placeholder="Enter Delivery Pincode" 
                    className="outline-none text-sm py-1 w-full font-medium"
                    maxLength="6"
                    onChange={(e) => setPincode(e.target.value)}
                  />
                  <button onClick={() => setIsCheck(true)} className="text-[#2874f0] font-bold text-sm ml-2 hover:bg-blue-50 px-2 py-1 rounded">Check</button>
                </div>
                {isCheck && (
                  <div className="animate-fadeIn">
                    <p className="text-sm text-gray-900 font-bold">Delivery by 11:00 PM Tonight</p>
                    <p className="text-xs text-gray-500 font-medium italic">Verified Express Hub: <span className="text-blue-600">Amritsar</span></p>
                  </div>
                )}
              </div>
            </div>

            {/* Highlights Section */}
            <div className="mt-8 flex items-start gap-10">
              <span className="text-gray-500 font-bold text-sm w-20">Highlights</span>
              <ul className="text-sm list-disc list-inside space-y-2 text-gray-800 font-medium">
                <li>100% Genuine product guaranteed</li>
                <li>Express delivery in Amritsar within 2 hours</li>
                <li>Manufactured by <span className="text-[#2874f0] font-black italic">{product.brand}</span></li>
              </ul>
            </div>

            <div className="mt-8 flex items-start gap-10">
              <span className="text-gray-500 font-bold text-sm w-20">Description</span>
              <div className="text-sm text-gray-700 leading-relaxed max-w-lg font-medium italic">
                <p>All products delivered from our certified hub in Amritsar. Store in a cool, dry place away from children. Consult your physician before use.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="p-6 border-t border-gray-100 bg-[#fafafa]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tighter italic">Similar Products</h2>
            <button className="bg-[#2874f0] text-white px-4 py-1.5 rounded-sm font-bold text-xs uppercase italic">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {related.slice(0, 5).map(item => (
              <div 
                key={item._id || item.id} 
                onClick={() => navigate(`/product/${item._id || item.id}`)}
                className="bg-white cursor-pointer hover:shadow-xl p-4 transition-all border border-gray-100 rounded-sm text-center group"
              >
                <div className="h-32 flex items-center justify-center mb-3">
                  <img src={item.image} alt={item.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                </div>
                <p className="text-xs font-bold text-gray-800 truncate mb-1 uppercase italic tracking-tighter">{item.name}</p>
                <p className="text-green-700 font-bold text-sm italic">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;