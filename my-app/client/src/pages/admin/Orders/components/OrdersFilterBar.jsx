import React, { useState, useEffect } from 'react';
import { Search, Download, X } from 'lucide-react';

const OrdersFilterBar = ({ 
  search, setSearch, 
  statusFilter, setStatusFilter, 
  paymentFilter, setPaymentFilter,
  dateRange, setDateRange,
  onClear, orders
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  // Sync external clear
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleDatePreset = (preset) => {
    const today = new Date();
    let from = new Date();
    
    if (preset === 'today') {
      // already today
    } else if (preset === '7days') {
      from.setDate(today.getDate() - 7);
    } else if (preset === '30days') {
      from.setDate(today.getDate() - 30);
    }
    
    setDateRange({
      from: from.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0]
    });
  };

  const handleExport = () => {
    // Simple CSV export of current page's orders
    if (!orders || orders.length === 0) return;
    
    const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'Total Amount', 'Status', 'Payment Method', 'Payment Status'];
    const csvRows = [headers.join(',')];
    
    orders.forEach(order => {
      const row = [
        order._id,
        new Date(order.createdAt).toLocaleDateString(),
        `"${order.userId?.name || 'Unknown'}"`,
        order.userId?.phone || '',
        order.totalAmount,
        order.status,
        order.paymentMethod,
        order.paymentStatus || 'Pending'
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 border-b border-slate-200 bg-white space-y-4">
      {/* Top row: Search and Export */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search Order ID, Customer Name or Phone..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
          {localSearch && (
            <button onClick={() => setLocalSearch('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          Export Orders
        </button>
      </div>

      {/* Bottom row: Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100"
        >
          <option value="All">All Statuses</option>
          <option value="Placed">Placed</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Payment Status Dropdown */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100"
        >
          <option value="All">All Payment Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>

        {/* Date Ranges */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
          />
        </div>

        {/* Date Presets */}
        <div className="flex gap-2">
          <button onClick={() => handleDatePreset('today')} className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded">Today</button>
          <button onClick={() => handleDatePreset('7days')} className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded">7 Days</button>
          <button onClick={() => handleDatePreset('30days')} className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded">30 Days</button>
        </div>

        {/* Clear Filters */}
        <button 
          onClick={onClear}
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium ml-auto"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default OrdersFilterBar;
