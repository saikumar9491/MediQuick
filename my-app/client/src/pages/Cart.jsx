import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  MapPin,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, saveStatus } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal ? getCartTotal() : 0;
  const discount = subtotal > 500 ? 100 : 0;
  const deliveryFee = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const totalAmount = subtotal + deliveryFee - discount;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-[3rem] bg-white p-12 text-center shadow-xl border border-slate-100"
        >
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-slate-200">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Your bag is empty</h2>
          <p className="mt-4 text-sm font-medium text-slate-400">
            Looks like you haven't added any medicines yet.
          </p>
          <button
            onClick={() => navigate('/medicines')}
            className="mt-10 w-full rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-blue-600 active:scale-95"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Main Cart Content (Left) */}
          <div className="flex-1 space-y-4">
            
            {/* Header / Pin Code Area */}
            <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                <span className="sm:inline hidden">My Cart ({cartItems.length})</span>
                <span className="sm:hidden inline">Cart · {cartItems.length} items</span>
              </h2>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 cursor-pointer hidden sm:flex">
                <MapPin size={14} /> Deliver to: Amritsar, 143001
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white shadow-sm border border-slate-100 divide-y divide-slate-100">
              {cartItems.map((item) => (
                <React.Fragment key={item._id}>
                  {/* Desktop Item Layout */}
                  <div className="hidden sm:flex p-4 sm:p-6 flex-row gap-4 sm:gap-6">
                    {/* Image Column */}
                    <div className="w-20 sm:w-32 shrink-0 flex flex-col items-center gap-3">
                      <div className="h-20 w-20 sm:h-28 sm:w-28 flex items-center justify-center p-1 bg-slate-50/50 rounded-lg border border-slate-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="max-h-full max-w-full object-contain" 
                        />
                      </div>
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-200 rounded-md bg-white shadow-3xs">
                        <button 
                          onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-slate-50 transition-colors"
                          style={{ minWidth: '28px', minHeight: '28px' }}
                        >
                          <Minus size={10} strokeWidth={3} />
                        </button>
                        <input 
                          type="text" 
                          readOnly 
                          value={item.quantity} 
                          className="w-8 h-7 sm:w-10 sm:h-8 text-center text-xs sm:text-sm font-black border-x border-slate-200 focus:outline-none"
                        />
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-slate-50 transition-colors"
                          style={{ minWidth: '28px', minHeight: '28px' }}
                        >
                          <Plus size={10} strokeWidth={3} />
                        </button>
                      </div>
                    </div>

                    {/* Info Column */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row justify-between gap-2">
                        <div className="space-y-1">
                          <h3 className="text-base font-medium text-slate-800 hover:text-blue-600 cursor-pointer leading-snug">
                            {item.name}
                          </h3>
                          <p className="text-xs text-slate-400 font-bold">{item.brand}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="flex items-center sm:justify-end gap-2">
                            <span className="text-sm text-slate-400 line-through">₹{Math.round(item.price * 1.3)}</span>
                            <span className="text-lg font-bold text-slate-900">₹{item.price}</span>
                            <span className="text-xs font-bold text-green-600">25% Off</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Inclusive of all taxes</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-6">
                        <button className="text-sm font-bold text-slate-800 uppercase hover:text-blue-600 transition-colors">
                          Save For Later
                        </button>
                        <button 
                          onClick={() => {
                            removeFromCart(item._id);
                            toast.success('Removed from cart');
                          }}
                          className="text-sm font-bold text-slate-800 uppercase hover:text-blue-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                        <Truck size={14} className="text-slate-400" />
                        Delivery by <span className="font-bold text-slate-800">Tomorrow, 10 AM</span> | <span className="text-green-600 font-bold">FREE Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Item Layout (Mockup Screen 4 Dark Card Style) */}
                  <div className="flex sm:hidden justify-between items-center w-full p-4 mb-3 bg-[#181d28] rounded-2xl text-white shadow-md border border-white/5">
                    <div className="flex items-center gap-3 max-w-[65%]">
                      <div className="w-12 h-12 rounded-xl bg-[#272e3d] flex items-center justify-center p-1 shrink-0">
                        <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-lighten" />
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-black text-white leading-snug truncate">{item.name}</h4>
                        <p className="text-xs font-bold text-slate-300 mt-0.5">₹{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs font-black text-white bg-[#272e3d] px-3 py-1.5 rounded-xl border border-white/10">
                      <button 
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} 
                        className="text-slate-300 hover:text-white px-1 select-none font-bold"
                      >
                        -
                      </button>
                      <span className="min-w-[12px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                        className="text-slate-300 hover:text-white px-1 select-none font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))}

              {/* Sticky Place Order Area - Desktop Only */}
              <div className="hidden sm:flex p-4 justify-end sticky bottom-0 bg-white border-t border-slate-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full sm:w-60 bg-[#fb641b] text-white py-3.5 px-8 font-black uppercase tracking-wider rounded-sm shadow-md hover:bg-[#e65a15] transition-all active:scale-95"
                >
                  Place Order
                </button>
              </div>
            </div>

            {/* MOBILE SUMMARY (Mockup Screen 4 Dark Sheet Style) */}
            <div className="block sm:hidden bg-[#181d28] p-6 rounded-t-3xl text-white shadow-2xl space-y-3 mt-6 border-t border-white/10">
              <div className="w-8 h-1 bg-slate-600 rounded-full mx-auto mb-3" />
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-700/50">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-white hover:bg-slate-100 text-[#181d28] text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-md active:scale-95 mt-4"
              >
                Proceed to checkout
              </button>
            </div>
          </div>

          {/* Right Sidebar (Price Details - Desktop Only) */}
          <aside className="hidden sm:block w-full lg:w-[380px] shrink-0">
            <div className="sticky top-28 bg-white shadow-sm border border-slate-100 rounded-sm">
              <h3 className="px-6 py-3 border-b border-slate-100 text-[13px] font-black uppercase tracking-widest text-slate-400">
                Price Details
              </h3>
              
              <div className="p-6 space-y-5">
                <div className="flex justify-between text-sm text-slate-800">
                  <span>Price ({cartItems.length} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-800">
                  <span>Discount</span>
                  <span className="text-green-600">-₹{discount}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-800">
                  <span>Delivery Charges</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? 'FREE Delivery' : `₹${deliveryFee}`}
                  </span>
                </div>
                
                <div className="pt-5 border-t border-dashed border-slate-200">
                  <div className="flex justify-between text-lg font-black text-slate-900 tracking-tight">
                    <span>Total Amount</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm font-bold text-green-600">
                    You will save ₹{discount} on this order
                  </p>
                </div>
              </div>

              {/* Safety Badges */}
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={28} className="text-slate-400" />
                  <p className="text-[10px] font-bold text-slate-500 leading-tight">
                    Safe and Secure Payments. 100% Authentic products.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Trust Footer */}
            <div className="mt-4 flex flex-col gap-4 px-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <ShieldCheck size={14} /> 256-Bit SSL Encryption
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                MediQuick is committed to providing genuine medicines. Every order is verified by our hub before dispatch.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
