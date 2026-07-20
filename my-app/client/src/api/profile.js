import { API_BASE } from '../utils/apiConfig';

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const fetchProfile = async (token) => {
  const res = await fetch(`${API_BASE}/api/customers/me`, { headers: headers(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
  return data;
};

export const updateProfile = async (token, payload) => {
  const res = await fetch(`${API_BASE}/api/customers/me`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
};

export const fetchOrders = async (token) => {
  const res = await fetch(`${API_BASE}/api/customers/me/orders`, { headers: headers(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
  return data;
};

export const fetchAddresses = async (token) => {
  const res = await fetch(`${API_BASE}/api/customers/me/addresses`, { headers: headers(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch addresses');
  return data;
};

export const addAddress = async (token, payload) => {
  const res = await fetch(`${API_BASE}/api/customers/me/addresses`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add address');
  return data;
};

export const editAddress = async (token, addressId, payload) => {
  const res = await fetch(`${API_BASE}/api/customers/me/addresses/${addressId}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to edit address');
  return data;
};

export const deleteAddress = async (token, addressId) => {
  const res = await fetch(`${API_BASE}/api/customers/me/addresses/${addressId}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete address');
  return data;
};

export const fetchPrescriptions = async (token) => {
  const res = await fetch(`${API_BASE}/api/customers/me/prescriptions`, { headers: headers(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch prescriptions');
  return data;
};

export const uploadPrescription = async (token, payload) => {
  const res = await fetch(`${API_BASE}/api/customers/me/prescriptions`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to upload prescription');
  return data;
};

export const fetchReviews = async (token) => {
  const res = await fetch(`${API_BASE}/api/customers/me/reviews`, { headers: headers(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch reviews');
  return data;
};

export const fetchWishlist = async (token) => {
  const res = await fetch(`${API_BASE}/api/customers/me/wishlist`, { headers: headers(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch wishlist');
  return data;
};

export const updateNotificationPreferences = async (token, payload) => {
  const res = await fetch(`${API_BASE}/api/customers/me/notification-preferences`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update preferences');
  return data;
};

export const changePassword = async (token, payload) => {
  const res = await fetch(`${API_BASE}/api/customers/me/password`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to change password');
  return data;
};

export const deleteAccount = async (token) => {
  const res = await fetch(`${API_BASE}/api/customers/me/delete-account`, {
    method: 'POST',
    headers: headers(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete account');
  return data;
};
