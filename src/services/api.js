// src/services/api.js — general API client.
// Auth (login/register) is handled by authService.js for backend integration.
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Mock Django URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = async (email, password) => {
    // In a real scenario, this would hit the backend.
    // For now, we'll mock the response to test the UI flow.

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock Logic
    if (email === 'demo@lintcollab.io' && password === 'password') {
        return {
            data: {
                token: 'mock-jwt-token-12345',
                user: {
                    email: email,
                    name: 'Demo User'
                }
            }
        };
    } else {
        throw {
            response: {
                data: {
                    detail: 'Invalid credentials. Please try again.'
                }
            }
        };
    }

    // Real implementation:
    // return api.post('/login/', { email, password });
};

export default api;
