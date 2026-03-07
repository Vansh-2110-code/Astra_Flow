import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WorkspaceSelection from './pages/WorkspaceSelection';
import Content from './pages/Content';
import Approvals from './pages/Approvals';
import Media from './pages/Media';
import Analytics from './pages/Analytics';
import Team from './pages/Team';
import Settings from './pages/Settings';
import { getAccessToken } from './services/authService';

function App() {
  // Check if user is authenticated for root route
  const isAuthenticated = !!getAccessToken();

  return (
    <Router>
      <NotificationProvider>
        <Routes>
          {/* Public routes - redirect to /workspace if already logged in */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } />

          {/* Protected routes - require authentication */}
          <Route path="/workspace" element={
            <ProtectedRoute>
              <WorkspaceSelection />
            </ProtectedRoute>
          } />

          <Route path="/workspace/:workspaceId/content" element={
            <ProtectedRoute>
              <Content />
            </ProtectedRoute>
          } />
          <Route path="/workspace/:workspaceId/dashboard" element={<Navigate to="content" replace />} />
          <Route path="/workspace/:workspaceId/approvals" element={
            <ProtectedRoute>
              <Approvals />
            </ProtectedRoute>
          } />
          <Route path="/workspace/:workspaceId/media" element={
            <ProtectedRoute>
              <Media />
            </ProtectedRoute>
          } />
          <Route path="/workspace/:workspaceId/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/workspace/:workspaceId/team" element={
            <ProtectedRoute>
              <Team />
            </ProtectedRoute>
          } />
          <Route path="/workspace/:workspaceId/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />

          {/* Redirect /workspaces/ (plural) to /workspace/ (singular) - for backend OAuth callbacks */}
          <Route path="/workspaces/:workspaceId/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />

          {/* Root route - redirect based on auth status */}
          <Route path="/" element={
            <Navigate to={isAuthenticated ? "/workspace" : "/login"} replace />
          } />
        </Routes>
      </NotificationProvider>
    </Router>
  );
}

export default App;
