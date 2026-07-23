import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle2, Loader2, Send, X } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../utils/apiConfig';
import { toast } from 'react-hot-toast';

const RaiseComplaint = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  const initialOrderId = location.state?.orderId || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [category, setCategory] = useState('Product Quality');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [complaintDetails, setComplaintDetails] = useState(null);

  useEffect(() => {
    if (!token) {
      toast.error('Please log in to raise a complaint');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please describe your issue');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        orderId: orderId.trim() || undefined,
        category,
        priority,
        description: description.trim(),
        images
      };

      const res = await axios.post(`${API_BASE}/api/complaints`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComplaintDetails(res.data.complaint);
      setSuccess(true);
      toast.success('Complaint raised successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddImage = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) {
      toast.error('Please enter a valid image URL');
      return;
    }
    if (images.length >= 4) {
      toast.error('You can attach up to 4 images');
      return;
    }
    setImages(prev => [...prev, trimmed]);
    setImageUrlInput('');
    toast.success('Image attached');
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  if (success && complaintDetails) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Support Ticket Raised!</h2>
            <p className="text-xs text-slate-400 mt-1">Our support agents are on it.</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-400">Ticket ID:</span>
              <span className="font-mono text-slate-800 font-bold">{complaintDetails.complaintId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Category:</span>
              <span className="text-slate-800 font-bold">{complaintDetails.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Priority:</span>
              <span className="text-slate-850 font-bold">{complaintDetails.priority}</span>
            </div>
            {complaintDetails.orderId && (
              <div className="flex justify-between">
                <span className="text-slate-400">Related Order ID:</span>
                <span className="font-mono text-slate-700 truncate max-w-[150px]">{complaintDetails.orderId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">
                {complaintDetails.status}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate('/my-orders')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-bold rounded-xl text-xs shadow-md shadow-blue-100"
            >
              Go to My Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-550 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-850">File a Support Ticket / Complaint</h1>
              <p className="text-xs text-slate-400">Let us resolve any issues with your order quickly.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Order ID */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-600 uppercase tracking-wider">
                Order ID (Optional)
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. 6a610e647e6d71..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-wider">
                  Issue Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="Product Quality">Product Quality</option>
                  <option value="Delivery Delay">Delivery Delay</option>
                  <option value="Wrong Item">Wrong Item</option>
                  <option value="Damaged Item">Damaged Item</option>
                  <option value="Prescription Issue">Prescription Issue</option>
                  <option value="Refund Not Received">Refund Not Received</option>
                  <option value="Rider Behavior">Rider Behavior</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-wider">
                  Severity / Urgency
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-600 uppercase tracking-wider">
                Describe the Issue <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe what is wrong so we can resolve it immediately..."
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs font-semibold text-slate-700 leading-relaxed"
                required
              />
            </div>

            {/* Attach Images */}
            <div className="space-y-3 pt-2">
              <label className="block text-[10px] font-black text-slate-600 uppercase tracking-wider">
                Attach Photo URLs (Optional - Max 4)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Paste direct image link/URL..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs font-semibold text-slate-700"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition-all"
                >
                  Attach Link
                </button>
              </div>

              {images.length > 0 && (
                <div className="flex gap-3 flex-wrap pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-1 group">
                      <img src={img} alt="attached thumbnail" className="max-h-full max-w-full object-contain" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#00a2a4] hover:bg-[#00898b] active:scale-95 transition-all text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#00a2a4]/10 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting ticket...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Support Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RaiseComplaint;
