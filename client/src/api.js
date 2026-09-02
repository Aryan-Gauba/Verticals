import axios from 'axios';

// Vite sets import.meta.env.DEV to true during 'npm run dev' and false during production builds
const API = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:5000/api' : '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const fetchHabits = (client_date) => API.get(`/habits?client_date=${client_date}`);
export const createHabit = (title) => API.post('/habits', { title });
export const logHabit = (id, date) => API.post(`/habits/${id}/log`, { date });
export const deleteHabit = (id) => API.delete(`/habits/${id}`);