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
      url.includes('/platform/school-auth/')
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
  forgotPassword: (email) =>
    apiClient.post('/platform/school-auth/forgot-password', { email }).then((res) => res.data),
  resetPassword: (token, password) =>
    apiClient.post('/platform/school-auth/reset-password', { token, password }).then((res) => res.data),
  branding: (email) =>
    apiClient.get('/platform/school-auth/branding', { params: { email } }).then((res) => res.data),
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

function studentRequestConfig(payload) {
  if (payload instanceof FormData) {
    return {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
  }
  return undefined;
}

export const schoolPortalApi = {
  me: () => schoolAdminClient.get('/platform/school-portal/me').then((res) => res.data),
  plans: () => schoolAdminClient.get('/platform/school-portal/plans').then((res) => res.data),
  selectPlan: (planId) =>
    schoolAdminClient.post('/platform/school-portal/select-plan', { planId }).then((res) => res.data),
  config: () => schoolAdminClient.get('/platform/school-portal/config').then((res) => res.data),
  updateConfig: (payload) =>
    schoolAdminClient.patch('/platform/school-portal/config', payload).then((res) => res.data),
  settings: () => schoolAdminClient.get('/platform/school-portal/settings').then((res) => res.data),
  updateTheme: (payload) =>
    schoolAdminClient
      .patch(
        '/platform/school-portal/settings/theme',
        typeof payload === 'string' ? { theme: payload } : payload
      )
      .then((res) => res.data),
  updateBranding: (payload) =>
    schoolAdminClient.patch('/platform/school-portal/settings/branding', payload).then((res) => res.data),
  changePassword: (payload) =>
    schoolAdminClient.patch('/platform/school-portal/settings/password', payload).then((res) => res.data),
  updateEmailSettings: (payload) =>
    schoolAdminClient.patch('/platform/school-portal/settings/email', payload).then((res) => res.data),
  notifications: () => schoolAdminClient.get('/platform/school-portal/notifications').then((res) => res.data),
  sendNotification: (payload) =>
    schoolAdminClient.post('/platform/school-portal/notifications', payload).then((res) => res.data),
  students: (params) => schoolAdminClient.get('/platform/school-portal/students', { params }).then((res) => res.data),
  getStudent: (id) => schoolAdminClient.get(`/platform/school-portal/students/${id}`).then((res) => res.data),
  createStudent: (payload) =>
    schoolAdminClient.post('/platform/school-portal/students', payload, studentRequestConfig(payload)).then((res) => res.data),
  updateStudent: (id, payload) =>
    schoolAdminClient.patch(`/platform/school-portal/students/${id}`, payload, studentRequestConfig(payload)).then((res) => res.data),
  updateStudentStatus: (id, status) =>
    schoolAdminClient.patch(`/platform/school-portal/students/${id}/status`, { status }).then((res) => res.data),
  deleteStudent: (id) => schoolAdminClient.delete(`/platform/school-portal/students/${id}`).then((res) => res.data),
};

export const academicPortalApi = {
  years: (params) => schoolAdminClient.get('/platform/school-portal/academic/years', { params }).then((r) => r.data),
  getYear: (id) => schoolAdminClient.get(`/platform/school-portal/academic/years/${id}`).then((r) => r.data),
  createYear: (payload) => schoolAdminClient.post('/platform/school-portal/academic/years', payload).then((r) => r.data),
  updateYear: (id, payload) => schoolAdminClient.patch(`/platform/school-portal/academic/years/${id}`, payload).then((r) => r.data),
  activateYear: (id) => schoolAdminClient.post(`/platform/school-portal/academic/years/${id}/activate`).then((r) => r.data),
  setCurrentYear: (id) => schoolAdminClient.post(`/platform/school-portal/academic/years/${id}/set-current`).then((r) => r.data),
  archiveYear: (id) => schoolAdminClient.post(`/platform/school-portal/academic/years/${id}/archive`).then((r) => r.data),
  unarchiveYear: (id) => schoolAdminClient.post(`/platform/school-portal/academic/years/${id}/unarchive`).then((r) => r.data),
  completeYear: (id) => schoolAdminClient.post(`/platform/school-portal/academic/years/${id}/complete`).then((r) => r.data),
  deleteYear: (id) => schoolAdminClient.delete(`/platform/school-portal/academic/years/${id}`).then((r) => r.data),
  yearClasses: (yearId) => schoolAdminClient.get(`/platform/school-portal/academic/years/${yearId}/classes`).then((r) => r.data),
  addClassToYear: (yearId, classId) =>
    schoolAdminClient.post(`/platform/school-portal/academic/years/${yearId}/classes`, { classId }).then((r) => r.data),
  removeClassFromYear: (yearId, classId) =>
    schoolAdminClient.delete(`/platform/school-portal/academic/years/${yearId}/classes/${classId}`).then((r) => r.data),
  classes: (params) => schoolAdminClient.get('/platform/school-portal/academic/classes', { params }).then((r) => r.data),
  getClass: (id) => schoolAdminClient.get(`/platform/school-portal/academic/classes/${id}`).then((r) => r.data),
  createClass: (payload) => schoolAdminClient.post('/platform/school-portal/academic/classes', payload).then((r) => r.data),
  updateClass: (id, payload) => schoolAdminClient.patch(`/platform/school-portal/academic/classes/${id}`, payload).then((r) => r.data),
  deleteClass: (id) => schoolAdminClient.delete(`/platform/school-portal/academic/classes/${id}`).then((r) => r.data),
  seedClasses: () => schoolAdminClient.post('/platform/school-portal/academic/classes/seed').then((r) => r.data),
  sections: (params) => schoolAdminClient.get('/platform/school-portal/academic/sections', { params }).then((r) => r.data),
  getSection: (id) => schoolAdminClient.get(`/platform/school-portal/academic/sections/${id}`).then((r) => r.data),
  createSection: (payload) => schoolAdminClient.post('/platform/school-portal/academic/sections', payload).then((r) => r.data),
  updateSection: (id, payload) => schoolAdminClient.patch(`/platform/school-portal/academic/sections/${id}`, payload).then((r) => r.data),
  deleteSection: (id) => schoolAdminClient.delete(`/platform/school-portal/academic/sections/${id}`).then((r) => r.data),
  subjects: (params) => schoolAdminClient.get('/platform/school-portal/academic/subjects', { params }).then((r) => r.data),
  createSubject: (payload) => schoolAdminClient.post('/platform/school-portal/academic/subjects', payload).then((r) => r.data),
  updateSubject: (id, payload) => schoolAdminClient.patch(`/platform/school-portal/academic/subjects/${id}`, payload).then((r) => r.data),
  deleteSubject: (id) => schoolAdminClient.delete(`/platform/school-portal/academic/subjects/${id}`).then((r) => r.data),
  sectionSubjects: (sectionId) =>
    schoolAdminClient.get(`/platform/school-portal/academic/sections/${sectionId}/subjects`).then((r) => r.data),
  addSectionSubject: (sectionId, payload) =>
    schoolAdminClient.post(`/platform/school-portal/academic/sections/${sectionId}/subjects`, payload).then((r) => r.data),
  updateSectionSubject: (id, payload) =>
    schoolAdminClient.patch(`/platform/school-portal/academic/section-subjects/${id}`, payload).then((r) => r.data),
  deleteSectionSubject: (id) =>
    schoolAdminClient.delete(`/platform/school-portal/academic/section-subjects/${id}`).then((r) => r.data),
  teachers: (params) => schoolAdminClient.get('/platform/school-portal/academic/teachers', { params }).then((r) => r.data),
  getTeacher: (id) => schoolAdminClient.get(`/platform/school-portal/academic/teachers/${id}`).then((r) => r.data),
  createTeacher: (payload) =>
    schoolAdminClient.post('/platform/school-portal/academic/teachers', payload, studentRequestConfig(payload)).then((r) => r.data),
  updateTeacher: (id, payload) =>
    schoolAdminClient.patch(`/platform/school-portal/academic/teachers/${id}`, payload, studentRequestConfig(payload)).then((r) => r.data),
  updateTeacherStatus: (id, status) =>
    schoolAdminClient.patch(`/platform/school-portal/academic/teachers/${id}/status`, { status }).then((r) => r.data),
  deleteTeacher: (id) => schoolAdminClient.delete(`/platform/school-portal/academic/teachers/${id}`).then((r) => r.data),
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
    schoolAdminClient.get(`/platform/support/school/${schoolId}/tickets`, { params }).then((res) => res.data),
  get: (schoolId, id) =>
    schoolAdminClient.get(`/platform/support/school/${schoolId}/tickets/${id}`).then((res) => res.data),
  create: (schoolId, payload) =>
    schoolAdminClient.post(`/platform/support/school/${schoolId}/tickets`, payload).then((res) => res.data),
  reply: (schoolId, id, payload) =>
    schoolAdminClient
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
