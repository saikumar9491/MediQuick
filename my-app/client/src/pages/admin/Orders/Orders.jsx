import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { fetchOrders, fetchOrdersStats, updateOrderStatus } from '../../../api/orders';
import OrdersStatsStrip from './components/OrdersStatsStrip';
import OrdersFilterBar from './components/OrdersFilterBar';
import OrdersTable from './components/OrdersTable';
import OrderDetailModal from './components/OrderDetailModal';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Filtering State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Modal State
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ordersData, statsData] = await Promise.all([
        fetchOrders({
          page,
          limit,
          search,
          status: statusFilter,
          paymentStatus: paymentFilter,
          dateFrom: dateRange.from,
          dateTo: dateRange.to
        }),
        fetchOrdersStats()
      ]);

      setOrders(ordersData.data);
      setTotal(ordersData.total);
      setTotalPages(ordersData.totalPages);
      setStats(statsData);
    } catch (error) {
      console.error(error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter, paymentFilter, dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle inline status update from table or modal
  const handleStatusChange = async (orderId, newStatus) => {
    // If cancelling, might want to show a confirm dialog
    if (newStatus === 'Cancelled') {
      const confirmCancel = window.confirm('Are you sure you want to cancel this order? If it was paid online, it will automatically refund the user\'s wallet.');
      if (!confirmCancel) return false;
    }

    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      loadData(); // Refresh list and stats
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
      return false;
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPaymentFilter('All');
    setDateRange({ from: '', to: '' });
    setPage(1);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-red-500 font-medium text-lg">{error}</p>
        <button 
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-500 text-sm mt-1">Manage and track all customer orders</p>
      </div>

      {/* Stats Strip */}
      <OrdersStatsStrip stats={stats} loading={loading && !stats} />

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters */}
        <OrdersFilterBar 
          search={search}
          setSearch={(v) => { setSearch(v); setPage(1); }}
          statusFilter={statusFilter}
          setStatusFilter={(v) => { setStatusFilter(v); setPage(1); }}
          paymentFilter={paymentFilter}
          setPaymentFilter={(v) => { setPaymentFilter(v); setPage(1); }}
          dateRange={dateRange}
          setDateRange={(v) => { setDateRange(v); setPage(1); }}
          onClear={handleClearFilters}
          orders={orders} // For CSV export
        />

        {/* Table */}
        <OrdersTable 
          orders={orders}
          loading={loading}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          total={total}
          totalPages={totalPages}
          onView={(id) => setSelectedOrderId(id)}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Detail Modal */}
      {selectedOrderId && (
        <OrderDetailModal 
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default Orders;
