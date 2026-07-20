import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Map as MapIcon, Loader2 } from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { RadarStatsStrip } from './components/RadarStatsStrip';
import { DeliveryMap } from './components/DeliveryMap';
import { ActiveDeliveriesPanel } from './components/ActiveDeliveriesPanel';

const LiveRadar = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const token = localStorage.getItem('userToken');
      // Fetch both active deliveries and riders stats for the top strip
      const [deliveriesRes, ridersRes] = await Promise.all([
        axios.get(`${API_BASE}/api/logistics/active-deliveries`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE}/api/logistics/riders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setDeliveries(deliveriesRes.data);
      setRiders(ridersRes.data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching radar data', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 15000); // 15 sec polling
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <MapIcon className="w-7 h-7 text-blue-600" />
            Live Radar
          </h1>
          <p className="text-sm text-slate-500 font-medium">Real-time view of active deliveries</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              Live updates • Last sync: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <button 
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-bold transition-colors disabled:opacity-50 text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
        {/* Stats */}
        <RadarStatsStrip deliveries={deliveries} riders={riders} loading={loading} />

        {/* Main Content */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Map (70%) */}
          <div className="flex-[7] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative z-0">
            {loading && deliveries.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 z-10">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : null}
            <DeliveryMap 
              deliveries={deliveries} 
              selectedOrder={selectedOrder}
              onSelectOrder={setSelectedOrder}
            />
          </div>

          {/* Panel (30%) */}
          <div className="flex-[3] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-w-[350px]">
            <ActiveDeliveriesPanel 
              deliveries={deliveries} 
              loading={loading}
              selectedOrder={selectedOrder}
              onSelectOrder={setSelectedOrder}
              onReassigned={() => fetchData(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRadar;
