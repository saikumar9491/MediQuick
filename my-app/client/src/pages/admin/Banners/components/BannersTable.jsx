import React from 'react';
import { 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  Monitor, 
  Smartphone, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText,
  ExternalLink
} from 'lucide-react';

const BannersTable = ({
  banners = [],
  loading = false,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onDelete
}) => {
  const getPlacementBadge = (placement, categorySlug) => {
    switch (placement) {
      case 'homepage-hero':
      case 'main':
        return <span className="bg-blue-50 text-[#0057FF] border border-blue-100 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">Homepage Hero</span>;
      case 'category-mini':
        return <span className="bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">Cat: {categorySlug || 'Mini'}</span>;
      case 'flash-sale':
      case 'flash':
        return <span className="bg-orange-50 text-[#FF6B00] border border-orange-100 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">Flash Sale</span>;
      case 'mobile-homepage':
        return <span className="bg-cyan-50 text-cyan-700 border border-cyan-100 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">Mobile Home</span>;
      case 'all-medicines':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">All Medicines</span>;
      case 'ayurveda':
        return <span className="bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">Ayurveda</span>;
      case 'lab-tests':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">Lab Tests</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">{placement}</span>;
    }
  };

  const getTargetBadge = (targetDevice) => {
    switch (targetDevice) {
      case 'desktop':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded"><Monitor size={12} /> Desktop</span>;
      case 'mobile':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded"><Smartphone size={12} /> Mobile</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded"><Layers size={12} /> Both</span>;
    }
  };

  const getStatusBadge = (status, isActive) => {
    const finalStatus = status || (isActive ? 'active' : 'draft');
    switch (finalStatus) {
      case 'active':
        return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase"><CheckCircle2 size={11} /> Active</span>;
      case 'scheduled':
        return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase"><Clock size={11} /> Scheduled</span>;
      case 'expired':
        return <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase"><AlertTriangle size={11} /> Expired</span>;
      default:
        return <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase"><FileText size={11} /> Draft</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return '—';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-xs">
        <div className="animate-spin h-8 w-8 border-4 border-[#0057FF] border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Banners Table...</p>
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
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Preview</th>
              <th className="py-3.5 px-4">Internal Name / Headline</th>
              <th className="py-3.5 px-4">Placement</th>
              <th className="py-3.5 px-4">Target Device</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Dates</th>
              <th className="py-3.5 px-4 text-center">Order</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {banners.map((banner) => {
              const previewImg = banner.imageUrl || banner.mobileImageUrl || banner.image;
              return (
                <tr key={banner._id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* Thumbnail Preview */}
                  <td className="py-3 px-4">
                    <div className="h-12 w-20 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center">
                      {previewImg ? (
                        <img src={previewImg} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="p-1 text-center text-[9px] font-bold text-slate-400 leading-tight">
                          Text Color
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Name & Headline */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-extrabold text-slate-900 truncate">
                      {banner.name || banner.headline || banner.title || 'Untitled Banner'}
                    </div>
                    {banner.headline && banner.headline !== banner.name && (
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        "{banner.headline}"
                      </div>
                    )}
                    {banner.badgeText && (
                      <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                        {banner.badgeText}
                      </span>
                    )}
                  </td>

                  {/* Placement */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getPlacementBadge(banner.placement || banner.category, banner.categorySlug)}
                  </td>

                  {/* Target Device */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getTargetBadge(banner.targetDevice)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getStatusBadge(banner.status, banner.isActive)}
                  </td>

                  {/* Dates */}
                  <td className="py-3 px-4 whitespace-nowrap text-[11px]">
                    <div><span className="text-slate-400">Start:</span> {formatDate(banner.startDate)}</div>
                    <div><span className="text-slate-400">End:</span> {formatDate(banner.endDate)}</div>
                  </td>

                  {/* Display Order */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-800 font-bold text-xs">
                      {banner.displayOrder ?? 0}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Toggle Status Button */}
                      <button
                        onClick={() => onToggleStatus(banner)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          banner.status === 'active' || banner.isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title={banner.status === 'active' || banner.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {banner.status === 'active' || banner.isActive ? 'Active' : 'Draft'}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(banner)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Edit Banner"
                      >
                        <Edit3 size={15} />
                      </button>

                      {/* Duplicate Button */}
                      <button
                        onClick={() => onDuplicate(banner)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Duplicate Banner"
                      >
                        <Copy size={15} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(banner)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Banner"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BannersTable;
