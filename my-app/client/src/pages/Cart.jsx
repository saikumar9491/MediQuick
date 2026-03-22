import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Loader2, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

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
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-4 pt-24 sm:pt-28">
        <div className="w-full max-w-md rounded-[28px] sm:rounded-[40px] border border-gray-100 bg-white p-8 sm:p-12 text-center shadow-xl">
          <div className="mx-auto mb-5 sm:mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gray-50">
            <ShoppingBag className="text-gray-300" size={42} />
          </div>

          <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-gray-900">
            Your Hub Cart is Empty
          </h2>

          <p className="mt-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[2px] sm:tracking-[3px] text-gray-400">
            Secure medical supplies for your inventory
          </p>

          <button
            onClick={() => navigate('/')}
            className="mt-8 sm:mt-10 w-full rounded-2xl bg-blue-600 py-3.5 sm:py-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] sm:tracking-widest text-white shadow-lg shadow-blue-100 transition-all hover:bg-black active:scale-95"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-14 pt-24 sm:pb-20 sm:pt-28 lg:pt-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:gap-8">
        {/* LEFT */}
        <div className="flex flex-1 flex-col gap-5 sm:gap-6">
          <div className="overflow-hidden rounded-[24px] sm:rounded-[35px] border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-50 p-4 sm:p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col">
                <h2 className="text-base sm:text-lg font-black uppercase italic tracking-tighter text-gray-900">
                  Medical Hub Inventory ({cartItems.length})
                </h2>

                <div className="h-4">
                  {saveStatus === 'saving' && (
                    <span className="flex items-center gap-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-blue-500 animate-pulse">
                      <Loader2 size={10} className="animate-spin" /> Syncing with Hub...
                    </span>
                  )}
                  {saveStatus === 'saved' && (
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-green-500">
                      ✅ Hub Inventory Secured
                    </span>
                  )}
                </div>
              </div>

              <span className="self-start rounded-full bg-blue-50 px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-blue-600">
                Verified Hub
              </span>
            </div>

            <div className="flex flex-col divide-y divide-gray-50">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="group flex flex-col gap-5 p-4 sm:p-6 lg:p-8 md:flex-row md:gap-6 hover:bg-gray-50/30 transition-colors"
                >
                  {/* Image */}
                  <div
                    className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 cursor-pointer overflow-hidden rounded-[18px] sm:rounded-[25px] bg-gray-50 p-3 sm:p-4 flex-shrink-0"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between gap-4 py-1">
                    <div>
                      <h3
                        className="cursor-pointer text-lg sm:text-xl font-black uppercase italic tracking-tighter leading-tight text-gray-900 transition-colors hover:text-blue-600"
                        onClick={() => navigate(`/product/${item._id}`)}
                      >
                        {item.name}
                      </h3>

                      <p className="mt-2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400">
                        Manufacturer: {item.brand}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 md:gap-6">
                      <div className="flex items-center rounded-xl bg-gray-100 p-1 w-fit">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-black shadow-sm disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>

                        <span className="px-4 sm:px-5 text-sm font-black text-gray-900">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-black shadow-sm"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="flex items-center gap-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-red-400 transition-colors hover:text-red-600"
                      >
                        <Trash2 size={12} /> Remove From Hub
                      </button>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex flex-row items-start justify-between md:flex-col md:items-end md:text-right gap-3">
                    <p className="text-2xl sm:text-3xl font-black italic tracking-tighter leading-none text-gray-900">
                      ₹{item.price * item.quantity}
                    </p>

                    <div className="rounded-lg bg-green-50 px-3 py-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-center text-green-600">
                        In Stock: Amritsar
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 rounded-[24px] sm:rounded-[30px] border border-gray-100 bg-white p-4 sm:p-6 shadow-xl md:flex-row md:items-center md:justify-between">
            <button
              onClick={() => navigate('/')}
              className="px-2 sm:px-4 text-left text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-black"
            >
              ← Continue Shopping
            </button>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full md:w-auto rounded-[16px] sm:rounded-[20px] bg-[#fb641b] px-6 sm:px-10 lg:px-12 py-4 sm:py-5 text-[10px] sm:text-xs font-black uppercase tracking-[1.5px] sm:tracking-[2px] text-white shadow-2xl shadow-orange-100 transition-all hover:-translate-y-[2px] active:translate-y-0"
            >
              Confirm Logistics & Checkout
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-[380px] xl:w-[400px]">
          <div className="lg:sticky lg:top-32">
            <div className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] border border-gray-100 bg-white p-5 sm:p-8 shadow-2xl">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>

              <h3 className="mb-5 sm:mb-6 border-b border-gray-50 pb-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[2px] sm:tracking-[3px] text-gray-400">
                Financial Assessment
              </h3>

              <div className="space-y-5 sm:space-y-6">
                <div className="flex justify-between font-bold italic tracking-tighter text-gray-600">
                  <span className="text-[11px] sm:text-xs uppercase">
                    Gross Value ({cartItems.length} items)
                  </span>
                  <span className="text-gray-900">₹{subtotal}</span>
                </div>

                <div className="flex justify-between font-black italic tracking-tighter text-green-500">
                  <span className="text-[11px] sm:text-xs uppercase">Hub Subsidy</span>
                  <span>-₹{discount}</span>
                </div>

                <div className="flex justify-between font-bold italic tracking-tighter text-gray-600">
                  <span className="text-[11px] sm:text-xs uppercase">Logistic Charges</span>
                  <span className={deliveryFee === 0 ? 'font-black uppercase text-green-500' : 'text-gray-900'}>
                    {deliveryFee === 0 ? 'Gratis' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="mt-5 border-t border-gray-100 pt-5 sm:mt-6 sm:pt-6">
                  <div className="flex items-end justify-between gap-3">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400">
                      Net Payable
                    </span>
                    <span className="text-3xl sm:text-4xl font-black italic tracking-tighter text-blue-600">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-blue-100/50 bg-blue-50/50 p-4 sm:mt-6">
                  <p className="text-center text-[8px] sm:text-[9px] font-black uppercase tracking-widest leading-relaxed text-blue-600">
                    You are saving ₹{discount} on this hub transaction
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex items-start gap-3 sm:gap-4 px-2 sm:px-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-lg shadow-sm">
                🛡️
              </div>
              <p className="text-[8px] sm:text-[9px] font-black uppercase leading-normal tracking-tight text-gray-400">
                Safe & Secure Terminal. Sourced from Certified Amritsar Medical Hub. Verified Authenticity Guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;