import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { RefreshCcw, Loader2 } from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { ReturnsStatsStrip } from './components/ReturnsStatsStrip';
import { ReturnsFilterBar } from './components/ReturnsFilterBar';
import { ReturnsTable } from './components/ReturnsTable';
import { ReturnDetailModal } from './components/ReturnDetailModal';
import toast from 'react-hot-toast';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-600">
          <h1 className="text-2xl font-bold">Something went wrong.</h1>
          <pre className="mt-4 bg-red-50 p-4 rounded">{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const ReturnsRefundsContent = () => {
  const [returns, setReturns] = useState([]);
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
  const [reason, setReason] = useState('All');

  // Modal
  const [selectedReturnId, setSelectedReturnId] = useState(null);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/returns/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        status,
        reason,
        ...(search && { search })
      });

      const res = await axios.get(`${API_BASE}/api/returns?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReturns(res.data.returns);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.total);
    } catch (err) {
      toast.error('Failed to load returns');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, status, reason, search]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const handleRefresh = () => {
    fetchStats();
    fetchReturns();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <RefreshCcw className="w-7 h-7 text-blue-600" />
            Returns & Refunds
          </h1>
          <p className="text-sm text-slate-500 font-medium">Manage product returns and process refunds</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <ReturnsStatsStrip stats={stats} loading={statsLoading} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <ReturnsFilterBar 
            search={search} setSearch={setSearch}
            status={status} setStatus={setStatus}
            reason={reason} setReason={setReason}
            onFilterChange={() => setCurrentPage(1)} 
          />
          
          <ReturnsTable 
            returns={returns}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            limit={limit}
            onPageChange={setCurrentPage}
            onLimitChange={(l) => { setLimit(l); setCurrentPage(1); }}
            onRowClick={setSelectedReturnId}
            onStatusUpdate={handleRefresh}
          />
        </div>
      </div>

      {selectedReturnId && (
        <ReturnDetailModal 
          returnId={selectedReturnId}
          onClose={() => setSelectedReturnId(null)}
          onUpdate={handleRefresh}
        />
      )}
    </div>
  );
};

const ReturnsRefunds = () => (
  <ErrorBoundary>
    <ReturnsRefundsContent />
  </ErrorBoundary>
);

export default ReturnsRefunds;
