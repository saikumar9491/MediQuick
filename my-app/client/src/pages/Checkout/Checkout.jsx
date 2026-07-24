import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, FileText, CreditCard, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { AddressSection } from './components/AddressSection';
import { PrescriptionUploadSection } from './components/PrescriptionUploadSection';
import { PaymentMethodSection } from './components/PaymentMethodSection';
import { OrderSummaryCard } from './components/OrderSummaryCard';
import {
  validateCheckout,
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../../api/checkout';
import { getMySubscription } from '../../api/carePlan';
import { API_BASE } from '../../utils/apiConfig';

const DELIVERY_FEE = 49;
const FREE_DELIVERY_THRESHOLD = 500;

const Section = ({ number, icon: Icon, title, subtitle, children }) => (
  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex-shrink-0">
        {number}
      </div>
      <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
        <Icon size={16} />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="px-6 py-5">{children}</div>
  </section>
);

const Checkout = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Direct-buy support (Buy Now from product page)
  const isDirectBuy = location.state?.isDirectBuy;
  const directItem = location.state?.directItem;
  const activeCart = isDirectBuy && directItem ? [directItem] : cartItems;

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [serviceabilityResult, setServiceabilityResult] = useState(null); // null = not checked
  const [paymentMethod, setPaymentMethod] = useState('');
  const [prescriptionUrl, setPrescriptionUrl] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [razorpayAvailable, setRazorpayAvailable] = useState(false);
  const [razorpayChecked, setRazorpayChecked] = useState(false);

  // Preselect default address
  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const def = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setSelectedAddress(def);
    }
  }, [user]);

  // Redirect if cart is empty (unless order was placed)
  useEffect(() => {
    if (activeCart.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
    window.scrollTo(0, 0);
  }, [activeCart.length, orderPlaced]);

  // Check if Razorpay is configured on the server
  useEffect(() => {
    const checkRazorpay = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/payment/config`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRazorpayAvailable(data.configured === true);
      } catch {
        setRazorpayAvailable(false);
      } finally {
        setRazorpayChecked(true);
      }
    };
    if (token) checkRazorpay();
  }, [token]);

  const [careSubscription, setCareSubscription] = useState(null);

  // Fetch active Care Plan subscription
  useEffect(() => {
    const fetchCareSub = async () => {
      try {
        const sub = await getMySubscription(token);
        setCareSubscription(sub);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchCareSub();
  }, [token]);

  const rxItems = activeCart.filter(item => item.needsRx);
  const rxRequired = rxItems.length > 0;
  const isServiceable = serviceabilityResult?.isServiceable ?? null;

  const subtotal = activeCart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  
  // Enforce Care Plan Benefits:
  // If user has active Care Plan, delivery fee is 0 (Free Delivery)
  const isCareMember = careSubscription && careSubscription.status === 'Active';
  const careDiscountPct = isCareMember ? (careSubscription.tier === 'annual' ? 10 : 5) : 0;
  const carePlanDiscount = Math.round((subtotal * careDiscountPct) / 100);
  
  const deliveryFee = isCareMember ? 0 : (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE);
  const total = Math.max(0, subtotal + deliveryFee - couponDiscount - carePlanDiscount);

  // Load Razorpay checkout.js script
  const loadRazorpayScript = () =>
    new Promise(resolve => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const buildOrderPayload = (extra = {}) => {
    const formattedItems = activeCart.map(item => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image,
      brand: item.brand,
    }));

    return {
      items: formattedItems,
      totalAmount: total,
      shippingAddress: {
        name: selectedAddress?.name || user?.name,
        phone: selectedAddress?.phone || user?.phone,
        addressLine1: selectedAddress?.addressLine1,
        addressLine2: selectedAddress?.addressLine2,
        landmark: selectedAddress?.landmark,
        city: selectedAddress?.city,
        state: selectedAddress?.state,
        pincode: selectedAddress?.pincode,
        addressType: selectedAddress?.type,
      },
      couponId: appliedCoupon?.couponId || undefined,
      discountApplied: couponDiscount,
      prescriptionUrl: prescriptionUrl || undefined,
      deliveryDateString: serviceabilityResult?.deliveryDateString || undefined,
      orderType: 'online',
      ...extra,
    };
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return toast.error('Please select a delivery address');
    if (isServiceable !== true) return toast.error('Delivery is not available to the selected pincode');
    if (!paymentMethod) return toast.error('Please select a payment method');
    if (rxRequired && !prescriptionUrl) return toast.error('Please upload the required prescription');

    setIsPlacingOrder(true);
    try {
      // 1. Server-side pre-flight validation
      const validationPayload = {
        items: activeCart.map(i => ({ productId: i._id, name: i.name, quantity: i.quantity || 1 })),
        couponCode: appliedCoupon?.code || undefined,
        subtotal,
        pincode: selectedAddress?.pincode,
        rxRequired,
        prescriptionUrl: prescriptionUrl || undefined,
      };

      const validation = await validateCheckout(token, validationPayload);
      if (!validation.valid) {
        toast.error(validation.errors?.[0] || 'Checkout validation failed');
        setIsPlacingOrder(false);
        return;
      }

      // 2a. COD path
      if (paymentMethod === 'cod') {
        const order = await createOrder(token, {
          ...buildOrderPayload({ paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending', status: 'Placed' }),
        });
        setOrderPlaced(true);
        if (!isDirectBuy) clearCart();
        navigate(`/order-confirmation/${order._id}`, { state: { order } });
        return;
      }

      // 2b. Razorpay path
      if (paymentMethod === 'razorpay') {
        const loaded = await loadRazorpayScript();
        if (!loaded) { toast.error('Could not load payment gateway. Please try again.'); setIsPlacingOrder(false); return; }

        const rzpOrder = await createRazorpayOrder(token, total);

        await new Promise((resolve, reject) => {
          const options = {
            key: rzpOrder.keyId,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            name: 'MediQuick',
            description: 'Medicine Order',
            order_id: rzpOrder.razorpayOrderId,
            prefill: { name: user?.name, email: user?.email, contact: user?.phone },
            theme: { color: '#2563eb' },
            handler: async (response) => {
              try {
                // Server-side signature verification — ONLY trusted signal
                const verified = await verifyRazorpayPayment(token, response);
                if (!verified.verified) {
                  toast.error('Payment verification failed. Please contact support.');
                  return reject(new Error('Signature mismatch'));
                }
                // Create order with paid status
                const order = await createOrder(token, {
                  ...buildOrderPayload({
                    paymentMethod: 'Razorpay',
                    paymentStatus: 'Paid',
                    transactionId: verified.transactionId,
                    status: 'Confirmed',
                  }),
                });
                setOrderPlaced(true);
                if (!isDirectBuy) clearCart();
                navigate(`/order-confirmation/${order._id}`, { state: { order } });
                resolve();
              } catch (err) {
                toast.error(err.message || 'Order creation failed after payment');
                reject(err);
              }
            },
            modal: {
              ondismiss: () => {
                // User closed modal — do NOT create order
                toast('Payment cancelled. No charge was made.', { icon: 'ℹ️' });
                resolve(); // resolve so setIsPlacingOrder is reset
              },
            },
          };
          new window.Razorpay(options).open();
        });
      }
    } catch (err) {
      if (err.message?.includes('401')) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error(err.message || 'Order failed. Please try again.');
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-8 pb-32 lg:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>
          <p className="text-sm text-slate-400 mt-1">Review your order and complete your purchase</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="flex-1 space-y-5">

            {/* Step 1: Delivery Address */}
            <Section number="1" icon={MapPin} title="Delivery Address" subtitle="Where should we deliver?">
              <AddressSection
                user={user}
                token={token}
                selectedAddress={selectedAddress}
                onAddressSelect={addr => { setSelectedAddress(addr); setServiceabilityResult(null); }}
                onServiceabilityChange={setServiceabilityResult}
              />
            </Section>

            {/* Step 2: Prescription Upload (conditional) */}
            {rxRequired && (
              <Section number="2" icon={FileText} title="Prescription Required" subtitle="Upload a valid doctor's prescription">
                <PrescriptionUploadSection
                  token={token}
                  rxItems={rxItems}
                  onUploadComplete={url => setPrescriptionUrl(url)}
                />
              </Section>
            )}

            {/* Step 3: Payment Method */}
            <Section
              number={rxRequired ? '3' : '2'}
              icon={CreditCard}
              title="Payment Method"
              subtitle="Choose how you'd like to pay"
            >
              <PaymentMethodSection
                selected={paymentMethod}
                onChange={setPaymentMethod}
                razorpayAvailable={razorpayAvailable}
              />
            </Section>

          </div>

          {/* RIGHT COLUMN — sticky */}
          <div className="w-full lg:w-[360px] flex-shrink-0 lg:sticky lg:top-24">
            <OrderSummaryCard
              cartItems={activeCart}
              deliveryEstimate={serviceabilityResult}
              appliedCoupon={appliedCoupon}
              onCouponApply={setAppliedCoupon}
              onCouponRemove={() => setAppliedCoupon(null)}
              onQuantityChange={(id, qty) => {
                if (qty < 1) removeFromCart(id);
                else updateQuantity(id, qty);
              }}
              onRemoveItem={removeFromCart}
              token={token}
              isServiceable={isServiceable}
              selectedAddress={selectedAddress}
              paymentMethod={paymentMethod}
              rxRequired={rxRequired}
              prescriptionUploaded={!!prescriptionUrl}
              isPlacingOrder={isPlacingOrder}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>

      {/* STICKY MOBILE BOTTOM CHECKOUT BAR (Flipkart Style) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between lg:hidden shadow-[0_-4px_15px_rgba(0,0,0,0.06)] animate-in slide-in-from-bottom duration-300">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Amount</span>
          <span className="text-lg font-black text-slate-900">₹{total}</span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <button
            onClick={handlePlaceOrder}
            disabled={!canPlace}
            className="bg-[#0057FF] hover:bg-[#003BB5] disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-full shadow-md active:scale-95 transition-all duration-150 flex items-center gap-1.5"
          >
            {isPlacingOrder ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            <span>Place Order</span>
          </button>
          {disabledReason && (
            <span className="text-[9px] text-[#EF4444] font-bold max-w-[150px] truncate">{disabledReason}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
