import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const featureHighlights = [
  {
    title: 'Create videos in minutes',
    description: 'Transform any script into a polished faceless video with AI powered narration.',
  },
  {
    title: 'Stay on brand',
    description: 'Centralize voices, avatars, and templates so every upload feels intentional.',
  },
  {
    title: 'Collaborate securely',
    description: 'Invite teammates, share credits, and manage usage with built-in roles.',
  },
];

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { heading, subHeading, submitLabel, switchPrompt, switchCta } = useMemo(() => {
    if (mode === 'register') {
      return {
        heading: 'Create your account',
        subHeading: 'Start generating videos with AI-crafted voices and visuals.',
        submitLabel: 'Create account',
        switchPrompt: 'Already have an account?',
        switchCta: 'Sign in',
      };
    }
    return {
      heading: 'Welcome back',
      subHeading: 'Sign in to manage projects, avatars, and analytics in one place.',
      submitLabel: 'Sign in',
      switchPrompt: "Don’t have an account yet?",
      switchCta: 'Create one',
    };
  }, [mode]);

  const handleModeChange = (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setError('');
    setSuccess('');
    setLoading(false);
    setPassword('');
    setConfirmPassword('');
  };

  const apiCall = async (endpoint, body) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Request to ${endpoint} failed.`);
    }
    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const payload = { username: email.trim(), password };

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      try {
        const data = await apiCall('/api/register', payload);
        setSuccess(data.message || 'Registration successful! Please sign in.');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        setError(err.message);
        console.error('Registration error:', err);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      await apiCall('/api/login', payload);
      if (rememberMe) {
        // Placeholder for future remember-me implementation (e.g., extend session)
        console.debug('Remember me selected');
      }
      setLoading(false);
      navigate('/welcome');
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-animation" aria-hidden="true">
          <div className="aurora aurora-one" />
          <div className="aurora aurora-two" />
          <div className="aurora aurora-three" />
          <div className="orbital orbital-one" />
          <div className="orbital orbital-two" />
          <div className="orbital orbital-three" />
          <div className="grid-overlay" />
        </div>
        <div className="auth-visual-overlay">
          <div className="auth-brand">
            <span className="auth-brand-icon">◎</span>
            <span className="auth-brand-text">Faceless AI Studio</span>
          </div>
          <h1 className="auth-visual-title">Create. Narrate. Publish.</h1>
          <p className="auth-visual-subtitle">
            Faceless AI gives you the tooling to ship engaging video content without ever stepping in front of a camera.
          </p>
          <ul className="auth-feature-list">
            {featureHighlights.map(({ title, description }) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="auth-card-wrapper">
        <div className="auth-card">
          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={mode === 'login' ? 'is-active' : ''}
              onClick={() => handleModeChange('login')}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={mode === 'register' ? 'is-active' : ''}
              onClick={() => handleModeChange('register')}
            >
              Create account
            </button>
          </div>

          <div className="auth-header">
            <h2>{heading}</h2>
            <p>{subHeading}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && <p className="banner banner-error">{error}</p>}
            {success && <p className="banner banner-success">{success}</p>}

            <label className="field">
              <span>Email</span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            {mode === 'register' && (
              <label className="field">
                <span>Confirm password</span>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  required
                />
              </label>
            )}

            {mode === 'login' && (
              <div className="form-meta">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me for 30 days
                </label>
                <button
                  className="ghost-link"
                  type="button"
                  onClick={() => alert('Password recovery coming soon!')}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Processing...' : submitLabel}
            </button>
          </form>

          <div className="auth-divider" role="presentation">
            <span>or continue with</span>
          </div>

          <div className="auth-social">
            <button type="button" onClick={() => alert('Google sign-in coming soon!')}>
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="" aria-hidden="true" />
              Google
            </button>
            <button type="button" onClick={() => alert('LinkedIn sign-in coming soon!')}>
              <img src="https://www.svgrepo.com/show/475661/linkedin-color.svg" alt="" aria-hidden="true" />
              LinkedIn
            </button>
          </div>

          <p className="auth-switch">
            {switchPrompt}{' '}
            <button type="button" onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}>
              {switchCta}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
