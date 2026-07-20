import axios from 'axios';
import { API_BASE } from '../utils/apiConfig';

/**
 * Fetch orders with pagination and filters
 * Params: { page, limit, search, status, paymentStatus, dateFrom, dateTo }
 */
export const fetchOrders = async (params = {}) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.get(`${API_BASE}/api/orders`, { 
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Fetch a single order by ID
 */
export const getOrderById = async (id) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.get(`${API_BASE}/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (id, status) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.patch(`${API_BASE}/api/orders/${id}/status`, 
      { status }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id} status:`, error);
    throw error;
  }
};

/**
 * Fetch orders summary stats
 */
export const fetchOrdersStats = async () => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.get(`${API_BASE}/api/admin/stats/orders-summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders stats:', error);
    throw error;
  }
};
