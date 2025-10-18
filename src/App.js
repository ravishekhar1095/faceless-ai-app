import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login.js';
import LandingPage from './LandingPage.js';
import MainPage from './Welcome.js';
import './App.css'; // Assuming App.css is in the src/ directory

import ProtectedRoute from './ProtectedRoute.js'; // Import the new gatekeeper component
// Import the new page components
import Dashboard from './Dashboard.js';
import About from './About.js';
import Documentation from './Documentation.js';
import Pricing from './Pricing.js';
// Import admin components
import AdminLayout from './admin/AdminLayout.js';
import UserManagement from './admin/UserManagement.js';
import CreditManagement from './admin/CreditManagement.js';
import AuditLog from './admin/AuditLog.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* --- Protected Routes --- */}
        {/* Any route inside here will first check for a valid session */}
        <Route element={<ProtectedRoute />}>
          <Route path="/welcome" element={<MainPage />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="about" element={<About />} />
            <Route path="documentation" element={<Documentation />} />
            <Route path="pricing" element={<Pricing />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="credits" element={<CreditManagement />} />
            <Route path="logs" element={<AuditLog />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;