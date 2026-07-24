import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { API_BASE } from '../../utils/apiConfig';
import ProductScrollRow from './ProductScrollRow';

const PersonalizedSection = () => {
  const { token, user } = useAuth();
  const { cartItems } = useCart();
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
        console.error("Error loading recently viewed for personalized section", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, [token]);

  if (loading || products.length === 0) return null;

  // Filter out products that are already in the cart
  const cartIds = (cartItems || []).map(item => (item._id || item.productId || '').toString());
  const stillLooking = products.filter(product => product && product._id && !cartIds.includes(product._id.toString()));

  if (stillLooking.length === 0) return null;

  return (
    <ProductScrollRow 
      title="Still looking for these?" 
      products={stillLooking}
    />
  );
};

export default PersonalizedSection;
