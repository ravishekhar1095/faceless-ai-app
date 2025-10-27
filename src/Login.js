import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
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
    <div className="login-page-container">
      {/* Left side with the video */}
      <div className="login-video-side">
        <video src="/HD_Video_Generation_Complete.mp4" autoPlay loop muted playsInline />
      </div>

      {/* Right side with the form */}
      <div className="login-form-side">
        <div className="login-card">
          <div className="login-header">
            <h2>{isRegisterMode ? 'Create an Account' : 'Welcome Back'}</h2>
            <p>{isRegisterMode ? 'Get started with your new account.' : 'Sign in to continue.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="input-group">
              <label htmlFor="username">Email</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="username"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete={isRegisterMode ? "new-password" : "current-password"}
              />
            </div>

            {isRegisterMode && (
              <div className="input-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Processing...' : (isRegisterMode ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6B7280' }}>
            {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={toggleMode} style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: '600', cursor: 'pointer', padding: 0 }}>
              {isRegisterMode ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;