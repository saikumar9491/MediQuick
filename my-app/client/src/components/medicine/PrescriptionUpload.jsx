import React, { useState, useEffect } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/apiConfig';

const PrescriptionUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview('pdf-icon');
    }
  }, [file]);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('prescription', file);

    try {
      const response = await fetch(`${API_BASE}/api/prescriptions/scan-and-check`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Success! Detected: ${data.medicineName}`);
        setFile(null);
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      alert('Server error. Check if backend is live.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 sm:px-0">
      <div
        className={`relative rounded-2xl border-2 border-dashed p-5 sm:p-6 transition-all duration-300 ${
          file
            ? 'border-green-400 bg-green-50 shadow-sm'
            : 'border-blue-200 bg-blue-50 hover:border-blue-400'
        }`}
      >
        {!file ? (
          <label className="flex cursor-pointer flex-col items-center space-y-3 text-center">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <Upload className="text-blue-500" size={26} />
            </div>

            <div>
              <p className="text-sm sm:text-base font-bold uppercase text-blue-900">
                Upload Prescription
              </p>
              <p className="mt-1 text-[11px] sm:text-xs text-blue-600">
                Upload image or PDF file
              </p>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf"
              />
            </div>
          </label>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white">
              {preview === 'pdf-icon' ? (
                <FileText className="text-red-500" size={28} />
              ) : (
                <img
                  src={preview}
                  className="h-full w-full object-cover"
                  alt="preview"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs sm:text-sm font-bold text-gray-800">
                {file.name}
              </p>
              <p className="mt-1 text-[10px] sm:text-xs text-gray-500">
                Ready for secure upload
              </p>
              <button
                onClick={() => setFile(null)}
                className="mt-2 text-[10px] font-bold uppercase text-red-500 transition hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex min-w-[110px] items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase text-white transition hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionUpload;