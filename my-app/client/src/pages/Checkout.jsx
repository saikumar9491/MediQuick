import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeStep, setActiveStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [addressData, setAddressData] = useState({
    pincode: '',
    building: '',
    area: '',
    type: 'Home',
  });

  const isDirectBuy = location.state?.isDirectBuy;
  const directItem = location.state?.directItem;
  const activeCart =
    isDirectBuy && directItem ? [directItem] : cartItems || [];

  const subtotal = activeCart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const discount = subtotal > 500 ? 100 : 0;
  const deliveryFee = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const total = subtotal + deliveryFee - discount;

  useEffect(() => {
    if (activeCart.length === 0 && !orderPlaced) {
      navigate('/');
    }
  }, [activeCart, navigate, orderPlaced]);

  const handleGetExactLocation = () => {
    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setAddressData((prev) => ({
            ...prev,
            pincode: '143001',
            area: `GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
          }));
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) return alert('Please select a payment method');
    if (!addressData.building || !addressData.pincode)
      return alert('Please complete address details');

    try {
      const formattedItems = activeCart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image,
        brand: item.brand,
      }));

      const orderPayload = {
        userId: user?._id,
        items: formattedItems,
        totalAmount: total,
        shippingAddress: addressData,
        paymentMethod,
        status: 'Confirmed',
      };

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (response.ok) {
        setOrderPlaced(true);
        if (!isDirectBuy && clearCart) clearCart();
        setTimeout(() => {
          navigate('/my-orders');
        }, 3000);
      } else {
        alert(data.message || 'Server error. Please try again.');
      }
    } catch (error) {
      console.error('Order process error:', error);
      alert('Hub Connection Failed. Is your backend running?');
    }
  };

  if (orderPlaced) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 pt-24 pb-10 text-center sm:p-6 sm:pt-24">
        <div className="mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-green-50 text-4xl sm:text-5xl text-green-500 shadow-sm animate-bounce">
          ✓
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold uppercase italic tracking-tight text-gray-900">
          Order Confirmed
        </h1>
        <p className="mt-2 max-w-sm text-sm sm:text-base font-medium italic text-gray-500">
          Your medical supplies are being prepared at the Amritsar Hub and will arrive shortly.
        </p>
        <button
          onClick={() => navigate('/my-orders')}
          className="mt-8 rounded-full bg-black px-6 sm:px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] sm:tracking-widest text-white shadow-lg transition-all hover:bg-blue-600"
        >
          Track Order
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] pt-20 pb-14 sm:pt-24 sm:pb-20 selection:bg-blue-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Step Indicator */}
        <div className="mx-auto mb-8 sm:mb-12 flex max-w-2xl items-start justify-between gap-2 sm:gap-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="relative flex flex-1 flex-col items-center">
              <div
                className={`z-10 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all duration-500 ${
                  activeStep >= step
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>

              <p
                className={`mt-2 sm:mt-3 text-[8px] sm:text-[10px] font-bold uppercase tracking-[1px] sm:tracking-widest text-center ${
                  activeStep >= step ? 'font-black text-blue-600' : 'text-gray-400'
                }`}
              >
                {step === 1 ? 'Shipping' : step === 2 ? 'Review' : 'Payment'}
              </p>

              {step < 3 && (
                <div
                  className={`absolute top-4 sm:top-5 left-1/2 h-[2px] w-full transition-all duration-500 ${
                    activeStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-5 sm:space-y-6 lg:col-span-7">
            {/* Step 1 */}
            <div
              className={`rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-5 sm:p-8 shadow-sm transition-all duration-500 ${
                activeStep !== 1 && 'scale-[0.98] opacity-60 grayscale'
              }`}
            >
              <h2 className="mb-5 sm:mb-6 flex items-center gap-2 text-lg sm:text-xl font-bold uppercase italic tracking-tighter text-gray-900">
                <span className="h-5 w-2 sm:h-6 rounded-full bg-blue-600"></span>
                Delivery Details
              </h2>

              {activeStep === 1 ? (
                <div className="space-y-4 animate-fadeIn">
                  <button
                    onClick={handleGetExactLocation}
                    className="flex items-center gap-2 rounded-lg border border-blue-100 p-2 text-[10px] sm:text-xs font-bold uppercase italic tracking-wide text-blue-600 transition-all hover:bg-blue-50"
                  >
                    {isLocating ? '📡 Accessing Satellite...' : '📍 Detect Current Exact Location'}
                  </button>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label className="ml-2 text-[9px] sm:text-[10px] font-black uppercase italic text-gray-400">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={addressData.pincode}
                        placeholder="143001"
                        className="w-full rounded-2xl border-2 border-transparent bg-gray-50 p-3 sm:p-4 text-sm font-semibold uppercase outline-none transition-all focus:border-blue-100 focus:bg-white"
                        onChange={(e) =>
                          setAddressData({ ...addressData, pincode: e.target.value })
                        }
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="ml-2 text-[9px] sm:text-[10px] font-black uppercase italic text-gray-400">
                        Building/Flat
                      </label>
                      <input
                        type="text"
                        value={addressData.building}
                        placeholder="H.No 123"
                        className="w-full rounded-2xl border-2 border-transparent bg-gray-50 p-3 sm:p-4 text-sm font-semibold uppercase outline-none transition-all focus:border-blue-100 focus:bg-white"
                        onChange={(e) =>
                          setAddressData({ ...addressData, building: e.target.value })
                        }
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="ml-2 text-[9px] sm:text-[10px] font-black uppercase italic text-gray-400">
                        Area / Locality / Road
                      </label>
                      <input
                        type="text"
                        value={addressData.area}
                        placeholder="Street name, landmark..."
                        className="w-full rounded-2xl border-2 border-transparent bg-gray-50 p-3 sm:p-4 text-sm font-semibold uppercase outline-none transition-all focus:border-blue-100 focus:bg-white"
                        onChange={(e) =>
                          setAddressData({ ...addressData, area: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveStep(2)}
                    disabled={!addressData.building}
                    className="mt-4 w-full rounded-2xl bg-black py-3.5 sm:py-4 text-[10px] sm:text-xs font-black uppercase italic tracking-[0.18em] sm:tracking-widest text-white transition-all active:scale-[0.99] disabled:bg-gray-200 hover:shadow-2xl"
                  >
                    Continue to Review
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between italic">
                  <p className="text-sm font-medium uppercase tracking-tighter text-gray-600">
                    {addressData.building}, {addressData.area}
                  </p>
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-left text-xs font-black uppercase text-blue-600 underline decoration-2 underline-offset-4"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div
              className={`rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-5 sm:p-8 shadow-sm transition-all duration-500 ${
                activeStep !== 2 && 'opacity-60 grayscale'
              }`}
            >
              <h2 className="mb-5 sm:mb-6 flex items-center gap-2 text-lg sm:text-xl font-bold uppercase italic tracking-tighter text-gray-900">
                <span className="h-5 w-2 sm:h-6 rounded-full bg-blue-600"></span>
                Review Order
              </h2>

              {activeStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase italic tracking-[2px] sm:tracking-[3px] text-gray-400">
                    {isDirectBuy
                      ? 'Processing Direct Hub Purchase Protocol'
                      : `Verifying ${activeCart.length} Inventory Units`}
                  </p>

                  <button
                    onClick={() => setActiveStep(3)}
                    className="mt-4 w-full rounded-2xl bg-black py-3.5 sm:py-4 text-[10px] sm:text-xs font-black uppercase italic tracking-[0.18em] sm:tracking-widest text-white shadow-xl active:scale-[0.99]"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}
            </div>

            {/* Step 3 */}
            <div
              className={`rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-5 sm:p-8 shadow-sm transition-all duration-500 ${
                activeStep !== 3 && 'opacity-60 grayscale'
              }`}
            >
              <h2 className="mb-5 sm:mb-6 flex items-center gap-2 text-lg sm:text-xl font-bold uppercase italic tracking-tighter text-gray-900">
                <span className="h-5 w-2 sm:h-6 rounded-full bg-blue-600"></span>
                Payment Method
              </h2>

              {activeStep === 3 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 animate-fadeIn">
                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 sm:p-6 transition-all ${
                      paymentMethod === 'UPI'
                        ? 'scale-[1.02] border-blue-600 bg-blue-50/50 shadow-md shadow-blue-50'
                        : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <span className="text-sm font-black uppercase italic tracking-tighter text-gray-700">
                      UPI / GPay / PhonePe
                    </span>
                    <div
                      className={`h-5 w-5 rounded-full border-4 ${
                        paymentMethod === 'UPI'
                          ? 'border-white bg-blue-600 ring-2 ring-blue-600'
                          : 'border-gray-200 bg-white'
                      }`}
                    ></div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 sm:p-6 transition-all ${
                      paymentMethod === 'COD'
                        ? 'scale-[1.02] border-blue-600 bg-blue-50/50 shadow-md shadow-blue-50'
                        : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <span className="text-sm font-black uppercase italic tracking-tighter text-gray-700">
                      Cash on Delivery
                    </span>
                    <div
                      className={`h-5 w-5 rounded-full border-4 ${
                        paymentMethod === 'COD'
                          ? 'border-white bg-blue-600 ring-2 ring-blue-600'
                          : 'border-gray-200 bg-white'
                      }`}
                    ></div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="mt-2 md:col-span-2 w-full rounded-2xl bg-blue-600 py-4 sm:py-6 text-xs sm:text-sm font-black uppercase italic tracking-[2px] sm:tracking-[3px] text-white shadow-2xl shadow-blue-100 transition-all active:scale-95"
                  >
                    Authorize Transaction — ₹{total}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] border border-gray-100 bg-white p-5 sm:p-8 shadow-2xl">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-blue-50 opacity-40 blur-3xl"></div>

                <h3 className="mb-6 sm:mb-8 flex items-center justify-between text-[9px] sm:text-[10px] font-black uppercase italic tracking-[2px] sm:tracking-[4px] text-gray-400">
                  <span>Hub Assessment</span>
                  {isDirectBuy && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[8px] sm:text-[9px] text-blue-600 animate-pulse">
                      Direct Buy
                    </span>
                  )}
                </h3>

                <div className="scrollbar-hide mb-6 sm:mb-8 max-h-[320px] sm:max-h-[350px] space-y-4 overflow-y-auto pr-1 sm:pr-2">
                  {activeCart.map((item) => (
                    <div
                      key={item._id || item.id}
                      className="group flex items-center gap-3 sm:gap-4 rounded-[20px] sm:rounded-[24px] border border-gray-100 bg-gray-50/50 p-3 sm:p-4 transition-all hover:bg-white"
                    >
                      <img
                        src={item.image}
                        className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border border-gray-100 bg-white p-2 object-contain shadow-sm transition-transform group-hover:scale-105"
                        alt={item.name}
                      />
                      <div className="flex-1">
                        <p className="mb-1 line-clamp-1 text-[10px] sm:text-[11px] font-black uppercase italic tracking-tighter leading-none text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-[8px] sm:text-[9px] font-black uppercase italic tracking-widest text-gray-400">
                          Units: {item.quantity || 1}
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm font-black italic tracking-tighter text-gray-900">
                        ₹{item.price * (item.quantity || 1)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-gray-100 pt-6 sm:pt-8">
                  <div className="flex justify-between text-xs font-bold uppercase italic tracking-tighter text-gray-500">
                    <span>Gross Valuation</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs font-black uppercase italic tracking-tighter text-green-500">
                    <span>Hub Credit Subsidy</span>
                    <span>-₹{discount}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase italic tracking-tighter text-gray-500">
                    <span>Logistics Charge</span>
                    <span>{deliveryFee === 0 ? 'GRATIS' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="mt-4 sm:mt-6 flex items-center justify-between border-t-2 border-dashed border-gray-100 pt-5 sm:pt-6">
                    <span className="text-xs sm:text-sm font-black uppercase italic tracking-widest text-gray-400">
                      Net Payable
                    </span>
                    <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-blue-600">
                      ₹{total}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative mt-5 sm:mt-6 overflow-hidden rounded-sm bg-[#0a0f18] p-5 sm:p-6 text-white shadow-xl">
                <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-[#2874f0]/20 blur-2xl"></div>
                <h4 className="mb-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[2px] sm:tracking-[3px] text-[#2874f0]">
                  Logistics Protocol
                </h4>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-black italic text-[#fb641b]">
                    AS
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase italic tracking-tighter">
                      Fulfillment Node: Amritsar Hub-01
                    </p>
                    <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-gray-400">
                      Status: Inventory Locked & Ready
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">
                    Satellite Link Established
                  </span>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-ping"></div>
                </div>
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
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Checkout;