import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="login-container">
      {/* Left Panel for Creative Content */}
      <div className="left-panel">
        <div className="creative-content">
          <h1>Faceless AI Studio</h1>
          <p>Create stunning videos from text, without ever showing your face. Your privacy, our priority.</p>
          {/* We are now using a video from the public folder */}
          <video
            className="creative-video"
            src="/login-animation.mp4"
            alt="AI video creation animation"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>

      {/* Right Panel for the Login Form */}
      <div className="right-panel">
        <div className="login-card">
          <div className="login-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            </svg>
          </div>
          <div className="login-header">
            <h2>{isRegisterMode ? 'Create Account' : 'Welcome Back'}</h2>
            <p>{isRegisterMode ? 'Get started with your new account' : 'Log in to continue'}</p>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <Input
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., test"
              required
              autoComplete="username"
            />
            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g., 12345"
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
              {loading ? 'Processing...' : (isRegisterMode ? 'Sign Up' : 'Log In')}
            </button>
          </form>
          <div className="toggle-mode">
            <p>
              {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
              <button onClick={toggleMode}>{isRegisterMode ? 'Log In' : 'Sign Up'}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;