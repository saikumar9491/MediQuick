import React from 'react';
import { Edit2, Trash2, Loader2, Mail, Smartphone, Bell, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const CampaignsTable = ({ campaigns, loading, onEdit, onRefresh }) => {

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_BASE}/api/marketing/campaigns/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Campaign deleted");
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete campaign");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'SMS': return <Smartphone className="w-4 h-4" />;
      case 'Push': return <Bell className="w-4 h-4" />;
      case 'Banner': return <ImageIcon className="w-4 h-4" />;
      default: return <Megaphone className="w-4 h-4" />;
    }
  };

  if (loading) return (
    <div className="flex-1 flex justify-center items-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  if (campaigns.length === 0) return (
    <div className="flex-1 flex justify-center items-center text-slate-500 p-12">
      No campaigns found. Create your first campaign!
    </div>
  );

  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-black text-slate-500">
            <th className="p-4">Campaign Name</th>
            <th className="p-4">Audience</th>
            <th className="p-4">Performance</th>
            <th className="p-4">Schedule</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {campaigns.map(c => {
            const openRate = c.metrics.sent > 0 ? ((c.metrics.opened / c.metrics.sent) * 100).toFixed(1) : 0;
            const clickRate = c.metrics.sent > 0 ? ((c.metrics.clicked / c.metrics.sent) * 100).toFixed(1) : 0;

            return (
              <tr key={c._id} className="hover:bg-slate-50 transition-colors bg-white">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600">
                      {getIcon(c.type)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{c.name}</p>
                      <p className="text-xs font-medium text-slate-500">{c.type}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded">
                    {c.targetAudience}
                  </span>
                </td>
                <td className="p-4 text-xs text-slate-600 space-y-1">
                  <p>Sent: <strong>{c.metrics.sent}</strong></p>
                  <p>Open: <strong>{openRate}%</strong></p>
                  <p>Click: <strong>{clickRate}%</strong></p>
                </td>
                <td className="p-4 text-sm text-slate-600">
                  {c.scheduledAt ? new Date(c.scheduledAt).toLocaleString() : 'Immediate'}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded font-bold text-[10px] uppercase ${
                    c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                    c.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                    c.status === 'Completed' ? 'bg-slate-200 text-slate-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(c)} title="Edit" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c._id)} title="Delete" className="p-1.5 text-rose-500 hover:bg-rose-50 rounded">
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
