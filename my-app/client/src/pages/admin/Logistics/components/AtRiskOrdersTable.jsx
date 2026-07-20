import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, AlertTriangle, PhoneCall } from 'lucide-react';
import { API_BASE } from '../../../../utils/apiConfig';

export const AtRiskOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAtRisk = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get(`${API_BASE}/api/logistics/at-risk-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load at-risk orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAtRisk();
  }, []);

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>;

  if (orders.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <p className="font-bold text-slate-800">All orders are on track!</p>
        <p className="text-sm text-slate-500">No active deliveries are currently at risk of breaching SLA.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200 sticky top-0">
          <tr>
            <th className="px-4 py-3">Order / Customer</th>
            <th className="px-4 py-3">Zone & Rider</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Risk Level</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map(order => (
            <tr key={order._id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="font-mono text-xs font-bold text-slate-800">{order._id.slice(-8).toUpperCase()}</div>
                <div className="text-xs text-slate-500 truncate max-w-[120px]">{order.customerName}</div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-700">{order.zoneName}</div>
                <div className="text-xs text-slate-500">{order.riderName}</div>
              </td>
              <td className="px-4 py-3">
                <div className="font-bold text-slate-800">{order.elapsedMins}m / {order.estimatedMins}m</div>
                <div className="text-[10px] text-slate-500 uppercase">{order.status}</div>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                  order.riskStatus === 'Breached' ? 'bg-rose-100 text-rose-700' :
                  order.riskStatus === 'At Risk' ? 'bg-orange-100 text-orange-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {order.riskStatus !== 'On Track' && <AlertTriangle className="w-3 h-3" />}
                  {order.riskStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center justify-end gap-1 w-full">
                  <PhoneCall className="w-3 h-3" /> Contact Rider
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
