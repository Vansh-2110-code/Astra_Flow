// src/components/PublicRoute.jsx
// Wrapper for login/signup - redirects to workspace if already authenticated

import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../services/authService';

/**
 * PublicRoute - Wrapper for login/signup pages
 * Redirects to /workspace if already authenticated
 */
const PublicRoute = ({ children }) => {
    const token = getAccessToken();
    
    if (token) {
        // Already logged in - redirect to workspace
        return <Navigate to="/workspace" replace />;
    }
    
    // Not logged in - render login/signup page
    return children;
};

export default PublicRoute;
