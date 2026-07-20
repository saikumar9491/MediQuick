import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, TrendingUp, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { API_BASE } from '../../../../utils/apiConfig';
import { SLATrendChart } from './SLATrendChart';
import { AtRiskOrdersTable } from './AtRiskOrdersTable';

export const SLATab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSLAStats = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get(`${API_BASE}/api/logistics/sla-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load SLA stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSLAStats();
  }, []);

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  if (!stats) return <div className="p-8 text-center text-slate-500">Failed to load SLA tracking data.</div>;

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 overflow-y-auto">
      {/* SLA Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Avg Delivery Time</p>
            <p className="text-2xl font-black text-slate-800">{stats.sla.avgDeliveryTime} <span className="text-sm font-bold text-slate-500">mins</span></p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">On-Time Rate</p>
            <p className="text-2xl font-black text-emerald-600">{stats.sla.onTimeRate}%</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Delayed Orders</p>
            <p className="text-2xl font-black text-orange-600">{stats.sla.delayedOrders}</p>
          </div>
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">SLA Breaches Today</p>
            <p className="text-2xl font-black text-rose-600">{stats.sla.breachesToday}</p>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4">7-Day Trend</h3>
          <SLATrendChart data={stats.trendData} />
        </div>

        {/* At Risk Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Active Orders At Risk</h3>
            <span className="bg-rose-100 text-rose-700 text-[10px] font-black uppercase px-2 py-1 rounded">Needs Attention</span>
          </div>
          <AtRiskOrdersTable />
        </div>
      </div>
    </div>
  );
};
