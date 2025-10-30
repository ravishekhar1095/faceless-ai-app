import React, { useState } from 'react';
import { useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import './Admin.css';

const ADMIN_LINKS = [
  {
    to: '/admin/users',
    label: 'Users',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: '/admin/credits',
    label: 'Credits',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1v22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H15a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    to: '/admin/logs',
    label: 'Audit logs',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v4H3z" />
        <path d="M3 11h18v10H3z" />
        <path d="M7 15h4" />
        <path d="M7 19h10" />
      </svg>
    ),
  },
  {
    to: '/admin/theme',
    label: 'Theme editor',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M12 4h9" />
        <path d="M4 9h16" />
        <path d="M4 15h16" />
        <path d="M4 4h.01" />
        <path d="M4 20h.01" />
      </svg>
    ),
  },
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      // ignore
    }
    navigate('/admin/login');
  };

  const activeLink = ADMIN_LINKS.find((link) => location.pathname.startsWith(link.to));

  return (
    <div className={`admin-shell ${collapsed ? 'is-collapsed' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 3H3" />
              <path d="M21 9H3" />
              <path d="M21 15H3" />
              <path d="M21 21H3" />
            </svg>
          </button>
          <NavLink to="/admin/users" className="brand-link">
            <span className="brand-icon">◎</span>
            <span className="brand-text">Faceless Admin</span>
          </NavLink>
        </div>
        <nav className="admin-nav">
          {ADMIN_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <p>Signed in as<br /><strong>admin@faceless.ai</strong></p>
          <button type="button" className="btn danger full" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-title">
            <span>Admin control center</span>
            <h2>{activeLink ? activeLink.label : 'Overview'}</h2>
          </div>
          <div className="topbar-actions">
            <button type="button" className="btn ghost" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
