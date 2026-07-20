import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/apiConfig';
import ConfettiExplosion from '../../components/ConfettiExplosion';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (order) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setOrder(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const steps = [
    { label: 'Order Placed', icon: CheckCircle, done: true },
    { label: 'Confirmed', icon: Package, done: order?.status !== 'Placed' },
    { label: 'Out for Delivery', icon: Truck, done: ['Out for Delivery', 'Delivered'].includes(order?.status) },
    { label: 'Delivered', icon: CheckCircle, done: order?.status === 'Delivered' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-12 pb-20 relative overflow-hidden">
      <ConfettiExplosion />
      <div className="max-w-2xl mx-auto px-4">

        {/* Success Icon + Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-5">
            <CheckCircle size={40} className="text-emerald-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Order Confirmed!</h1>
          <p className="text-slate-500 mt-2 text-sm">Thank you for your order. We'll get it ready for dispatch soon.</p>
          {order?.deliveryDateString && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm text-blue-700 font-medium">
              <Clock size={14} /> Estimated delivery: {order.deliveryDateString}
            </div>
          )}
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-5">
          {/* Order Meta */}
          <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap gap-4 justify-between">
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Order ID</p>
              <p className="text-sm font-mono text-slate-700 mt-0.5">{order?._id}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Payment</p>
              <p className="text-sm font-medium text-slate-700 mt-0.5">{order?.paymentMethod}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Status</p>
              <span className="inline-block mt-0.5 px-2.5 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                {order?.status}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="px-6 py-5 space-y-4 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Items Ordered</p>
            {order?.items?.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-11 h-11 rounded-lg object-contain bg-slate-50 border border-slate-100 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="text-xs font-semibold text-slate-800">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex justify-between text-sm font-semibold text-slate-900">
              <span>Total Paid</span>
              <span>₹{order?.totalAmount}</span>
            </div>
            {order?.discountApplied > 0 && (
              <p className="text-xs text-emerald-600 mt-1">Includes ₹{order.discountApplied} coupon discount</p>
            )}
          </div>

          {/* Delivery Address */}
          {order?.shippingAddress && (
            <div className="px-6 py-5 border-b border-slate-100">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-2">Deliver To</p>
              <p className="text-sm font-medium text-slate-800">{order.shippingAddress.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
              </p>
              <p className="text-xs text-slate-500">
                {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{order.shippingAddress.phone}</p>
            </div>
          )}

          {/* Order Steps */}
          <div className="px-6 py-5">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-4">Order Journey</p>
            <div className="flex gap-0">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex-1 flex flex-col items-center gap-2">
                    <div className="relative w-full flex items-center">
                      {i > 0 && <div className={`flex-1 h-0.5 ${steps[i - 1].done ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Icon size={14} />
                      </div>
                      {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${step.done ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
                    </div>
                    <p className={`text-[10px] text-center ${step.done ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>{step.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/my-orders')}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Package size={15} /> Track Order
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag size={15} /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
