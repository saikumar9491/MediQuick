import { API_BASE } from '../utils/apiConfig';

export const getPageContent = async (pageKey) => {
  try {
    const res = await fetch(`${API_BASE}/api/page-content/${pageKey}`);
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error(`Failed to fetch page content for ${pageKey}:`, err);
    return null;
  }
};

export const getAllPageContentsAdmin = async (token) => {
  const authToken = token || localStorage.getItem('userToken');
  const res = await fetch(`${API_BASE}/api/page-content/admin/all`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch admin page contents');
  return res.json();
};

export const updatePageContentAdmin = async (token, pageKey, payload) => {
  const authToken = token || localStorage.getItem('userToken');
  const res = await fetch(`${API_BASE}/api/page-content/admin/${pageKey}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to update page settings');
  }
  return res.json();
};
