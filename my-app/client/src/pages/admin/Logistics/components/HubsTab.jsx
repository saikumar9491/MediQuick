import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Home, Clock, Map, Edit2, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { API_BASE } from '../../../../utils/apiConfig';
import { HubModal } from './HubModal';
import toast from 'react-hot-toast';

export const HubsTab = () => {
  const [hubs, setHubs] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHub, setSelectedHub] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [hubsRes, zonesRes] = await Promise.all([
        axios.get(`${API_BASE}/api/logistics/hubs`, { headers }),
        axios.get(`${API_BASE}/api/logistics/zones`, { headers })
      ]);
      
      setHubs(hubsRes.data);
      setZones(zonesRes.data);
    } catch (err) {
      toast.error('Failed to load hubs data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fulfillment hub?")) return;
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_BASE}/api/logistics/hubs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Hub deleted successfully");
      fetchData();
    } catch (err) {
      toast.error("Error deleting hub");
    }
  };

  const toggleStatus = async (hub) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_BASE}/api/logistics/hubs/${hub._id}`, { isActive: !hub.isActive }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Hub ${hub.isActive ? 'deactivated' : 'activated'}`);
      fetchData();
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const openModal = (hub = null) => {
    setSelectedHub(hub);
    setIsModalOpen(true);
  };

  const totalHubs = hubs.length;
  const activeHubs = hubs.filter(h => h.isActive).length;
  
  // Calculate zones covered by active hubs
  const coveredZoneIds = new Set();
  hubs.forEach(h => {
    if (h.isActive && h.servedZones) {
      h.servedZones.forEach(z => coveredZoneIds.add(z._id || z));
    }
  });
  const totalZonesCovered = coveredZoneIds.size;

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header & Stats */}
      <div className="p-6 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 min-w-[120px]">
            <p className="text-xs font-bold text-slate-500 uppercase">Total Hubs</p>
            <p className="text-2xl font-black text-slate-800">{totalHubs}</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 min-w-[120px]">
            <p className="text-xs font-bold text-emerald-600 uppercase">Active Hubs</p>
            <p className="text-2xl font-black text-emerald-700">{activeHubs}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 min-w-[140px]">
            <p className="text-xs font-bold text-blue-600 uppercase">Zones Linked</p>
            <p className="text-2xl font-black text-blue-700">{totalZonesCovered} / {zones.length}</p>
          </div>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Hub
        </button>
      </div>

      {/* List */}
      <div className="p-6 flex-1 overflow-y-auto">
        {hubs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Fulfillment Hubs Setup</h3>
            <p className="text-slate-500 text-sm mb-4">Create your first physical warehouse/hub to assign delivery zones and enable smart estimations.</p>
            <button onClick={() => openModal()} className="text-blue-600 font-bold text-sm hover:underline">
              Create First Hub
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {hubs.map(hub => (
              <div key={hub._id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                      {hub.name}
                      {!hub.isActive && <span className="bg-slate-100 text-slate-500 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">Inactive</span>}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-1">{hub.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleStatus(hub)} className={`w-10 h-5 rounded-full relative transition-colors ${hub.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${hub.isActive ? 'translate-x-5' : ''}`}></span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Hours</p>
                      <p className="font-bold text-slate-700">{hub.operatingHours?.open} - {hub.operatingHours?.close}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Cutoff Time</p>
                      <p className="font-bold text-slate-700">{hub.orderCutoffTime}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Served Zones</p>
                  <div className="flex flex-wrap gap-1.5">
                    {hub.servedZones && hub.servedZones.length > 0 ? (
                      hub.servedZones.map(z => (
                        <span key={z._id || z} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-blue-100">
                          {z.name || 'Zone'}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No zones linked yet.</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6 border-t border-slate-100 pt-4">
                  <button onClick={() => openModal(hub)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(hub._id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <HubModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hub={selectedHub}
        zones={zones}
        onSave={fetchData}
      />
    </div>
  );
};
