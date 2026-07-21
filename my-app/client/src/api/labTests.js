import { API_BASE } from '../utils/apiConfig';

export const getLabTests = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/lab-tests?${query}`);
  if (!res.ok) throw new Error('Failed to fetch lab tests');
  return res.json();
};

export const getLabTestDetails = async (id) => {
  const res = await fetch(`${API_BASE}/api/lab-tests/${id}`);
  if (!res.ok) throw new Error('Failed to fetch test details');
  return res.json();
};

export const createLabTestBooking = async (token, bookingData) => {
  const res = await fetch(`${API_BASE}/api/lab-tests/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(bookingData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Booking request failed');
  }
  return res.json();
};

export const getMyLabBookings = async (token) => {
  const authToken = token || localStorage.getItem('userToken');
  if (!authToken) return [];

  const res = await fetch(`${API_BASE}/api/lab-tests/my-bookings`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to fetch your bookings');
  }
  return res.json();
};

export const getAdminLabBookings = async (token) => {
  const res = await fetch(`${API_BASE}/api/lab-tests/admin/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch admin bookings');
  return res.json();
};

export const addLabTest = async (token, testData) => {
  const res = await fetch(`${API_BASE}/api/lab-tests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(testData)
  });
  if (!res.ok) throw new Error('Failed to create test package');
  return res.json();
};

export const updateLabTest = async (token, id, testData) => {
  const res = await fetch(`${API_BASE}/api/lab-tests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(testData)
  });
  if (!res.ok) throw new Error('Failed to update test package');
  return res.json();
};

export const deleteLabTest = async (token, id) => {
  const res = await fetch(`${API_BASE}/api/lab-tests/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Failed to delete test package');
  return res.json();
};

export const updateBookingStatus = async (token, id, statusData) => {
  const res = await fetch(`${API_BASE}/api/lab-tests/bookings/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(statusData)
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
};

export const uploadLabReport = async (token, id, file) => {
  const formData = new FormData();
  formData.append('report', file);

  const res = await fetch(`${API_BASE}/api/lab-tests/bookings/${id}/upload-report`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Report upload failed');
  }
  return res.json();
};

export const cancelLabTestBooking = async (token, id) => {
  const res = await fetch(`${API_BASE}/api/lab-tests/bookings/${id}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Cancellation request failed');
  }
  return res.json();
};
