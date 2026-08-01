import React, { useState, useEffect } from 'react';
import { X, Upload, Video, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { uploadProductImage } from '../../../../api/products';
import toast from 'react-hot-toast';

const FloatingVideoModal = ({
  isOpen = false,
  onClose,
  onSubmit,
  editingBanner = null,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'floating-video',
    videoUrl: '',
    isLive: true,
    badgeText: 'LIVE',
    headline: '',
    subtext: '',
    ctaUrl: '/medicines',
    placement: 'floating-video',
    targetDevice: 'mobile',
    displayOrder: 0,
    status: 'active',
    startDate: '',
    endDate: '',
    openInNewTab: false
  });

  const [videoUploading, setVideoUploading] = useState(false);
  const [isPreviewMuted, setIsPreviewMuted] = useState(true);

  useEffect(() => {
    if (editingBanner) {
      setFormData({
        _id: editingBanner._id,
        name: editingBanner.name || editingBanner.headline || 'Floating LIVE Video Banner',
        type: 'floating-video',
        videoUrl: editingBanner.videoUrl || editingBanner.imageUrl || editingBanner.image || '',
        isLive: editingBanner.isLive !== undefined ? Boolean(editingBanner.isLive) : true,
        badgeText: editingBanner.badgeText || (editingBanner.isLive ? 'LIVE' : 'OFFER'),
        headline: editingBanner.headline || editingBanner.title || '',
        subtext: editingBanner.subtext || editingBanner.desc || '',
        ctaUrl: editingBanner.ctaUrl || editingBanner.link || '/medicines',
        placement: 'floating-video',
        targetDevice: 'mobile',
        displayOrder: editingBanner.displayOrder ?? 0,
        status: editingBanner.status || 'active',
        startDate: editingBanner.startDate ? new Date(editingBanner.startDate).toISOString().slice(0, 16) : '',
        endDate: editingBanner.endDate ? new Date(editingBanner.endDate).toISOString().slice(0, 16) : '',
        openInNewTab: editingBanner.openInNewTab || false
      });
    } else {
      setFormData({
        name: '',
        type: 'floating-video',
        videoUrl: '',
        isLive: true,
        badgeText: 'LIVE',
        headline: '',
        subtext: '',
        ctaUrl: '/medicines',
        placement: 'floating-video',
        targetDevice: 'mobile',
        displayOrder: 0,
        status: 'active',
        startDate: '',
        endDate: '',
        openInNewTab: false
      });
    }
  }, [editingBanner, isOpen]);

  if (!isOpen) return null;

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await uploadProductImage(data);
      if (res?.imageUrl || res?.url) {
        const uploadedUrl = res.imageUrl || res.url;
        setFormData(prev => ({ ...prev, videoUrl: uploadedUrl }));
        toast.success('Video clip uploaded successfully!');
      }
    } catch (err) {
      console.error('Video upload failed:', err);
      toast.error('Video upload failed. You can paste video URL directly.');
    } finally {
      setVideoUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let bannerName = (formData.name || '').trim();
    if (!bannerName) {
      bannerName = (formData.headline || '').trim() || 'Floating LIVE Video Banner';
    }

    const payload = {
      ...formData,
      name: bannerName,
      headline: (formData.headline || '').trim() || bannerName,
      type: 'floating-video',
      placement: 'floating-video',
      targetDevice: 'mobile',
      startDate: formData.startDate ? formData.startDate : null,
      endDate: formData.endDate ? formData.endDate : null,
      displayOrder: Number(formData.displayOrder) || 0
    };

    const isEditingExisting = Boolean(editingBanner && editingBanner._id);
    if (!isEditingExisting) {
      delete payload._id;
      delete payload.id;
    }

    onSubmit(payload, isEditingExisting);
  };

  const isLive = Boolean(formData.isLive);
  const headlineText = formData.headline || 'Extra 30% Off';
  const subtextText = formData.subtext || 'Winter Wellness Sale';

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md shadow-xs">
              <Video size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <span>{editingBanner?._id ? 'Edit Floating Video Banner' : '🎬 Create Floating LIVE Video Banner'}</span>
                <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-white/30">
                  MOBILE WIDGET
                </span>
              </h2>
              <p className="text-xs font-medium text-white/90">
                Design a floating mobile video card with live offer overlays and auto-play clips
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Real-Time Mobile Card Preview */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col items-center space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles size={16} />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                Live Floating Mobile Widget Preview
              </h4>
            </div>

            {/* Mobile Phone Mockup Preview (125x165px Floating Card) */}
            <div className="w-[125px] h-[165px] rounded-[18px] bg-slate-900 shadow-2xl border-2 border-white/30 overflow-hidden relative flex flex-col justify-between select-none">
              {formData.videoUrl && formData.videoUrl.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i) ? (
                <video
                  src={formData.videoUrl}
                  autoPlay
                  loop
                  muted={isPreviewMuted}
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <img
                  src={formData.videoUrl || 'https://img.freepik.com/free-vector/flat-medical-healthcare-sales-banner-template_23-2149511116.jpg'}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {/* Badge & Close Button */}
              <div className="relative z-10 p-2 flex items-center justify-between">
                <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase flex items-center gap-1 shadow-md ${
                  isLive ? 'bg-rose-600 text-white' : 'bg-gradient-to-r from-[#FF6B00] to-amber-500 text-white'
                }`}>
                  {isLive ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      <span>LIVE</span>
                    </>
                  ) : (
                    <span>{formData.badgeText || 'OFFER'}</span>
                  )}
                </div>

                <div className="w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  ✕
                </div>
              </div>

              {/* Bottom Gradient Overlay Text */}
              <div className="relative z-10 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent p-2.5 pt-6 text-left">
                <h5 className="text-[10px] font-black text-white leading-tight uppercase line-clamp-2 drop-shadow-md">
                  {headlineText}
                </h5>
                <p className="text-[8px] font-extrabold text-amber-300 line-clamp-1 mt-0.5 drop-shadow-xs">
                  {subtextText}
                </p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-medium text-center">
              Appears in bottom-right corner of mobile app screens after 2.5s delay
            </p>
          </div>

          {/* Section 1: Video File & Media Upload */}
          <div className="border-2 border-amber-200 rounded-2xl p-5 bg-gradient-to-br from-amber-50/80 to-orange-50/40 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div>
                <label className="block text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Video size={16} className="text-amber-700" />
                  <span>1. Video Media Source</span>
                </label>
                <p className="text-[11px] text-amber-800 font-semibold">
                  Upload an MP4 or WebM video file directly from your device (Max 15MB)
                </p>
              </div>

              {/* Is LIVE Badge Toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-white px-3.5 py-1.5 rounded-full border border-amber-300 shadow-xs hover:border-amber-400 transition-all">
                <input
                  type="checkbox"
                  checked={formData.isLive}
                  onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <span className="text-xs font-black text-rose-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                  SHOW RED "LIVE" BADGE
                </span>
              </label>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="space-y-1.5">
              <div className="h-44 bg-white border-2 border-dashed border-amber-300 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-amber-500 transition-all shadow-2xs">
                {formData.videoUrl ? (
                  <div className="w-full h-full relative flex items-center justify-center bg-slate-950">
                    <video
                      src={formData.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-black uppercase tracking-wider transition-opacity cursor-pointer gap-2 backdrop-blur-xs">
                      <Upload size={16} />
                      <span>{videoUploading ? 'Uploading Video File...' : 'Change Video File'}</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer p-6 text-center w-full h-full justify-center">
                    <div className="p-3.5 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-orange-600 shadow-2xs">
                      <Upload size={24} />
                    </div>
                    <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
                      {videoUploading ? 'Uploading Video File...' : 'Click or Drag & Drop MP4 Video File'}
                    </span>
                    <span className="text-[10px] text-amber-700 font-bold">
                      Supports MP4, WebM, MOV, M4V (Max 15MB)
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Direct Link Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                Or Video CDN Link (Direct MP4 URL)
              </label>
              <input
                type="text"
                placeholder="https://... (Direct video URL link)"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full rounded-xl border border-amber-300 bg-white p-2.5 text-xs font-medium text-slate-800 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Section 2: Banner Text & Overlay */}
          <div className="space-y-4 border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              2. Overlay Text & Campaign Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Main Offer Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra 30% Off"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Subtext / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Winter Wellness Sale"
                  value={formData.subtext}
                  onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Click Destination URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. /medicines?filter=ayurveda or /offers"
                  value={formData.ctaUrl}
                  onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Internal Reference Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Floating Monsoon Live Banner"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Status & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200 rounded-2xl p-5 bg-white">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold outline-none focus:border-orange-500 bg-white cursor-pointer"
              >
                <option value="active">Active (Live on Mobile App)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Display Order Priority
              </label>
              <input
                type="number"
                min="0"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center pt-5">
              <span className="text-[11px] font-bold text-slate-500">
                Target Device: <span className="text-orange-600 font-extrabold">Mobile Only</span>
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-amber-500 text-white text-xs font-black uppercase tracking-wider hover:from-amber-600 hover:to-orange-600 shadow-md active:scale-95 transition-all disabled:bg-slate-400 cursor-pointer flex items-center gap-2"
            >
              <Video size={16} />
              <span>{isSubmitting ? 'Publishing...' : editingBanner?._id ? 'Update Video Banner' : 'Publish Floating Video Banner'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FloatingVideoModal;
