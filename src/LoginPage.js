import React from 'react';
import { NavLink } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-container">
          <div className="login-header">
            <NavLink to="/" className="login-logo">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              </svg>
              <span>Faceless AI</span>
            </NavLink>
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your account.</p>
          </div>
          <form className="login-form">
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="login-button">Sign In</button>
          </form>
          <p className="signup-link">
            Don't have an account? <NavLink to="/signup">Sign up</NavLink>
          </p>
        </div>
        <div className="login-visual">
          <video className="login-video" src="/GIF_Generation_Request_Fulfilled.mp4" alt="AI video creation animation" autoPlay loop muted playsInline />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;