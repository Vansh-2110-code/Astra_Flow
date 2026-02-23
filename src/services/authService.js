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

/**
 * Logout — clears all auth data and redirects to login.
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Get stored user data from localStorage.
 * Returns null if not logged in.
 */
export const getUserData = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};