import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, Calendar, CreditCard, ShoppingBag, Download, ArrowRight, ShieldAlert, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../../context/CartContext';
import { addItem } from '../../../api/cart';
import { ReviewForm } from '../../../components/ReviewForm';

const OrderDetailView = ({ order, onBack, token }) => {
  const navigate = useNavigate();
  const { addToCartMultiple } = useCart();
  const [reordering, setReordering] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeProductId, setActiveProductId] = useState(null);

  const steps = [
    { label: 'Order Placed', done: true },
    { label: 'Processing', done: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) },
    { label: 'Out for Delivery', done: ['Out for Delivery', 'Delivered'].includes(order.status) },
    { label: 'Delivered', done: order.status === 'Delivered' }
  ];

  const handleReorder = async () => {
    setReordering(true);
    try {
      if (order?.items?.length > 0) {
        // 1. Sync React local state & localStorage
        addToCartMultiple(order.items);
        
        // 2. Also sync to backend API if logged in
        if (token) {
          for (const item of order.items) {
            const id = item.productId?._id || item.productId || item._id;
            if (id) {
              await addItem(token, id, item.quantity || 1).catch(err => console.error(err));
            }
          }
        }

        toast.success(`Added ${order.items.length} items to your cart!`);
        navigate('/cart');
      } else {
        toast.error('No items found to reorder');
      }
    } catch (err) {
      toast.error(err.message || 'Could not add items to cart');
    } finally {
      setReordering(false);
    }
  };

  const handleInvoiceDownload = () => {
    // Simulated PDF Invoice Download
    toast.success('Invoice download started');
  };

  return (
    <div className="space-y-6">
      {/* Back Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Orders
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleInvoiceDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <Download size={13} /> Invoice
          </button>
          <button
            onClick={handleReorder}
            disabled={reordering}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            <ShoppingBag size={13} /> {reordering ? 'Reordering...' : 'Reorder Items'}
          </button>
        </div>
      </div>

      {/* Meta Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/50 rounded-2xl border border-slate-200 p-5">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</p>
          <p className="text-xs font-mono text-slate-700 mt-1">{order._id}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Placed On</p>
          <p className="text-xs font-semibold text-slate-700 mt-1">
            {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
          <p className="text-xs font-semibold text-slate-900 mt-1">₹{order.totalAmount}</p>
        </div>
      </div>

      {/* Status Journey */}
      {order.status !== 'Cancelled' ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Delivery Status Timeline</p>
          <div className="flex justify-between items-center gap-0 max-w-lg">
            {steps.map((step, i) => (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                    step.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-[10px] font-medium text-center ${
                    step.done ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 ${steps[i + 1].done ? 'bg-emerald-350 bg-emerald-400' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-xs flex items-center gap-2">
          <ShieldAlert size={15} />
          This order was cancelled.
        </div>
      )}

      {/* Items & details columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="md:col-span-2 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Items Ordered</p>
          {order.items?.map((item, i) => (
            <div key={i} className="flex gap-3 items-center bg-white rounded-xl border border-slate-200 p-3">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-contain bg-slate-50 border border-slate-100 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Quantity: {item.quantity}</p>
                {order.status === 'Delivered' && (item.productId || item._id) && (
                  <button
                    onClick={() => {
                      setActiveProductId(item.productId || item._id);
                      setReviewModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-[#00a2a4] text-[10px] font-black mt-1.5 transition-colors border border-teal-100 cursor-pointer"
                  >
                    <Star size={10} className="fill-amber-400 text-amber-400 stroke-none" />
                    <span>Rate Product</span>
                  </button>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">₹{item.price * item.quantity}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">₹{item.price} each</p>
              </div>
            </div>
          ))}
        </div>

        {/* Address & Payment Info */}
        <div className="space-y-4">
          {/* Deliver to address */}
          {order.shippingAddress && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Truck size={12} /> Delivery Address
              </p>
              <div className="text-xs">
                <p className="font-semibold text-slate-800">{order.shippingAddress.name}</p>
                <p className="text-slate-500 mt-1">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                </p>
                <p className="text-slate-500">
                  {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </p>
                <p className="text-slate-400 mt-1.5">{order.shippingAddress.phone}</p>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <CreditCard size={12} /> Payment Info
            </p>
            <div className="text-xs">
              <p className="font-semibold text-slate-800">{order.paymentMethod}</p>
              <p className="text-slate-400 mt-0.5">Status: <span className="font-semibold text-slate-700">{order.isPaid ? 'Paid' : 'Pending'}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Rating Modal */}
      {reviewModalOpen && activeProductId && (
        <ReviewForm
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setActiveProductId(null);
          }}
          productId={activeProductId}
          token={token}
          onSubmit={() => {
            setReviewModalOpen(false);
            setActiveProductId(null);
            toast.success('Thank you for your rating!');
          }}
        />
      )}
    </div>
  );
};

export default OrderDetailView;
