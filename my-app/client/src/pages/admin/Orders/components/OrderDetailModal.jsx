import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, Mail, User, Printer, Loader2 } from 'lucide-react';
import { getOrderById } from '../../../../api/orders';
import StatusUpdateDropdown from './StatusUpdateDropdown';
import { toast } from 'react-hot-toast';

const OrderDetailModal = ({ orderId, onClose, onStatusChange }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        toast.error('Failed to load order details');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, onClose]);

  const handleStatusUpdate = async (id, newStatus) => {
    const success = await onStatusChange(id, newStatus);
    if (success) {
      setOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-12 flex justify-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  const getPaymentBadge = (order) => {
    let status = order.paymentStatus;
    if (!status) {
      if (order.paymentMethod === 'Razorpay' || order.paymentMethod === 'NB') {
        status = 'Paid';
      } else {
        status = 'Pending';
      }
    }

    switch (status) {
      case 'Paid': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Paid</span>;
      case 'Pending': return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">Pending</span>;
      case 'Failed': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Failed</span>;
      case 'Refunded': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Refunded</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">{status || 'Pending'}</span>;
    }
  };

  const formatPaymentMethod = (method) => {
    if (method === 'NB') return 'Net Banking';
    return method || 'Unknown';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:w-full">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 print:hidden">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Order #{order._id.substring(18).toUpperCase()}</h2>
            <p className="text-sm text-slate-500">
              Placed on {new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print Invoice
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          
          {/* Top Section: Status & Payment */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Order Status</h3>
              <div className="flex items-center gap-4">
                <StatusUpdateDropdown 
                  currentStatus={order.status} 
                  orderId={order._id}
                  onStatusChange={handleStatusUpdate}
                />
              </div>
            </div>
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Payment Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-medium text-slate-900">{formatPaymentMethod(order.paymentMethod)}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-slate-500">Status:</span>
                  {getPaymentBadge(order)}
                </div>
                {order.transactionId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Transaction ID:</span>
                    <span className="font-medium text-slate-900">{order.transactionId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle Section: Customer & Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">Customer Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600">
                  <User className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-900">{order.userId?.name || 'Unknown User'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span>{order.userId?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span>{order.userId?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">Delivery Address</h3>
              <div className="flex gap-3 text-slate-600">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">{order.shippingAddress?.building}</p>
                  <p>{order.shippingAddress?.area}</p>
                  <p>PIN: {order.shippingAddress?.pincode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">Order Items</h3>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold text-center">Quantity</th>
                    <th className="px-4 py-3 font-semibold text-right">Unit Price</th>
                    <th className="px-4 py-3 font-semibold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-slate-100"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{item.name}</p>
                            {item.brand && <p className="text-xs text-slate-500">{item.brand}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">₹{item.price}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">
                        ₹{item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary & Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between text-slate-600 pb-3 border-b border-slate-200">
                  <span>Delivery Fee</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-1">
                  <span>Total Amount</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
