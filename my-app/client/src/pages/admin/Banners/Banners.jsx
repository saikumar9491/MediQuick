import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  RefreshCw, 
  LayoutGrid, 
  List as ListIcon, 
  ArrowUpDown, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Zap,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

import { 
  fetchAdminBanners, 
  fetchBannersSummaryStats, 
  createBanner, 
  updateBanner, 
  deleteBanner, 
  reorderBanners,
  toggleBannerStatus 
} from '../../../api/admin/banners';

import BannersStatsStrip from './components/BannersStatsStrip';
import BannersFilterTabs from './components/BannersFilterTabs';
import BannersTable from './components/BannersTable';
import BannersGrid from './components/BannersGrid';
import BannerModal from './components/BannerModal';
import DragReorderList from './components/DragReorderList';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bannersData, statsData] = await Promise.all([
        fetchAdminBanners(),
        fetchBannersSummaryStats()
      ]);
      setBanners(bannersData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load banner data:', err);
      toast.error('Failed to load banner list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute category counts for Filter Tabs
  const counts = useMemo(() => {
    const res = {
      all: banners.length,
      'homepage-hero': 0,
      'floating-video': 0,
      'category-mini': 0,
      'flash-sale': 0,
      'mobile-only': 0,
      'desktop-only': 0,
      'both-devices': 0
    };

    banners.forEach((b) => {
      const p = b.placement || b.category;
      if (p === 'homepage-hero' || p === 'main') res['homepage-hero']++;
      else if (p === 'floating-video' || b.type === 'floating-video') res['floating-video']++;
      else if (p === 'category-mini') res['category-mini']++;
      else if (p === 'flash-sale' || p === 'flash') res['flash-sale']++;

      if (b.targetDevice === 'mobile') res['mobile-only']++;
      else if (b.targetDevice === 'desktop') res['desktop-only']++;
      else res['both-devices']++;
    });

    return res;
  }, [banners]);

  // Filter banners based on activeTab and searchQuery
  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      const p = b.placement || b.category;

      // Tab Filtering
      if (activeTab === 'homepage-hero' && p !== 'homepage-hero' && p !== 'main') return false;
      if (activeTab === 'floating-video' && p !== 'floating-video' && b.type !== 'floating-video') return false;
      if (activeTab === 'category-mini' && p !== 'category-mini') return false;
      if (activeTab === 'flash-sale' && p !== 'flash-sale' && p !== 'flash') return false;
      if (activeTab === 'mobile-only' && b.targetDevice !== 'mobile') return false;
      if (activeTab === 'desktop-only' && b.targetDevice !== 'desktop') return false;
      if (activeTab === 'both-devices' && b.targetDevice !== 'both' && b.targetDevice !== undefined) return false;

      // Search Filtering
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const nameMatch = (b.name || '').toLowerCase().includes(query);
        const headlineMatch = (b.headline || b.title || '').toLowerCase().includes(query);
        const subtextMatch = (b.subtext || b.desc || '').toLowerCase().includes(query);
        const badgeMatch = (b.badgeText || '').toLowerCase().includes(query);
        if (!nameMatch && !headlineMatch && !subtextMatch && !badgeMatch) return false;
      }

      return true;
    });
  }, [banners, activeTab, searchQuery]);

  // Create or Update Submission
  const handleModalSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingBanner) {
        await updateBanner(editingBanner._id, formData);
        toast.success('Banner updated successfully!');
      } else {
        await createBanner(formData);
        toast.success('New banner created and published!');
      }
      setIsModalOpen(false);
      setEditingBanner(null);
      loadData();
    } catch (err) {
      console.error('Error submitting banner form:', err);
      toast.error(err.response?.data?.message || 'Failed to save banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Status Action
  const handleToggleStatus = async (banner) => {
    const isCurrentlyActive = banner.status === 'active' || banner.isActive;
    const newStatus = isCurrentlyActive ? 'draft' : 'active';
    try {
      await toggleBannerStatus(banner._id, newStatus);
      toast.success(newStatus === 'active' ? 'Banner is now Live!' : 'Banner deactivated');
      loadData();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      toast.error('Failed to update status');
    }
  };

  // Duplicate Action
  const handleDuplicate = async (banner) => {
    try {
      const duplicateData = {
        ...banner,
        _id: undefined,
        name: `${banner.name || banner.headline || 'Banner'} (Copy)`,
        headline: banner.headline ? `${banner.headline} (Copy)` : '',
        status: 'draft',
        isActive: false
      };
      await createBanner(duplicateData);
      toast.success('Banner duplicated as Draft!');
      loadData();
    } catch (err) {
      console.error('Duplicate failed:', err);
      toast.error('Failed to duplicate banner');
    }
  };

  // Delete Action with Live Banner Protection Check
  const handleDelete = async (banner) => {
    const isLive = banner.status === 'active' || banner.isActive;

    if (isLive) {
      const confirmDeactivate = window.confirm(
        `Banner "${banner.name || banner.headline}" is currently live on the site!\n\nDo you want to DEACTIVATE it instead of deleting? (Click OK to Deactivate, Cancel to abort)`
      );
      if (confirmDeactivate) {
        return handleToggleStatus(banner);
      }
      return;
    }

    if (window.confirm(`Are you sure you want to delete banner "${banner.name || banner.headline}"?`)) {
      try {
        await deleteBanner(banner._id, true);
        toast.success('Banner deleted');
        loadData();
      } catch (err) {
        console.error('Delete failed:', err);
        toast.error('Failed to delete banner');
      }
    }
  };

  // Reorder Save
  const handleSaveReorder = async (reorderedItems) => {
    await reorderBanners(reorderedItems);
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] p-6 lg:p-8 space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Banner Management
            </h1>
            <span className="bg-blue-50 text-[#0057FF] border border-blue-100 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
              PROMOTIONS
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Manage promotional banners, hero carousels, category mini-banners, and flash sale slots across desktop and mobile
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsReorderOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ArrowUpDown size={14} className="text-[#0057FF]" />
            <span>Reorder Priority</span>
          </button>

          <button
            onClick={() => {
              setEditingBanner(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#0057FF] text-white text-xs font-black uppercase tracking-wider hover:bg-blue-700 shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Add Banner</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Strip */}
      <BannersStatsStrip stats={stats} loading={loading} />

      {/* 3. Filter Tabs & Search */}
      <BannersFilterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        counts={counts}
      />

      {/* View Mode Switcher Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-slate-500">
          Showing <span className="text-slate-900 font-extrabold">{filteredBanners.length}</span> banners
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw size={15} />
          </button>

          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-[#0057FF] text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              <ListIcon size={15} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#0057FF] text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Table / Grid Views */}
      {viewMode === 'table' ? (
        <BannersTable
          banners={filteredBanners}
          loading={loading}
          onEdit={(b) => {
            setEditingBanner(b);
            setIsModalOpen(true);
          }}
          onDuplicate={handleDuplicate}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      ) : (
        <BannersGrid
          banners={filteredBanners}
          loading={loading}
          onEdit={(b) => {
            setEditingBanner(b);
            setIsModalOpen(true);
          }}
          onDuplicate={handleDuplicate}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      )}

      {/* 5. Add / Edit Banner Modal */}
      <BannerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBanner(null);
        }}
        onSubmit={handleModalSubmit}
        editingBanner={editingBanner}
        isSubmitting={isSubmitting}
      />

      {/* 6. Drag & Drop Reordering Drawer */}
      <DragReorderList
        banners={banners}
        isOpen={isReorderOpen}
        onClose={() => setIsReorderOpen(false)}
        onSaveReorder={handleSaveReorder}
      />

    </div>
  );
};

export default Banners;
