import React from 'react';
import { Eye, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import StatusUpdateDropdown from './StatusUpdateDropdown';

const OrdersTable = ({ 
  orders, loading, 
  page, setPage, 
  limit, setLimit, 
  total, totalPages,
  onView, onStatusChange 
}) => {
  const getPaymentBadge = (order) => {
    // Infer legacy payment status if missing
    let status = order.paymentStatus;
    if (!status) {
      if (order.paymentMethod === 'Razorpay' || order.paymentMethod === 'NB') {
        status = 'Paid';
      } else {
        status = 'Pending';
      }
    }

    switch (status) {
      case 'Paid': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Paid</span>;
      case 'Pending': return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Pending</span>;
      case 'Failed': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Failed</span>;
      case 'Refunded': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Refunded</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{status || 'Pending'}</span>;
    }
  };

  const formatPaymentMethod = (method) => {
    if (method === 'NB') return 'Net Banking';
    return method || 'Unknown';
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-pulse space-y-4 w-full">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-slate-100 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">No orders found</h3>
        <p className="text-slate-500">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Order ID</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Date & Time</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Customer</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Items</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Total</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Payment</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => onView(order._id)}>
                  #{order._id.substring(18).toUpperCase()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleString('en-US', { 
                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-slate-900">{order.userId?.name || 'Unknown'}</div>
                  <div className="text-xs text-slate-500">{order.userId?.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="group relative inline-block cursor-help">
                    <span className="font-medium text-slate-900">
                      {order.items?.length || 0} items — {order.items?.[0]?.name?.length > 25 ? order.items[0].name.substring(0, 25) + '...' : order.items?.[0]?.name}
                      {order.items?.length > 1 && ` + ${order.items.length - 1} more`}
                    </span>
                    <div className="opacity-0 w-64 bg-black text-white text-xs rounded py-2 px-3 absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-normal">
                      <div className="space-y-1">
                        {order.items?.map((i, idx) => (
                          <div key={idx} className="flex justify-between border-b border-gray-700 pb-1 last:border-0 last:pb-0">
                            <span className="truncate mr-2 flex-1">{i.name}</span>
                            <span className="shrink-0 text-gray-300">{i.quantity} × ₹{i.price}</span>
                          </div>
                        ))}
                      </div>
                      <svg className="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                  ₹{order.totalAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-xs text-slate-500 font-medium">{formatPaymentMethod(order.paymentMethod)}</span>
                    {getPaymentBadge(order)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusUpdateDropdown 
                    currentStatus={order.status} 
                    orderId={order._id}
                    onStatusChange={onStatusChange}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    onClick={() => onView(order._id)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Show</span>
          <select 
            value={limit} 
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="border-slate-300 rounded px-2 py-1 bg-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>entries of {total}</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 rounded bg-white border border-slate-300 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-slate-700 px-2">
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1 rounded bg-white border border-slate-300 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
