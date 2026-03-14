import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Loader2, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'; // Added for better UI

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, saveStatus } = useCart();
  const navigate = useNavigate();

  // --- Dynamic Pricing Logic ---
  const subtotal = getCartTotal ? getCartTotal() : 0;
  const discount = subtotal > 500 ? 100 : 0;
  const deliveryFee = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const totalAmount = subtotal + deliveryFee - discount;

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, []);

  // --- Empty State UI ---
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center pt-28 px-4">
        <div className="bg-white p-12 shadow-xl rounded-[40px] text-center border border-gray-100 max-w-md w-full">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <ShoppingBag className="text-gray-300" size={48} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Your Hub Cart is Empty</h2>
          <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase tracking-[3px]">Secure medical supplies for your inventory</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-10 w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-100 hover:bg-black transition-all transform active:scale-95"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 pt-32">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT: ITEM LIST */}
        <div className="flex-1 flex flex-col gap-6"> 
          <div className="bg-white shadow-sm border border-gray-100 rounded-[35px] overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
               <div className="flex flex-col">
                 <h2 className="font-black uppercase italic tracking-tighter text-lg text-gray-900">Medical Hub Inventory ({cartItems.length})</h2>
                 {/* SAVING INDICATOR */}
                 <div className="h-4">
                    {saveStatus === 'saving' && (
                      <span className="text-[9px] font-bold text-blue-500 animate-pulse uppercase tracking-widest flex items-center gap-1">
                        <Loader2 size={10} className="animate-spin" /> Syncing with Hub...
                      </span>
                    )}
                    {saveStatus === 'saved' && (
                      <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">
                        ✅ Hub Inventory Secured
                      </span>
                    )}
                 </div>
               </div>
               <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Verified Hub</span>
            </div>
            
            <div className="flex flex-col divide-y divide-gray-50">
              {cartItems.map((item) => (
                <div key={item._id} className="p-8 flex flex-col md:flex-row gap-8 hover:bg-gray-50/30 transition-colors group">
                  {/* Image Container */}
                  <div 
                    className="w-32 h-32 bg-gray-50 rounded-[25px] flex-shrink-0 cursor-pointer overflow-hidden p-4" 
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>

                  {/* Details Container */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 
                        className="font-black text-gray-900 text-xl uppercase italic tracking-tighter leading-none cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => navigate(`/product/${item._id}`)}
                      >
                        {item.name}
                      </h3>
                      <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-2">Manufacturer: {item.brand}</p>
                    </div>

                    <div className="flex items-center gap-6 mt-6 md:mt-0">
                      <div className="flex items-center bg-gray-100 rounded-xl p-1">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)} 
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg font-black shadow-sm disabled:opacity-30" 
                          disabled={item.quantity <= 1}
                        > <Minus size={14} /> </button>
                        <span className="px-5 font-black text-sm text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg font-black shadow-sm"
                        > <Plus size={14} /> </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item._id)} 
                        className="flex items-center gap-1 text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={12} /> Remove From Hub
                      </button>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="text-right flex flex-col justify-between">
                    <p className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none">₹{item.price * item.quantity}</p>
                    <div className="bg-green-50 px-3 py-1 rounded-lg">
                       <p className="text-[8px] text-green-600 font-black uppercase tracking-widest text-center">In Stock: Amritsar</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="p-6 flex justify-between items-center bg-white border border-gray-100 shadow-xl rounded-[30px]">
            <button 
              onClick={() => navigate('/')} 
              className="text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-black transition-colors px-4"
            >
              ← Continue Shopping
            </button>
            <button 
              onClick={() => navigate('/checkout')} 
              className="bg-[#fb641b] text-white px-12 py-5 rounded-[20px] font-black uppercase text-xs tracking-[2px] shadow-2xl shadow-orange-100 hover:translate-y-[-2px] active:translate-y-0 transition-all"
            >
              Confirm Logistics & Checkout
            </button>
          </div>
        </div>

        {/* RIGHT: PRICE SUMMARY */}
        <div className="w-full lg:w-[400px] h-fit sticky top-32">
          <div className="bg-white border border-gray-100 shadow-2xl p-8 rounded-[40px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 blur-3xl opacity-50 -mr-16 -mt-16 rounded-full"></div>
            
            <h3 className="font-black text-gray-400 uppercase text-[10px] border-b border-gray-50 pb-4 mb-6 tracking-[3px]">Financial Assessment</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between text-gray-600 font-bold italic tracking-tighter">
                <span className="text-xs uppercase">Gross Value ({cartItems.length} items)</span>
                <span className="text-gray-900">₹{subtotal}</span>
              </div>
              
              <div className="flex justify-between text-green-500 font-black italic tracking-tighter">
                <span className="text-xs uppercase">Hub Subsidy</span>
                <span>-₹{discount}</span>
              </div>
              
              <div className="flex justify-between text-gray-600 font-bold italic tracking-tighter">
                <span className="text-xs uppercase">Logistic Charges</span>
                <span className={deliveryFee === 0 ? "text-green-500 font-black uppercase" : "text-gray-900"}>
                  {deliveryFee === 0 ? "Gratis" : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-6">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Net Payable</span>
                  <span className="text-4xl font-black text-blue-600 italic tracking-tighter">₹{totalAmount}</span>
                </div>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 mt-6">
                 <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest text-center leading-relaxed">
                   You are saving ₹{discount} on this hub transaction
                 </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-start gap-4 px-4">
            <div className="w-8 h-8 bg-white shadow-sm border border-gray-100 rounded-lg flex items-center justify-center text-lg">🛡️</div>
            <p className="text-[9px] font-black uppercase text-gray-400 leading-normal tracking-tight">
              Safe & Secure Terminal. Sourced from Certified Amritsar Medical Hub. Verified Authenticity Guaranteed.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;