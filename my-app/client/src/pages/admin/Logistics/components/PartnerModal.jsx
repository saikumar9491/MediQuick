import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const PartnerModal = ({ rider, onClose, onSave }) => {
  const [zones, setZones] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'Bike',
    zoneId: '',
    status: 'off-duty',
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch zones for the dropdown
    const fetchZones = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get(`${API_BASE}/api/logistics/zones`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setZones(res.data.filter(z => z.isActive));
      } catch (err) {
        console.error('Failed to load zones', err);
      }
    };
    fetchZones();

    if (rider) {
      setFormData({
        name: rider.name,
        phone: rider.phone,
        email: rider.email || '',
        vehicleType: rider.vehicleType || 'Bike',
        zoneId: rider.zoneId?._id || '',
        status: rider.status,
        isActive: rider.isActive
      });
    }
  }, [rider]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      return toast.error("Name and Phone are required");
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('userToken');
      const payload = { ...formData };
      if (!payload.zoneId) delete payload.zoneId;

      if (rider) {
        await axios.patch(`${API_BASE}/api/logistics/riders/${rider._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Partner updated");
      } else {
        await axios.post(`${API_BASE}/api/logistics/riders`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Partner created");
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving partner");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-black text-slate-800">{rider ? 'Edit Partner' : 'Add Delivery Partner'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1.5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
              <input 
                type="text" 
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email (Optional)</label>
            <input 
              type="email" 
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Assigned Zone</label>
              <select 
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={formData.zoneId}
                onChange={e => setFormData({...formData, zoneId: e.target.value})}
              >
                <option value="">-- Unassigned --</option>
                {zones.map(z => (
                  <option key={z._id} value={z._id}>{z.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Vehicle Type</label>
              <select 
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={formData.vehicleType}
                onChange={e => setFormData({...formData, vehicleType: e.target.value})}
              >
                <option value="Bike">Bike</option>
                <option value="Scooter">Scooter</option>
                <option value="Cycle">Cycle</option>
                <option value="Van">Van</option>
              </select>
            </div>
          </div>

          {rider && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Current Status</label>
              <select 
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="off-duty">Off-Duty</option>
                <option value="on-duty">On-Duty (Available)</option>
                <option value="delivering">Delivering (Busy)</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="isActiveRider" 
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              checked={formData.isActive}
              onChange={e => setFormData({...formData, isActive: e.target.checked})}
            />
            <label htmlFor="isActiveRider" className="text-sm font-bold text-slate-700">Account is Active</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-sm transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Partner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
