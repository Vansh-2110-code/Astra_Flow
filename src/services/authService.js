// src/services/authService.js — Auth API functions.
// Uses centralized Axios client from api.js for consistent headers, error handling, and base URL.

import api from './api';

/**
 * Register user against backend.
 * Endpoint: POST /api/register/
 * Payload: { email, password, confirm_password, first_name, last_name, timezone }
 */
export const registerUser = (payload) =>
  api.post('/register/', payload).then((res) => res.data);

/**
 * Login user against backend.
 * Endpoint: POST /api/v1/token/
 * Payload: { username (email), password }
 */
export const login = (email, password) =>
  api
    .post('/v1/token/', { username: email, password })
    .then((res) => res.data);

// ── Storage Utilities ──

/**
 * Get appropriate storage based on rememberMe preference.
 * @param {boolean} rememberMe - Whether to use localStorage or sessionStorage
 * @returns {Storage} - localStorage or sessionStorage
 */
const getStorage = (rememberMe) => rememberMe ? localStorage : sessionStorage;

/**
 * Store authentication data in appropriate storage.
 * @param {Object} data - Auth response with access, refresh, user
 * @param {boolean} rememberMe - Whether to persist across browser sessions
 */
export const storeAuthData = (data, rememberMe = true) => {
  const storage = getStorage(rememberMe);
  storage.setItem('access_token', data.access);
  storage.setItem('refresh_token', data.refresh);
  storage.setItem('user', JSON.stringify(data.user));
  
  // Always store rememberMe preference in localStorage
  localStorage.setItem('rememberMe', rememberMe.toString());
};

/**
 * Clear authentication data from both storages.
 */
export const clearAuthData = () => {
  // Clear from both storages to ensure clean logout
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
  sessionStorage.removeItem('user');
};

/**
 * Get access token from either storage.
 * @returns {string|null} - Access token or null
 */
export const getAccessToken = () => {
  return localStorage.getItem('access_token') || 
         sessionStorage.getItem('access_token');
};

/**
 * Get refresh token from either storage.
 * @returns {string|null} - Refresh token or null
 */
export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token') || 
         sessionStorage.getItem('refresh_token');
};

/**
 * Logout — clears all auth data and redirects to login.
 */
export const logout = () => {
  clearAuthData();
  localStorage.removeItem('rememberMe');
  window.location.href = '/login';
};

/**
 * Get stored user data from either storage.
 * Returns null if not logged in.
 */
export const getUserData = () => {
  try {
    const raw = localStorage.getItem('user') || 
                sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
