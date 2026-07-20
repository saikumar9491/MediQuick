import React, { useState } from 'react';
import { Search, PhoneCall, RefreshCcw, MapPin, MapPinOff } from 'lucide-react';
import { ReassignRiderModal } from './ReassignRiderModal';

export const ActiveDeliveriesPanel = ({ deliveries, loading, selectedOrder, onSelectOrder, onReassigned }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [orderToReassign, setOrderToReassign] = useState(null);

  const filtered = deliveries.filter(d => 
    d._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    // Sort by risk status first (Breached > At Risk > On Track), then elapsed time
    const riskScore = { 'Breached': 3, 'At Risk': 2, 'On Track': 1 };
    if (riskScore[b.riskStatus] !== riskScore[a.riskStatus]) {
      return riskScore[b.riskStatus] - riskScore[a.riskStatus];
    }
    return b.elapsedMins - a.elapsedMins;
  });

  const handleReassignClick = (order, e) => {
    e.stopPropagation();
    setOrderToReassign(order);
    setReassignModalOpen(true);
  };

  return (
    <>
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-3 shrink-0">
        <h2 className="font-black text-slate-800">Active Fleet</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search Order ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {loading && deliveries.length === 0 ? (
          <div className="p-4 text-center text-slate-400 text-sm">Loading deliveries...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center h-full text-slate-500">
            <MapPin className="w-8 h-8 mb-2 text-slate-300" />
            <p className="font-bold text-slate-700">No active deliveries</p>
            <p className="text-xs">There are no orders currently out for delivery.</p>
          </div>
        ) : (
          filtered.map(order => {
            const hasLocation = !!(order.rider?.currentLocation?.lat);
            
            return (
              <div 
                key={order._id}
                onClick={() => onSelectOrder(order._id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedOrder === order._id 
                    ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs font-mono font-bold text-slate-500">#{order._id.slice(-6).toUpperCase()}</p>
                    <p className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{order.customerName}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase whitespace-nowrap ${
                    order.riskStatus === 'Breached' ? 'bg-rose-100 text-rose-700' :
                    order.riskStatus === 'At Risk' ? 'bg-orange-100 text-orange-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {order.riskStatus}
                  </span>
                </div>
                
                <div className="flex justify-between items-end mt-3">
                  <div className="text-xs text-slate-500">
                    <p className="flex items-center gap-1 font-medium text-slate-700">
                      <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[8px] text-slate-600">
                        {order.rider?.name?.charAt(0) || '?'}
                      </span>
                      {order.rider?.name || 'No Rider Assigned'}
                    </p>
                    <p className="mt-1">{order.zone?.name || 'Unknown Zone'}</p>
                    <p className="mt-0.5 font-mono font-bold">{order.elapsedMins}m / {order.estimatedMins}m</p>
                    {!hasLocation && order.rider && (
                      <p className="text-[10px] text-amber-600 flex items-center gap-1 mt-1 bg-amber-50 px-1 py-0.5 rounded w-fit">
                        <MapPinOff className="w-3 h-3" /> Location unavailable
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {order.rider?.phone && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); window.open(`tel:${order.rider.phone}`); }}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors flex justify-center items-center"
                        title="Call Rider"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button 
                      onClick={(e) => handleReassignClick(order, e)}
                      className="p-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors flex justify-center items-center"
                      title="Reassign Rider"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {reassignModalOpen && (
        <ReassignRiderModal 
          order={orderToReassign} 
          onClose={() => setReassignModalOpen(false)}
          onSuccess={() => {
            setReassignModalOpen(false);
            onReassigned();
          }}
        />
      )}
    </>
  );
};
