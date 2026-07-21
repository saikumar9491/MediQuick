import { API_BASE } from '../utils/apiConfig';

export const getDoctors = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/doctors?${query}`);
  if (!res.ok) throw new Error('Failed to fetch doctor catalog');
  return res.json();
};

export const getDoctorDetails = async (id) => {
  const res = await fetch(`${API_BASE}/api/doctors/${id}`);
  if (!res.ok) throw new Error('Failed to fetch doctor details');
  return res.json();
};

export const createDoctorAppointment = async (token, appointmentData) => {
  const authToken = token || localStorage.getItem('userToken');
  const res = await fetch(`${API_BASE}/api/doctors/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify(appointmentData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Appointment booking failed');
  }
  return res.json();
};

export const getMyAppointments = async (token) => {
  const authToken = token || localStorage.getItem('userToken');
  if (!authToken) return [];

  const res = await fetch(`${API_BASE}/api/doctors/my-appointments`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to fetch your appointments');
  }
  return res.json();
};

export const cancelDoctorAppointment = async (token, id) => {
  const authToken = token || localStorage.getItem('userToken');
  const res = await fetch(`${API_BASE}/api/doctors/appointments/${id}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to cancel appointment');
  }
  return res.json();
};

// Admin Endpoints
export const getAdminAppointments = async (token) => {
  const authToken = token || localStorage.getItem('userToken');
  const res = await fetch(`${API_BASE}/api/doctors/admin/appointments`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch admin appointments');
  return res.json();
};

export const getAdminDoctors = async (token) => {
  const authToken = token || localStorage.getItem('userToken');
  const res = await fetch(`${API_BASE}/api/doctors/admin/list`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch doctors list');
  return res.json();
};

export const addDoctorAdmin = async (token, doctorData) => {
  const authToken = token || localStorage.getItem('userToken');
  const res = await fetch(`${API_BASE}/api/doctors/admin/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify(doctorData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create doctor profile');
  }
  return res.json();
};

export const deleteDoctorAdmin = async (token, id) => {
  const authToken = token || localStorage.getItem('userToken');
  const res = await fetch(`${API_BASE}/api/doctors/admin/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete doctor profile');
  }
  return res.json();
};

export const updateAppointmentAdmin = async (token, id, formData) => {
  const authToken = token || localStorage.getItem('userToken');
  const res = await fetch(`${API_BASE}/api/doctors/admin/appointments/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${authToken}`
    },
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update appointment');
  }
  return res.json();
};
