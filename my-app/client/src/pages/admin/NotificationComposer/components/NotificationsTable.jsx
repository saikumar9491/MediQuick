import React from 'react';
import { Loader2, Send, Clock, Mail, Smartphone, BellRing } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const NotificationsTable = ({ notifications, loading, onRefresh }) => {

  const handleSendNow = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to send this notification now?")) return;
    const loadId = toast.loading("Processing campaign...");
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.post(`${API_BASE}/api/notifications/${id}/send`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.errors && res.data.errors.length > 0) {
        toast.success(`Sent via configured channels.`, { id: loadId });
        res.data.errors.forEach(err => toast.error(err, { duration: 5000 }));
      } else {
        toast.success(`Successfully processed! Delivered to ${res.data.delivered}.`, { id: loadId });
      }
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send", { id: loadId });
    }
  };

  if (loading) return (
    <div className="flex-1 flex justify-center items-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
    </div>
  );

  if (notifications.length === 0) return (
    <div className="flex-1 flex justify-center items-center text-slate-500 py-12">
      No notifications found. Create a new campaign!
    </div>
  );

  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black text-slate-500 tracking-wider">
            <th className="p-4">Message</th>
            <th className="p-4">Channels</th>
            <th className="p-4">Audience</th>
            <th className="p-4">Status</th>
            <th className="p-4">Date</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {notifications.map(n => {
            return (
              <tr key={n._id} className="hover:bg-slate-50 transition-colors bg-white">
                <td className="p-4">
                  <p className="font-bold text-slate-800 text-sm max-w-[250px] truncate">{n.title}</p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[250px]">{n.message}</p>
                </td>
                <td className="p-4 flex gap-1">
                  {n.channels.includes('email') && <Mail className="w-4 h-4 text-slate-400" />}
                  {n.channels.includes('sms') && <Smartphone className="w-4 h-4 text-slate-400" />}
                  {n.channels.includes('push') && <BellRing className="w-4 h-4 text-slate-400" />}
                </td>
                <td className="p-4">
                  <p className="font-bold text-xs text-slate-700">{n.audienceType}</p>
                  {n.audienceFilter && <p className="text-[10px] text-slate-500">{n.audienceFilter}</p>}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded font-bold text-[10px] uppercase ${
                    n.status === 'Sent' ? 'bg-emerald-100 text-emerald-700' :
                    n.status === 'Scheduled' ? 'bg-amber-100 text-amber-700' :
                    n.status === 'Failed' ? 'bg-rose-100 text-rose-700' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {n.status}
                  </span>
                  {n.status === 'Sent' && <p className="text-[10px] text-emerald-600 mt-1 font-bold">{n.deliveredCount} delivered</p>}
                </td>
                <td className="p-4 text-xs font-medium text-slate-600">
                  {n.status === 'Sent' && n.sentAt ? new Date(n.sentAt).toLocaleString() : 
                   n.scheduledAt ? new Date(n.scheduledAt).toLocaleString() : 'N/A'}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1">
                    {n.status === 'Draft' && (
                      <button 
                        onClick={(e) => handleSendNow(e, n._id)} 
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Send className="w-3 h-3" /> Send
                      </button>
                    )}
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
