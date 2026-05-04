import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Loader2,
  ChevronLeft,
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
    <div className="min-h-screen bg-[#f8fafc] pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              <ShoppingBag size={12} className="text-[#00a2a4]" /> 
              Your Selections
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
              Shopping <span className="text-[#00a2a4]">Bag</span>
            </h1>
            <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              You have {cartItems.length} verified items in your bag
            </p>
          </div>
          
          <AnimatePresence>
            {saveStatus === 'saving' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 rounded-xl bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#00a2a4] shadow-sm border border-teal-50"
              >
                <Loader2 size={14} className="animate-spin" /> Syncing Bag...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Cart Items Area */}
          <div className="flex-1 space-y-6">
            <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/50 border border-white">
              <div className="divide-y divide-slate-50">
                {cartItems.map((item) => (
                  <motion.div 
                    layout
                    key={item._id} 
                    className="group flex flex-col sm:flex-row gap-8 p-8 sm:p-10 hover:bg-slate-50/30 transition-all duration-500"
                  >
                    {/* Item Image */}
                    <div 
                      onClick={() => navigate(`/product/${item._id}`)}
                      className="relative h-32 w-32 shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-slate-50 p-6 border border-slate-100 transition-all group-hover:shadow-lg flex items-center justify-center"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" 
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <h3 
                            onClick={() => navigate(`/product/${item._id}`)}
                            className="cursor-pointer text-xl font-black text-slate-900 hover:text-[#00a2a4] transition-colors leading-tight uppercase tracking-tight"
                          >
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#00a2a4]">{item.brand}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In Stock</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-slate-900 tracking-tighter">
                            ₹{item.price * item.quantity}
                          </p>
                          <p className="text-[10px] font-bold text-green-600 uppercase">You saved ₹{Math.round(item.price * 0.25)}</p>
                        </div>
                      </div>

                      {/* Item Actions */}
                      <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-6 rounded-2xl bg-slate-50 p-1.5 border border-slate-100 shadow-inner">
                          <button 
                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm border border-slate-100 disabled:opacity-30 hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                          >
                            <Minus size={14} strokeWidth={3} />
                          </button>
                          <span className="w-6 text-center text-lg font-black text-slate-900">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm border border-slate-100 hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>

                        <button 
                          onClick={() => {
                            removeFromCart(item._id);
                            toast.success('Item removed from bag');
                          }}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all active:scale-95"
                        >
                          <Trash2 size={16} /> Remove Item
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="rounded-[2.5rem] bg-white p-8 border border-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center text-[#00a2a4]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Have a Promo Code?</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apply to get extra discounts</p>
                </div>
              </div>
              <div className="flex w-full sm:w-auto gap-2">
                <input 
                  type="text" 
                  placeholder="CODE2024"
                  className="flex-1 sm:w-40 rounded-xl bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-widest border border-slate-100 focus:outline-none focus:border-[#00a2a4] transition-all"
                />
                <button className="rounded-xl bg-slate-900 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#00a2a4] transition-all active:scale-95">
                  Apply
                </button>
              </div>
            </div>

            <button 
              onClick={() => navigate('/medicines')}
              className="group flex items-center gap-3 px-6 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
            >
              <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" /> Continue Shopping
            </button>
          </div>

          {/* Bill Details Sidebar */}
          <aside className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-28 space-y-8">
              <div className="overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 text-white shadow-2xl relative border border-white/5">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00a2a4]/10 blur-[80px]" />
                
                <h3 className="mb-10 text-xs font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/10 pb-4">Bill Details</h3>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Cart Subtotal</span>
                    <span className="text-white">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Medical Discount</span>
                    <span className="text-green-400">-₹{discount}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Hub Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-green-400' : 'text-white'}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  
                  <div className="my-10 border-t-2 border-dashed border-white/10 pt-10">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount to Pay</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-5xl font-black text-[#00a2a4] tracking-tighter">₹{totalAmount}</span>
                        {discount > 0 && (
                          <div className="rounded-lg bg-green-500/10 px-3 py-1.5 text-[9px] font-black text-green-400 uppercase tracking-widest">
                            SAVED ₹{discount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="group mt-10 flex w-full items-center justify-center gap-4 rounded-2xl bg-white py-5 text-xs font-black uppercase tracking-widest text-slate-900 shadow-xl transition-all hover:bg-[#00a2a4] hover:text-white active:scale-95"
                >
                  Confirm Order <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </button>

                <p className="mt-8 text-center text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                  By proceeding, you agree to our <br/> <span className="text-slate-300 underline cursor-pointer">Terms & Conditions</span>
                </p>
              </div>

              {/* Secure Checkout Signals */}
              <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100 space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                  <ShieldCheck className="text-[#00a2a4]" size={24} />
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Encrypted Payments</h4>
                    <p className="mt-1 text-[9px] font-bold text-slate-400 uppercase">256-bit SSL Secure Checkout</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Hub Dispatch</h4>
                    <p className="mt-1 text-[9px] font-bold text-slate-400 uppercase">Verified at Amritsar Warehouse</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;