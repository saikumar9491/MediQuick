import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Loader2, Bike, User, MapPin, Eye, Edit2, Trash2 } from 'lucide-react';
import { API_BASE } from '../../../../utils/apiConfig';
import { PartnerModal } from './PartnerModal';
import { RiderDetailModal } from './RiderDetailModal';
import toast from 'react-hot-toast';

export const PartnersTab = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);

  const fetchRiders = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/logistics/riders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRiders(res.data);
    } catch (err) {
      toast.error('Failed to load riders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this delivery partner?")) return;
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_BASE}/api/logistics/riders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Partner deleted");
      fetchRiders();
    } catch (err) {
      toast.error("Error deleting partner");
    }
  };

  const openPartnerModal = (rider = null) => {
    setSelectedRider(rider);
    setIsPartnerModalOpen(true);
  };

  const openDetailModal = (rider) => {
    setSelectedRider(rider);
    setIsDetailModalOpen(true);
  };

  const totalRiders = riders.length;
  const onDuty = riders.filter(r => r.status === 'on-duty' || r.status === 'delivering').length;
  const delivering = riders.filter(r => r.status === 'delivering').length;
  const inactive = riders.filter(r => !r.isActive).length;

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header & Stats */}
      <div className="p-6 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 min-w-[120px]">
            <p className="text-xs font-bold text-slate-500 uppercase">Total Riders</p>
            <p className="text-2xl font-black text-slate-800">{totalRiders}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 min-w-[120px]">
            <p className="text-xs font-bold text-blue-600 uppercase">On-Duty</p>
            <p className="text-2xl font-black text-blue-700">{onDuty}</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 min-w-[120px]">
            <p className="text-xs font-bold text-emerald-600 uppercase">Delivering</p>
            <p className="text-2xl font-black text-emerald-700">{delivering}</p>
          </div>
          {inactive > 0 && (
            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 min-w-[120px]">
              <p className="text-xs font-bold text-slate-500 uppercase">Inactive</p>
              <p className="text-2xl font-black text-slate-600">{inactive}</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => openPartnerModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Partner
        </button>
      </div>

      {/* List */}
      <div className="p-6 flex-1 overflow-y-auto">
        {riders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <Bike className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Delivery Partners Setup</h3>
            <p className="text-slate-500 text-sm mb-4">Add riders to assign them to zones and fulfill orders.</p>
            <button onClick={() => openPartnerModal()} className="text-blue-600 font-bold text-sm hover:underline">
              Add First Partner
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-black text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Rider</th>
                  <th className="px-6 py-4">Zone</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Active Orders</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {riders.map(rider => (
                  <tr key={rider._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          {rider.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{rider.name}</p>
                          <p className="text-xs text-slate-500">{rider.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{rider.zoneId?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                        rider.status === 'delivering' ? 'bg-emerald-100 text-emerald-700' :
                        rider.status === 'on-duty' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {rider.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-slate-700">{rider.activeOrders || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openDetailModal(rider)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openPartnerModal(rider)} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(rider._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isPartnerModalOpen && (
        <PartnerModal 
          rider={selectedRider} 
          onClose={() => setIsPartnerModalOpen(false)} 
          onSave={fetchRiders} 
        />
      )}

      {isDetailModalOpen && (
        <RiderDetailModal 
          rider={selectedRider} 
          onClose={() => setIsDetailModalOpen(false)} 
        />
      )}
    </div>
  );
};
