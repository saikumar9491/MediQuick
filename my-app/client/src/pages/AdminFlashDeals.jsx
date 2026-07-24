import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE } from '../utils/apiConfig';
import { 
  Zap, 
  Trash2, 
  Edit3, 
  Plus, 
  Search, 
  X, 
  CheckCircle, 
  Tag, 
  Percent, 
  Sparkles,
  TrendingUp,
  Image as ImageIcon,
  Clock,
  Calendar,
  Save
} from 'lucide-react';

const AdminFlashDeals = ({ embedded }) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [banners, setBanners] = useState([]);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  
  // Timer State
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState('FLASH25');
  const [couponDiscount, setCouponDiscount] = useState('25');
  const [durationHours, setDurationHours] = useState('24');
  const [customDateTime, setCustomDateTime] = useState('');
  const [liveCountdown, setLiveCountdown] = useState('');
  const [savingTimer, setSavingTimer] = useState(false);

  // Edit/Add state
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [discountPrice, setDiscountPrice] = useState('');

  const { token } = useAuth();

  const fetchMedicinesAndBanners = useCallback(async () => {
    try {
      const [medRes, bannerRes, couponRes] = await Promise.all([
        fetch(`${API_BASE}/api/medicines`),
        fetch(`${API_BASE}/api/banners`),
        fetch(`${API_BASE}/api/coupons/public/active`)
      ]);
      
      if (medRes.ok) {
        const medData = await medRes.json();
        setMedicines(Array.isArray(medData) ? medData : (medData.medicines || []));
      }
      if (bannerRes.ok) {
        const bannerData = await bannerRes.json();
        setBanners(Array.isArray(bannerData) ? bannerData : []);
      }
      if (couponRes.ok) {
        const coupons = await couponRes.json();
        const flashC = (coupons || []).find(c => 
          (c.code || '').includes('FLASH') || 
          (c.code || '').includes('SALE') || 
          (c.code || '').includes('DEAL')
        );
        if (flashC) {
          setActiveCoupon(flashC);
          setCouponCode(flashC.code);
          setCouponDiscount(String(flashC.discountValue || 25));
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicinesAndBanners();
  }, [fetchMedicinesAndBanners]);

  // Live ticking countdown for active timer preview
  useEffect(() => {
    if (!activeCoupon?.validTo) return;

    const timer = setInterval(() => {
      const diff = new Date(activeCoupon.validTo).getTime() - Date.now();
      if (diff <= 0) {
        setLiveCountdown('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      const pad = (n) => String(n).padStart(2, '0');

      setLiveCountdown(`${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeCoupon]);

  // Handle setting Flash Sale Timer
  const handleSaveTimer = async (hoursPreset = null) => {
    setSavingTimer(true);
    const toastId = toast.loading('Saving Flash Sale Timer...');
    try {
      const payload = {
        code: couponCode || 'FLASH25',
        discountValue: Number(couponDiscount) || 25,
        durationHours: hoursPreset || Number(durationHours) || 24,
        ...(customDateTime ? { customValidTo: customDateTime } : {})
      };

      const res = await fetch(`${API_BASE}/api/coupons/flash-sale-timer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save timer');
      const data = await res.json();
      
      setActiveCoupon(data.coupon);
      toast.success('Flash Sale Timer Started! ⚡', { id: toastId });
      setCustomDateTime('');
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setSavingTimer(false);
    }
  };

  const flashDeals = medicines.filter(m => m.isFlashDeal);
  const availableForFlash = medicines.filter(m => 
    !m.isFlashDeal && 
    (m.name || '').toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleToggleFlashDeal = async (id, isFlashDeal, price) => {
    try {
      const res = await fetch(`${API_BASE}/api/medicines/${id}/flash-deal`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          isFlashDeal,
          discountPrice: price
        })
      });

      if (!res.ok) throw new Error('Failed to update flash deal');
      toast.success(isFlashDeal ? 'Flash Deal added! ⚡' : 'Flash Deal removed!');
      fetchMedicinesAndBanners();
      setShowAddModal(false);
      setSelectedMedicine(null);
      setDiscountPrice('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const applyDiscountPercentage = (percent) => {
    if (!selectedMedicine || !selectedMedicine.price) return;
    const calc = Math.round(selectedMedicine.price * (1 - percent / 100));
    setDiscountPrice(calc);
  };

  const openEditModal = (medicine) => {
    setSelectedMedicine(medicine);
    setDiscountPrice(medicine.discountPrice || Math.round(medicine.price * 0.75));
    setShowAddModal(true);
  };

  const flashBanner = banners.find(b => b.category === 'flash');

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const saveFlashBanner = async () => {
    if (!bannerPreview && !flashBanner) return toast.error('Please select an image');
    const loadToast = toast.loading('Saving Flash Deals Banner...');
    try {
      const res = await fetch(`${API_BASE}/api/banners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Daily Flash Sale Banner',
          category: 'flash',
          image: bannerPreview || flashBanner?.image
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Flash Deals Banner Saved! ⚡', { id: loadToast });
        setBannerPreview('');
        fetchMedicinesAndBanners();
      } else {
        toast.error(data.message || 'Failed to save banner', { id: loadToast });
      }
    } catch (err) {
      toast.error(err.message, { id: loadToast });
    }
  };

  const handleDeleteBanner = async () => {
    if (!flashBanner || !window.confirm('Remove Flash Deal Banner?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/banners/${flashBanner._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to remove banner');
      toast.success('Banner removed');
      fetchMedicinesAndBanners();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return embedded ? (
      <div className="p-12 text-center text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Flash Deals Panel...</div>
    ) : (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#fdfdfd]">
        <div className="animate-spin text-4xl text-[#FF6B00]">⚡</div>
      </div>
    );
  }

  return (
    <div className={embedded ? "space-y-6" : "min-h-screen bg-[#fdfdfd] pt-20 pb-12"}>
      <div className={embedded ? "w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            {!embedded && (
              <Link to="/admin-dashboard" className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#0057FF] mb-2 inline-block">
                ← Back to Dashboard
              </Link>
            )}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-100 text-[#FF6B00]">
                <Zap size={22} className="fill-current" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-slate-900">
                  Flash Deals Manager
                </h1>
                <p className="text-xs font-bold text-slate-400">Set flash sale countdown timers, product discounts, and promotional banners</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedMedicine(null);
                setDiscountPrice('');
                setSearchQuery('');
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-[#FF6B00] hover:bg-[#E55A00] px-5 py-3 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Flash Deal</span>
            </button>
          </div>
        </div>

        {/* ─── 1. FLASH SALE TIMER CONTROL PANEL (ADMIN TIMER CONFIG) ─── */}
        <div className="mb-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl border border-slate-700/60 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
            <Zap size={200} className="fill-current text-[#FF6B00]" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Left: Active Timer Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#FF6B00] text-white p-1.5 rounded-lg">
                  <Clock size={16} />
                </span>
                <h2 className="text-sm font-black uppercase tracking-widest text-orange-400">
                  Live Flash Sale Countdown Timer
                </h2>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl">
                  {liveCountdown || '00h : 00m : 00s'}
                </div>
                <div className="flex flex-col text-xs text-slate-300">
                  <span className="font-bold text-orange-300 uppercase tracking-wider">
                    Coupon: {activeCoupon?.code || 'FLASH25'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Expires: {activeCoupon?.validTo ? new Date(activeCoupon.validTo).toLocaleString() : 'Not Set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Timer Duration Controls & Presets */}
            <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl space-y-3.5 max-w-md w-full">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-300">Quick Timer Presets</p>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[6, 12, 24, 48].map((h) => (
                  <button
                    key={h}
                    disabled={savingTimer}
                    onClick={() => {
                      setDurationHours(String(h));
                      handleSaveTimer(h);
                    }}
                    className="py-1.5 px-2 bg-slate-700 hover:bg-[#FF6B00] text-white rounded-lg text-xs font-black transition-all cursor-pointer border border-slate-600 hover:border-orange-500 active:scale-95"
                  >
                    + {h} Hours
                  </button>
                ))}
              </div>

              {/* Custom Date Time Inputs */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="datetime-local"
                  value={customDateTime}
                  onChange={(e) => setCustomDateTime(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-[#FF6B00]"
                />
                <button
                  disabled={savingTimer}
                  onClick={() => handleSaveTimer()}
                  className="bg-[#FF6B00] hover:bg-[#E55A00] text-white px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Save size={13} />
                  <span>Set</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 p-4 rounded-2xl border border-orange-100/80 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-orange-500">Active Deals</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{flashDeals.length}</p>
            </div>
            <div className="p-3 bg-white text-[#FF6B00] rounded-xl shadow-2xs">
              <Zap size={20} className="fill-current" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50/50 p-4 rounded-2xl border border-emerald-100/80 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Avg Discount</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">25% OFF</p>
            </div>
            <div className="p-3 bg-white text-emerald-600 rounded-xl shadow-2xs">
              <Percent size={20} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-100/80 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#0057FF]">Inventory Ready</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{availableForFlash.length} Items</p>
            </div>
            <div className="p-3 bg-white text-[#0057FF] rounded-xl shadow-2xs">
              <Sparkles size={20} />
            </div>
          </div>
        </div>

        {/* Flash Banner Manager */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#FF6B00] flex items-center gap-2">
              <ImageIcon size={16} />
              <span>Daily Flash Sale Promotional Banner</span>
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Current/Preview Banner Display */}
            <div className="w-full md:w-2/3 h-[150px] sm:h-[180px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden relative">
              {(bannerPreview || flashBanner) ? (
                <img 
                  src={bannerPreview || flashBanner.image} 
                  alt="Flash Deal Banner" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="text-center text-slate-400">
                  <span className="block text-3xl mb-2">⚡</span>
                  <span className="text-xs font-bold uppercase tracking-widest">No Banner Configured</span>
                </div>
              )}
            </div>

            {/* Banner Controls */}
            <div className="w-full md:w-1/3 flex flex-col gap-3">
              <label className="cursor-pointer bg-blue-50 text-[#0057FF] text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl text-center hover:bg-blue-100 transition-colors">
                {flashBanner ? 'Change Image' : 'Upload Image'}
                <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
              </label>
              
              {bannerPreview && (
                <button 
                  onClick={saveFlashBanner} 
                  className="bg-[#FF6B00] text-white text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl text-center hover:bg-[#E55A00] transition-colors cursor-pointer"
                >
                  Save Banner
                </button>
              )}

              {flashBanner && !bannerPreview && (
                <button 
                  onClick={handleDeleteBanner} 
                  className="bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl text-center hover:bg-red-100 transition-colors cursor-pointer"
                >
                  Delete Banner
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Deals List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-700">Active Flash Products ({flashDeals.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100/70 text-slate-800 border-b border-slate-200/60">
                <tr>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest">Product</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest">Original Price</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#FF6B00]">Flash Deal Price</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-emerald-600">Discount</th>
                  <th className="p-4 text-center text-[10px] font-black uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {flashDeals.map((deal) => {
                  const mrp = deal.price || 0;
                  const flashPrice = deal.discountPrice || mrp;
                  const discountPct = mrp > 0 ? Math.round(((mrp - flashPrice) / mrp) * 100) : 0;

                  return (
                    <tr key={deal._id} className="transition-colors hover:bg-orange-50/20">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={deal.image} alt={deal.name} className="h-10 w-10 rounded-lg object-contain bg-slate-50 border border-slate-100 p-1" />
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{deal.name}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{deal.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-400 line-through">₹{mrp}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-black text-base text-[#FF6B00]">₹{flashPrice}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full">
                          {discountPct}% OFF
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(deal)}
                            className="rounded-lg bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#0057FF] transition-colors hover:bg-blue-100 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Remove ${deal.name} from Flash Deals?`)) {
                                handleToggleFlashDeal(deal._id, false, null);
                              }
                            }}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-600 transition-colors hover:bg-red-100 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {flashDeals.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-10 text-center">
                      <div className="text-3xl mb-2 text-slate-300">⚡</div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">No active flash deal products.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add / Edit Flash Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setShowAddModal(false);
                setSelectedMedicine(null);
              }}
              className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X size={18} />
            </button>

            <h3 className="mb-5 text-lg font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <Zap size={18} className="text-[#FF6B00] fill-current" />
              <span>{selectedMedicine && selectedMedicine.isFlashDeal ? 'Edit Flash Deal' : 'Add Flash Deal Product'}</span>
            </h3>

            {!selectedMedicine ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search inventory product..."
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-xs font-bold outline-none transition focus:border-[#FF6B00]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                  {availableForFlash.length > 0 ? availableForFlash.map(med => (
                    <div 
                      key={med._id} 
                      onClick={() => { 
                        setSelectedMedicine(med); 
                        setDiscountPrice(Math.round((med.price || 500) * 0.75)); 
                      }} 
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 cursor-pointer hover:border-[#FF6B00] hover:bg-orange-50/40 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img src={med.image} alt={med.name} className="h-9 w-9 rounded-lg object-contain bg-white border border-slate-100 p-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 line-clamp-1">{med.name}</p>
                          <p className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">Base Price: ₹{med.price}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#FF6B00] bg-orange-50 border border-orange-100 px-2 py-1 rounded-lg">Select</span>
                    </div>
                  )) : (
                    <p className="text-center text-xs text-slate-400 font-bold py-6">No matching inventory items available.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                   <img src={selectedMedicine.image} alt={selectedMedicine.name} className="h-11 w-11 rounded-xl object-contain bg-white shadow-2xs border border-slate-100 p-1" />
                   <div>
                      <p className="text-xs font-black text-slate-900 line-clamp-1">{selectedMedicine.name}</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Base Price: ₹{selectedMedicine.price}</p>
                   </div>
                </div>

                {/* Quick Discount Presets */}
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">Quick Discount Presets</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 20, 25, 30].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => applyDiscountPercentage(pct)}
                        className="py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-[#FF6B00] text-xs font-black hover:bg-[#FF6B00] hover:text-white transition-all cursor-pointer"
                      >
                        {pct}% OFF
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00]">Flash Sale Price (₹)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="w-full rounded-xl border border-orange-200 p-3 text-base font-black text-slate-900 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                    placeholder="Enter discounted price"
                  />
                  {Number(discountPrice) >= selectedMedicine.price && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">Warning: Flash price should be lower than base price.</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (!selectedMedicine.isFlashDeal) setSelectedMedicine(null);
                      else setShowAddModal(false);
                    }}
                    className="flex-1 rounded-xl bg-slate-100 py-3 text-xs font-black uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleToggleFlashDeal(selectedMedicine._id, true, discountPrice)}
                    disabled={!discountPrice}
                    className="flex-1 rounded-xl bg-[#FF6B00] py-3 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-[#E55A00] disabled:opacity-50 cursor-pointer shadow-xs active:scale-95"
                  >
                    Save Flash Deal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminFlashDeals;
