import React, { useState } from 'react';
import { ArrowLeft, Package, Truck, Calendar, CreditCard, ShoppingBag, Download, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import StatusTimeline from './StatusTimeline';
import ReorderButton from './ReorderButton';
import { getInvoiceUrl } from '../../../api/myOrders';
import { useNavigate } from 'react-router-dom';

const OrderDetailView = ({ order, onBack, token }) => {
  const navigate = useNavigate();
  const isDelivered = order.status === 'Delivered';
  const isCancelled = order.status === 'Cancelled';
  const invoiceUrl = getInvoiceUrl(order._id);

  const handleInvoiceClick = () => {
    window.open(invoiceUrl, '_blank');
  };

  const handleHelpRedirect = () => {
    navigate('/complaints', { state: { orderId: order._id } });
  };

  // Simple timeline helper
  const hasPrescription = order.items?.some(i => i.needsRx) || order.prescriptionUrl;

  return (
    <div className="space-y-6">
      {/* Back button and page actions */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Orders
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleInvoiceClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <Download size={13} /> Invoice
          </button>
          {(isDelivered || isCancelled) && (
            <ReorderButton orderId={order._id} token={token} />
          )}
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</span>
          <p className="font-mono text-slate-700 mt-1">{order._id}</p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Date</span>
          <p className="font-semibold text-slate-700 mt-1">
            {new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</span>
          <p className="font-bold text-slate-900 mt-1">₹{order.totalAmount}</p>
        </div>
      </div>

      {/* Status Journey Tracker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Order Journey</span>
        <StatusTimeline
          currentStatus={order.status}
          updatedAt={order.updatedAt}
          statusHistory={order.statusHistory || []}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: items list */}
        <div className="md:col-span-2 space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Ordered Items</span>
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex gap-4 items-center bg-white rounded-2xl border border-slate-200 p-4">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-contain bg-slate-50 border border-slate-100 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-800 truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.brand}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">₹{item.price * item.quantity}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">₹{item.price} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Rx info */}
          {hasPrescription && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={13} /> Prescription Verification Status
              </span>
              <p className="text-xs text-amber-700">
                This order contains items that require pharmacist review. The prescription has been successfully submitted and is under verification.
              </p>
            </div>
          )}
        </div>

        {/* Right column: shipping & payment info */}
        <div className="space-y-4">
          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Truck size={12} /> Shipping Destination
              </span>
              <div className="text-xs">
                <p className="font-semibold text-slate-800">{order.shippingAddress.name}</p>
                <p className="text-slate-500 mt-1">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                </p>
                <p className="text-slate-500">
                  {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </p>
                <p className="text-slate-400 mt-2">{order.shippingAddress.phone}</p>
              </div>
            </div>
          )}

          {/* Payment breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <CreditCard size={12} /> Payment Summary
            </span>
            <div className="text-xs">
              <p className="font-semibold text-slate-800">{order.paymentMethod}</p>
              <p className="text-slate-400 mt-0.5">Status: <span className="font-semibold text-slate-700">{order.paymentStatus}</span></p>
            </div>
          </div>

          {/* Need help option */}
          <button
            onClick={handleHelpRedirect}
            className="w-full py-3 rounded-xl border border-dashed border-slate-250 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            Need Help with this Order?
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;
