import axios from 'axios';
import { API_BASE } from '../../utils/apiConfig';

const getAuthHeader = () => {
  const token = localStorage.getItem('userToken') || localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

/**
 * Fetch list of banners for Admin Dashboard with filters
 * Params: { placement, status, targetDevice, search }
 */
export const fetchAdminBanners = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/api/admin/banners`, {
      ...getAuthHeader(),
      params
    });
    return Array.isArray(response.data) ? response.data : (response.data.banners || []);
  } catch (error) {
    console.error('Error fetching admin banners:', error);
    throw error;
  }
};

/**
 * Fetch banner summary statistics for Admin stats strip
 */
export const fetchBannersSummaryStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/admin/banners/stats/banners-summary`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching banner stats summary:', error);
    return {
      totalBanners: 0,
      activeBanners: 0,
      scheduledBanners: 0,
      expiredBanners: 0,
      draftBanners: 0
    };
  }
};

/**
 * Create a new banner
 */
export const createBanner = async (bannerData) => {
  try {
    const response = await axios.post(`${API_BASE}/api/admin/banners`, bannerData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

/**
 * Update an existing banner
 */
export const updateBanner = async (id, bannerData) => {
  try {
    const response = await axios.patch(`${API_BASE}/api/admin/banners/${id}`, bannerData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error(`Error updating banner ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a banner (supports force=true)
 */
export const deleteBanner = async (id, force = false) => {
  try {
    const response = await axios.delete(`${API_BASE}/api/admin/banners/${id}?force=${force ? 'true' : 'false'}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error(`Error deleting banner ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Reorder display positions of banners
 */
export const reorderBanners = async (items) => {
  try {
    const response = await axios.patch(`${API_BASE}/api/admin/banners/reorder`, { items }, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error reordering banners:', error);
    throw error;
  }
};

/**
 * Quick toggle active/draft status
 */
export const toggleBannerStatus = async (id, newStatus) => {
  return updateBanner(id, { status: newStatus, isActive: newStatus === 'active' });
};
