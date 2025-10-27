import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage.js';
import Login from './Login.js';
import MainPage from './Welcome.js';
import './App.css'; // Assuming App.css is in the src/ directory

import ProtectedRoute from './ProtectedRoute.js'; // Import the new gatekeeper component
// Import the new page components
import Dashboard from './Dashboard.js';
import About from './About.js';
import Documentation from './Documentation.js';
import Pricing from './Pricing.js';
import CreateVideo from './CreateVideo.js';
import Scripts from './Scripts.js';
import Avatars from './Avatars.js';
import VoiceStudio from './VoiceStudio.js';
import Projects from './Projects.js';
import Analytics from './Analytics.js';
// Import admin components
import AdminLayout from './admin/AdminLayout.js';
import UserManagement from './admin/UserManagement.js';
import CreditManagement from './admin/CreditManagement.js';
import AuditLog from './admin/AuditLog.js';
import ThemeEditor from './admin/ThemeEditor.js';
import Settings from './Settings.js';
import SocialConnectPage from './SocialConnectPage.js';
import { ThemeProvider } from './ThemeContext.js';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Page for social media connection popup */}
          <Route path="/connect/:platform" element={<SocialConnectPage />} />

          {/* --- Protected Routes --- */}
          {/* Any route inside here will first check for a valid session */}
          <Route element={<ProtectedRoute />}>
            <Route path="/welcome" element={<MainPage />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="create" element={<CreateVideo />} />
              <Route path="scripts" element={<Scripts />} />
              <Route path="avatars" element={<Avatars />} />
              <Route path="voice-studio" element={<VoiceStudio />} />
              <Route path="projects" element={<Projects />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="about" element={<About />} />
              <Route path="documentation" element={<Documentation />} />
              <Route path="pricing" element={<Pricing />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="users" replace />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="credits" element={<CreditManagement />} />
              <Route path="logs" element={<AuditLog />} />
            <Route path="theme" element={<ThemeEditor />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;