import React, { useState, useEffect } from 'react';
import { Upload, X, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Adjust dots based on folder depth

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
    formData.append('prescription', file); // Matches backend upload.single('prescription')

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/prescriptions/scan-and-check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` 
        },
        body: formData 
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Success! Detected: ${data.medicineName}`);
        setFile(null);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Server error. Check if backend is live.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all ${
        file ? 'border-green-400 bg-green-50' : 'border-blue-200 bg-blue-50 hover:border-blue-400'
      }`}>
        {!file ? (
          <label className="flex flex-col items-center cursor-pointer space-y-3">
            <Upload className="text-blue-500" size={28} />
            <div className="text-center">
              <p className="text-sm font-bold text-blue-900 uppercase">Upload Prescription</p>
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
            </div>
          </label>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded overflow-hidden border bg-white flex items-center justify-center">
              {preview === 'pdf-icon' ? <FileText className="text-red-500" /> : <img src={preview} className="object-cover h-full" alt="preview" />}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold truncate">{file.name}</p>
              <button onClick={() => setFile(null)} className="text-[10px] text-red-500 font-bold uppercase">Remove</button>
            </div>
            <button 
              onClick={handleUpload}
              disabled={uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-[10px] uppercase disabled:bg-gray-400"
            >
              {uploading ? <Loader2 className="animate-spin" size={14} /> : "Confirm"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionUpload;