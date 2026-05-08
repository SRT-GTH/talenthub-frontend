import axios from 'axios';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { debug } from '../utils/debug.js';

const log = debug('api');

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
log('baseURL:', baseURL);

export const api = axios.create({
  baseURL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Request: attach auth token if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  log('→', config.method?.toUpperCase(), config.url);
  return config;
});

// Response: log + surface errors. Refresh-token logic lands here when auth ships.
api.interceptors.response.use(
  (response) => {
    log('←', response.status, response.config.url);
    return response;
  },
  (error) => {
    log.error('×', error.response?.status, error.config?.url, error.message);
    return Promise.reject(error);
  }
);

export default api;
