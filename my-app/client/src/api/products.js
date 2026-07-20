import axios from 'axios';
import { API_BASE } from '../utils/apiConfig';

/**
 * Fetch products with pagination and filters
 * Params: { page, limit, search, category, stockStatus, rx }
 */
export const fetchProducts = async (params = {}) => {
  try {
    // Map 'rx' correctly (the frontend uses 'rx' and 'category' exactly as the backend expects)
    const response = await axios.get(`${API_BASE}/api/medicines`, { params });
    // Normalize response shape to match spec requirements: { data, total, totalPages, currentPage }
    return {
      data: response.data.medicines || response.data.data || [],
      total: response.data.total || 0,
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.page || 1
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch product summary stats
 */
export const fetchProductsStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/admin/stats/products-summary`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product stats:', error);
    throw error;
  }
};

/**
 * Fetch all unique categories
 */
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/categories`);
    return response.data; // Array of categories
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Delete a single product
 */
export const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.delete(`${API_BASE}/api/medicines/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

/**
 * Update a single product (e.g. toggle status)
 */
export const updateProduct = async (id, updateData) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.put(`${API_BASE}/api/medicines/${id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

/**
 * Bulk update multiple products
 */
export const bulkUpdateProducts = async (ids, updateData) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.patch(`${API_BASE}/api/medicines/bulk-update`, { ids, updateData }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error bulk updating products:', error);
    throw error;
  }
};

/**
 * Bulk delete multiple products
 */
export const bulkDeleteProducts = async (ids) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.delete(`${API_BASE}/api/medicines/bulk-delete`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { ids } // axios delete requires payload inside `data`
    });
    return response.data;
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    throw error;
  }
};

/**
 * Fetch a single product by ID
 */
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/api/medicines/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new product
 */
export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.post(`${API_BASE}/api/medicines/add`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Upload a product image
 */
export const uploadProductImage = async (formData) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.post(`${API_BASE}/api/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
