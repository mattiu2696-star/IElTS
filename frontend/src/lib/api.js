import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(err)
      }
      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken })
        localStorage.setItem('access_token',  data.accessToken)
        localStorage.setItem('refresh_token', data.refreshToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(err)
      }
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  login:         (email, password)         => api.post('/auth/login',          { email, password }),
  signup:        (name, email, password)   => api.post('/auth/signup',         { name, email, password }),
  logout:        (refreshToken)            => api.post('/auth/logout',         { refreshToken }),
  forgotPassword:(email)                   => api.post('/auth/forgot-password',{ email }),
  resetPassword: (token, password)         => api.post('/auth/reset-password', { token, password }),
}

export const userApi = {
  getProfile:   ()       => api.get('/api/user/profile'),
  updateProfile:(data)   => api.put('/api/user/profile',  data),
  getProgress:  ()       => api.get('/api/user/progress'),
  getScores:    ()       => api.get('/api/user/scores'),
}

export const writingApi = {
  getLessons:       (params)           => api.get('/api/writing/lessons',           { params }),
  getLesson:        (id)               => api.get(`/api/writing/lessons/${id}`),
  submit:           (data)             => api.post('/api/writing/submit',            data),
  getSubmission:    (id)               => api.get(`/api/writing/submissions/${id}`),
  getSubmissions:   ()                 => api.get('/api/writing/submissions'),
}

export const vocabApi = {
  getWords:     (params) => api.get('/api/vocab/words',    { params }),
  getProgress:  ()       => api.get('/api/vocab/progress'),
  submitQuiz:   (data)   => api.post('/api/vocab/quiz/submit', data),
  getDue:       ()       => api.get('/api/vocab/due'),
}

export default api
