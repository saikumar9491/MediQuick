import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { ComplaintsStatsStrip } from './components/ComplaintsStatsStrip';
import { ComplaintsFilterBar } from './components/ComplaintsFilterBar';
import { ComplaintsTable } from './components/ComplaintsTable';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import toast from 'react-hot-toast';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [category, setCategory] = useState('All');

  // Modal
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/complaints/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        status,
        priority,
        category,
        ...(search && { search })
      });

      const res = await axios.get(`${API_BASE}/api/complaints?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComplaints(res.data.complaints);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.total);
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, status, priority, category, search]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleRefresh = () => {
    fetchStats();
    fetchComplaints();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-blue-600" />
            Complaints
          </h1>
          <p className="text-sm text-slate-500 font-medium">Track and resolve customer complaints</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <ComplaintsStatsStrip stats={stats} loading={statsLoading} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <ComplaintsFilterBar 
            search={search} setSearch={setSearch}
            status={status} setStatus={setStatus}
            priority={priority} setPriority={setPriority}
            category={category} setCategory={setCategory}
            onFilterChange={() => setCurrentPage(1)} // Reset page when filters change
          />
          
          <ComplaintsTable 
            complaints={complaints}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            limit={limit}
            onPageChange={setCurrentPage}
            onLimitChange={(l) => { setLimit(l); setCurrentPage(1); }}
            onRowClick={setSelectedComplaintId}
            onStatusUpdate={handleRefresh}
          />
        </div>
      </div>

      {selectedComplaintId && (
        <ComplaintDetailModal 
          complaintId={selectedComplaintId}
          onClose={() => setSelectedComplaintId(null)}
          onUpdate={handleRefresh}
        />
      )}
    </div>
  );
};

export default Complaints;
