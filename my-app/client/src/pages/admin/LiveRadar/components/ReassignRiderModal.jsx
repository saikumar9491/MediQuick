import React, { useState, useEffect } from 'react';
import { X, Loader2, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const ReassignRiderModal = ({ order, onClose, onSuccess }) => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRider, setSelectedRider] = useState('');

  useEffect(() => {
    const fetchAvailableRiders = async () => {
      try {
        const token = localStorage.getItem('userToken');
        // Fetch riders in the same zone who are currently on-duty
        const res = await axios.get(`${API_BASE}/api/logistics/riders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const available = res.data.filter(r => 
          r.zoneId?._id === order.zone?._id && 
          r.status === 'on-duty' && 
          r._id !== order.rider?._id
        );
        
        setRiders(available);
      } catch (err) {
        toast.error('Failed to load available riders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableRiders();
  }, [order]);

  const handleReassign = async () => {
    if (!selectedRider) return;
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_BASE}/api/logistics/orders/${order._id}/reassign-rider`, 
        { riderId: selectedRider },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Rider reassigned successfully!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reassign rider');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-black text-slate-800 flex items-center gap-2">
            <RefreshCcw className="w-5 h-5 text-orange-500" />
            Reassign Rider
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Order Details</p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
              <p><strong>Order ID:</strong> #{order._id.slice(-8).toUpperCase()}</p>
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p className="text-rose-600 mt-1"><strong>Current Rider:</strong> {order.rider?.name || 'None'}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Select New Rider</label>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Finding available riders in zone...
              </div>
            ) : riders.length === 0 ? (
              <div className="p-3 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg text-sm">
                No idle riders available in <strong>{order.zone?.name || 'this zone'}</strong> currently.
              </div>
            ) : (
              <select 
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedRider}
                onChange={(e) => setSelectedRider(e.target.value)}
              >
                <option value="">-- Choose an available rider --</option>
                {riders.map(r => (
                  <option key={r._id} value={r._id}>
                    {r.name} (Vehicle: {r.vehicleType})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
          <button 
            onClick={onClose}
            className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleReassign}
            disabled={!selectedRider || submitting}
            className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirm Reassignment
          </button>
        </div>
      </div>
    </div>
  );
};
