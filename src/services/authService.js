// Restructured signup to 2-step flow; backend register integration isolated here.
// Updated backend payload structure: email, password, confirm_password, first_name, last_name, time_zone (no username).

/**
 * Register user against backend.
 * Expects VITE_API_BASE_URL to be set (no hardcoding in code).
 * Payload: { email, password, confirm_password, first_name, last_name, time_zone }
 */
export const registerUser = async (payload) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('API base URL not configured. Set VITE_API_BASE_URL in .env');
  }

  // Trying /api/register (no trailing slash) as next attempt
  const url = `${baseUrl.trim().replace(/\/$/, '')}/api/register/`;
  console.log('Registering user at:', url);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.detail || 'Registration failed');
  }

  return data;
};

/**
 * Login user against backend.
 * Endpoint: POST /api/v1/token
 * Payload: { username, password }
 */
export const login = async (email, password) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('API base URL not configured. Set VITE_API_BASE_URL in .env');
  }

  // Django often requires trailing slash. Added / at the end.
  const url = `${baseUrl.trim().replace(/\/$/, '')}/api/v1/token/`;
  console.log('Logging in at:', url);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      username: email, // Backend expects username field for email
      password: password
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Handle error details usually provided by Django DRF or similar
    const errorMessage = data.detail || data.message || 'Login failed';
    throw new Error(errorMessage);
  }

  return data;
};