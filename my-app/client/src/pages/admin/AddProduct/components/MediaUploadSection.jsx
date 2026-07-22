import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { uploadProductImage } from '../../../../api/products';
import { toast } from 'react-hot-toast';

const MediaUploadSection = ({ formData, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  // Filter out any copy of the primary image from the additional images list to prevent duplication
  const additionalImages = (formData.additionalImages || []).filter(img => img && img !== formData.image);

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
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Product Media</h2>
        <p className="text-xs text-slate-400">Manage the photos displayed for this product.</p>
      </div>
      
      <div className="space-y-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Primary Product Image
        </label>
        
        {formData.image ? (
          <div className="relative inline-block border border-slate-200 rounded-lg overflow-hidden group bg-slate-50/50">
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

      {/* Additional Photos Section */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Additional Photos / Gallery (Max 4)
          </label>
          <p className="text-xs text-slate-400">These will appear in the thumbnail gallery on the product detail page.</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Render added thumbnails */}
          {additionalImages.map((imgUrl, index) => (
            <div key={index} className="relative aspect-square border border-slate-200 rounded-xl overflow-hidden group bg-slate-50/50 flex items-center justify-center p-2">
              <img 
                src={imgUrl} 
                alt={`Additional ${index + 1}`} 
                className="max-h-full max-w-full object-contain p-1"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const updated = additionalImages.filter((_, i) => i !== index);
                    onChange('additionalImages', updated);
                  }}
                  className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50 cursor-pointer shadow-sm"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-white/95 rounded text-[8px] font-black text-slate-550 border border-slate-200/50 uppercase">
                Slide {index + 1}
              </div>
            </div>
          ))}

          {/* Render blank slots */}
          {additionalImages.length < 4 && (
            <div className="border border-dashed border-slate-350 rounded-xl aspect-square flex flex-col items-center justify-center p-3 bg-slate-50/40">
              <button
                type="button"
                onClick={() => {
                  const inputUrl = prompt("Enter additional image URL link:");
                  if (inputUrl && inputUrl.trim()) {
                    const trimmed = inputUrl.trim();
                    if (trimmed === formData.image) {
                      toast.error("This is already the primary image!");
                      return;
                    }
                    onChange('additionalImages', [...additionalImages, trimmed]);
                    toast.success('Gallery image added');
                  }
                }}
                className="text-[10px] bg-[#00a2a4] hover:bg-[#00898b] text-white px-2 py-1.5 rounded-lg font-bold transition-all w-full text-center shadow-xs cursor-pointer mb-2"
              >
                + Add Link
              </button>
              <div className="text-[9px] text-slate-400 font-bold text-center">OR</div>
              
              <label className="text-[10px] text-center font-bold text-slate-500 hover:text-[#00a2a4] cursor-pointer mt-1.5 underline">
                Upload File
                <input 
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    try {
                      const data = new FormData();
                      data.append('image', file);
                      toast.loading('Uploading gallery image...', { id: 'gallery-upload' });
                      const res = await uploadProductImage(data);
                      toast.dismiss('gallery-upload');
                      if (res && res.imageUrl) {
                        const fullUrl = res.imageUrl.startsWith('/') 
                          ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${res.imageUrl}`
                          : res.imageUrl;
                        if (fullUrl === formData.image) {
                          toast.error("This is already the primary image!");
                          return;
                        }
                        onChange('additionalImages', [...additionalImages, fullUrl]);
                        toast.success('Gallery image uploaded successfully!');
                      }
                    } catch (err) {
                      toast.dismiss('gallery-upload');
                      toast.error('Failed to upload image');
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaUploadSection;
