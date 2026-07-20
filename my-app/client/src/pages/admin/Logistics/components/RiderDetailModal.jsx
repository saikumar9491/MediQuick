import React, { useState, useEffect } from 'react';
import { X, Loader2, Star, Clock, Package, MapPin, Bike } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';

export const RiderDetailModal = ({ rider, onClose }) => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rider) return;
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get(`${API_BASE}/api/logistics/riders/${rider._id}/performance`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPerformance(res.data);
      } catch (err) {
        console.error('Error fetching rider performance', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, [rider]);

  if (!rider) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-slate-50 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl">
              {rider.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                {rider.name}
                <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                  rider.status === 'delivering' ? 'bg-emerald-100 text-emerald-700' :
                  rider.status === 'on-duty' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {rider.status}
                </span>
              </h2>
              <p className="text-sm text-slate-500 flex items-center gap-3 mt-0.5">
                <span>{rider.phone}</span>
                {rider.zoneId?.name && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {rider.zoneId.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Bike className="w-3 h-3" /> {rider.vehicleType}
                </span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : performance ? (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <Package className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500 uppercase">Total Deliveries</p>
                  <p className="text-xl font-black text-slate-800">{performance.stats.totalDeliveries}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <Clock className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500 uppercase">On-Time %</p>
                  <p className="text-xl font-black text-slate-800">{performance.stats.onTimePercentage}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500 uppercase">Avg Time</p>
                  <p className="text-xl font-black text-slate-800">{performance.stats.avgDeliveryTime}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500 uppercase">Rating</p>
                  <p className="text-xl font-black text-slate-800">{performance.stats.rating}</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Recent Deliveries</h3>
                {performance.recentOrders.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 text-sm">No delivery history yet.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-xs uppercase font-black text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Order ID</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {performance.recentOrders.map(order => (
                          <tr key={order._id}>
                            <td className="px-4 py-3 font-mono text-xs">{order._id.slice(-8).toUpperCase()}</td>
                            <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-slate-800">₹{order.totalAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500">Failed to load performance data</div>
          )}
        </div>
      </div>
    </div>
  );
};
