import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/apiConfig';
import ProductScrollRow from './ProductScrollRow';

const RecentlyViewed = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sessionId = sessionStorage.getItem('mq_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('mq_session_id', sessionId);
    }

    const fetchRecentlyViewed = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/customers/recently-viewed?sessionId=${sessionId}`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProducts(data);
          }
        }
      } catch (err) {
        console.error("Error loading recently viewed products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyViewed();

    // Listen to potential additions
    const handleHistoryLogged = () => {
      fetchRecentlyViewed();
    };
    window.addEventListener('historyLogged', handleHistoryLogged);
    return () => window.removeEventListener('historyLogged', handleHistoryLogged);
  }, [token]);

  if (loading || products.length === 0) return null;

  return (
    <ProductScrollRow 
      title="Recently Viewed Items" 
      products={products}
    />
  );
};

export default RecentlyViewed;
