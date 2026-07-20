import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadProductImage } from '../../../../api/products';
import { toast } from 'react-hot-toast';

const MediaUploadSection = ({ formData, onChange }) => {
  const [uploading, setUploading] = useState(false);
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

  const removeImage = () => {
    onChange('image', '');
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
              className="w-48 h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={removeImage}
                className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 hover:scale-110 transition-transform"
                title="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-medium text-slate-700 shadow-sm">
              Primary Image
            </div>
          </div>
        ) : (
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
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                <p className="text-sm font-medium text-slate-900">Uploading image...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="p-4 bg-blue-50 rounded-full text-blue-600 mb-3">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-slate-900 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-500">
                  SVG, PNG, JPG or GIF (max. 5MB)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUploadSection;
