import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Tag, Plus } from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { CouponsStatsStrip } from './components/CouponsStatsStrip';
import { CouponsTable } from './components/CouponsTable';
import { CouponModal } from './components/CouponModal';
import { CouponDetailModal } from './components/CouponDetailModal';
import { CouponsFilterBar } from './components/CouponsFilterBar';
import toast from 'react-hot-toast';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [type, setType] = useState('All');
  
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null); // Used for Edit & Duplicate
  const [viewDetailId, setViewDetailId] = useState(null);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/coupons/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching coupon stats', err);
    }
  };

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const params = new URLSearchParams({
        page,
        limit,
        search,
        status,
        type
      });

      const res = await axios.get(`${API_BASE}/api/coupons?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(res.data.coupons);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.total);
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, type]);

  useEffect(() => {
    fetchStats();
    fetchCoupons();
  }, [fetchCoupons]);

  const handleOpenAdd = () => {
    setSelectedCoupon(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setSelectedCoupon(c);
    setIsModalOpen(true);
  };

  const handleDuplicate = (c) => {
    // Deep copy and remove sensitive unique fields
    const duplicate = JSON.parse(JSON.stringify(c));
    delete duplicate._id;
    duplicate.code = '';
    duplicate.usedCount = 0;
    setSelectedCoupon(duplicate);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    fetchStats();
    fetchCoupons();
    setIsModalOpen(false);
  };

  // When filters change, reset page to 1
  const handleFilterChange = () => {
    setPage(1);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Tag className="w-7 h-7 text-blue-600" />
            Coupons Engine
          </h1>
          <p className="text-sm text-slate-500 font-medium">Create and manage discount codes</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Coupon
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <CouponsStatsStrip stats={stats} />
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[400px]">
          <CouponsFilterBar 
            search={search} setSearch={setSearch}
            status={status} setStatus={setStatus}
            type={type} setType={setType}
            onFilterChange={handleFilterChange}
          />
          <CouponsTable 
            coupons={coupons}
            loading={loading}
            currentPage={page}
            totalPages={totalPages}
            totalCount={totalCount}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(v) => { setLimit(v); setPage(1); }}
            onEdit={handleOpenEdit}
            onDuplicate={handleDuplicate}
            onRowClick={setViewDetailId}
            onRefresh={handleRefresh}
          />
        </div>
      </div>

      {isModalOpen && (
        <CouponModal 
          coupon={selectedCoupon}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleRefresh}
        />
      )}

      {viewDetailId && (
        <CouponDetailModal 
          couponId={viewDetailId}
          onClose={() => setViewDetailId(null)}
        />
      )}
    </div>
  );
};

export default Coupons;
