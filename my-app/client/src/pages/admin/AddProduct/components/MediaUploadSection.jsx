import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { uploadProductImage } from '../../../../api/products';
import { toast } from 'react-hot-toast';

const MediaUploadSection = ({ formData, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (jpg, png, webp)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const data = new FormData();
      data.append('image', file);

      const res = await uploadProductImage(data);
      if (res && res.imageUrl) {
        // Construct the full URL if it's a relative path and running locally
        const fullUrl = res.imageUrl.startsWith('/') 
          ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${res.imageUrl}`
          : res.imageUrl;
          
        onChange('image', fullUrl);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlApply = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      toast.error('Please enter a valid image URL');
      return;
    }
    onChange('image', trimmed);
    toast.success('Product image URL set successfully!');
  };

  const removeImage = () => {
    onChange('image', '');
    setUrlInput('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Product Media</h2>
      
      <div className="space-y-4">
        {formData.image ? (
          <div className="relative inline-block border border-slate-200 rounded-lg overflow-hidden group">
            <img 
              src={formData.image} 
              alt="Product Preview" 
              className="w-48 h-48 object-contain p-2 bg-white"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={removeImage}
                className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 hover:scale-110 transition-transform cursor-pointer"
                title="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-semibold text-slate-700 shadow-sm border border-slate-200">
              Primary Image
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Upload zone */}
            <div 
              className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
              />
              
              {uploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-[#00a2a4] animate-spin mb-3" />
                  <p className="text-sm font-medium text-slate-900">Uploading image...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-slate-50 rounded-full text-slate-550 mb-3">
                    <UploadCloud className="w-8 h-8 text-[#00a2a4]" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    SVG, PNG, JPG or WEBP (max. 5MB)
                  </p>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="flex items-center gap-3 text-slate-350 text-xs font-bold uppercase tracking-widest my-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span>OR</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* URL input field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider">
                Paste Image Link / URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="e.g. https://example.com/images/dolo650.jpg"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleUrlApply();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleUrlApply}
                  className="px-4 py-2 bg-[#00a2a4] hover:bg-[#00898b] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  Apply Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUploadSection;
