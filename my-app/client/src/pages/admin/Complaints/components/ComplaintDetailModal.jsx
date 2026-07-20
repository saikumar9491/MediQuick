import React, { useState, useEffect } from 'react';
import { X, Loader2, Save, Send, Link, History, Package } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';
import { InternalNotesThread } from './InternalNotesThread';

export const ComplaintDetailModal = ({ complaintId, onClose, onUpdate }) => {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [adminUsers, setAdminUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        
        // Fetch Complaint
        const res = await axios.get(`${API_BASE}/api/complaints/${complaintId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComplaint(res.data);
        setStatus(res.data.status);
        setPriority(res.data.priority);
        setAssignedTo(res.data.assignedTo?._id || '');
        setResolutionNotes(res.data.resolutionNotes || '');

        // Fetch Admin users for assignment
        const usersRes = await axios.get(`${API_BASE}/api/users?role=admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdminUsers(usersRes.data.users || []); // Assuming paginated response has users array
        
      } catch (err) {
        toast.error('Failed to load complaint details');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [complaintId, onClose]);

  const handleSave = async () => {
    if (status === 'Resolved' && !resolutionNotes.trim()) {
      toast.error('Resolution notes are required when resolving a complaint');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('userToken');
      
      // Update status/priority/resolution
      await axios.patch(`${API_BASE}/api/complaints/${complaintId}/status`, {
        status,
        priority,
        resolutionNotes
      }, { headers: { Authorization: `Bearer ${token}` } });

      // Update assignee if changed
      if (assignedTo !== (complaint.assignedTo?._id || '')) {
        await axios.patch(`${API_BASE}/api/complaints/${complaintId}/assign`, {
          assignedTo: assignedTo || null
        }, { headers: { Authorization: `Bearer ${token}` } });
      }

      toast.success('Complaint updated successfully');
      onUpdate();
      onClose();
    } catch (err) {
      toast.error('Failed to update complaint');
      setSaving(false);
    }
  };

  const handleAddNote = async (text) => {
    setNoteSubmitting(true);
    try {
      const token = localStorage.getItem('userToken');
      // For demo, we can just extract admin name from token/localstorage, 
      // but assuming the backend can take it from body if auth is simple, or we just pass a string
      const adminName = 'Admin'; // You'd ideally get this from auth context

      const res = await axios.post(`${API_BASE}/api/complaints/${complaintId}/notes`, {
        text,
        adminName
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setComplaint(prev => ({ ...prev, internalNotes: res.data.internalNotes }));
      toast.success('Note added');
    } catch (err) {
      toast.error('Failed to add note');
    } finally {
      setNoteSubmitting(false);
    }
  };

  const handleSendUpdate = () => {
    toast.success('Customer notified via SMS/Email (Simulated)');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
          <p className="text-slate-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-black text-slate-800">
                Complaint {complaint.complaintId}
              </h2>
              <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded font-bold text-[10px] uppercase">
                {complaint.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Raised on {new Date(complaint.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0">
          
          {/* Left Column: Details & Forms */}
          <div className="flex-[6] p-6 overflow-y-auto custom-scrollbar border-r border-slate-200">
            
            {/* Customer & Order Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider mb-2">Customer Info</p>
                <p className="font-bold text-slate-800">{complaint.customerId?.name}</p>
                <p className="text-sm text-slate-600">{complaint.customerId?.phone}</p>
                <p className="text-sm text-slate-600">{complaint.customerId?.email}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                  Related Order
                  {complaint.orderId && <Link className="w-3 h-3 text-blue-500 cursor-pointer" title="View Order" />}
                </p>
                {complaint.orderId ? (
                  <>
                    <p className="font-bold text-slate-800 font-mono text-sm">#{complaint.orderId._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-slate-600 mt-1">
                      Status: <span className="font-bold">{complaint.orderId.status}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Placed: {new Date(complaint.orderId.createdAt).toLocaleDateString()}</p>
                  </>
                ) : (
                  <p className="text-sm text-slate-400 italic">No order linked</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Issue Description</p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 text-sm whitespace-pre-wrap">
                {complaint.description}
              </div>
            </div>

            {/* Evidence Images */}
            {complaint.images && complaint.images.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Attached Evidence</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {complaint.images.map((img, idx) => (
                    <img key={idx} src={img} alt="Evidence" className="h-24 w-24 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity" />
                  ))}
                </div>
              </div>
            )}

            <hr className="border-slate-200 my-6" />

            {/* Action Form */}
            <div className="space-y-4">
              <h3 className="font-black text-slate-800">Update Ticket</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Status</label>
                  <select 
                    value={status} onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-slate-700"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Escalated">Escalated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Priority</label>
                  <select 
                    value={priority} onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-slate-700"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Assigned To</label>
                <select 
                  value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-slate-700"
                >
                  <option value="">Unassigned</option>
                  {adminUsers.map(u => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              </div>

              {status === 'Resolved' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Resolution Notes <span className="text-rose-500">*</span>
                  </label>
                  <textarea 
                    value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Describe how this issue was resolved..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[80px]"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Notes & History */}
          <div className="flex-[4] bg-slate-50 border-l border-slate-200 flex flex-col p-4 gap-4 overflow-y-auto">
            <div className="flex-1 min-h-0">
              <InternalNotesThread 
                notes={complaint.internalNotes} 
                onAddNote={handleAddNote} 
                submitting={noteSubmitting}
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 h-64 overflow-y-auto custom-scrollbar shrink-0">
              <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 mb-4">
                <History className="w-4 h-4" /> Status History
              </h3>
              <div className="space-y-4">
                {complaint.statusHistory && complaint.statusHistory.length > 0 ? (
                  complaint.statusHistory.slice().reverse().map((h, i) => (
                    <div key={i} className="flex gap-3 relative">
                      {i !== complaint.statusHistory.length - 1 && (
                        <div className="absolute left-2.5 top-6 bottom-[-16px] w-0.5 bg-slate-200"></div>
                      )}
                      <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center shrink-0 z-10"></div>
                      <div className="pb-1">
                        <p className="text-sm font-bold text-slate-800">Changed to {h.status}</p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          By {h.changedBy?.name || 'System'} • {new Date(h.changedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No history available</p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center shrink-0">
          <button 
            onClick={handleSendUpdate}
            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold rounded-lg transition-colors text-sm"
          >
            <Send className="w-4 h-4" /> Notify Customer
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
