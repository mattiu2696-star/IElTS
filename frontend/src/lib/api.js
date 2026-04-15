import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
})

export const writingApi = {
  getLessons:    (params) => api.get('/api/writing/lessons',        { params }),
  getLesson:     (id)     => api.get(`/api/writing/lessons/${id}`),
  submit:        (data)   => api.post('/api/writing/submit',         data),
  getSubmission: (id)     => api.get(`/api/writing/submissions/${id}`),
  getSubmissions:()       => api.get('/api/writing/submissions'),
}

export const vocabApi = {
  getWords:   (params) => api.get('/api/vocab/words',       { params }),
  getDue:     ()       => api.get('/api/vocab/due'),
  submitQuiz: (data)   => api.post('/api/vocab/quiz/submit', data),
}

export default api
