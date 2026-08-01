import React from 'react';
import { 
  Edit3, 
  Trash2, 
  Copy, 
  Monitor, 
  Smartphone, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText,
  ExternalLink
} from 'lucide-react';

const BannersGrid = ({
  banners = [],
  loading = false,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onDelete
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-white rounded-xl border border-slate-200 h-52 animate-pulse p-4 space-y-3">
            <div className="h-28 bg-slate-100 rounded-lg" />
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <Layers size={40} className="mx-auto text-slate-300 mb-3" />
        <h4 className="text-sm font-bold text-slate-700 mb-1">No Banners Found</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">Create a new banner or change your search filter tabs.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {banners.map((banner) => {
        const previewImg = banner.imageUrl || banner.mobileImageUrl || banner.image;
        const isActive = banner.status === 'active' || banner.isActive;

        return (
          <div
            key={banner._id}
            className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col group transition-all hover:shadow-md hover:border-slate-300"
          >
            {/* Visual Preview Header */}
            <div className="h-36 bg-slate-900 relative overflow-hidden flex items-center justify-center">
              {previewImg ? (
                <img
                  src={previewImg}
                  alt={banner.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className={`w-full h-full p-4 flex flex-col justify-center text-white ${banner.bgColor || 'bg-gradient-to-r from-blue-700 to-indigo-900'}`}>
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-300">
                    {banner.badgeText || 'PROMOTIONAL'}
                  </span>
                  <h4 className="text-sm font-black line-clamp-1 mt-0.5">{banner.headline || banner.name}</h4>
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">{banner.subtext}</p>
                </div>
              )}

              {/* Status Badge Overlay */}
              <div className="absolute top-2.5 left-2.5">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs backdrop-blur-md ${
                  isActive 
                    ? 'bg-emerald-500 text-white' 
                    : banner.status === 'scheduled'
                      ? 'bg-amber-500 text-white'
                      : banner.status === 'expired'
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-700 text-slate-200'
                }`}>
                  {banner.status || (isActive ? 'active' : 'draft')}
                </span>
              </div>

              {/* Display Order Badge Overlay */}
              <div className="absolute top-2.5 right-2.5 bg-slate-900/80 text-white px-2 py-0.5 rounded text-[10px] font-black backdrop-blur-md">
                Order: #{banner.displayOrder ?? 0}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 truncate">
                    {banner.name || banner.headline || 'Untitled Banner'}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded shrink-0">
                    {banner.placement || 'homepage-hero'}
                  </span>
                </div>
                {banner.headline && banner.headline !== banner.name && (
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-medium">
                    "{banner.headline}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 border-t border-slate-100 pt-3">
                <span className="capitalize">Target: {banner.targetDevice || 'both'}</span>
                <span>CTA: {banner.ctaLabel || 'SHOP NOW'}</span>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {/* Active Toggle Switch */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => onToggleStatus(banner)}
                    className="w-4 h-4 rounded text-[#0057FF] focus:ring-[#0057FF] cursor-pointer"
                  />
                  <span className={`text-xs font-bold ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {isActive ? 'Live' : 'Inactive'}
                  </span>
                </label>

                {/* Edit & Delete Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(banner)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit Banner"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => onDuplicate(banner)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Duplicate Banner"
                  >
                    <Copy size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(banner)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Banner"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BannersGrid;
