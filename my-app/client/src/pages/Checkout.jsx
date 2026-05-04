import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
  RotateCcw,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE } from '../utils/apiConfig';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeStep, setActiveStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [addressData, setAddressData] = useState({
    pincode: '',
    building: '',
    area: '',
    type: 'Home',
  });

  const isDirectBuy = location.state?.isDirectBuy;
  const directItem = location.state?.directItem;
  const activeCart = isDirectBuy && directItem ? [directItem] : cartItems || [];

  const subtotal = activeCart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const discount = subtotal > 500 ? 100 : 0;
  const deliveryFee = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const total = subtotal + deliveryFee - discount;

  useEffect(() => {
    if (activeCart.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
    window.scrollTo(0, 0);
  }, [activeCart.length, navigate, orderPlaced]);

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
          toast.success("Location locked successfully");
        },
        () => {
          setIsLocating(false);
          toast.error("GPS access denied");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) return toast.error('Please select a payment method');
    if (!addressData.building || !addressData.pincode)
      return toast.error('Please complete address details');

    try {
      setIsProcessing(true);
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

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        setOrderPlaced(true);
        if (!isDirectBuy) clearCart();
        toast.success("Order placed successfully!");
        setTimeout(() => navigate('/my-orders'), 4000);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-[3rem] bg-slate-50 p-12 text-center shadow-xl"
        >
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-100">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Order Confirmed!</h1>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Your medical supplies are being prepared at the Amritsar Hub and will arrive shortly.
          </p>
          <button
            onClick={() => navigate('/my-orders')}
            className="mt-10 w-full rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-blue-600"
          >
            Track Order
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator */}
        <div className="mx-auto mb-16 flex max-w-2xl items-center justify-between relative">
          <div className="absolute top-1/2 left-0 h-0.5 w-full bg-slate-200 -translate-y-1/2 z-0" />
          {[1, 2, 3].map((step) => (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ${
                  activeStep >= step
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                {activeStep > step ? <CheckCircle2 size={20} /> : step}
              </div>
              <span className={`mt-3 text-[10px] font-bold uppercase tracking-widest ${activeStep >= step ? 'text-blue-600' : 'text-slate-400'}`}>
                {step === 1 ? 'Shipping' : step === 2 ? 'Review' : 'Payment'}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1 space-y-8">
            
            {/* Shipping Details */}
            <section className={`overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100 transition-all ${activeStep !== 1 && 'opacity-60 grayscale scale-95'}`}>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Shipping Details</h2>
              </div>

              {activeStep === 1 ? (
                <div className="space-y-6">
                  <button 
                    onClick={handleGetExactLocation} 
                    className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    {isLocating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} className="fill-current" />}
                    Detect Current Location
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Pincode</label>
                      <input 
                        type="text" 
                        value={addressData.pincode} 
                        placeholder="143001" 
                        className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-bold outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all"
                        onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Building/Flat</label>
                      <input 
                        type="text" 
                        value={addressData.building} 
                        placeholder="e.g. House No. 123" 
                        className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-bold outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all"
                        onChange={(e) => setAddressData({ ...addressData, building: e.target.value })} 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Area / Locality / Street</label>
                      <input 
                        type="text" 
                        value={addressData.area} 
                        placeholder="e.g. Mall Road, Near Golden Temple" 
                        className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-bold outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all"
                        onChange={(e) => setAddressData({ ...addressData, area: e.target.value })} 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveStep(2)} 
                    disabled={!addressData.building || !addressData.pincode}
                    className="w-full rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-blue-600 active:scale-95 disabled:bg-slate-200"
                  >
                    Continue to Review
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-bold text-slate-600">
                    {addressData.building}, {addressData.area} ({addressData.pincode})
                  </div>
                  <button onClick={() => setActiveStep(1)} className="text-xs font-bold text-blue-600 hover:underline">Change</button>
                </div>
              )}
            </section>

            {/* Review Section */}
            <section className={`overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100 transition-all ${activeStep !== 2 && 'opacity-60 grayscale scale-95'}`}>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Package size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Review Order</h2>
              </div>

              {activeStep === 2 && (
                <div className="space-y-6">
                  <div className="rounded-2xl bg-slate-50 p-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selected Items ({activeCart.length})</p>
                    <div className="mt-4 space-y-4">
                      {activeCart.map(item => (
                        <div key={item._id} className="flex items-center gap-4">
                          <img src={item.image} className="h-10 w-10 rounded-lg bg-white p-1" alt="" />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-slate-400">Qty: {item.quantity || 1}</p>
                          </div>
                          <p className="text-sm font-bold text-slate-900">₹{item.price * (item.quantity || 1)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveStep(3)} 
                    className="w-full rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-blue-600 active:scale-95"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}
            </section>

            {/* Payment Section */}
            <section className={`overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100 transition-all ${activeStep !== 3 && 'opacity-60 grayscale scale-95'}`}>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
              </div>

              {activeStep === 3 && (
                <div className="space-y-4">
                  <div 
                    onClick={() => setPaymentMethod('UPI')}
                    className={`cursor-pointer rounded-2xl border-2 p-6 flex items-center justify-between transition-all ${paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-50' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center">
                        <span className="font-bold text-blue-600">UPI</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">UPI Payments</p>
                        <p className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</p>
                      </div>
                    </div>
                    <div className={`h-6 w-6 rounded-full border-2 ${paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-600' : 'border-slate-200'}`} />
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('COD')}
                    className={`cursor-pointer rounded-2xl border-2 p-6 flex items-center justify-between transition-all ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center">
                        <Truck size={20} className="text-slate-900" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Cash on Delivery</p>
                        <p className="text-[10px] text-slate-400">Pay when your medicine arrives</p>
                      </div>
                    </div>
                    <div className={`h-6 w-6 rounded-full border-2 ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-600' : 'border-slate-200'}`} />
                  </div>

                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={isProcessing || !paymentMethod}
                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-6 text-sm font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:bg-slate-900 active:scale-95 disabled:bg-slate-200"
                    className="mt-4 flex w-full items-center justify-center gap-4 rounded-[2rem] bg-slate-900 py-6 text-sm font-black uppercase tracking-[0.2em] text-white shadow-2xl transition-all hover:bg-[#00a2a4] active:scale-95 disabled:bg-slate-100 disabled:text-slate-300"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
                    {isProcessing ? 'AUTHORIZING...' : `Place Secure Order — ₹${total}`}
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Right Assessment Sidebar */}
          <aside className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-28 space-y-8">
              <div className="overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 text-white shadow-2xl relative border border-white/5">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00a2a4]/10 blur-[80px]" />
                
                <h3 className="mb-10 text-xs font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/10 pb-4">Order Assessment</h3>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Gross Value</span>
                    <span className="text-white">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Hub Subsidy</span>
                    <span className="text-green-400">-₹{discount}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Logistic Charge</span>
                    <span className={deliveryFee === 0 ? 'text-green-400' : 'text-white'}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  
                  <div className="my-10 border-t-2 border-dashed border-white/10 pt-10">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Payable Amount</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-5xl font-black text-[#00a2a4] tracking-tighter">₹{total}</span>
                        <div className="rounded-lg bg-green-500/10 px-3 py-1.5 text-[9px] font-black text-green-400 uppercase tracking-widest">
                          APPROVED
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl bg-white/5 p-5 border border-white/10 flex items-start gap-4">
                  <div className="h-8 w-8 rounded-xl bg-[#00a2a4]/20 flex items-center justify-center text-[#00a2a4]">
                    <ShieldCheck size={18} />
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    MediQuick utilizes 256-bit AES encryption to protect your medical and payment data.
                  </p>
                </div>
              </div>

              {/* Verified Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3">
                  <Truck className="text-slate-300" size={24} />
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-900 leading-tight">Fast Hub <br/> Delivery</p>
                </div>
                <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3">
                  <RotateCcw className="text-slate-300" size={24} />
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-900 leading-tight">Easy Returns <br/> Policy</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;