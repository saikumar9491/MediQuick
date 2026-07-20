import axios from 'axios';
import { API_BASE } from '../utils/apiConfig';

export const submitReview = async (reviewData, token) => {
  const res = await axios.post(`${API_BASE}/api/reviews`, reviewData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const editReview = async (reviewId, reviewData, token) => {
  const res = await axios.patch(`${API_BASE}/api/reviews/${reviewId}`, reviewData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteReview = async (reviewId, token) => {
  const res = await axios.delete(`${API_BASE}/api/reviews/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const checkCanReview = async (productId, token) => {
  const res = await axios.get(`${API_BASE}/api/reviews/can-review/${productId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
