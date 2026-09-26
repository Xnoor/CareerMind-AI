import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careermind_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global 401 unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid
      localStorage.removeItem('careermind_token');
      localStorage.removeItem('careermind_user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
};

export const resumeAPI = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getResumes: () => api.get('/resumes'),
  getResumeById: (id) => api.get(`/resumes/${id}`),
  improveSection: (data) => api.post('/resumes/improve', data),
};

export const jobAPI = {
  analyzeJob: (data) => api.post('/jobs/analyze', data),
  getJobs: (search = '') => api.get(`/jobs${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getJobById: (id) => api.get(`/jobs/${id}`),
  compareJobs: (jobIds) => api.post('/jobs/compare', jobIds),
};

export const matchingAPI = {
  analyzeMatch: (data) => api.post('/matching/analyze', data),
};

export const skillsAPI = {
  getCareerDNA: () => api.get('/skills/dna'),
  getSkillGaps: () => api.get('/skills/gaps'),
};

export const roadmapAPI = {
  generateRoadmap: () => api.post('/roadmap/generate'),
  getRoadmap: () => api.get('/roadmap'),
  updateItemStatus: (itemId, status) => api.put(`/roadmap/item/${itemId}`, { status }),
};

export const interviewAPI = {
  startInterview: (data) => api.post('/interview/start', data),
  submitAnswer: (interviewId, data) => api.post(`/interview/${interviewId}/answer`, data),
  getResults: (interviewId) => api.get(`/interview/${interviewId}/results`),
  getCodingChallenges: () => api.get('/interview/coding/challenges'),
  submitCoding: (data) => api.post('/interview/coding/submit', data),
};

export const recommendationAPI = {
  getProjects: () => api.get('/recommendations/projects'),
  submitFeedback: (data) => api.post('/recommendations/feedback', data),
};

export const assistantAPI = {
  chat: (message) => api.post('/assistant/chat', { message }),
};

export const applicationAPI = {
  getApplications: () => api.get('/applications'),
  createApplication: (data) => api.post('/applications', data),
  updateApplication: (id, data) => api.put(`/applications/${id}`, data),
  deleteApplication: (id) => api.delete(`/applications/${id}`),
};

export const analyticsAPI = {
  getAnalytics: () => api.get('/analytics'),
};

export const healthAPI = {
  checkHealth: () => api.get('/health'),
};

export default api;
