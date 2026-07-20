import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, ChevronRight, Loader2, ArrowLeft, Package } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { fetchOrders, fetchOrderDetails } from '../../api/myOrders';

import OrdersFilterTabs from './components/OrdersFilterTabs';
import OrderCard from './components/OrderCard';
import OrderDetailView from './components/OrderDetailView';
import EmptyOrdersState from './components/EmptyOrdersState';

const MyOrders = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // '30', '180', 'all'
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { from: '/my-orders' } });
      return;
    }

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

    loadOrders();
  }, [token]);

  // Load single order if URL has params (handled here via state/props toggling or inline navigation back)
  const handleViewDetails = async (orderId) => {
    try {
      const order = await fetchOrderDetails(token, orderId);
      setSelectedOrder(order);
    } catch (_) {
      toast.error('Could not load order details');
    }
  };

  // Filter and search logic
  const filteredOrders = orders.filter(order => {
    // 1. Tab Status Filter
    if (activeTab === 'active') {
      const activeStates = ['Placed', 'Confirmed', 'Processing', 'Out for Delivery'];
      if (!activeStates.includes(order.status)) return false;
    } else if (activeTab === 'delivered') {
      if (order.status !== 'Delivered') return false;
    } else if (activeTab === 'cancelled') {
      if (order.status !== 'Cancelled') return false;
    }

    // 2. Date Range Filter
    const orderTime = new Date(order.createdAt).getTime();
    const now = Date.now();
    if (dateFilter === '30') {
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      if (now - orderTime > thirtyDays) return false;
    } else if (dateFilter === '180') {
      const sixMonths = 180 * 24 * 60 * 60 * 1000;
      if (now - orderTime > sixMonths) return false;
    }

    // 3. Search Query (ID or Product names)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const idMatch = order._id.toLowerCase().includes(q);
      const productMatch = order.items?.some(i => i.name.toLowerCase().includes(q));
      if (!idMatch && !productMatch) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {selectedOrder ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <OrderDetailView
              order={selectedOrder}
              onBack={() => setSelectedOrder(null)}
              token={token}
            />
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Page Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">My Orders</h1>
                <p className="text-xs text-slate-400">View and track your past orders.</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <OrdersFilterTabs activeTab={activeTab} onTabSelect={setActiveTab} />

            {/* Search & date selection */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-400 transition-all">
                <Search size={14} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID or item..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-xs placeholder-slate-400 text-slate-700 focus:outline-none"
                />
              </div>

              {/* Date Filter dropdown */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
                <Calendar size={14} className="text-slate-400" />
                <select
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Time</option>
                  <option value="30">Last 30 Days</option>
                  <option value="180">Last 6 Months</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {filteredOrders.length === 0 ? (
              <EmptyOrdersState />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredOrders.map(order => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    token={token}
                    onViewDetails={() => handleViewDetails(order._id)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrders;
