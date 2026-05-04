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
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeStep, setActiveStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryType, setDeliveryType] = useState('standard');
  const [prescription, setPrescription] = useState(null);
  const [uploadLater, setUploadLater] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [addressData, setAddressData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    pincode: '',
    building: '',
    area: '',
    landmark: '',
    city: 'Amritsar',
    district: '',
    state: 'Punjab',
    country: 'India',
    type: 'Home',
  });

  const isDirectBuy = location.state?.isDirectBuy;
  const directItem = location.state?.directItem;
  const activeCart = isDirectBuy && directItem ? [directItem] : cartItems || [];

  const subtotal = activeCart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const discount = subtotal > 500 ? 100 : 0;
  const deliveryFee = deliveryType === 'express' ? 99 : (subtotal > 1000 || subtotal === 0 ? 0 : 50);
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
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            // Reverse Geocoding using OpenStreetMap (Free)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            
            if (data.address) {
              const addr = data.address;
              const village = addr.village || addr.suburb || addr.neighbourhood || addr.road || '';
              const district = addr.city_district || addr.county || addr.state_district || '';
              const city = addr.city || addr.town || addr.village || 'Amritsar';
              
              setAddressData((prev) => ({
                ...prev,
                area: village,
                city: city,
                district: district,
                state: addr.state || 'Punjab',
                country: addr.country || 'India',
                pincode: addr.postcode || prev.pincode,
              }));
              toast.success("Address resolved successfully");
            } else {
              // Fallback to raw if API fails
              setAddressData(prev => ({...prev, area: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}));
            }
          } catch (err) {
            toast.error("Address resolution failed");
          } finally {
            setIsLocating(false);
          }
        },
        () => {
          setIsLocating(false);
          toast.error("GPS access denied");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
      toast.error("Geolocation not supported");
    }
  };

  const handlePlaceOrder = async () => {
    if (!termsAccepted) return toast.error('Please accept terms & conditions');
    if (!paymentMethod) return toast.error('Please select a payment method');
    if (!addressData.building || !addressData.pincode || !addressData.phone)
      return toast.error('Please complete shipping details');

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
        deliveryType,
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
      } else if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
        navigate('/login');
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
          <h1 className="text-3xl font-bold text-slate-900 uppercase italic tracking-tighter">Order Confirmed!</h1>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Your medical supplies are being prepared at the Amritsar Hub and will arrive shortly via {deliveryType === 'express' ? 'EXPRESS SATELLITE' : 'STANDARD HUB'} Delivery.
          </p>
          <button
            onClick={() => navigate('/my-orders')}
            className="mt-10 w-full rounded-2xl bg-slate-900 py-4 text-xs font-black uppercase tracking-[0.3em] text-white shadow-xl transition-all hover:bg-[#00a2a4]"
          >
            Track Order
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator - Premium Clinical Style */}
        <div className="mx-auto mb-16 flex max-w-4xl items-center justify-between relative px-4">
          <div className="absolute top-[22px] left-0 h-[2px] w-full bg-slate-100 z-0" />
          {[1, 2, 3].map((step) => (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: activeStep >= step ? '#00a2a4' : '#ffffff',
                  borderColor: activeStep >= step ? '#00a2a4' : '#e2e8f0',
                  scale: activeStep === step ? 1.1 : 1
                }}
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-xs font-black transition-all duration-500 ${
                  activeStep >= step ? 'text-white shadow-lg shadow-teal-100' : 'text-slate-300'
                }`}
              >
                {activeStep > step ? <CheckCircle2 size={18} strokeWidth={3} /> : step}
              </motion.div>
              <span className={`mt-4 text-[9px] font-black uppercase tracking-[0.2em] ${activeStep >= step ? 'text-[#00a2a4]' : 'text-slate-400'}`}>
                {step === 1 ? 'Identity' : step === 2 ? 'Review' : 'Payment'}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1 space-y-8">
            
            {/* 1. Identity & Shipping */}
            <section className={`overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-xl shadow-slate-200/50 border border-white transition-all duration-500 ${activeStep !== 1 && 'opacity-50 grayscale scale-[0.98]'}`}>
              <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#00a2a4]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Identity & <span className="text-[#00a2a4]">Shipping</span></h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Satellite delivery coordinates required</p>
                  </div>
                </div>
                {activeStep === 1 && (
                  <button 
                    onClick={handleGetExactLocation} 
                    className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#00a2a4] transition-all"
                  >
                    {isLocating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} className="fill-current text-teal-400" />}
                    {isLocating ? 'Locating...' : 'Smart Detect'}
                  </button>
                )}
              </div>

              {activeStep === 1 ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                      <input 
                        type="text" 
                        value={addressData.name}
                        placeholder="e.g. John Doe" 
                        onChange={(e) => setAddressData({...addressData, name: e.target.value})}
                        className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-black outline-none border-2 border-transparent focus:border-[#00a2a4] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Mobile Number</label>
                      <input 
                        type="text" 
                        value={addressData.phone}
                        placeholder="+91 98765 43210" 
                        onChange={(e) => setAddressData({...addressData, phone: e.target.value})}
                        className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-black outline-none border-2 border-transparent focus:border-[#00a2a4] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Pincode</label>
                      <input 
                        type="text" 
                        value={addressData.pincode}
                        placeholder="143001" 
                        onChange={(e) => setAddressData({...addressData, pincode: e.target.value})}
                        className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-black outline-none border-2 border-transparent focus:border-[#00a2a4] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">House No / Flat / Building</label>
                      <input 
                        type="text" 
                        value={addressData.building}
                        placeholder="e.g. Flat 402, Skyline" 
                        onChange={(e) => setAddressData({...addressData, building: e.target.value})}
                        className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-black outline-none border-2 border-transparent focus:border-[#00a2a4] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Village / Locality / Street</label>
                      <input 
                        type="text" 
                        value={addressData.area}
                        placeholder="e.g. Mall Road, Heritage Street" 
                        onChange={(e) => setAddressData({...addressData, area: e.target.value})}
                        className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-black outline-none border-2 border-transparent focus:border-[#00a2a4] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">District / City</label>
                      <input 
                        type="text" 
                        value={addressData.district || addressData.city}
                        placeholder="Amritsar" 
                        onChange={(e) => setAddressData({...addressData, district: e.target.value, city: e.target.value})}
                        className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-black outline-none border-2 border-transparent focus:border-[#00a2a4] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">State / Country</label>
                      <div className="flex gap-2">
                        <input type="text" value={addressData.state} onChange={(e) => setAddressData({...addressData, state: e.target.value})} className="w-1/2 rounded-2xl bg-slate-50 p-4 text-sm font-black outline-none border-2 border-transparent focus:border-[#00a2a4] focus:bg-white transition-all" />
                        <input type="text" value={addressData.country} onChange={(e) => setAddressData({...addressData, country: e.target.value})} className="w-1/2 rounded-2xl bg-slate-50 p-4 text-sm font-black outline-none border-2 border-transparent focus:border-[#00a2a4] focus:bg-white transition-all" />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Landmark (Optional)</label>
                      <input 
                        type="text" 
                        value={addressData.landmark}
                        placeholder="e.g. Near Golden Temple" 
                        onChange={(e) => setAddressData({...addressData, landmark: e.target.value})}
                        className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-black outline-none border-2 border-transparent focus:border-[#00a2a4] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {['Home', 'Work'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setAddressData({...addressData, type})}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${addressData.type === type ? 'bg-[#00a2a4] text-white shadow-lg shadow-teal-100' : 'bg-slate-50 text-slate-400'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setActiveStep(2)} 
                    disabled={!addressData.building || !addressData.pincode}
                    className="w-full rounded-[2rem] bg-slate-900 py-6 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-[#00a2a4] disabled:bg-slate-50 disabled:text-slate-200"
                  >
                    Save & Continue
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-6 border border-slate-100">
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{addressData.name} — {addressData.phone}</p>
                    <p className="mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{addressData.area}, {addressData.district}, {addressData.state}, {addressData.country} ({addressData.pincode})</p>
                  </div>
                  <button onClick={() => setActiveStep(1)} className="text-[10px] font-black text-[#00a2a4] uppercase tracking-widest hover:underline">Edit</button>
                </div>
              )}
            </section>

            {/* 2. Review & Delivery Options */}
            <section className={`overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-xl shadow-slate-200/50 border border-white transition-all duration-500 ${activeStep !== 2 && 'opacity-50 grayscale scale-[0.98]'}`}>
              <div className="mb-10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Order <span className="text-orange-600">Review</span></h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Final checklist & delivery speed</p>
                </div>
              </div>

              {activeStep === 2 && (
                <div className="space-y-10">
                  {/* Delivery Speed Section */}
                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Select Delivery Protocol</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div 
                        onClick={() => setDeliveryType('standard')}
                        className={`cursor-pointer p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between ${deliveryType === 'standard' ? 'border-[#00a2a4] bg-teal-50' : 'border-slate-50 bg-slate-50'}`}
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest">Standard Delivery</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">2 — 3 Business Days | FREE</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 ${deliveryType === 'standard' ? 'bg-[#00a2a4] border-[#00a2a4]' : 'border-slate-200'}`} />
                      </div>
                      <div 
                        onClick={() => setDeliveryType('express')}
                        className={`cursor-pointer p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between ${deliveryType === 'express' ? 'border-[#00a2a4] bg-teal-50' : 'border-slate-50 bg-slate-50'}`}
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest">Express Priority</p>
                          <p className="text-[8px] font-bold text-[#00a2a4] uppercase mt-1">Same Day / Next Day | ₹99</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 ${deliveryType === 'express' ? 'bg-[#00a2a4] border-[#00a2a4]' : 'border-slate-200'}`} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[2rem] bg-slate-50 p-8 border border-slate-100">
                    <div className="space-y-6">
                      {activeCart.map(item => (
                        <div key={item._id} className="flex items-center gap-6">
                          <img src={item.image} className="h-14 w-14 rounded-xl bg-white p-2 object-contain shadow-sm" alt="" />
                          <div className="flex-1">
                            <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">QTY: {item.quantity || 1} — {item.brand}</p>
                          </div>
                          <p className="text-xs font-black text-slate-900 tracking-tighter">₹{item.price * (item.quantity || 1)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveStep(3)} 
                    className="w-full rounded-[2rem] bg-slate-900 py-6 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-[#00a2a4]"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}
            </section>

            {/* 3. Payment Gateway */}
            <section className={`overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-xl shadow-slate-200/50 border border-white transition-all duration-500 ${activeStep !== 3 && 'opacity-50 grayscale scale-[0.98]'}`}>
              <div className="mb-10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Payment <span className="text-green-600">Gateway</span></h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Certified secure Indian gateway</p>
                </div>
              </div>

              {activeStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      {id: 'UPI', label: 'UPI', sub: 'GPay, PhPe'},
                      {id: 'COD', label: 'COD', sub: 'Pay on Delivery'},
                      {id: 'CARD', label: 'CARD', sub: 'Credit / Debit'},
                      {id: 'NB', label: 'BANK', sub: 'Net Banking'},
                    ].map(method => (
                      <div 
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`cursor-pointer p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center gap-3 ${paymentMethod === method.id ? 'border-[#00a2a4] bg-teal-50' : 'border-slate-50 bg-slate-50'}`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-tight">{method.label}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase leading-none">{method.sub}</span>
                        <div className={`h-4 w-4 rounded-full border-2 ${paymentMethod === method.id ? 'bg-[#00a2a4] border-[#00a2a4]' : 'border-slate-200'}`} />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-[#00a2a4] focus:ring-[#00a2a4]" 
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <label htmlFor="terms" className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
                      I agree to the <span className="text-slate-900 underline">Terms of Service</span> and authorize MediQuick to process satellite delivery to Amritsar Hub coordinates.
                    </label>
                  </div>

                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={isProcessing || !paymentMethod || !termsAccepted}
                    className="mt-4 flex w-full items-center justify-center gap-4 rounded-[2rem] bg-slate-900 py-7 text-sm font-black uppercase tracking-[0.2em] text-white shadow-2xl transition-all hover:bg-[#00a2a4] active:scale-95 disabled:bg-slate-100 disabled:text-slate-300"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <ShieldCheck size={28} />}
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
                    <span className="text-slate-500">Satellite Discount</span>
                    <span className="text-green-400">-₹{discount}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">{deliveryType === 'express' ? 'Priority Fee' : 'Hub Charge'}</span>
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
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;