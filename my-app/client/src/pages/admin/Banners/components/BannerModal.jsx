import React, { useState, useEffect } from 'react';
import { X, Upload, Sparkles, Check, AlertCircle } from 'lucide-react';
import { uploadProductImage } from '../../../../api/products';
import BannerPreviewPanel from './BannerPreviewPanel';
import toast from 'react-hot-toast';

const BannerModal = ({
  isOpen = false,
  onClose,
  onSubmit,
  editingBanner = null,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'image-text',
    imageUrl: '',
    mobileImageUrl: '',
    videoUrl: '',
    isLive: false,
    altText: 'Promotional Banner',
    headline: '',
    subtext: '',
    badgeText: '',
    ctaLabel: 'SHOP NOW',
    ctaUrl: '/medicines',
    ctaColor: 'blue',
    bgColor: 'from-blue-700 via-blue-800 to-indigo-900',
    textColor: 'white',
    placement: 'homepage-hero',
    categorySlug: '',
    targetDevice: 'both',
    displayOrder: 0,
    status: 'active',
    startDate: '',
    endDate: '',
    openInNewTab: false
  });

  const [desktopUploading, setDesktopUploading] = useState(false);
  const [mobileUploading, setMobileUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  useEffect(() => {
    if (editingBanner) {
      setFormData({
        name: editingBanner.name || editingBanner.title || '',
        type: editingBanner.type || (editingBanner.placement === 'floating-video' ? 'floating-video' : 'image-text'),
        imageUrl: editingBanner.imageUrl || editingBanner.image || '',
        mobileImageUrl: editingBanner.mobileImageUrl || '',
        videoUrl: editingBanner.videoUrl || '',
        isLive: Boolean(editingBanner.isLive),
        altText: editingBanner.altText || 'Promotional Banner',
        headline: editingBanner.headline || editingBanner.title || '',
        subtext: editingBanner.subtext || editingBanner.desc || '',
        badgeText: editingBanner.badgeText || '',
        ctaLabel: editingBanner.ctaLabel || 'SHOP NOW',
        ctaUrl: editingBanner.ctaUrl || editingBanner.link || '/medicines',
        ctaColor: editingBanner.ctaColor || 'blue',
        bgColor: editingBanner.bgColor || editingBanner.bg || 'from-blue-700 via-blue-800 to-indigo-900',
        textColor: editingBanner.textColor || 'white',
        placement: editingBanner.placement || editingBanner.category || 'homepage-hero',
        categorySlug: editingBanner.categorySlug || '',
        targetDevice: editingBanner.targetDevice || (editingBanner.placement === 'floating-video' ? 'mobile' : 'both'),
        displayOrder: editingBanner.displayOrder ?? 0,
        status: editingBanner.status || (editingBanner.isActive ? 'active' : 'draft'),
        startDate: editingBanner.startDate ? new Date(editingBanner.startDate).toISOString().slice(0, 16) : '',
        endDate: editingBanner.endDate ? new Date(editingBanner.endDate).toISOString().slice(0, 16) : '',
        openInNewTab: editingBanner.openInNewTab || false
      });
    } else {
      setFormData({
        name: '',
        type: 'image-text',
        imageUrl: '',
        mobileImageUrl: '',
        videoUrl: '',
        isLive: false,
        altText: 'Promotional Banner',
        headline: '',
        subtext: '',
        badgeText: '',
        ctaLabel: 'SHOP NOW',
        ctaUrl: '/medicines',
        ctaColor: 'blue',
        bgColor: 'from-blue-700 via-blue-800 to-indigo-900',
        textColor: 'white',
        placement: 'homepage-hero',
        categorySlug: '',
        targetDevice: 'both',
        displayOrder: 0,
        status: 'active',
        startDate: '',
        endDate: '',
        openInNewTab: false
      });
    }
  }, [editingBanner, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === 'imageUrl') setDesktopUploading(true);
    else setMobileUploading(true);

    try {
      const data = new FormData();
      data.append('image', file);
      const res = await uploadProductImage(data);
      if (res?.imageUrl || res?.url) {
        const uploadedUrl = res.imageUrl || res.url;
        setFormData(prev => ({ ...prev, [field]: uploadedUrl }));
        toast.success('Banner image uploaded!');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      toast.error('Image upload failed. You can paste image URL directly.');
    } finally {
      if (field === 'imageUrl') setDesktopUploading(false);
      else setMobileUploading(false);
    }
  };

  const isEditingExisting = Boolean(editingBanner && editingBanner._id);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Auto-fill fallback internal name if left blank by user
    let bannerName = (formData.name || '').trim();
    if (!bannerName) {
      if ((formData.headline || '').trim()) bannerName = formData.headline.trim();
      else if (formData.type === 'floating-video' || formData.placement === 'floating-video') bannerName = 'Floating LIVE Video Banner';
      else bannerName = 'Promotional Banner';
    }

    const payload = {
      ...formData,
      name: bannerName,
      headline: (formData.headline || '').trim() || bannerName,
      startDate: formData.startDate ? formData.startDate : null,
      endDate: formData.endDate ? formData.endDate : null,
      displayOrder: Number(formData.displayOrder) || 0
    };

    if (isEditingExisting) {
      payload._id = editingBanner._id;
    } else {
      delete payload._id;
      delete payload.id;
    }

    onSubmit(payload, isEditingExisting);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <span>
                {isEditingExisting
                  ? 'Edit Promotional Banner'
                  : (formData.type === 'floating-video' || formData.placement === 'floating-video')
                  ? '🎬 Create Floating LIVE Video Banner'
                  : 'Create New Promotional Banner'}
              </span>
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Configure banner content, placement, schedule, and preview across devices
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* SECTION F: Embedded Live Preview at Top */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
              LIVE BANNER PREVIEW
            </h3>
            <BannerPreviewPanel formData={formData} />
          </div>

          <hr className="border-slate-200" />

          {/* SECTION A: Banner Content */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0057FF] flex items-center gap-1.5">
              <span>SECTION A: Banner Content & Media</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Winter Wellness Sale Hero 2026"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-[#0057FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Banner Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      type: newType,
                      placement: newType === 'floating-video' ? 'floating-video' : prev.placement,
                      targetDevice: newType === 'floating-video' ? 'mobile' : prev.targetDevice
                    }));
                  }}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-bold outline-none focus:border-[#0057FF] bg-white cursor-pointer"
                >
                  <option value="image-text">Image + Text Overlay</option>
                  <option value="floating-video">🎬 Floating Video Widget (Mobile Only)</option>
                  <option value="image">Image Only (Pure Graphic)</option>
                  <option value="text-color">Text + Color Background</option>
                </select>
              </div>
            </div>

            {/* Video File / URL Upload Box if Floating Video Widget */}
            {(formData.type === 'floating-video' || formData.placement === 'floating-video') && (
              <div className="border-2 border-amber-300 rounded-2xl p-5 bg-gradient-to-br from-amber-50/90 to-orange-50/60 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                  <div>
                    <label className="block text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎬 Floating LIVE Video Settings</span>
                    </label>
                    <p className="text-[11px] font-semibold text-amber-800">
                      Upload an MP4/WebM video file directly from your computer or paste a direct CDN link
                    </p>
                  </div>
                  
                  {/* Is Live Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3.5 py-1.5 rounded-full border border-amber-300 shadow-xs hover:border-amber-400 transition-colors">
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

                {/* Direct Video Drag & Drop Upload Zone */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                    Direct Video File Upload
                  </label>
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
                          <span>{videoUploading ? 'Uploading Video...' : 'Change Video File'}</span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setVideoUploading(true);
                              try {
                                const data = new FormData();
                                data.append('image', file);
                                const res = await uploadProductImage(data);
                                if (res?.imageUrl || res?.url) {
                                  setFormData(prev => ({ ...prev, videoUrl: res.imageUrl || res.url }));
                                  toast.success('Video uploaded successfully!');
                                }
                              } catch (err) {
                                toast.error('Video upload failed');
                              } finally {
                                setVideoUploading(false);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center gap-2 cursor-pointer p-6 text-center w-full h-full justify-center">
                        <div className="p-3 rounded-full bg-amber-100 text-amber-800 shadow-2xs">
                          <Upload size={24} />
                        </div>
                        <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
                          {videoUploading ? 'Uploading Video File...' : 'Click to Upload Video File Directly'}
                        </span>
                        <span className="text-[10px] text-amber-700 font-bold">
                          Supports MP4, WebM, MOV, M4V (Max 15MB)
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setVideoUploading(true);
                            try {
                              const data = new FormData();
                              data.append('image', file);
                              const res = await uploadProductImage(data);
                              if (res?.imageUrl || res?.url) {
                                setFormData(prev => ({ ...prev, videoUrl: res.imageUrl || res.url }));
                                toast.success('Video uploaded successfully!');
                              }
                            } catch (err) {
                              toast.error('Video upload failed');
                            } finally {
                              setVideoUploading(false);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Or Paste Direct Video URL */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                    Or Video URL Link (Hosted MP4 / WebM Link)
                  </label>
                  <input
                    type="text"
                    placeholder="https://... (Direct MP4 / WebM Video URL)"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full rounded-xl border border-amber-200 bg-white p-2.5 text-xs font-medium text-slate-800 outline-none focus:border-[#0057FF]"
                  />
                </div>
              </div>
            )}

            {/* Desktop & Mobile Image Upload Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Desktop Image */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Desktop Image (e.g. 1440x400px)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium outline-none focus:border-[#0057FF]"
                  />
                  <label className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-[#0057FF] transition-colors shrink-0">
                    <Upload size={13} />
                    <span>{desktopUploading ? 'Uploading...' : 'Browse'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'imageUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Mobile Image */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Mobile Image (e.g. 750x400px)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.mobileImageUrl}
                    onChange={(e) => setFormData({ ...formData, mobileImageUrl: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium outline-none focus:border-[#0057FF]"
                  />
                  <label className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-[#0057FF] transition-colors shrink-0">
                    <Upload size={13} />
                    <span>{mobileUploading ? 'Uploading...' : 'Browse'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'mobileImageUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Alt Text & Badge Text */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alt Text (Accessibility)
                </label>
                <input
                  type="text"
                  placeholder="Alt description for screen readers"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-[#0057FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Badge / Pill Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. FLAT 25% OFF"
                  value={formData.badgeText}
                  onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-[#0057FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Headline Text
                </label>
                <input
                  type="text"
                  placeholder="Main banner headline"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-[#0057FF]"
                />
              </div>
            </div>

            {/* Subtext & CTA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtext / Description
                </label>
                <input
                  type="text"
                  placeholder="Short descriptive supporting subtext"
                  value={formData.subtext}
                  onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-[#0057FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. SHOP NOW"
                  value={formData.ctaLabel}
                  onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-[#0057FF]"
                />
              </div>
            </div>

          </div>

          <hr className="border-slate-200" />

          {/* SECTION B: Appearance */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0057FF]">
              SECTION B: Appearance & Styling
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Background Color / Gradient
                </label>
                <input
                  type="text"
                  placeholder="e.g. bg-gradient-to-r from-blue-700 to-indigo-900 or #0057FF"
                  value={formData.bgColor}
                  onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-[#0057FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Text Color
                </label>
                <select
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-bold outline-none focus:border-[#0057FF] bg-white cursor-pointer"
                >
                  <option value="white">White Text (For dark backgrounds)</option>
                  <option value="dark">Dark Text (For light backgrounds)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  CTA Button Color
                </label>
                <select
                  value={formData.ctaColor}
                  onChange={(e) => setFormData({ ...formData, ctaColor: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-bold outline-none focus:border-[#0057FF] bg-white cursor-pointer"
                >
                  <option value="blue">Electric Blue (#0057FF)</option>
                  <option value="orange">Vivid Orange (#FF6B00)</option>
                  <option value="green">Emerald Green</option>
                  <option value="purple">Royal Purple</option>
                  <option value="dark">Slate Black</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* SECTION C: Placement & Targeting */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0057FF]">
              SECTION C: Placement & Device Targeting
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Placement Slot
                </label>
                <select
                  value={formData.placement}
                  onChange={(e) => {
                    const newPlacement = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      placement: newPlacement,
                      type: newPlacement === 'floating-video' ? 'floating-video' : prev.type,
                      targetDevice: newPlacement === 'floating-video' ? 'mobile' : prev.targetDevice
                    }));
                  }}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-bold outline-none focus:border-[#0057FF] bg-white cursor-pointer"
                >
                  <option value="homepage-hero">Homepage Hero Carousel</option>
                  <option value="floating-video">🎬 Floating Video Widget (Mobile Only)</option>
                  <option value="category-mini">Category Page Mini Banner</option>
                  <option value="mobile-homepage">Mobile Homepage Banner</option>
                  <option value="all-medicines">All Medicines Page Banner</option>
                  <option value="flash-sale">Flash Sale Banner</option>
                  <option value="lab-tests">Lab Tests Page Banner</option>
                  <option value="ayurveda">Ayurveda Page Banner</option>
                </select>
              </div>

              {formData.placement === 'category-mini' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category Page Filter
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ayurveda, skin-care"
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-[#0057FF]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Device
                </label>
                <select
                  value={formData.targetDevice}
                  onChange={(e) => setFormData({ ...formData, targetDevice: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-bold outline-none focus:border-[#0057FF] bg-white cursor-pointer"
                >
                  <option value="both">Both (Desktop & Mobile)</option>
                  <option value="desktop">Desktop Only</option>
                  <option value="mobile">Mobile Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Display Order (Lower = First)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-[#0057FF]"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* SECTION D: Scheduling */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0057FF]">
              SECTION D: Status & Scheduling
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-bold outline-none focus:border-[#0057FF] bg-white cursor-pointer"
                >
                  <option value="active">Active (Live on website)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="scheduled">Scheduled (Auto-activates)</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Start Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-[#0057FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  End Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-[#0057FF]"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* SECTION E: Link & Action */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0057FF]">
              SECTION E: Link & Destination
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Click Destination URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. /medicines?filter=skin-care or https://..."
                  value={formData.ctaUrl}
                  onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-medium outline-none focus:border-[#0057FF]"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.openInNewTab}
                    onChange={(e) => setFormData({ ...formData, openInNewTab: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0057FF] focus:ring-[#0057FF]"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    Open link in a new browser tab
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
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
              className="px-6 py-2.5 rounded-xl bg-[#0057FF] text-white text-xs font-black uppercase tracking-wider hover:bg-blue-700 shadow-md active:scale-95 transition-all disabled:bg-slate-400 cursor-pointer"
            >
              {isSubmitting ? 'Saving Banner...' : editingBanner ? 'Update Banner' : 'Publish Banner'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BannerModal;
