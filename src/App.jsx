
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WorkspaceSelection from './pages/WorkspaceSelection'; // The new landing
import Content from './pages/Content';
// Reusing other pages, mapping them to the new route structure
import Calendar from './pages/Calendar';
import GridView from './pages/Grid';
import Approvals from './pages/Approvals';
import Media from './pages/Media';
import Analytics from './pages/Analytics';
import Team from './pages/Team';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Workspace Selection (New Dashboard) */}
        <Route path="/workspace" element={<WorkspaceSelection />} />

        {/* Dynamic Workspace Routes */}
        <Route path="/workspace/:workspaceId/content" element={<Content />} />

        {/* Mapping Dashboard link to Content for now, or could be Analytics */}
        <Route path="/workspace/:workspaceId/dashboard" element={<Navigate to="content" replace />} />

        <Route path="/workspace/:workspaceId/calendar" element={<Calendar />} />
        <Route path="/workspace/:workspaceId/grid" element={<GridView />} />
        <Route path="/workspace/:workspaceId/approvals" element={<Approvals />} />
        <Route path="/workspace/:workspaceId/media" element={<Media />} />
        <Route path="/workspace/:workspaceId/analytics" element={<Analytics />} />
        <Route path="/workspace/:workspaceId/team" element={<Team />} />
        <Route path="/workspace/:workspaceId/settings" element={<Settings />} />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
