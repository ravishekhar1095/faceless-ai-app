import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Login.css';

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      try {
        const response = await fetch('/api/check-session');
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (!isMounted) return;
        if (data?.user?.user_type === 'admin') {
          navigate('/admin/users', { replace: true });
        } else if (data?.user) {
          setInfo('You are logged in as a standard user. Please sign out to access the admin console.');
        }
      } catch (err) {
        // ignore
      }
    };
    verifySession();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      // ignore
    }
    setError('');
    setInfo('Session cleared. You can now sign in as an admin.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Admin login failed.');
      }
      const redirectTo = location.state?.from?.pathname || '/admin/users';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth">
      <div className="auth-card-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Admin Console</h2>
            <p>Sign in with your admin credentials to manage the platform.</p>
          </div>

          {info && (
            <div className="banner banner-info">
              {info}
              <button type="button" className="banner-link" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && <p className="banner banner-error">{error}</p>}

            <label className="field">
              <span>Username or email</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </label>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">
            Need the user app instead?
            {' '}
            <NavLink to="/login">Return to user login</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
