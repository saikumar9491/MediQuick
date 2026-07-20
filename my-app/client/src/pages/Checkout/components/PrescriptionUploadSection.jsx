import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, X, Loader2, ImageIcon } from 'lucide-react';
import { uploadPrescription } from '../../../api/checkout';

export const PrescriptionUploadSection = ({ token, rxItems, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (f) => {
    if (!f) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(f.type)) {
      setError('Only JPG, PNG, WEBP, or PDF files are accepted');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB');
      return;
    }
    setError('');
    setFile(f);
    setUploading(true);
    try {
      const result = await uploadPrescription(token, f);
      onUploadComplete(result.prescriptionUrl);
      setUploaded(true);
    } catch (e) {
      setError(e.message || 'Upload failed. Please try again.');
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [token]);

  const handleRemove = () => {
    setFile(null);
    setUploaded(false);
    onUploadComplete(null);
  };

  return (
    <div className="space-y-4">
      {/* Notice */}
      <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
        <div className="w-5 h-5 rounded-full bg-amber-400 text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">!</div>
        <div>
          <p className="text-xs font-semibold text-amber-800">Prescription required</p>
          <p className="text-xs text-amber-700 mt-0.5">
            {rxItems.map(i => i.name).join(', ')} require{rxItems.length === 1 ? 's' : ''} a valid doctor's prescription.
            Please upload a clear photo or scanned copy.
          </p>
        </div>
      </div>

      {/* Upload Area */}
      {!uploaded ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl transition-all ${
            dragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
          }`}
        >
          <label className="flex flex-col items-center gap-3 p-8 cursor-pointer">
            <div className={`p-3 rounded-full ${dragging ? 'bg-blue-100 text-blue-500' : 'bg-slate-100 text-slate-400'}`}>
              {uploading ? <Loader2 size={22} className="animate-spin" /> : <Upload size={22} />}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">
                {uploading ? 'Uploading...' : 'Drop your prescription here'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {uploading ? 'Please wait' : 'or click to browse · JPG, PNG, PDF up to 5MB'}
              </p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="sr-only"
              onChange={e => handleFile(e.target.files[0])}
              disabled={uploading}
            />
          </label>
        </div>
      ) : (
        /* Uploaded success state */
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            {file?.type === 'application/pdf' ? <FileText size={18} /> : <ImageIcon size={18} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-emerald-800 truncate">{file?.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CheckCircle size={11} className="text-emerald-500" />
              <p className="text-xs text-emerald-600">Uploaded — Pending pharmacist review</p>
            </div>
          </div>
          <button onClick={handleRemove} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};
