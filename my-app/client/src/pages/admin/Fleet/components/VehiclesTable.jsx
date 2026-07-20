import React from 'react';
import { Edit2, Trash2, Loader2, Wrench } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const VehiclesTable = ({ vehicles, loading, onEdit, onRefresh }) => {

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_BASE}/api/fleet/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Vehicle deleted");
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete vehicle");
    }
  };

  const handleMaintenance = async (id) => {
    if (!window.confirm("Mark this vehicle as 'Maintenance Due'? This will flag the assigned rider as off-duty.")) return;
    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_BASE}/api/fleet/vehicles/${id}`, { status: 'Maintenance Due' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Vehicle marked for maintenance");
      onRefresh();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return (
    <div className="flex-1 flex justify-center items-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  if (vehicles.length === 0) return (
    <div className="flex-1 flex justify-center items-center text-slate-500">
      No vehicles found.
    </div>
  );

  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-black text-slate-500">
            <th className="p-4">Plate Number</th>
            <th className="p-4">Type</th>
            <th className="p-4">Assigned Rider</th>
            <th className="p-4">Next Service Due</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {vehicles.map(v => (
            <tr key={v._id} className="hover:bg-slate-50 transition-colors bg-white">
              <td className="p-4 font-mono font-bold text-slate-800">{v.plateNumber}</td>
              <td className="p-4 text-slate-600 font-medium">{v.type}</td>
              <td className="p-4">
                {v.assignedRiderId ? (
                  <p className="font-bold text-slate-700">{v.assignedRiderId.name}</p>
                ) : (
                  <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded">Unassigned</span>
                )}
              </td>
              <td className="p-4 text-slate-600 text-sm">
                {v.nextServiceDue ? new Date(v.nextServiceDue).toLocaleDateString() : 'N/A'}
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded font-bold text-[10px] uppercase ${
                  v.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                  v.status === 'Maintenance Due' ? 'bg-orange-100 text-orange-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  {v.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => handleMaintenance(v._id)} title="Mark Maintenance" className="p-1.5 text-orange-500 hover:bg-orange-50 rounded">
                    <Wrench className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEdit(v)} title="Edit" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(v._id)} title="Delete" className="p-1.5 text-rose-500 hover:bg-rose-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
