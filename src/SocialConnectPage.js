import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SocialConnectPage.css';

const SocialConnectPage = () => {
  const { platform } = useParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleConnect = (e) => {
    e.preventDefault();
    // In a real app, you'd send credentials to your backend for the OAuth flow.
    // Here, we simulate success and pass the username back to the dashboard.
    if (window.opener && !window.opener.closed) {
      window.opener.handleSocialConnectSuccess(platform, username);
    }
    window.close();
  };

  useEffect(() => {
    document.title = `Connect to ${platform}`;
  }, [platform]);

  return (
    <div className="connect-page">
      <div className="connect-card">
        <div className="connect-header">
          <div className="connect-logo">
            {/* In a real app, you'd show the platform's logo */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>
            <span>Faceless AI</span>
          </div>
          <h2>Authorize Faceless AI</h2>
          <p>
            Sign in to your {platform} account to allow Faceless AI to publish videos on your behalf.
          </p>
        </div>
        <form onSubmit={handleConnect} className="connect-form">
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="connect-authorize-button">
            Authorize & Connect
          </button>
        </form>
      </div>
    </div>
  );
};

export default SocialConnectPage;