import React, { useState } from 'react';
import { Send, Loader2, User, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const AbandonedCartTable = ({ carts, loading, onRefresh }) => {
  const [sendingId, setSendingId] = useState(null);

  const handleSendReminder = async (id) => {
    setSendingId(id);
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_BASE}/api/carts/${id}/send-reminder`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Reminder sent successfully");
      onRefresh();
    } catch (err) {
      toast.error("Failed to send reminder");
    } finally {
      setSendingId(null);
    }
  };

  if (loading) return (
    <div className="flex-1 flex justify-center items-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  if (carts.length === 0) return (
    <div className="flex-1 flex justify-center items-center text-slate-500 p-12">
      No abandoned carts found in the last 48 hours.
    </div>
  );

  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-black text-slate-500">
            <th className="p-4">Customer</th>
            <th className="p-4">Cart Details</th>
            <th className="p-4">Abandoned At</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {carts.map(c => {
            const totalValue = c.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const isReminded = c.status === 'Reminded';

            return (
              <tr key={c._id} className="hover:bg-slate-50 transition-colors bg-white">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{c.userId?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{c.userId?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-800">₹{totalValue}</p>
                  <p className="text-xs text-slate-500 truncate max-w-[150px]">
                    {c.items.length} items: {c.items[0]?.name} {c.items.length > 1 ? '...' : ''}
                  </p>
                </td>
                <td className="p-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {new Date(c.lastActivityAt).toLocaleString()}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded font-bold text-[10px] uppercase ${
                    isReminded ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {isReminded ? 'Reminded' : 'Not Contacted'}
                  </span>
                  {c.recoveryEmailSentAt && (
                    <p className="text-[10px] text-slate-500 mt-1">
                      Sent {new Date(c.recoveryEmailSentAt).toLocaleDateString()}
                    </p>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleSendReminder(c._id)} 
                    disabled={sendingId === c._id}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 ml-auto transition-colors ${
                      isReminded ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    {sendingId === c._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                     isReminded ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    {isReminded ? 'Send Again' : 'Send Reminder'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
