import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Star, Loader2 } from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { ReviewsStatsStrip } from './components/ReviewsStatsStrip';
import { ReviewsFilterBar } from './components/ReviewsFilterBar';
import { ReviewsTable } from './components/ReviewsTable';
import { ReviewDetailModal } from './components/ReviewDetailModal';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [responseFilter, setResponseFilter] = useState('All');

  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      // Search
      const searchMatch = !search || 
        r.productName.toLowerCase().includes(search.toLowerCase()) || 
        r.customerName.toLowerCase().includes(search.toLowerCase());
      
      // Rating
      const ratingMatch = ratingFilter === 'All' || r.rating === Number(ratingFilter);
      
      // Status
      const statusMatch = statusFilter === 'All' || 
        (statusFilter === 'Published' && r.isApproved) || 
        (statusFilter === 'Hidden' && !r.isApproved);
        
      // Response
      const responseMatch = responseFilter === 'All' || 
        (responseFilter === 'Responded' && r.adminResponse) || 
        (responseFilter === 'Not Responded' && !r.adminResponse);

      return searchMatch && ratingMatch && statusMatch && responseMatch;
    });
  }, [reviews, search, ratingFilter, statusFilter, responseFilter]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
            Reviews Management
          </h1>
          <p className="text-sm text-slate-500 font-medium">Moderate and respond to product reviews</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        <ReviewsStatsStrip reviews={reviews} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[500px]">
          <ReviewsFilterBar 
            search={search} setSearch={setSearch}
            ratingFilter={ratingFilter} setRatingFilter={setRatingFilter}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            responseFilter={responseFilter} setResponseFilter={setResponseFilter}
          />
          
          <ReviewsTable 
            reviews={filteredReviews}
            loading={loading}
            onRowClick={setSelectedReview}
            onRefresh={fetchReviews}
          />
        </div>

      </div>

      {selectedReview && (
        <ReviewDetailModal 
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onRefresh={fetchReviews}
        />
      )}
    </div>
  );
};

export default Reviews;
