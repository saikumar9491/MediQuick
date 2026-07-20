import React, { useState } from 'react';
import { X, Save, Loader2, Info } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const CreateTestModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Banner',
    trafficSplit: 50,
    successMetric: 'Conversion Rate',
    variantA: '',
    variantB: '',
    status: 'Draft',
    startDate: new Date().toISOString().slice(0, 16)
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.variantA || !formData.variantB) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      
      const payload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        trafficSplit: Number(formData.trafficSplit),
        successMetric: formData.successMetric,
        status: formData.status,
        startDate: formData.startDate,
        variants: [
          { label: 'A', content: formData.variantA },
          { label: 'B', content: formData.variantB }
        ]
      };

      await axios.post(`${API_BASE}/api/ab-tests`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("A/B Test Created");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <h2 className="text-lg font-black text-slate-800">Create A/B Test</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-800 font-medium leading-relaxed">
            <strong>Note:</strong> Creating a test here sets up the tracking and reporting infrastructure. 
            Your customer-facing frontend application will need to be updated by a developer to read this configuration and hit the <code className="bg-white px-1 py-0.5 rounded text-indigo-900">/api/ab-tests/:id/track</code> endpoint before real data will flow in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-slate-50/50">
          
          <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Test Name *</label>
              <input 
                type="text" name="name" required
                value={formData.name} onChange={handleChange}
                placeholder="e.g. Homepage Hero Banner Test"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Hypothesis / Description</label>
              <textarea 
                name="description" rows={2}
                value={formData.description} onChange={handleChange}
                placeholder="e.g. Changing the banner color to red will increase conversions."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Test Type *</label>
                <select 
                  name="type" value={formData.type} onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Banner</option>
                  <option>Product Sort</option>
                  <option>Pricing</option>
                  <option>Notification Copy</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Success Metric *</label>
                <select 
                  name="successMetric" value={formData.successMetric} onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Conversion Rate</option>
                  <option>Click-through Rate</option>
                  <option>Revenue per Visitor</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Variants Configuration</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-indigo-600 mb-1">Variant A (Control) Content *</label>
                <textarea 
                  name="variantA" required rows={3}
                  value={formData.variantA} onChange={handleChange}
                  placeholder="Config for A (e.g. image URL, or 'blue-button')"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-600 mb-1">Variant B (Challenger) Content *</label>
                <textarea 
                  name="variantB" required rows={3}
                  value={formData.variantB} onChange={handleChange}
                  placeholder="Config for B (e.g. image URL, or 'red-button')"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">
                Traffic Split (A: {formData.trafficSplit}% / B: {100 - formData.trafficSplit}%)
              </label>
              <input 
                type="range" name="trafficSplit" min="10" max="90" step="1"
                value={formData.trafficSplit} onChange={handleChange}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Start Date</label>
              <input 
                type="datetime-local" name="startDate" 
                value={formData.startDate} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Initial Status</label>
              <select 
                name="status" value={formData.status} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Draft">Draft</option>
                <option value="Running">Running (Start Immediately)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 pb-2">
            <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-sm">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Create Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
