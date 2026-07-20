import React from 'react';
import { Calendar, Eye, Download, Info, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import ReorderButton from './ReorderButton';
import { getInvoiceUrl } from '../../../api/myOrders';

const STATUS_BADGES = {
  Placed: 'bg-blue-50 text-blue-700 border-blue-100',
  Confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
  Processing: 'bg-amber-50 text-amber-700 border-amber-100',
  'Out for Delivery': 'bg-pink-50 text-pink-700 border-pink-100',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Cancelled: 'bg-red-50 text-red-700 border-red-100'
};

const OrderCard = ({ order, token, onViewDetails }) => {
  const isDelivered = order.status === 'Delivered';
  const isCancelled = order.status === 'Cancelled';
  const isActive = ['Placed', 'Confirmed', 'Processing', 'Out for Delivery'].includes(order.status);

  const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    dateStyle: 'medium'
  });

  const invoiceUrl = getInvoiceUrl(order._id);

  const handleInvoiceClick = (e) => {
    e.stopPropagation();
    window.open(invoiceUrl, '_blank');
  };

  return (
    <div
      onClick={onViewDetails}
      className="bg-white border border-slate-200 hover:border-slate-350 hover:shadow-sm rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</span>
            <p className="text-xs font-mono text-slate-600 mt-0.5">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
          </div>
          <span className={`px-2.5 py-0.5 border text-[9px] font-bold rounded-full uppercase tracking-wider ${STATUS_BADGES[order.status] || 'bg-slate-50'}`}>
            {order.status}
          </span>
        </div>

        {/* Thumbnails preview */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {order.items?.slice(0, 3).map((item, i) => (
            <div key={i} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center p-1 flex-shrink-0 relative group" title={item.name}>
              {item.image ? (
                <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="w-6 h-6 bg-slate-200 rounded" />
              )}
            </div>
          ))}
          {order.items?.length > 3 && (
            <div className="w-12 h-12 rounded-lg bg-slate-50 border border-dashed border-slate-250 flex items-center justify-center text-[10px] font-bold text-slate-500">
              +{order.items.length - 3}
            </div>
          )}
        </div>

        {/* Date & total */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-50 pt-3">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {formattedDate}
          </span>
          <span className="font-bold text-slate-800">₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100/60 text-xs font-semibold">
        <button
          onClick={onViewDetails}
          className="flex-1 flex items-center justify-center gap-1 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Eye size={12} /> Details
        </button>

        <button
          onClick={handleInvoiceClick}
          className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="Download Invoice"
        >
          <Download size={12} />
        </button>

        {(isDelivered || isCancelled) && (
          <ReorderButton orderId={order._id} token={token} />
        )}
      </div>
    </div>
  );
};

export default OrderCard;
