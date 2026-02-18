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

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
};
