// src/components/ProtectedRoute.jsx
// Route protection wrapper - redirects to login if not authenticated

import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../services/authService';

/**
 * ProtectedRoute - Wrapper for routes that require authentication
 * Redirects to /login if no valid token exists
 */
const ProtectedRoute = ({ children }) => {
    const token = getAccessToken();
    
    if (!token) {
        // No token found - redirect to login
        return <Navigate to="/login" replace />;
    }
    
    // Token exists - render the protected component
    return children;
};

export default ProtectedRoute;
