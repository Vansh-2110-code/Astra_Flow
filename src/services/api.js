// src/services/api.js — general API client.
// Auth (login/register) is handled by authService.js for backend integration.
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Mock Django URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
