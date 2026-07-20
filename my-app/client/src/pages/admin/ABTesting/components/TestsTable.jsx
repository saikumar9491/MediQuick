import React from 'react';
import { Loader2, Trash2, Power, Eye } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const TestsTable = ({ tests, loading, onRowClick, onRefresh }) => {

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_BASE}/api/ab-tests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Test deleted");
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete test");
    }
  };

  const handleToggleStatus = async (e, test) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('userToken');
      const newStatus = test.status === 'Running' ? 'Completed' : 'Running';
      await axios.patch(`${API_BASE}/api/ab-tests/${test._id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Test marked as ${newStatus}`);
      onRefresh();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return (
    <div className="flex-1 flex justify-center items-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  if (tests.length === 0) return (
    <div className="flex-1 flex justify-center items-center text-slate-500 py-12">
      No A/B tests found. Create one to get started!
    </div>
  );

  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black text-slate-500 tracking-wider">
            <th className="p-4">Test Name</th>
            <th className="p-4">Type</th>
            <th className="p-4">Traffic Split</th>
            <th className="p-4">Status</th>
            <th className="p-4">Start Date</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tests.map(t => {
            return (
              <tr 
                key={t._id} 
                onClick={() => onRowClick(t._id)}
                className="hover:bg-slate-50 transition-colors bg-white cursor-pointer"
              >
                <td className="p-4">
                  <p className="font-bold text-slate-800 text-sm max-w-[250px] truncate">{t.name}</p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[250px]">{t.description}</p>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 font-bold text-[10px] rounded uppercase">
                    {t.type}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                    <span className="text-indigo-600">A: {t.trafficSplit}%</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-emerald-600">B: {100 - t.trafficSplit}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded font-bold text-[10px] uppercase ${
                    t.status === 'Running' ? 'bg-indigo-100 text-indigo-700' :
                    t.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="p-4 text-xs font-medium text-slate-600">
                  {t.startDate ? new Date(t.startDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={(e) => { e.stopPropagation(); onRowClick(t._id); }} title="View Results" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    {t.status !== 'Completed' && (
                      <button 
                        onClick={(e) => handleToggleStatus(e, t)} 
                        title={t.status === 'Running' ? 'Stop Test' : 'Start Test'}
                        className={`p-2 rounded-lg transition-colors ${t.status === 'Running' ? 'text-amber-500 hover:bg-amber-50' : 'text-indigo-500 hover:bg-indigo-50'}`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={(e) => handleDelete(e, t._id)} title="Delete" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
