import { API_BASE } from '../utils/apiConfig';

export const getCarePlans = async () => {
  const res = await fetch(`${API_BASE}/api/care-plan/plans`);
  if (!res.ok) throw new Error('Failed to fetch care plans');
  return res.json();
};

export const getMySubscription = async (token) => {
  const authToken = token || localStorage.getItem('userToken');
  if (!authToken) return null;

  const res = await fetch(`${API_BASE}/api/care-plan/my-subscription`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
};

export const subscribeCarePlan = async (token, payload) => {
  const authToken = token || localStorage.getItem('userToken');
  const res = await fetch(`${API_BASE}/api/care-plan/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Subscription failed');
  }
  return res.json();
};

export const cancelCarePlanSubscription = async (token) => {
  const authToken = token || localStorage.getItem('userToken');
  const res = await fetch(`${API_BASE}/api/care-plan/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to cancel subscription');
  }
  return res.json();
};
