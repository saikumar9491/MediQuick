import { API_BASE } from '../utils/apiConfig';

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const fetchOrders = async (token) => {
  const res = await fetch(`${API_BASE}/api/customers/me/orders`, { headers: headers(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
  return data;
};

export const fetchOrderDetails = async (token, orderId) => {
  const res = await fetch(`${API_BASE}/api/customers/me/orders/${orderId}`, { headers: headers(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch order details');
  return data;
};

export const reorder = async (token, orderId) => {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/reorder`, {
    method: 'POST',
    headers: headers(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Reorder failed');
  return data;
};

export const getInvoiceUrl = (orderId) => {
  return `${API_BASE}/api/orders/${orderId}/invoice`;
};
