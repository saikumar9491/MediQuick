import React, { useState } from 'react';
import { Monitor, Smartphone, ArrowRight, Sparkles } from 'lucide-react';

const BannerPreviewPanel = ({ formData = {} }) => {
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'mobile'

  const desktopImage = formData.imageUrl || formData.image || formData.mobileImageUrl;
  const mobileImage = formData.mobileImageUrl || formData.imageUrl || formData.image;
  const currentImage = viewMode === 'desktop' ? desktopImage : mobileImage;

  const headline = formData.headline || formData.name || 'Sample Banner Headline';
  const subtext = formData.subtext || formData.desc || 'Explore our latest pharmaceutical offers and essential products.';
  const badgeText = formData.badgeText || 'SPECIAL OFFER';
  const ctaLabel = formData.ctaLabel || 'SHOP NOW';
  const bgColor = formData.bgColor || 'bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900';
  const textColorClass = formData.textColor === 'dark' ? 'text-slate-900' : 'text-white';

  const getCtaStyle = () => {
    switch (formData.ctaColor) {
      case 'orange':
        return 'bg-[#FF6B00] text-white hover:bg-orange-600';
      case 'green':
        return 'bg-emerald-600 text-white hover:bg-emerald-700';
      case 'purple':
        return 'bg-purple-600 text-white hover:bg-purple-700';
      case 'dark':
        return 'bg-slate-900 text-white hover:bg-black';
      default:
        return 'bg-[#0057FF] text-white hover:bg-blue-700';
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
      
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-400" size={16} />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
            Real-Time Live Preview
          </h4>
        </div>

        <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={() => setViewMode('desktop')}
            className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'desktop' ? 'bg-[#0057FF] text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor size={13} /> Desktop
          </button>
          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'mobile' ? 'bg-[#0057FF] text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={13} /> Mobile
          </button>
        </div>
      </div>

      {/* Interactive Live Banner Mockup */}
      <div className="flex justify-center items-center py-2">
        {viewMode === 'desktop' ? (
          /* DESKTOP BANNER PREVIEW CONTAINER */
          <div className="w-full max-w-2xl h-56 rounded-xl overflow-hidden relative shadow-2xl border border-white/10 flex items-center group">
            {/* Background image or gradient */}
            {formData.type === 'image' && currentImage ? (
              <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className={`absolute inset-0 flex items-center ${bgColor.includes('from-') ? bgColor : ''}`} style={!bgColor.includes('from-') ? { backgroundColor: bgColor } : {}}>
                {currentImage && (
                  <div className="absolute right-0 h-full w-[60%] overflow-hidden">
                    <img
                      src={currentImage}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-l-[150px] border-l-4 border-white/20 shadow-xl"
                    />
                  </div>
                )}
                <div className="relative z-10 w-[55%] p-6 space-y-2">
                  {badgeText && (
                    <span className="inline-block bg-white/20 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full backdrop-blur-md">
                      {badgeText}
                    </span>
                  )}
                  <h3 className={`text-xl font-black italic tracking-tight uppercase line-clamp-2 ${textColorClass}`}>
                    {headline}
                  </h3>
                  <p className="text-[11px] font-semibold text-white/80 line-clamp-2">
                    {subtext}
                  </p>
                  <button type="button" className={`mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md transition-transform active:scale-95 ${getCtaStyle()}`}>
                    <span>{ctaLabel}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* MOBILE BANNER PREVIEW CONTAINER (375px phone ratio) */
          <div className="w-[320px] aspect-[20/9] rounded-2xl overflow-hidden relative shadow-2xl border border-slate-700 flex items-center">
            {formData.type === 'image' && currentImage ? (
              <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full p-4 flex flex-col justify-center ${bgColor.includes('from-') ? bgColor : ''}`} style={!bgColor.includes('from-') ? { backgroundColor: bgColor } : {}}>
                {badgeText && (
                  <span className="text-[8px] font-black uppercase tracking-widest text-amber-300">
                    {badgeText}
                  </span>
                )}
                <h4 className={`text-xs font-black mt-0.5 line-clamp-1 ${textColorClass}`}>
                  {headline}
                </h4>
                <p className="text-[9px] text-white/80 line-clamp-1 mt-0.5 font-medium">
                  {subtext}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-[10px] text-slate-400 text-center font-medium">
        Preview updates instantly as you edit content and appearance.
      </div>

    </div>
  );
};

export default BannerPreviewPanel;
