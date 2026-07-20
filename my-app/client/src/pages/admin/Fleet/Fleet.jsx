import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Truck, Plus } from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { FleetStatsStrip } from './components/FleetStatsStrip';
import { VehiclesTable } from './components/VehiclesTable';
import { VehicleModal } from './components/VehicleModal';
import toast from 'react-hot-toast';

const Fleet = () => {
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/fleet/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching fleet stats', err);
    }
  };

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/fleet/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { status, search }
      });
      setVehicles(res.data);
    } catch (err) {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    fetchStats();
    fetchVehicles();
  }, [fetchVehicles]);

  const handleOpenAdd = () => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v) => {
    setSelectedVehicle(v);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    fetchStats();
    fetchVehicles();
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Truck className="w-7 h-7 text-blue-600" />
            Fleet Console
          </h1>
          <p className="text-sm text-slate-500 font-medium">Manage delivery vehicles and maintenance schedules</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <FleetStatsStrip stats={stats} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[400px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4 rounded-t-xl">
            <input 
              type="text" 
              placeholder="Search Plate Number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Maintenance Due">Maintenance Due</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>

          <VehiclesTable 
            vehicles={vehicles}
            loading={loading}
            onEdit={handleOpenEdit}
            onRefresh={handleRefresh}
          />
        </div>
      </div>

      {isModalOpen && (
        <VehicleModal 
          vehicle={selectedVehicle}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
};

export default Fleet;
