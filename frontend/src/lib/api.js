import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 → refresh or logout
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const { refreshToken, logout, setAuth } = useAuthStore.getState()
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/auth/refresh`, { refresh_token: refreshToken })
          setAuth(res.data.data.access_token, res.data.data.refresh_token, res.data.data.user)
          error.config.headers.Authorization = `Bearer ${res.data.data.access_token}`
          return api(error.config)
        } catch { logout() }
      } else { logout() }
    }
    return Promise.reject(error)
  }
)

// ============ AUTH ============
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  profile: () => api.get('/auth/profile'),
  changePassword: (data) => api.put('/auth/change-password', data),
}

// ============ DASHBOARD ============
export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats'),
}

// ============ SANTRI ============
export const santriAPI = {
  getAll: (params) => api.get('/santri', { params }),
  getById: (id) => api.get(`/santri/${id}`),
  create: (data) => api.post('/santri', data),
  update: (id, data) => api.put(`/santri/${id}`, data),
  delete: (id) => api.delete(`/santri/${id}`),
}

// ============ ATTENDANCE ============
export const attendanceAPI = {
  getAll: (params) => api.get('/attendance', { params }),
  scanQR: (data) => api.post('/attendance/qr', data),
  manual: (data) => api.post('/attendance/manual', data),
}

// ============ PAYMENT ============
export const paymentAPI = {
  getAll: (params) => api.get('/payments', { params }),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  confirm: (id, data) => api.put(`/payments/${id}/confirm`, data),
  bySantri: (santriId) => api.get(`/payments/santri/${santriId}`),
}

// ============ ANNOUNCEMENT ============
export const announcementAPI = {
  getAll: (params) => api.get('/announcements', { params }),
  getById: (id) => api.get(`/announcements/${id}`),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
}

// ============ PPDB ============
export const ppdbAPI = {
  getAll: (params) => api.get('/ppdb', { params }),
  getById: (id) => api.get(`/ppdb/${id}`),
  review: (id, data) => api.put(`/ppdb/${id}/review`, data),
}

export default api
