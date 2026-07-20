import { API_BASE } from '../utils/apiConfig';

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

/** Fetch cart with live product data */
export const fetchCart = async (token) => {
  const res = await fetch(`${API_BASE}/api/cart`, { headers: headers(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch cart');
  return data;
};

/** Add item to cart */
export const addItem = async (token, productId, quantity = 1) => {
  const res = await fetch(`${API_BASE}/api/cart/items`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ productId, quantity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add item');
  return data;
};

/** Update item quantity */
export const updateItemQty = async (token, productId, quantity) => {
  const res = await fetch(`${API_BASE}/api/cart/items/${productId}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({ quantity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update quantity');
  return data;
};

/** Remove item */
export const removeItem = async (token, productId) => {
  const res = await fetch(`${API_BASE}/api/cart/items/${productId}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to remove item');
  return data;
};

/** Validate all items (stock/price freshness check) */
export const validateCart = async (token) => {
  const res = await fetch(`${API_BASE}/api/cart/validate`, {
    method: 'POST',
    headers: headers(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Cart validation failed');
  return data;
};

/** Clear entire cart */
export const clearCart = async (token) => {
  const res = await fetch(`${API_BASE}/api/cart`, {
    method: 'DELETE',
    headers: headers(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to clear cart');
  return data;
};

/** Fetch product recommendations by category */
export const fetchRecommendations = async (categories = [], limit = 8) => {
  const cat = categories[0] || '';
  const url = cat
    ? `${API_BASE}/api/medicines?category=${encodeURIComponent(cat)}&limit=${limit}`
    : `${API_BASE}/api/medicines?isFeatured=true&limit=${limit}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.medicines || data.products || data || [];
};
