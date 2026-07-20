import { API_BASE } from '../utils/apiConfig';

/**
 * Validate coupon code server-side before applying
 */
export const validateCoupon = async (token, { code, subtotal, cartCategories = [] }) => {
  const res = await fetch(`${API_BASE}/api/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ code, subtotal, cartCategories }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Coupon validation failed');
  return data;
};

/**
 * Pre-flight checkout validation (stock, zone, Rx, coupon)
 */
export const validateCheckout = async (token, payload) => {
  const res = await fetch(`${API_BASE}/api/orders/validate-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Checkout validation failed');
  return data;
};

/**
 * Upload prescription file — returns prescriptionUrl (base64 dataUrl)
 */
export const uploadPrescription = async (token, file) => {
  const formData = new FormData();
  formData.append('prescription', file);
  const res = await fetch(`${API_BASE}/api/prescriptions/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Prescription upload failed');
  return data;
};

/**
 * Create a COD order directly
 */
export const createOrder = async (token, orderPayload) => {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(orderPayload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Order creation failed');
  return data;
};

/**
 * Create a Razorpay order (returns razorpayOrderId + keyId)
 */
export const createRazorpayOrder = async (token, amount) => {
  const res = await fetch(`${API_BASE}/api/payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ amount }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Payment order creation failed');
  return data;
};

/**
 * Verify Razorpay signature server-side
 */
export const verifyRazorpayPayment = async (token, { razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const res = await fetch(`${API_BASE}/api/payment/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Payment verification failed');
  return data;
};

/**
 * Check delivery estimate for a pincode
 */
export const getDeliveryEstimate = async (pincode) => {
  const res = await fetch(`${API_BASE}/api/delivery/estimate?pincode=${pincode}`);
  return res.json();
};

/**
 * Save address to user profile
 */
export const saveAddress = async (token, address) => {
  const res = await fetch(`${API_BASE}/api/users/addresses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(address),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to save address');
  return data;
};
