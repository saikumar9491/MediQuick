import { API_BASE } from '../utils/apiConfig';

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const fetchWishlist = async (token) => {
  const res = await fetch(`${API_BASE}/api/customers/me/wishlist`, { headers: headers(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch wishlist');
  return data;
};

export const addToWishlist = async (token, productId) => {
  const res = await fetch(`${API_BASE}/api/customers/me/wishlist/${productId}`, {
    method: 'POST',
    headers: headers(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add to wishlist');
  return data;
};

export const removeFromWishlist = async (token, productId) => {
  const res = await fetch(`${API_BASE}/api/customers/me/wishlist/${productId}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to remove from wishlist');
  return data;
};

export const subscribeToRestock = async (token, productId) => {
  const res = await fetch(`${API_BASE}/api/products/${productId}/notify-restock`, {
    method: 'POST',
    headers: headers(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to subscribe to restock notifications');
  return data;
};
