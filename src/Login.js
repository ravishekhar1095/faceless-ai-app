import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './Login.css';
import Input from './Input.js';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const navigate = useNavigate();

  // Helper function to handle API requests
  const apiCall = async (endpoint, body) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      // Throw an error to be caught by the calling function's catch block
      throw new Error(data.message || `Request to ${endpoint} failed.`);
    }
    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (isRegisterMode) {
      // --- Registration Logic ---
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      try {
        const data = await apiCall('/api/register', { username, password });
        setSuccess(data.message);
        setIsRegisterMode(false); // Switch back to login mode
      } catch (err) {
        setError(err.message);
        console.error('Registration error:', err);
      }
    } else {
      // --- Login Logic ---
      try {
        const data = await apiCall('/api/login', { username, password });
        // On successful login, redirect to the welcome page
        navigate('/welcome');
      } catch (err) {
        setError(err.message);
        console.error('Login error:', err);
      }
    }
    setLoading(false);
  };

  const toggleMode = () => {
    // Reset form state when toggling
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setSuccess('');
  };

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
            <h2>{isRegisterMode ? 'Create an Account' : 'Welcome Back'}</h2>
            <p>{isRegisterMode ? 'Get started with your new account.' : 'Sign in to continue to your account.'}</p>
          </div>
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <Input
              id="username"
              label="Email"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="username"
            />
            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete={isRegisterMode ? "new-password" : "current-password"}
            />
            {isRegisterMode && (
              <Input
                id="confirm-password"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            )}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Processing...' : (isRegisterMode ? 'Create Account' : 'Sign In')}
            </button>
            <div className="form-divider">
              <span className="divider-line"></span>
              <span className="divider-text">OR</span>
            </div>
          </form>
          <p className="toggle-link">
            {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={toggleMode}>{isRegisterMode ? 'Sign In' : 'Sign Up'}</button>
          </p>
        </div>
        <div className="login-visual">
          <video className="login-video" src="/GIF_Generation_Request_Fulfilled.mp4#t=2" alt="AI video creation animation" autoPlay loop muted playsInline />
        </div>
      </div>
    </div>
  );
}

export default Login;