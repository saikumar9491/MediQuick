import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE } from '../utils/apiConfig';
import { 
  ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  X, 
  Check, 
  Sparkles, 
  Link as LinkIcon, 
  Upload, 
  Tag, 
  LayoutGrid 
} from 'lucide-react';

const AdminBanners = ({ embedded }) => {
  const { token } = useAuth();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    link: '/medicines',
    category: 'hero',
    bg: 'from-[#0057FF] to-blue-800',
    isActive: true
  });

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/banners`);
      if (res.ok) {
        const data = await res.json();
        setBanners(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch banners:', err);
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setBannerPreview('');
    setFormData({
      title: '',
      desc: '',
      link: '/medicines',
      category: 'hero',
      bg: 'from-[#0057FF] to-blue-800',
      isActive: true
    });
    setShowModal(true);
  };

  const openEditModal = (b) => {
    setEditingBanner(b);
    setBannerPreview(b.image || '');
    setFormData({
      title: b.title || '',
      desc: b.desc || '',
      link: b.link || '/medicines',
      category: b.category || 'hero',
      bg: b.bg || 'from-[#0057FF] to-blue-800',
      isActive: b.isActive !== false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bannerPreview && !editingBanner) {
      return toast.error('Please upload a banner image');
    }

    const toastId = toast.loading(editingBanner ? 'Updating Banner...' : 'Creating Banner...');
    try {
      const payload = {
        ...formData,
        image: bannerPreview || editingBanner?.image
      };

      const url = editingBanner 
        ? `${API_BASE}/api/banners/${editingBanner._id}`
        : `${API_BASE}/api/banners`;
      
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save banner');
      
      // Clear client session cache so mobile & desktop app re-fetches instantly
      sessionStorage.removeItem('mq_cached_banners');

      toast.success(editingBanner ? 'Banner Updated 🖼️' : 'Banner Created 🚀', { id: toastId });
      setShowModal(false);
      fetchBanners();
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const res = await fetch(`${API_BASE}/api/banners/${banner._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !banner.isActive })
      });

      if (!res.ok) throw new Error('Failed to toggle status');
      sessionStorage.removeItem('mq_cached_banners');
      toast.success(banner.isActive ? 'Banner Deactivated' : 'Banner Activated ⚡');
      fetchBanners();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/banners/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete banner');
      sessionStorage.removeItem('mq_cached_banners');
      toast.success('Banner Deleted');
      fetchBanners();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredBanners = activeCategoryFilter === 'all' 
    ? banners 
    : banners.filter(b => b.category === activeCategoryFilter);

  return (
    <div className={embedded ? "space-y-6" : "min-h-screen bg-slate-50 pt-20 pb-12"}>
      <div className={embedded ? "w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            {!embedded && (
              <Link to="/admin-dashboard" className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#0057FF] mb-2 inline-block">
                ← Back to Dashboard
              </Link>
            )}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-[#0057FF]">
                <ImageIcon size={22} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-slate-900">
                  Banners Manager
                </h1>
                <p className="text-xs font-bold text-slate-400">Upload, edit, and reorder home promotional banners</p>
              </div>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-[#0057FF] hover:bg-[#0044CC] px-5 py-3 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Upload New Banner</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {[
            { id: 'all', label: 'All Banners' },
            { id: 'hero', label: 'Hero Banners' },
            { id: 'flash', label: 'Flash Sale Banners' },
            { id: 'promo', label: 'Promo Banners' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveCategoryFilter(filter.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeCategoryFilter === filter.id 
                  ? 'bg-[#0057FF] text-white shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Banners Grid */}
        {loading ? (
          <div className="bg-white p-12 rounded-2xl text-center text-xs font-bold text-slate-400 animate-pulse">
            Loading Banners...
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-slate-200/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0057FF] flex items-center justify-center mx-auto text-xl">
              🖼️
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">No Banners Found</h3>
            <p className="text-xs text-slate-400">Click "Upload New Banner" to add a banner to the homepage carousel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanners.map((banner) => (
              <div 
                key={banner._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col group transition-all hover:shadow-md"
              >
                {/* Banner Preview Box */}
                <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-2xs ${
                      banner.isActive !== false ? 'bg-emerald-500' : 'bg-slate-500'
                    }`}>
                      {banner.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                    {banner.category || 'hero'}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 line-clamp-1">{banner.title || 'Untitled Banner'}</h3>
                    {banner.desc && <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-medium">{banner.desc}</p>}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-[#0057FF] font-bold text-[10px] uppercase truncate max-w-[60%]">
                      <LinkIcon size={12} />
                      <span className="truncate">{banner.link || '/medicines'}</span>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleActive(banner)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          banner.isActive !== false ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title={banner.isActive !== false ? 'Deactivate' : 'Activate'}
                      >
                        {banner.isActive !== false ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>

                      <button
                        onClick={() => openEditModal(banner)}
                        className="p-1.5 rounded-lg bg-blue-50 text-[#0057FF] hover:bg-blue-100 transition-colors cursor-pointer"
                        title="Edit Banner"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                        title="Delete Banner"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add / Edit Banner Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
            >
              <X size={20} />
            </button>

            <h3 className="mb-5 text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <ImageIcon size={22} className="text-[#0057FF]" />
              <span>{editingBanner ? 'Edit Banner' : 'Upload Banner'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Preview / File Dropzone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Banner Image</label>
                <div className="h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                  {bannerPreview ? (
                    <>
                      <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity cursor-pointer">
                        <Upload size={16} className="mr-1.5" />
                        <span>Change Image</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer p-4 text-center">
                      <Upload size={24} className="text-[#0057FF]" />
                      <span className="text-xs font-bold text-slate-700">Click to upload banner image</span>
                      <span className="text-[10px] text-slate-400 font-medium">Recommended aspect ratio: 21:9 or 16:9</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Banner Title</label>
                <input
                  type="text"
                  placeholder="e.g. Monsoon Health Sale"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0057FF]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subtitle / Offer Description</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 25% Off on Prescriptions & Medicines"
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0057FF]"
                />
              </div>

              {/* Target Link & Category Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target Route / Link</label>
                  <select
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0057FF]"
                  >
                    <option value="/medicines">Medicines Catalog</option>
                    <option value="/skin-care">Skin Care</option>
                    <option value="/lab-tests">Lab Tests</option>
                    <option value="/ayurveda">Ayurveda</option>
                    <option value="/care-plan">Care Plan</option>
                    <option value="/offers">Offers</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Category Tag</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0057FF]"
                  >
                    <option value="hero">Hero Carousel</option>
                    <option value="flash">Flash Sale</option>
                    <option value="promo">Promo Banner</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl bg-slate-100 py-3 text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#0057FF] hover:bg-[#0046CC] py-3 text-xs font-black uppercase tracking-wider text-white transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBanners;
