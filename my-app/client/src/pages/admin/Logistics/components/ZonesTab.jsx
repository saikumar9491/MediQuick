import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, MapPin, Clock, Users, Edit2, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { API_BASE } from '../../../../utils/apiConfig';
import { ZoneModal } from './ZoneModal';
import toast from 'react-hot-toast';

export const ZonesTab = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  const fetchZones = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/logistics/zones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setZones(res.data);
    } catch (err) {
      toast.error('Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this zone? Riders assigned to it will be unassigned.")) return;
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_BASE}/api/logistics/zones/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Zone deleted");
      fetchZones();
    } catch (err) {
      toast.error("Error deleting zone");
    }
  };

  const toggleStatus = async (zone) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_BASE}/api/logistics/zones/${zone._id}`, { isActive: !zone.isActive }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Zone ${zone.isActive ? 'deactivated' : 'activated'}`);
      fetchZones();
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const openModal = (zone = null) => {
    setSelectedZone(zone);
    setIsModalOpen(true);
  };

  const totalZones = zones.length;
  const activeZones = zones.filter(z => z.isActive).length;
  const noRidersCount = zones.filter(z => z.ridersCount === 0 && z.isActive).length;

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header & Stats */}
      <div className="p-6 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 min-w-[120px]">
            <p className="text-xs font-bold text-slate-500 uppercase">Total Zones</p>
            <p className="text-2xl font-black text-slate-800">{totalZones}</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 min-w-[120px]">
            <p className="text-xs font-bold text-emerald-600 uppercase">Active</p>
            <p className="text-2xl font-black text-emerald-700">{activeZones}</p>
          </div>
          {noRidersCount > 0 && (
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 min-w-[140px] flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-orange-600 uppercase flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> No Riders
                </p>
                <p className="text-2xl font-black text-orange-700">{noRidersCount}</p>
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Zone
        </button>
      </div>

      {/* List */}
      <div className="p-6 flex-1 overflow-y-auto">
        {zones.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Delivery Zones Setup</h3>
            <p className="text-slate-500 text-sm mb-4">Create your first zone to start assigning riders and tracking deliveries.</p>
            <button onClick={() => openModal()} className="text-blue-600 font-bold text-sm hover:underline">
              Create First Zone
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {zones.map(zone => (
              <div key={zone._id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                      {zone.name}
                      {!zone.isActive && <span className="bg-slate-100 text-slate-500 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">Inactive</span>}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleStatus(zone)} className={`w-10 h-5 rounded-full relative transition-colors ${zone.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${zone.isActive ? 'translate-x-5' : ''}`}></span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {zone.pincodes.slice(0, 5).map(pin => (
                        <span key={pin} className="bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded font-medium">{pin}</span>
                      ))}
                      {zone.pincodes.length > 5 && (
                        <span className="bg-slate-100 text-slate-500 text-xs px-1.5 py-0.5 rounded font-medium">+{zone.pincodes.length - 5} more</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-700">{zone.estimatedDeliveryTime} mins</span> ETA
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-700">{zone.ridersCount}</span> Assigned Riders
                    {zone.ridersCount === 0 && zone.isActive && <AlertCircle className="w-4 h-4 text-orange-500" title="No riders assigned!" />}
                  </div>
                </div>

                <div className="flex border-t border-slate-100 pt-3 gap-3">
                  <button onClick={() => openModal(zone)} className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 py-1.5 rounded transition-colors">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDelete(zone._id)} className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 py-1.5 rounded transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <ZoneModal 
          zone={selectedZone} 
          onClose={() => setIsModalOpen(false)} 
          onSave={fetchZones} 
        />
      )}
    </div>
  );
};
