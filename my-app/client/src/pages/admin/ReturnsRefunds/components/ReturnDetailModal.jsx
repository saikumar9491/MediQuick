import React, { useState, useEffect } from 'react';
import { X, Loader2, Save, Send, CreditCard, Banknote, History, Box, ChevronRight, CornerDownRight, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const ReturnDetailModal = ({ returnId, onClose, onUpdate }) => {
  const [ret, setRet] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Action State
  const [processing, setProcessing] = useState(false);
  const [noteText, setNoteText] = useState('');
  
  // Manual Refund State
  const [manualMethod, setManualMethod] = useState('Bank Transfer');
  const [manualRef, setManualRef] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get(`${API_BASE}/api/returns/${returnId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRet(res.data);
      } catch (err) {
        toast.error('Failed to load return details');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [returnId, onClose]);

  const handleStatusUpdate = async (newStatus) => {
    if (!noteText.trim()) {
      toast.error(`Please provide a reason/note for marking as ${newStatus}`);
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_BASE}/api/returns/${returnId}/status`, {
        status: newStatus,
        noteText
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success(`Return request ${newStatus}`);
      onUpdate();
      onClose();
    } catch (err) {
      toast.error('Failed to update status');
      setProcessing(false);
    }
  };

  const handleOnlineRefund = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_BASE}/api/returns/${returnId}/process-refund`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Refund processed successfully via Gateway');
      onUpdate();
      onClose();
    } catch (err) {
      toast.error('Failed to process refund');
      setProcessing(false);
    }
  };

  const handleManualRefund = async () => {
    if (!manualRef.trim()) {
      toast.error('Please provide a reference/transaction ID');
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_BASE}/api/returns/${returnId}/mark-refunded`, {
        method: manualMethod,
        reference: manualRef,
        noteText: noteText || `Refunded manually via ${manualMethod}. Ref: ${manualRef}`
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success('Marked as refunded manually');
      onUpdate();
      onClose();
    } catch (err) {
      toast.error('Failed to mark as refunded');
      setProcessing(false);
    }
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

  if (!ret) return null;

  const totalRefundAmount = ret.items.reduce((sum, i) => sum + i.refundAmount, 0);
  const isOnlinePayment = ret.orderId?.paymentMethod !== 'Cash on Delivery';

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-black text-slate-800">
                Return {ret.returnId}
              </h2>
              <span className={`px-2 py-1 rounded font-bold text-[10px] uppercase ${
                ret.status === 'Requested' ? 'bg-blue-100 text-blue-700' :
                ret.status === 'Under Review' ? 'bg-orange-100 text-orange-700' :
                ret.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                ret.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                'bg-indigo-100 text-indigo-700'
              }`}>
                {ret.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Requested on {new Date(ret.requestedAt).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0">
          
          {/* Left Column: Details */}
          <div className="flex-[6] p-6 overflow-y-auto custom-scrollbar border-r border-slate-200 space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider mb-2">Customer Info</p>
                <p className="font-bold text-slate-800">{ret.customerId?.name}</p>
                <p className="text-sm text-slate-600">{ret.customerId?.phone}</p>
                <p className="text-sm text-slate-600">{ret.customerId?.email}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Order Info</p>
                {ret.orderId ? (
                  <>
                    <p className="font-bold text-slate-800 font-mono text-sm">#{ret.orderId._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-slate-600 mt-1">Total: ₹{ret.orderId.totalAmount}</p>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      Payment: {isOnlinePayment ? <CreditCard className="w-3 h-3 text-emerald-500" /> : <Banknote className="w-3 h-3 text-orange-500" />}
                      <span className="font-bold">{ret.orderId.paymentMethod}</span>
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-400 italic">No order linked</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Items to Return</p>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2 font-black text-slate-600 text-xs">Product</th>
                      <th className="px-4 py-2 font-black text-slate-600 text-xs">Qty</th>
                      <th className="px-4 py-2 font-black text-slate-600 text-xs">Price</th>
                      <th className="px-4 py-2 font-black text-slate-600 text-xs">Refund</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ret.items.map((item, idx) => (
                      <tr key={idx} className="bg-white">
                        <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                        <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-slate-600">₹{item.unitPrice}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">₹{item.refundAmount}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50">
                      <td colSpan={3} className="px-4 py-3 font-bold text-right text-slate-600">Total Refund:</td>
                      <td className="px-4 py-3 font-black text-blue-600 text-lg">₹{totalRefundAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Reason: <span className="text-blue-600">{ret.reason}</span></p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 text-sm whitespace-pre-wrap">
                {ret.description}
              </div>
            </div>

            {ret.images && ret.images.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Attached Evidence</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {ret.images.map((img, idx) => (
                    <img key={idx} src={img} alt="Evidence" className="h-24 w-24 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity" />
                  ))}
                </div>
              </div>
            )}

            {/* Admin Action Area */}
            <div className="mt-8">
              <h3 className="font-black text-slate-800 mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                <CornerDownRight className="w-5 h-5 text-slate-400" /> Action Required
              </h3>
              
              {(ret.status === 'Requested' || ret.status === 'Under Review') && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-sm font-bold text-blue-800 mb-2">Review Return Request</p>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter reason or internal note for this decision... (Required)"
                    className="w-full p-3 rounded-lg border border-blue-200 text-sm mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={2}
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleStatusUpdate('Approved')}
                      disabled={processing}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Approve Return
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate('Rejected')}
                      disabled={processing}
                      className="flex-1 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Reject Return
                    </button>
                  </div>
                </div>
              )}

              {ret.status === 'Approved' && isOnlinePayment && (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                  <p className="text-sm font-bold text-orange-800 mb-2">Online Refund Pending</p>
                  <p className="text-xs text-orange-600 mb-4">
                    This order was paid via online gateway. Clicking below will trigger a refund request to Razorpay for ₹{totalRefundAmount}.
                  </p>
                  <button 
                    onClick={handleOnlineRefund}
                    disabled={processing}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                    Process Automatic Refund
                  </button>
                </div>
              )}

              {ret.status === 'Approved' && !isOnlinePayment && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-sm font-bold text-slate-800 mb-2">Manual Refund Processing</p>
                  <p className="text-xs text-slate-500 mb-4">
                    This was a COD order. You must process the refund manually (e.g. Bank Transfer or Wallet Credit) and record the reference here.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Method</label>
                      <select 
                        value={manualMethod} onChange={(e) => setManualMethod(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                      >
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Wallet Credit">Wallet Credit</option>
                        <option value="Store Credit">Store Credit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Transaction Ref</label>
                      <input 
                        type="text" value={manualRef} onChange={(e) => setManualRef(e.target.value)}
                        placeholder="e.g. UTR123456"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                      />
                    </div>
                  </div>
                  <textarea
                    value={noteText} onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Optional notes..."
                    className="w-full p-2 rounded-lg border border-slate-300 text-sm mb-3 outline-none"
                    rows={1}
                  />
                  <button 
                    onClick={handleManualRefund}
                    disabled={processing}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Mark as Refunded
                  </button>
                </div>
              )}

              {ret.status === 'Refunded' && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-indigo-800 mb-1 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Refund Completed</p>
                    <p className="text-xs text-indigo-600">Method: <strong>{ret.refundMethod}</strong></p>
                    <p className="text-xs text-indigo-600">Reference: <strong>{ret.refundReference || 'N/A'}</strong></p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-indigo-700 text-lg">₹{totalRefundAmount}</p>
                  </div>
                </div>
              )}

              {ret.status === 'Rejected' && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                  <p className="text-sm font-bold text-rose-800 flex items-center gap-1"><X className="w-4 h-4" /> Return Rejected</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: History & Notes */}
          <div className="flex-[4] bg-slate-50 border-l border-slate-200 flex flex-col p-4 gap-4 overflow-y-auto">
            
            {/* Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shrink-0">
              <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 mb-4">
                <History className="w-4 h-4" /> Status Timeline
              </h3>
              <div className="space-y-4 relative">
                {ret.statusHistory && ret.statusHistory.length > 0 ? (
                  ret.statusHistory.map((h, i) => (
                    <div key={i} className="flex gap-3 relative">
                      {i !== ret.statusHistory.length - 1 && (
                        <div className="absolute left-2.5 top-6 bottom-[-16px] w-0.5 bg-slate-200"></div>
                      )}
                      <div className="w-5 h-5 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center shrink-0 z-10"></div>
                      <div className="pb-1 flex-1">
                        <p className="text-sm font-bold text-slate-800">{h.status}</p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {new Date(h.changedAt).toLocaleString()} • By {h.changedBy?.name || 'System'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No history available</p>
                )}
              </div>
            </div>

            {/* Internal Notes */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex-1 flex flex-col min-h-0">
               <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 mb-4">
                <Box className="w-4 h-4" /> Admin Activity Log
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                {ret.adminNotes && ret.adminNotes.length > 0 ? (
                  ret.adminNotes.map((note, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-700 text-xs">{note.adminName}</span>
                        <span className="text-[10px] text-slate-400">{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic text-center mt-4">No internal notes</p>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
