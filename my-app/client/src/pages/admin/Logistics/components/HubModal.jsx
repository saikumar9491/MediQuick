import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Loader2 } from 'lucide-react';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const HubModal = ({ isOpen, onClose, hub, zones, onSave }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [cutoffTime, setCutoffTime] = useState('16:00');
  const [selectedZones, setSelectedZones] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (hub) {
      setName(hub.name || '');
      setAddress(hub.address || '');
      setLatitude(hub.latitude || '');
      setLongitude(hub.longitude || '');
      setOpenTime(hub.operatingHours?.open || '09:00');
      setCloseTime(hub.operatingHours?.close || '22:00');
      setCutoffTime(hub.orderCutoffTime || '16:00');
      setSelectedZones(hub.servedZones?.map(z => z._id || z) || []);
      setIsActive(hub.isActive !== undefined ? hub.isActive : true);
    } else {
      setName('');
      setAddress('');
      setLatitude('');
      setLongitude('');
      setOpenTime('09:00');
      setCloseTime('22:00');
      setCutoffTime('16:00');
      setSelectedZones([]);
      setIsActive(true);
    }
  }, [hub, isOpen]);

  const handleZoneToggle = (zoneId) => {
    setSelectedZones(prev => 
      prev.includes(zoneId) 
        ? prev.filter(id => id !== zoneId) 
        : [...prev, zoneId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !address) {
      toast.error('Name and Address are required');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('userToken');
      const data = {
        name,
        address,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        operatingHours: { open: openTime, close: closeTime },
        orderCutoffTime: cutoffTime,
        servedZones: selectedZones,
        isActive
      };

      if (hub) {
        await axios.patch(`${API_BASE}/api/logistics/hubs/${hub._id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Hub updated successfully');
      } else {
        await axios.post(`${API_BASE}/api/logistics/hubs`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Hub created successfully');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving hub');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-black text-lg text-slate-800">{hub ? 'Edit Fulfillment Hub' : 'Add Fulfillment Hub'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hub Name *</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                placeholder="e.g. South Delhi Dispatch Hub"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address *</label>
              <textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold h-20"
                placeholder="Full physical address of the hub"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Latitude</label>
                <input 
                  type="number" 
                  step="any"
                  value={latitude} 
                  onChange={(e) => setLatitude(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                  placeholder="e.g. 28.5355"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Longitude</label>
                <input 
                  type="number" 
                  step="any"
                  value={longitude} 
                  onChange={(e) => setLongitude(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                  placeholder="e.g. 77.2631"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Open Time</label>
                <input 
                  type="time" 
                  value={openTime} 
                  onChange={(e) => setOpenTime(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Close Time</label>
                <input 
                  type="time" 
                  value={closeTime} 
                  onChange={(e) => setCloseTime(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Order Cutoff Time</label>
                <input 
                  type="time" 
                  value={cutoffTime} 
                  onChange={(e) => setCutoffTime(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Serves Delivery Zones</label>
              <div className="border border-slate-200 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2">
                {zones.map(z => (
                  <label key={z._id} className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg text-sm font-semibold">
                    <input 
                      type="checkbox" 
                      checked={selectedZones.includes(z._id)}
                      onChange={() => handleZoneToggle(z._id)}
                      className="rounded border-slate-350 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-slate-800 font-bold">{z.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">ETA: {z.estimatedDeliveryTime} mins • {z.pincodes.length} pincodes</p>
                    </div>
                  </label>
                ))}
                {zones.length === 0 && <p className="text-xs text-slate-400 italic">No delivery zones configured yet.</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input 
                type="checkbox" 
                id="hubIsActive" 
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-slate-350 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="hubIsActive" className="text-xs font-bold text-slate-600 uppercase cursor-pointer">Active and Accepting Orders</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 font-bold text-sm transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all min-w-[120px]"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : hub ? 'Save Changes' : 'Create Hub'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
