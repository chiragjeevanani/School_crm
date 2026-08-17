import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('super_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('super_admin_refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const { data } = await refreshClient.post('/platform/auth/refresh', { refreshToken });
  if (!data?.token) {
    throw new Error('Unable to refresh session');
  }

  localStorage.setItem('super_admin_token', data.token);
  if (data.refreshToken) {
    localStorage.setItem('super_admin_refresh_token', data.refreshToken);
  }
  if (data.user) {
    const current = JSON.parse(localStorage.getItem('super_admin_user') || '{}');
    localStorage.setItem('super_admin_user', JSON.stringify({ ...current, ...data.user }));
  }
  return data.token;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;
    const url = original.url || '';

    if (
      status !== 401 ||
      original._retry ||
      url.includes('/platform/auth/login') ||
      url.includes('/platform/auth/refresh') ||
      url.includes('/platform/school-auth/login')
    ) {
      throw error;
    }

    original._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const token = await refreshPromise;
      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${token}`;
      return apiClient(original);
    } catch {
      localStorage.removeItem('super_admin_token');
      localStorage.removeItem('super_admin_refresh_token');
      throw error;
    }
  }
);

export const platformAuthApi = {
  login: (email, password) =>
    apiClient.post('/platform/auth/login', { email, password }).then((res) => res.data),
  me: () => apiClient.get('/platform/auth/me').then((res) => res.data),
  updateProfile: (payload) => apiClient.patch('/platform/auth/profile', payload).then((res) => res.data),
  changePassword: (payload) => apiClient.patch('/platform/auth/password', payload).then((res) => res.data),
};

export const schoolAdminAuthApi = {
  login: (email, password) =>
    apiClient.post('/platform/school-auth/login', { email, password }).then((res) => res.data),
};

const schoolAdminClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

schoolAdminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('school_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const schoolPortalApi = {
  me: () => schoolAdminClient.get('/platform/school-portal/me').then((res) => res.data),
  plans: () => schoolAdminClient.get('/platform/school-portal/plans').then((res) => res.data),
  selectPlan: (planId) =>
    schoolAdminClient.post('/platform/school-portal/select-plan', { planId }).then((res) => res.data),
};

export const platformLegalApi = {
  get: () => apiClient.get('/platform/privacy-policy').then((res) => res.data),
  update: (payload) => apiClient.put('/platform/privacy-policy', payload).then((res) => res.data),
};

export const platformSchoolApi = {
  list: (params) => apiClient.get('/platform/schools', { params }).then((res) => res.data),
  create: (payload) => apiClient.post('/platform/schools', payload).then((res) => res.data),
  update: (id, payload) => apiClient.put(`/platform/schools/${id}`, payload).then((res) => res.data),
  updateStatus: (id, status) =>
    apiClient.patch(`/platform/schools/${id}/status`, { status }).then((res) => res.data),
  resetLogin: (id) => apiClient.post(`/platform/schools/${id}/reset-login`).then((res) => res.data),
  remove: (id) => apiClient.delete(`/platform/schools/${id}`).then((res) => res.data),
};

export const platformSubscriptionApi = {
  list: () => apiClient.get('/platform/subscriptions').then((res) => res.data),
  create: (payload) => apiClient.post('/platform/subscriptions', payload).then((res) => res.data),
  update: (id, payload) => apiClient.put(`/platform/subscriptions/${id}`, payload).then((res) => res.data),
  remove: (id) => apiClient.delete(`/platform/subscriptions/${id}`).then((res) => res.data),
};

export const platformBillingApi = {
  list: (params) => apiClient.get('/platform/billings', { params }).then((res) => res.data),
  create: (payload) => apiClient.post('/platform/billings', payload).then((res) => res.data),
  get: (id) => apiClient.get(`/platform/billings/${id}`).then((res) => res.data),
  gateway: () => apiClient.get('/platform/billings/gateway').then((res) => res.data),
  createRazorpayOrder: (id) =>
    apiClient.post(`/platform/billings/${id}/razorpay-order`).then((res) => res.data),
  verifyRazorpay: (id, payload) =>
    apiClient.post(`/platform/billings/${id}/razorpay-verify`, payload).then((res) => res.data),
  markPaid: (id, payload) =>
    apiClient.patch(`/platform/billings/${id}/pay`, payload).then((res) => res.data),
  refund: (id) => apiClient.patch(`/platform/billings/${id}/refund`).then((res) => res.data),
  cancel: (id) => apiClient.patch(`/platform/billings/${id}/cancel`).then((res) => res.data),
};

export const platformNotificationApi = {
  list: () => apiClient.get('/platform/notifications').then((res) => res.data),
  send: (payload) => apiClient.post('/platform/notifications', payload).then((res) => res.data),
  inbox: (params) => apiClient.get('/platform/notifications/inbox', { params }).then((res) => res.data),
  registerDevice: (payload) => apiClient.post('/platform/device-tokens', payload).then((res) => res.data),
};

export const platformSupportApi = {
  list: (params) => apiClient.get('/platform/support/tickets', { params }).then((res) => res.data),
  get: (id) => apiClient.get(`/platform/support/tickets/${id}`).then((res) => res.data),
  create: (payload) => apiClient.post('/platform/support/tickets', payload).then((res) => res.data),
  reply: (id, payload) =>
    apiClient.post(`/platform/support/tickets/${id}/replies`, payload).then((res) => res.data),
  updateStatus: (id, status) =>
    apiClient.patch(`/platform/support/tickets/${id}/status`, { status }).then((res) => res.data),
};

export const schoolSupportApi = {
  list: (schoolId, params) =>
    apiClient.get(`/platform/support/school/${schoolId}/tickets`, { params }).then((res) => res.data),
  get: (schoolId, id) =>
    apiClient.get(`/platform/support/school/${schoolId}/tickets/${id}`).then((res) => res.data),
  create: (schoolId, payload) =>
    apiClient.post(`/platform/support/school/${schoolId}/tickets`, payload).then((res) => res.data),
  reply: (schoolId, id, payload) =>
    apiClient
      .post(`/platform/support/school/${schoolId}/tickets/${id}/replies`, payload)
      .then((res) => res.data),
};

export const platformReportApi = {
  summary: (params) => apiClient.get('/platform/reports', { params }).then((res) => res.data),
  schools: (params) => apiClient.get('/platform/reports/schools', { params }).then((res) => res.data),
  subscriptions: (params) => apiClient.get('/platform/reports/subscriptions', { params }).then((res) => res.data),
  invoices: (params) => apiClient.get('/platform/reports/invoices', { params }).then((res) => res.data),
  notifications: (params) => apiClient.get('/platform/reports/notifications', { params }).then((res) => res.data),
};
