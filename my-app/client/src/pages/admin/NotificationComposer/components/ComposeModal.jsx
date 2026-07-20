import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, Info } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const ComposeModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    channels: ['email'],
    audienceType: 'All',
    audienceFilter: '',
    status: 'Draft',
    scheduledAt: ''
  });

  const [audienceCount, setAudienceCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [counting, setCounting] = useState(false);

  useEffect(() => {
    const fetchAudienceCount = async () => {
      setCounting(true);
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get(`${API_BASE}/api/notifications/audience-count`, {
          params: { type: formData.audienceType, filter: formData.audienceFilter },
          headers: { Authorization: `Bearer ${token}` }
        });
        setAudienceCount(res.data.count);
      } catch (err) {
        setAudienceCount(0);
      } finally {
        setCounting(false);
      }
    };
    fetchAudienceCount();
  }, [formData.audienceType, formData.audienceFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChannelToggle = (channel) => {
    setFormData(prev => {
      if (prev.channels.includes(channel)) {
        return { ...prev, channels: prev.channels.filter(c => c !== channel) };
      }
      return { ...prev, channels: [...prev.channels, channel] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message || formData.channels.length === 0) {
      toast.error('Please fill title, message, and select at least one channel');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const payload = { ...formData };
      if (payload.status === 'Scheduled' && !payload.scheduledAt) {
        toast.error("Please select a schedule time");
        setLoading(false);
        return;
      }

      await axios.post(`${API_BASE}/api/notifications`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Notification saved");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <h2 className="text-lg font-black text-slate-800">Compose Notification</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 mb-2">Delivery Channels *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.channels.includes('email')} onChange={() => handleChannelToggle('email')} className="w-4 h-4 text-sky-600 rounded border-slate-300" />
                    <span className="text-sm font-bold text-slate-700">Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.channels.includes('sms')} onChange={() => handleChannelToggle('sms')} className="w-4 h-4 text-sky-600 rounded border-slate-300" />
                    <span className="text-sm font-bold text-slate-700">SMS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.channels.includes('push')} onChange={() => handleChannelToggle('push')} className="w-4 h-4 text-sky-600 rounded border-slate-300" />
                    <span className="text-sm font-bold text-slate-700">Push</span>
                  </label>
                </div>
                
                {(formData.channels.includes('sms') || formData.channels.includes('push')) && (
                  <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 font-medium flex gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    SMS/Push providers are not configured yet. Saving this will succeed, but sending will return a provider error.
                  </div>
                )}
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Title / Subject *</label>
                  <input 
                    type="text" name="title" required
                    value={formData.title} onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-600">Message Body *</label>
                    <span className={`text-[10px] font-bold ${formData.message.length > 160 && formData.channels.includes('sms') ? 'text-rose-500' : 'text-slate-400'}`}>
                      {formData.message.length} chars {formData.channels.includes('sms') && '(>160 may split SMS)'}
                    </span>
                  </div>
                  <textarea 
                    name="message" required rows={6}
                    value={formData.message} onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Audience Type</label>
                  <select 
                    name="audienceType" value={formData.audienceType} onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="All">All Customers</option>
                    <option value="Segment">Specific Segment</option>
                  </select>
                </div>
                
                {formData.audienceType === 'Segment' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Segment Filter</label>
                    <select 
                      name="audienceFilter" value={formData.audienceFilter} onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="">Select segment...</option>
                      <option value="Inactive 30+ days">Inactive 30+ days</option>
                    </select>
                  </div>
                )}
                
                <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase">Est. Recipients</span>
                  {counting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  ) : (
                    <span className="font-black text-slate-800">{audienceCount} customers</span>
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Action</label>
                  <select 
                    name="status" value={formData.status} onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Draft">Save as Draft (Send Later)</option>
                    <option value="Scheduled">Schedule for Later</option>
                  </select>
                </div>
                
                {formData.status === 'Scheduled' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Schedule Time</label>
                    <input 
                      type="datetime-local" name="scheduledAt" 
                      value={formData.scheduledAt} onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 sticky bottom-0">
            <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={loading || audienceCount === 0} className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg flex items-center gap-2 shadow-sm disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {formData.status === 'Draft' ? 'Save Draft' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
