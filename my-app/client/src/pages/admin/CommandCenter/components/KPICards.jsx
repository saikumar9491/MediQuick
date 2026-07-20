import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw, TrendingUp, TrendingDown, Package, IndianRupee, Truck, AlertOctagon, AlertTriangle, FileText, Users, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export const KPICards = () => {
  const { orders, medicines, users, loading: contextLoading } = useCommandCenter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ordersToday: { value: 0, change: 0, isPositive: true },
    revenueToday: { value: 0, change: 0, isPositive: true },
    activeDeliveries: { value: 0, label: "In transit" },
    lowStock: { value: 0 },
    pendingComplaints: { value: 0 },
    pendingPrescriptions: { value: 0 },
    newCustomers: { value: 0, trend: [] },
    avgOrderValue: { value: 0, change: 0, isPositive: true }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
        const revenueToday = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        const lowStock = medicines.filter(m => m.countInStock < 15).length;
        const newCustomers = users.filter(u => new Date(u.createdAt) >= today).length;
        
        setStats({
          ordersToday: { value: todayOrders.length, change: 0, isPositive: true },
          revenueToday: { value: revenueToday, change: 0, isPositive: true },
          activeDeliveries: { value: orders.filter(o => o.status === 'Out for Delivery').length, label: "In transit" },
          lowStock: { value: lowStock },
          pendingComplaints: { value: 0 },
          pendingPrescriptions: { value: 0 },
          newCustomers: { value: newCustomers, trend: [] },
          avgOrderValue: { value: Math.round(revenueToday / (todayOrders.length || 1)), change: 0, isPositive: true }
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(contextLoading);
      }
    };
    fetchData();
    const refresher = setInterval(fetchData, 60000);
    return () => clearInterval(refresher);
  }, [orders, medicines, users, contextLoading]);

  if (loading) {
    return (
      <Card className="h-32 flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><Package className="h-5 w-5" /></div>
          <div className={`flex items-center gap-1 text-xs font-bold ${stats?.ordersToday.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {stats?.ordersToday.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {stats?.ordersToday.change}%
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-800">{stats?.ordersToday.value}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Orders Today</p>
        </div>
      </Card>

      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><IndianRupee className="h-5 w-5" /></div>
          <div className={`flex items-center gap-1 text-xs font-bold ${stats?.revenueToday.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {stats?.revenueToday.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {stats?.revenueToday.change}%
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-800">₹{stats?.revenueToday.value.toLocaleString()}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Revenue Today</p>
        </div>
      </Card>

      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg"><Truck className="h-5 w-5" /></div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-800">{stats?.activeDeliveries.value}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 flex items-center gap-2">
            Active Deliveries <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
          </p>
        </div>
      </Card>

      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow cursor-pointer hover:border-orange-300">
        <Link to="/admin/inventory-alerts">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg"><AlertOctagon className="h-5 w-5" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-orange-600">{stats?.lowStock.value}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Low Stock Products</p>
          </div>
        </Link>
      </Card>

      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow cursor-pointer hover:border-rose-300">
        <Link to="/admin/complaints">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg"><AlertTriangle className="h-5 w-5" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-rose-600">{stats?.pendingComplaints.value}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Pending Complaints</p>
          </div>
        </Link>
      </Card>

      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300">
        <Link to="/admin/radar">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><FileText className="h-5 w-5" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-blue-600">{stats?.pendingPrescriptions.value}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Pending Prescriptions</p>
          </div>
        </Link>
      </Card>

      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg"><Users className="h-5 w-5" /></div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-800">{stats?.newCustomers.value}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">New Customers Today</p>
        </div>
      </Card>

      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg"><CreditCard className="h-5 w-5" /></div>
          <div className={`flex items-center gap-1 text-xs font-bold ${stats?.avgOrderValue.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {stats?.avgOrderValue.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(stats?.avgOrderValue.change)}%
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-800">₹{stats?.avgOrderValue.value}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Avg Order Value</p>
        </div>
      </Card>
    </div>
  );
};
