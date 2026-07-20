import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const VehicleModal = ({ vehicle, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    plateNumber: vehicle?.plateNumber || '',
    type: vehicle?.type || 'Bike',
    assignedRiderId: vehicle?.assignedRiderId?._id || '',
    status: vehicle?.status || 'Active',
    registrationDate: vehicle?.registrationDate ? vehicle.registrationDate.split('T')[0] : '',
    insuranceExpiry: vehicle?.insuranceExpiry ? vehicle.insuranceExpiry.split('T')[0] : '',
    lastServiceDate: vehicle?.lastServiceDate ? vehicle.lastServiceDate.split('T')[0] : '',
    nextServiceDue: vehicle?.nextServiceDue ? vehicle.nextServiceDue.split('T')[0] : '',
  });

  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get(`${API_BASE}/api/logistics/partners`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRiders(res.data);
      } catch (err) {
        console.error('Failed to load riders', err);
      }
    };
    fetchRiders();
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      
      const payload = { ...formData };
      if (!payload.assignedRiderId) payload.assignedRiderId = null;

      if (vehicle) {
        await axios.patch(`${API_BASE}/api/fleet/vehicles/${vehicle._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Vehicle updated");
      } else {
        await axios.post(`${API_BASE}/api/fleet/vehicles`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Vehicle created");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-black text-slate-800">
            {vehicle ? 'Edit Vehicle' : 'Add Vehicle'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Plate Number *</label>
              <input 
                type="text" name="plateNumber" required
                value={formData.plateNumber} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Vehicle Type *</label>
              <select 
                name="type" value={formData.type} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Bike">Bike</option>
                <option value="Scooter">Scooter</option>
                <option value="Van">Van</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Assigned Rider</label>
              <select 
                name="assignedRiderId" value={formData.assignedRiderId} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Unassigned --</option>
                {riders.map(r => (
                  <option key={r._id} value={r._id}>{r.name} ({r.phone})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Status *</label>
              <select 
                name="status" value={formData.status} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Maintenance Due">Maintenance Due</option>
                <option value="Out of Service">Out of Service</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Registration Date</label>
              <input 
                type="date" name="registrationDate"
                value={formData.registrationDate} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Insurance Expiry</label>
              <input 
                type="date" name="insuranceExpiry"
                value={formData.insuranceExpiry} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Last Service Date</label>
              <input 
                type="date" name="lastServiceDate"
                value={formData.lastServiceDate} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Next Service Due</label>
              <input 
                type="date" name="nextServiceDue"
                value={formData.nextServiceDue} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Vehicle
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
