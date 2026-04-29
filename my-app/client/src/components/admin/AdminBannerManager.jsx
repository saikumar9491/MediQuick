import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Edit3, Image as ImageIcon, Upload, Link as LinkIcon, CheckCircle } from 'lucide-react';

const THEME_COLORS = [
  'bg-gradient-to-r from-purple-500 to-purple-700',
  'bg-gradient-to-r from-green-500 to-green-700',
  'bg-gradient-to-r from-blue-500 to-blue-700',
  'bg-gradient-to-r from-orange-500 to-orange-700',
  'bg-gradient-to-r from-pink-500 to-pink-700',
  'bg-gradient-to-r from-indigo-500 to-indigo-700',
  'bg-gradient-to-r from-teal-500 to-teal-700',
  'bg-gradient-to-r from-red-500 to-red-700',
  'bg-gradient-to-r from-slate-800 to-slate-900',
  'bg-gradient-to-r from-cyan-500 to-cyan-700',
  'bg-gradient-to-r from-fuchsia-500 to-fuchsia-700',
  'bg-gradient-to-r from-emerald-500 to-emerald-700',
];

const AdminBannerManager = ({ banners, setBanners, token, API_BASE, handleDeleteBanner }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    image: '',
    bg: THEME_COLORS[0],
    link: ''
  });

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Read file as Base64 Data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      toast.error('Title and Image are required!');
      return;
    }

    setIsUploading(true);
    try {
      const res = await fetch(`${API_BASE}/api/banners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Banner successfully deployed!');
        setBanners([...banners, data]);
        setFormData({ title: '', desc: '', image: '', bg: THEME_COLORS[0], link: '' });
      } else {
        toast.error(data.message || 'Failed to create banner');
      }
    } catch (err) {
      toast.error('Network error while deploying banner');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT COLUMN: BANNER BUILDER */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Banner Builder</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Banner Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Banner Title</label>
              <input
                type="text"
                placeholder="e.g., Stock Clearing Sale"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Subtitle</label>
              <input
                type="text"
                placeholder="Up to 30% Off on Medicines"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              />
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-4 pt-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Media Payload (Image)</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 px-4 py-3 text-xs font-bold text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all"
              >
                <Upload className="h-4 w-4" /> Upload Image
              </button>
              
              <div className="flex flex-1 items-center relative">
                <LinkIcon className="absolute left-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Or Paste Manual URL"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-xs font-bold text-slate-600 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                  value={formData.image.startsWith('data:') ? '' : formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
            </div>
            
            {formData.image && (
              <div className="mt-3 relative h-32 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setFormData({...formData, image: ''})} className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 text-red-500 hover:bg-red-50 hover:scale-110 transition-all">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Theme Color & Link */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Select Theme Color (Visual Picker)</label>
              <div className="grid grid-cols-6 gap-3">
                {THEME_COLORS.map((color, idx) => (
                  <div
                    key={idx}
                    onClick={() => setFormData({ ...formData, bg: color })}
                    className={`h-10 w-10 cursor-pointer rounded-full ${color} shadow-sm transition-transform hover:scale-110 relative flex items-center justify-center`}
                  >
                    {formData.bg === color && <CheckCircle className="h-5 w-5 text-white/90 drop-shadow-md" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Destination Link (Optional)</label>
              <input
                type="text"
                placeholder="/medicines or https://..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none transition-all"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Deploying...' : 'Deploy Custom Banner'}
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: LIVE PREVIEWS */}
      <div className="space-y-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Live Deployments</h2>
        
        {banners.filter(b => b.category !== 'flash').length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-20 text-slate-400">
            <ImageIcon className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm font-bold">No active banners found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {banners.filter(b => b.category !== 'flash').map(banner => (
              <div key={banner._id} className={`group relative flex h-32 w-full overflow-hidden rounded-full shadow-md transition-transform hover:scale-[1.02] ${banner.bg || 'bg-slate-800'}`}>
                {/* Left side text content */}
                <div className="flex w-2/3 flex-col justify-center pl-8 pr-4 z-10">
                  <h3 className="text-lg font-black uppercase italic tracking-tight text-white leading-tight line-clamp-1 drop-shadow-md">
                    {banner.title}
                  </h3>
                  {banner.desc && (
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/90 line-clamp-2">
                      {banner.desc}
                    </p>
                  )}
                </div>
                
                {/* Right side image */}
                <div className="relative w-1/3 h-full rounded-l-[40px] overflow-hidden border-l-4 border-white/20 shadow-[-10px_0_15px_rgba(0,0,0,0.1)]">
                  <img src={banner.image} alt="Banner" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
                    <button onClick={() => handleDeleteBanner(banner._id)} className="rounded-full bg-white/90 p-2 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:scale-110">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBannerManager;
