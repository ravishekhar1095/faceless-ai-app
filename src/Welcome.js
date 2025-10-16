import React from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import './Welcome.css';

function MainPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you would also clear any stored tokens or session data
    console.log('Logging out...');
    navigate('/login');
  };

  // Placeholder for user's credits. This would typically come from an API call.
  const creditsLeft = 150;

  return (
    <div className="main-page-container">
      <nav className="main-navbar">
        <NavLink to="/welcome/dashboard" className="navbar-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          </svg>
          <span>Faceless AI</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/welcome/about">About</NavLink>
          <NavLink to="/welcome/documentation">Documentation</NavLink>
          <NavLink to="/welcome/pricing">Pricing</NavLink>
        </div>
        <div className="navbar-user-info">
          <span>Credits: {creditsLeft}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
    </div>
  );
}

export default MainPage;