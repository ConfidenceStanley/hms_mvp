import axios from 'axios';

// Determine the base backend URL
let backendUrl = import.meta.env.VITE_API_URL;

// Fallback: If Vercel env variable is missing, default to Render in production
if (!backendUrl || backendUrl.includes('vercel.app')) {
  backendUrl = import.meta.env.PROD
    ? 'https://hms-mvp.onrender.com'
    : 'http://localhost:5000';
}

// Clean up trailing slashes
backendUrl = backendUrl.replace(/\/+$/, '');

// Ensure /api is at the end of the baseURL
if (!backendUrl.endsWith('/api')) {
  backendUrl = `${backendUrl}/api`;
}

const API = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Prevent double '/api/api' and attach JWT token
API.interceptors.request.use(
  (config) => {
    // Strip leading '/api' if a component accidentally called API.get('/api/...')
    if (config.url && config.url.startsWith('/api/')) {
      config.url = config.url.replace(/^\/api/, '');
    }

    const token = localStorage.getItem('hms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hms_token');
      localStorage.removeItem('hms_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;