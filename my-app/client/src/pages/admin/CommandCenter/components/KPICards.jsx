import { useCommandCenter } from '../CommandCenterContext';
import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw, Package, IndianRupee, Truck, ShoppingCart, Clock, XCircle, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const KPICards = () => {
  const { summary, loading } = useCommandCenter();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="h-32 flex items-center justify-center animate-pulse bg-slate-50">
            <RefreshCw className="h-5 w-5 animate-spin text-slate-300" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
      {/* 1. Live Orders Today */}
      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><Package className="h-5 w-5" /></div>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full animate-pulse">
            LIVE
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-800">{summary.liveOrders}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Orders Today</p>
        </div>
      </Card>

      {/* 2. Revenue Today */}
      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><IndianRupee className="h-5 w-5" /></div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-800">₹{summary.revenueToday.toLocaleString()}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Revenue Today</p>
        </div>
      </Card>

      {/* 3. Active Deliveries */}
      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg"><Truck className="h-5 w-5" /></div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-800">{summary.outForDelivery}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 flex items-center gap-2">
            Active Deliveries <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
          </p>
        </div>
      </Card>

      {/* 4. Active Carts */}
      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg"><ShoppingCart className="h-5 w-5" /></div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-800">{summary.activeCarts}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Active Carts (30m)</p>
        </div>
      </Card>

      {/* 5. Pending Orders */}
      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-lg"><Clock className="h-5 w-5" /></div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-800">{summary.pendingOrders}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Pending Orders</p>
        </div>
      </Card>

      {/* 6. Cancelled Today */}
      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg"><XCircle className="h-5 w-5" /></div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-800">{summary.cancelledToday}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Cancelled Today</p>
        </div>
      </Card>

      {/* 7. Active Users Online */}
      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg"><Users className="h-5 w-5" /></div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-800">{summary.activeUsers}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Active Sessions</p>
        </div>
      </Card>

      {/* 8. Avg Rating Today */}
      <Card className="p-5 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg"><Star className="h-5 w-5" /></div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-800">
            {summary.avgRating > 0 ? `${summary.avgRating} / 5` : 'N/A'}
          </h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Avg Review Rating</p>
        </div>
      </Card>
    </div>
  );
};
