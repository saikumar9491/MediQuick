import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader2 } from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { SearchStatsStrip } from './components/SearchStatsStrip';
import { TopSearchesChart } from './components/TopSearchesChart';
import { SearchVolumeTrend } from './components/SearchVolumeTrend';
import { ZeroResultsTable } from './components/ZeroResultsTable';
import { TrendingTermsTable } from './components/TrendingTermsTable';
import toast from 'react-hot-toast';

const SearchDiscovery = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [summary, setSummary] = useState(null);
  const [zeroResults, setZeroResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [summaryRes, zeroRes, trendingRes] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/search-discovery/summary?range=${dateRange}`, { headers }),
        axios.get(`${API_BASE}/api/admin/search-discovery/zero-results?range=${dateRange}`, { headers }),
        axios.get(`${API_BASE}/api/admin/search-discovery/trending?range=${dateRange}`, { headers })
      ]);

      setSummary(summaryRes.data);
      setZeroResults(zeroRes.data);
      setTrending(trendingRes.data);
    } catch (err) {
      toast.error('Failed to load search data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Search className="w-7 h-7 text-indigo-500" />
            Search Discovery
          </h1>
          <p className="text-sm text-slate-500 font-medium">See what customers are searching for</p>
        </div>
        <div>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <option value="Today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <>
            <SearchStatsStrip stats={summary?.stats} />

            {summary?.stats.totalSearches === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700">Search tracking just started</h3>
                <p className="text-slate-500 max-w-md mx-auto mt-2">
                  No searches recorded for this time period. Data will populate naturally as customers use the search bar on the storefront.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <h2 className="font-bold text-slate-800 mb-4">Top Searched Terms</h2>
                    <TopSearchesChart data={summary?.topSearches} />
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <h2 className="font-bold text-slate-800 mb-4">Search Volume Trend</h2>
                    <SearchVolumeTrend data={summary?.volumeTrend} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-96">
                    <div className="p-4 border-b border-slate-200 bg-amber-50 rounded-t-xl">
                      <h2 className="font-bold text-amber-800">Zero-Result Searches ⚠️</h2>
                      <p className="text-[10px] text-amber-600">Customers searched for these but found nothing.</p>
                    </div>
                    <ZeroResultsTable data={zeroResults} />
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-96">
                    <div className="p-4 border-b border-slate-200 bg-emerald-50 rounded-t-xl">
                      <h2 className="font-bold text-emerald-800">Trending This Week 🚀</h2>
                      <p className="text-[10px] text-emerald-600">Highest volume growth vs previous week.</p>
                    </div>
                    <TrendingTermsTable data={trending} />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchDiscovery;
