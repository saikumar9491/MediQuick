import React, { useState, useEffect } from 'react';
import { Package, Calendar, Loader2, ArrowRight, Eye, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchOrders } from '../../../api/profile';
import OrderDetailView from './OrderDetailView';

const STATUS_COLORS = {
  Placed: 'bg-blue-50 text-blue-700 border-blue-100',
  Processing: 'bg-amber-50 text-amber-700 border-amber-100',
  Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Out for Delivery': 'bg-pink-50 text-pink-700 border-pink-100',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Cancelled: 'bg-red-50 text-red-700 border-red-100'
};

const MyOrdersTab = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders(token);
      setOrders(data);
    } catch (_) {
      toast.error('Failed to load past orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <OrderDetailView
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
        token={token}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Package size={20} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">My Orders</h2>
          <p className="text-xs text-slate-400">Track and review your past orders and status.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-slate-300 mb-3" size={36} strokeWidth={1.5} />
          <p className="text-sm text-slate-500 font-medium">You haven't placed any orders yet</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100/60">
          {orders.map((order) => (
            <div 
              key={order._id} 
              onClick={() => setSelectedOrder(order)}
              className="py-3.5 flex flex-row items-center justify-between hover:bg-slate-50/45 px-2 rounded-xl transition-all cursor-pointer"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-slate-800">
                    #{order._id.substring(order._id.length - 6).toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    ({new Date(order.createdAt).toLocaleDateString()})
                  </span>
                </div>
                <div className="text-[10.5px] sm:text-xs text-slate-400 font-bold">
                  <span>{order.items?.length || 0} items</span>
                  <span className="mx-1.5 font-normal">·</span>
                  <span className="font-extrabold text-slate-700">₹{order.totalAmount}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] sm:text-xs font-black uppercase tracking-wider ${
                  order.status === 'Delivered' ? 'text-emerald-600' :
                  order.status === 'Cancelled' ? 'text-rose-600' : 'text-amber-600'
                }`}>
                  {order.status}
                </span>
                <ChevronRight size={13} className="text-slate-350 sm:hidden flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersTab;
