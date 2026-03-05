import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // --- 1. STATE INITIALIZATION ---
  const [activeStep, setActiveStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [addressData, setAddressData] = useState({ pincode: "", building: "", area: "", type: "Home" });

  // --- 2. DATA LOCK LOGIC (THE FIX) ---
  // We extract the direct buy flag and item from navigation state
  const isDirectBuy = location.state?.isDirectBuy;
  const directItem = location.state?.directItem;

  /**
   * PERMANENT FIX: 
   * If isDirectBuy is TRUE, we force activeCart to be ONLY the directItem.
   * We ignore cartItems from context entirely to stop items from repeating/mixing.
   */
  const activeCart = (isDirectBuy && directItem) ? [directItem] : (cartItems || []);

  // --- 3. DYNAMIC CALCULATIONS ---
  // We calculate subtotal manually from activeCart ONLY. 
  // This ensures the price matches exactly what is visible on the screen.
  const subtotal = activeCart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  
  const discount = subtotal > 500 ? 100 : 0;
  const deliveryFee = (subtotal > 1000 || subtotal === 0) ? 0 : 50;
  const total = subtotal + deliveryFee - discount;

  // Security: If someone forces access to /checkout with no items, send them home
  useEffect(() => {
    if (activeCart.length === 0 && !orderPlaced) {
      navigate('/');
    }
  }, [activeCart, navigate, orderPlaced]);

  const handleGetExactLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setAddressData(prev => ({
          ...prev,
          pincode: "143001",
          area: `GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Verified Location)`,
        }));
        setIsLocating(false);
      }, () => {
        alert("GPS Access Denied. Please enter manually.");
        setIsLocating(false);
      }, { enableHighAccuracy: true });
    }
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) return alert("Please select a payment method");
    if (!addressData.building || !addressData.pincode) return alert("Please complete address details");

    try {
      const orderPayload = {
        userId: user?._id,
        items: activeCart,
        totalAmount: total,
        shippingAddress: addressData,
        paymentMethod: paymentMethod,
        status: "Confirmed",
        createdAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        setOrderPlaced(true);
        // CRITICAL: Only clear global cart context if this was a normal cart checkout.
        // If it was a direct buy, the cart was already cleared in ProductDetail.
        if (!isDirectBuy && clearCart) clearCart(); 
        
        setTimeout(() => {
          navigate('/my-orders'); 
        }, 3000);
      } else {
        alert("Server error. Please try again.");
      }
    } catch (error) {
      console.error("Order process error:", error);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 pt-24 text-center">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm animate-bounce">✓</div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight italic uppercase">Order Confirmed</h1>
        <p className="text-gray-500 mt-2 max-w-sm font-medium italic">Your medical supplies are being prepared at the Amritsar Hub and will arrive shortly.</p>
        <button onClick={() => navigate('/my-orders')} className="mt-8 bg-black text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">Track Order</button>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen pt-24 pb-20 selection:bg-blue-100">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* PROGRESS TIMELINE */}
        <div className="flex justify-between items-center mb-12 max-w-2xl mx-auto">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-500 ${activeStep >= step ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-200 text-gray-500'}`}>
                {step}
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-3 ${activeStep >= step ? 'text-blue-600 font-black' : 'text-gray-400'}`}>
                {step === 1 ? 'Shipping' : step === 2 ? 'Review' : 'Payment'}
              </p>
              {step < 3 && <div className={`absolute top-5 left-1/2 w-full h-[2px] transition-all duration-500 ${activeStep > step ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: FORMS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STEP 1: ADDRESS */}
            <div className={`bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all duration-500 ${activeStep !== 1 && 'opacity-60 grayscale scale-[0.98]'}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 italic uppercase tracking-tighter">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span> Delivery Details
              </h2>
              
              {activeStep === 1 ? (
                <div className="space-y-4 animate-fadeIn">
                  <button onClick={handleGetExactLocation} className="text-blue-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-4 hover:bg-blue-50 p-2 rounded-lg transition-all border border-blue-100 italic">
                    {isLocating ? "📡 Accessing Satellite..." : "📍 Detect Current exact location"}
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-2 italic">Pincode</label>
                      <input type="text" value={addressData.pincode} placeholder="143001" className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-sm font-semibold focus:border-blue-100 focus:bg-white outline-none transition-all uppercase" onChange={(e) => setAddressData({...addressData, pincode: e.target.value})} />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-2 italic">Building/Flat</label>
                      <input type="text" value={addressData.building} placeholder="H.No 123" className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-sm font-semibold focus:border-blue-100 focus:bg-white outline-none transition-all uppercase" onChange={(e) => setAddressData({...addressData, building: e.target.value})} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-2 italic">Area / Locality / Road</label>
                      <input type="text" value={addressData.area} placeholder="Street name, landmark..." className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 text-sm font-semibold focus:border-blue-100 focus:bg-white outline-none transition-all uppercase" onChange={(e) => setAddressData({...addressData, area: e.target.value})} />
                    </div>
                  </div>
                  <button onClick={() => setActiveStep(2)} disabled={!addressData.building} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-xs mt-4 hover:shadow-2xl transition-all disabled:bg-gray-200 active:scale-[0.99] tracking-widest italic">Continue to Review</button>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
                   <p className="text-sm text-gray-600 font-medium uppercase tracking-tighter">{addressData.building}, {addressData.area}</p>
                   <button onClick={() => setActiveStep(1)} className="text-blue-600 text-xs font-black uppercase underline decoration-2 underline-offset-4">Change</button>
                </div>
              )}
            </div>

            {/* STEP 2: REVIEW */}
            <div className={`bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all duration-500 ${activeStep !== 2 && 'opacity-60 grayscale'}`}>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 italic uppercase tracking-tighter">
                    <span className="w-2 h-6 bg-blue-600 rounded-full"></span> Review Order
                </h2>
                {activeStep === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[3px] italic">
                            {isDirectBuy ? "Processing Direct Hub Purchase Protocol" : `Verifying ${activeCart.length} Inventory Units`}
                        </p>
                        <button onClick={() => setActiveStep(3)} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-xs mt-4 italic tracking-widest shadow-xl active:scale-[0.99]">Proceed to Payment</button>
                    </div>
                )}
            </div>

            {/* STEP 3: PAYMENT */}
            <div className={`bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all duration-500 ${activeStep !== 3 && 'opacity-60 grayscale'}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 italic uppercase tracking-tighter">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span> Payment Method
              </h2>
              {activeStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                  <div onClick={() => setPaymentMethod("UPI")} className={`p-6 rounded-2xl cursor-pointer border-2 flex items-center justify-between transition-all ${paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-50 scale-[1.02]' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}>
                    <span className="font-black text-sm text-gray-700 italic uppercase tracking-tighter">UPI / GPay / PhonePe</span>
                    <div className={`w-5 h-5 rounded-full border-4 ${paymentMethod === 'UPI' ? 'bg-blue-600 border-white ring-2 ring-blue-600' : 'border-gray-200 bg-white'}`}></div>
                  </div>
                  <div onClick={() => setPaymentMethod("COD")} className={`p-6 rounded-2xl cursor-pointer border-2 flex items-center justify-between transition-all ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-50 scale-[1.02]' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}>
                    <span className="font-black text-sm text-gray-700 italic uppercase tracking-tighter">Cash on Delivery</span>
                    <div className={`w-5 h-5 rounded-full border-4 ${paymentMethod === 'COD' ? 'bg-blue-600 border-white ring-2 ring-blue-600' : 'border-gray-200 bg-white'}`}></div>
                  </div>
                  <button onClick={handlePlaceOrder} className="md:col-span-2 w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase text-sm tracking-[3px] mt-6 shadow-2xl shadow-blue-100 active:scale-95 transition-all italic">Authorize Transaction — ₹{total}</button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: STICKY INVOICE SUMMARY */}
          <div className="lg:col-span-5 h-fit sticky top-28">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 blur-3xl rounded-full -mr-16 -mt-16 opacity-40"></div>
              
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[4px] mb-8 flex justify-between items-center italic">
                  <span>Hub Assessment</span>
                  {isDirectBuy && <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-[9px] animate-pulse">Direct Buy</span>}
              </h3>
              
              <div className="max-h-[350px] overflow-y-auto mb-8 pr-2 space-y-4 scrollbar-hide">
                {activeCart.map(item => (
                  <div key={item._id || item.id} className="flex gap-4 items-center bg-gray-50/50 p-4 rounded-[24px] border border-gray-100 hover:bg-white transition-all group">
                    <img src={item.image} className="w-14 h-14 object-contain bg-white rounded-2xl p-2 shadow-sm border border-gray-100 group-hover:scale-105 transition-transform" alt={item.name} />
                    <div className="flex-1">
                      <p className="font-black text-[11px] text-gray-800 line-clamp-1 uppercase italic tracking-tighter leading-none mb-1">{item.name}</p>
                      <p className="text-[9px] text-gray-400 font-black italic uppercase tracking-widest">Units: {item.quantity || 1}</p>
                    </div>
                    <p className="font-black text-sm text-gray-900 italic tracking-tighter">₹{item.price * (item.quantity || 1)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-8">
                <div className="flex justify-between text-xs font-bold text-gray-500 italic uppercase tracking-tighter">
                  <span>Gross Valuation</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-green-500 italic uppercase tracking-tighter">
                  <span>Hub Credit Subsidy</span>
                  <span>-₹{discount}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-500 italic uppercase tracking-tighter">
                  <span>Logistics Charge</span>
                  <span>{deliveryFee === 0 ? "GRATIS" : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t-2 border-dashed border-gray-100 mt-6">
                  <span className="text-sm font-black text-gray-400 uppercase italic tracking-widest">Net Payable</span>
                  <span className="text-3xl font-black text-blue-600 italic tracking-tighter">₹{total}</span>
                </div>
              </div>

              <div className="mt-8 p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                  <p className="text-[9px] text-blue-800 font-black uppercase leading-relaxed text-center italic tracking-widest">
                      Satellite Secured Hub Terminal <br/> Verified Amritsar Medical Dispatch
                  </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Checkout;