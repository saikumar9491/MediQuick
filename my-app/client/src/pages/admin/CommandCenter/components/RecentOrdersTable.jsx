import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { DataTable } from '../../../../components/ui/DataTable';
import { RefreshCw, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecentOrdersTable = () => {
  const { orders, medicines, users, loading: contextLoading } = useCommandCenter();
  const [loading, setLoading] = useState(true);
  const [localOrders, setLocalOrders] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!orders || !Array.isArray(orders)) return;
    try {
      const mapped = orders.map(o => ({
        id: o._id ? o._id.substring(0, 8).toUpperCase() : 'UNKNOWN',
        customer: o.userId?.name || o.customerName || 'Guest',
        items: o.items ? o.items.length : 0,
        amount: o.totalAmount || 0,
        status: o.status || 'Placed',
        payment: o.paymentMethod || 'COD',
        date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''
      }));
      const filtered = filter === 'All' 
        ? mapped 
        : mapped.filter(o => o.status === filter);
      setLocalOrders(filtered.slice(0, 6));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(contextLoading);
    }
  }, [orders, filter, contextLoading]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Delivered': return 'success';
      case 'Placed': return 'primary';
      case 'Processing': 
      case 'Shipped': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const columns = [
    { header: 'Order ID', accessor: 'id', cellClassName: 'font-black text-slate-800' },
    { header: 'Customer', accessor: 'customer', cellClassName: 'font-bold text-slate-600' },
    { header: 'Items', accessor: 'items', cell: (row) => `${row.items} items`, cellClassName: 'text-slate-600' },
    { header: 'Amount', accessor: 'amount', cell: (row) => `₹${row.amount.toLocaleString()}`, cellClassName: 'font-black text-slate-800' },
    { header: 'Payment', accessor: 'payment', cellClassName: 'text-slate-500 font-medium' },
    { header: 'Status', accessor: 'status', cell: (row) => <Badge variant={getStatusBadge(row.status)}>{row.status}</Badge> },
    { header: 'Date', accessor: 'date', cellClassName: 'text-slate-500 font-medium' },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      className: 'text-center',
      cellClassName: 'text-center',
      cell: () => (
        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex">
          <Eye className="h-4 w-4" />
        </button>
      )
    }
  ];

  return (
    <Card className="overflow-hidden animate-in fade-in duration-500">
      <div className="p-5 border-b border-slate-200 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-slate-800">Recent Orders</h3>
          <Link to="/admin/orders" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
            View All
          </Link>
        </div>
        
        {/* Quick filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {['All', 'Placed', 'Processing', 'Delivered', 'Cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full transition-colors whitespace-nowrap ${
                filter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={localOrders} 
          emptyMessage="No recent orders found."
        />
      )}
    </Card>
  );
};
