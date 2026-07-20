import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Send } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const CampaignModal = ({ campaign, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    type: campaign?.type || 'Email',
    targetAudience: campaign?.targetAudience || 'All Customers',
    message: campaign?.message || '',
    status: campaign?.status || 'Draft',
    scheduledAt: campaign?.scheduledAt ? new Date(campaign.scheduledAt).toISOString().slice(0,16) : '',
    linkedCouponId: campaign?.linkedCouponId?._id || ''
  });

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get(`${API_BASE}/api/coupons`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCoupons(res.data.filter(c => c.isActive));
      } catch (err) {
        console.error('Failed to load coupons', err);
      }
    };
    fetchCoupons();
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      
      const payload = { ...formData };
      if (!payload.linkedCouponId) payload.linkedCouponId = null;
      if (!payload.scheduledAt) payload.scheduledAt = null;

      if (campaign) {
        await axios.patch(`${API_BASE}/api/marketing/campaigns/${campaign._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Campaign updated");
      } else {
        await axios.post(`${API_BASE}/api/marketing/campaigns`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Campaign created");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-black text-slate-800">
            {campaign ? 'Edit Campaign' : 'Create Campaign'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Campaign Name *</label>
            <input 
              type="text" name="name" required
              value={formData.name} onChange={handleChange}
              placeholder="e.g. Summer Clearance Sale"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Campaign Type *</label>
              <select 
                name="type" value={formData.type} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
                <option value="Push">Push Notification</option>
                <option value="Banner">App Banner</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Target Audience *</label>
              <select 
                name="targetAudience" value={formData.targetAudience} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Customers">All Customers</option>
                <option value="Inactive 30+ Days">Inactive 30+ Days</option>
                <option value="High Value">High Value</option>
                <option value="Specific Zone">Specific Zone</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Message Content *</label>
            <textarea 
              name="message" required rows="3"
              value={formData.message} onChange={handleChange}
              placeholder="Write your promotional message here..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Schedule At</label>
              <input 
                type="datetime-local" name="scheduledAt"
                value={formData.scheduledAt} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Leave blank to send immediately (or save as Draft).</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Status</label>
              <select 
                name="status" value={formData.status} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Active">Active (Sending)</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Linked Coupon (Optional)</label>
            <select 
              name="linkedCouponId" value={formData.linkedCouponId} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- None --</option>
              {coupons.map(c => (
                <option key={c._id} value={c._id}>{c.code} ({c.discountType === 'Percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`})</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Campaign
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
