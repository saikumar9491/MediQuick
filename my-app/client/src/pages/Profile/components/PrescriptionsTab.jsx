import React, { useState, useEffect } from 'react';
import { FileText, Plus, Loader2, Clock, CheckCircle2, XCircle, AlertTriangle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchPrescriptions, uploadPrescription } from '../../../api/profile';

const STATUS_BADGES = {
  'Pending Review': 'bg-orange-50 text-[#FF6B00] border-orange-200',
  Approved: 'bg-green-50 text-[#16A34A] border-green-200',
  Rejected: 'bg-red-50 text-[#EF4444] border-red-200'
};

const PrescriptionsTab = ({ token }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedRx, setSelectedRx] = useState(null);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await fetchPrescriptions(token);
      setPrescriptions(data);
    } catch (_) {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, [token]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      return toast.error('Only images and PDFs are allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Maximum file size is 5MB');
    }

    const reader = new FileReader();
    reader.onloadstart = () => setUploading(true);
    reader.onerror = () => {
      setUploading(false);
      toast.error('Failed to read file');
    };
    reader.onload = async () => {
      try {
        const base64 = reader.result;
        const newRx = await uploadPrescription(token, {
          prescriptionUrl: base64,
          fileName: file.name,
          fileSize: file.size
        });
        toast.success('Prescription uploaded successfully!');
        setPrescriptions(prev => [newRx, ...prev]);
      } catch (err) {
        toast.error(err.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">My Prescriptions</h2>
            <p className="text-xs text-slate-400">Pre-upload and manage doctor prescriptions for quick checkout.</p>
          </div>
        </div>

        <label className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-[0.98]">
          {uploading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Plus size={14} />
          )}
          <span>{uploading ? 'Uploading...' : 'Upload New'}</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto text-slate-300 mb-3" size={36} strokeWidth={1.5} />
          <p className="text-sm text-slate-500 font-medium">No prescriptions found</p>
          <p className="text-xs text-slate-400 mt-1">Upload a prescription now to pre-verify for your next checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prescriptions.map((rx) => (
            <div key={rx._id} className="rounded-2xl border border-slate-200 p-4 bg-white hover:border-slate-350 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{rx.fileName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Uploaded {new Date(rx.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 border text-[9px] font-bold rounded-full uppercase tracking-wider ${STATUS_BADGES[rx.status] || 'bg-slate-50'}`}>
                    {rx.status}
                  </span>
                </div>

                {/* Thumbnail Preview */}
                {rx.prescriptionUrl && (
                  <div className="h-32 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden mb-3 flex items-center justify-center relative group">
                    <img src={rx.prescriptionUrl} alt={rx.fileName} className="h-full object-contain p-2" />
                    <button
                      onClick={() => setSelectedRx(rx)}
                      className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-1.5 transition-all"
                    >
                      <Eye size={14} /> Preview
                    </button>
                  </div>
                )}

                {/* Rejected Reason */}
                {rx.status === 'Rejected' && rx.rejectionReason && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-1.5 text-[11px] text-red-700">
                    <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Rejection reason:</span> {rx.rejectionReason}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 max-h-[85vh] flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs font-semibold text-slate-700">{selectedRx.fileName}</span>
              <button
                onClick={() => setSelectedRx(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-50 border rounded-xl p-4 flex items-center justify-center">
              <img src={selectedRx.prescriptionUrl} alt="Prescription" className="max-h-[50vh] object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsTab;
