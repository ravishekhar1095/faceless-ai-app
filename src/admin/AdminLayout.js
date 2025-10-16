import React from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import '../Welcome.css';
import './Admin.css';

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="main-page-container">
      <nav className="main-navbar">
        <NavLink to="/admin/users" className="navbar-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>
          <span>Admin Panel</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/admin/users">User Management</NavLink>
          <NavLink to="/admin/credits">Credit Management</NavLink>
          <NavLink to="/admin/logs">Audit Logs</NavLink>
        </div>
        <div className="navbar-user-info">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      <main className="main-content">
        <Outlet /> {/* Admin child routes will be rendered here */}
      </main>
    </div>
  );
}

export default AdminLayout;