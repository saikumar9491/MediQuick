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
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Shopping Bag</h1>
            <p className="mt-1 text-sm font-medium text-slate-400">
              You have {cartItems.length} items in your bag
            </p>
          </div>
          
          <AnimatePresence>
            {saveStatus === 'saving' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-600"
              >
                <Loader2 size={14} className="animate-spin" /> Syncing...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Cart Items List */}
          <div className="flex-1 space-y-4">
            <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-sm border border-slate-100">
              <div className="divide-y divide-slate-50">
                {cartItems.map((item) => (
                  <motion.div 
                    layout
                    key={item._id} 
                    className="group flex flex-col sm:flex-row gap-6 p-6 sm:p-8 hover:bg-slate-50/50 transition-colors"
                  >
                    <div 
                      onClick={() => navigate(`/product/${item._id}`)}
                      className="h-28 w-28 shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-slate-50 p-4 border border-slate-100 flex items-center justify-center"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex flex-col sm:flex-row justify-between gap-2">
                        <div>
                          <h3 
                            onClick={() => navigate(`/product/${item._id}`)}
                            className="cursor-pointer text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {item.name}
                          </h3>
                          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                            {item.brand}
                          </p>
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-1 border border-slate-100">
                          <button 
                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-900 shadow-sm border border-slate-100 disabled:opacity-30 active:scale-90 transition-all"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-900 shadow-sm border border-slate-100 active:scale-90 transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button 
                          onClick={() => {
                            removeFromCart(item._id);
                            toast.success('Removed from bag');
                          }}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => navigate('/medicines')}
              className="flex items-center gap-2 px-6 py-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft size={16} /> Continue Shopping
            </button>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="w-full lg:w-96 shrink-0">
            <div className="sticky top-28 space-y-6">
              <div className="overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl relative">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-600/20 blur-2xl" />
                
                <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-400">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400">Discount</span>
                    <span className="text-green-400">-₹{discount}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400">Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-green-400' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  
                  <div className="my-6 border-t border-white/10 pt-6">
                    <div className="flex items-end justify-between">
                      <span className="text-sm font-bold text-slate-400">Total Payable</span>
                      <span className="text-4xl font-black text-blue-400 tracking-tight">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 text-sm font-bold text-slate-900 shadow-xl transition-all hover:bg-blue-600 hover:text-white active:scale-95"
                >
                  Checkout <ArrowRight size={18} />
                </button>
              </div>

              {/* Trust Signal */}
              <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Secure Checkout</h4>
                    <p className="mt-1 text-[10px] text-slate-400">Your payment information is encrypted and secure.</p>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Fast Delivery</h4>
                    <p className="mt-1 text-[10px] text-slate-400">Direct from our Amritsar hub to your doorstep.</p>
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