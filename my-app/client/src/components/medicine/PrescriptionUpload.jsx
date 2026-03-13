import React, { useState, useEffect } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react'; // For modern icons

const PrescriptionUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Generate a preview when a file is selected
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    // Only show preview for images
    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      // For PDFs, we show a generic icon
      setPreview('pdf-icon');
    }
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className={`relative group border-2 border-dashed rounded-2xl transition-all duration-300 p-6 ${
        file ? 'border-green-400 bg-green-50' : 'border-blue-200 bg-blue-50 hover:border-blue-400'
      }`}>
        
        {!file ? (
          <label className="flex flex-col items-center justify-center cursor-pointer space-y-3">
            <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="text-blue-500" size={28} />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-blue-900 uppercase italic">Upload Prescription</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">JPG, PNG or PDF (Max 5MB)</p>
            </div>
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*,.pdf"
            />
          </label>
        ) : (
          <div className="flex items-center gap-4">
            {/* Visual Preview */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-white shadow-md bg-white flex items-center justify-center">
              {preview === 'pdf-icon' ? (
                <FileText className="text-red-500" size={32} />
              ) : (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              )}
              <button 
                onClick={removeFile}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={12} />
              </button>
            </div>

            {/* File Info */}
            <div className="flex-1">
              <p className="text-xs font-black text-gray-800 truncate max-w-[150px]">{file.name}</p>
              <div className="flex items-center gap-1 mt-1 text-green-600">
                <CheckCircle size={12} />
                <span className="text-[10px] font-bold uppercase">Ready to upload</span>
              </div>
            </div>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase shadow-md hover:bg-blue-700 transition-all active:scale-95">
              Confirm
            </button>
          </div>
        )}
      </div>
      
      <p className="mt-3 text-[9px] text-gray-400 font-bold uppercase text-center px-4">
        🔒 Your prescription is encrypted and handled only by certified pharmacists.
      </p>
    </div>
  );
};

export default PrescriptionUpload;