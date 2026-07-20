import React from 'react';
import { Package, TrendingUp, Clock, Truck, XCircle } from 'lucide-react';

const OrdersStatsStrip = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Orders Today',
      value: stats?.ordersToday || 0,
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Pending / Processing',
      value: stats?.pendingProcessing || 0,
      icon: Clock,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      title: 'Out for Delivery',
      value: stats?.outForDelivery || 0,
      icon: Truck,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Cancelled',
      value: stats?.cancelled || 0,
      icon: XCircle,
      color: 'bg-red-50 text-red-600',
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-pulse flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-full flex-shrink-0 ${stat.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersStatsStrip;
