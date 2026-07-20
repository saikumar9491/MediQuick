import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const ZoneModal = ({ zone, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    pincodes: '',
    estimatedDeliveryTime: 45,
    deliveryFee: 0,
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name,
        pincodes: zone.pincodes.join(', '),
        estimatedDeliveryTime: zone.estimatedDeliveryTime,
        deliveryFee: zone.deliveryFee || 0,
        isActive: zone.isActive
      });
    }
  }, [zone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.pincodes.trim()) {
      return toast.error("Name and Pincodes are required");
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('userToken');
      const payload = {
        ...formData,
        pincodes: formData.pincodes.split(',').map(p => p.trim()).filter(Boolean)
      };

      if (zone) {
        await axios.patch(`${API_BASE}/api/logistics/zones/${zone._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Zone updated");
      } else {
        await axios.post(`${API_BASE}/api/logistics/zones`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Zone created");
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving zone");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-black text-slate-800">{zone ? 'Edit Zone' : 'Add New Zone'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1.5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Zone Name</label>
            <input 
              type="text" 
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. North District"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Pincodes</label>
            <textarea 
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Comma separated (e.g. 110001, 110002)"
              rows={3}
              value={formData.pincodes}
              onChange={e => setFormData({...formData, pincodes: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Estimated Time (mins)</label>
              <input 
                type="number" 
                min="1"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.estimatedDeliveryTime}
                onChange={e => setFormData({...formData, estimatedDeliveryTime: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Delivery Fee (₹)</label>
              <input 
                type="number" 
                min="0"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.deliveryFee}
                onChange={e => setFormData({...formData, deliveryFee: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="isActive" 
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              checked={formData.isActive}
              onChange={e => setFormData({...formData, isActive: e.target.checked})}
            />
            <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Zone is Active</label>
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
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Zone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
