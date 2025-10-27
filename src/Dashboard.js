import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [script, setScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [voiceStyle, setVoiceStyle] = useState('professional');
  const [aspectRatio, setAspectRatio] = useState('16:9'); // Define aspectRatio state
  const [isDownloadOpen, setIsDownloadOpen] = useState(false); // Define isDownloadOpen state
  const [showDisconnectModal, setShowDisconnectModal] = useState(false); // Define showDisconnectModal state
  const [platformToDisconnect, setPlatformToDisconnect] = useState(null);
  const navigate = useNavigate();

  // Mock user data (should come from context/session in Welcome.js)
  const user = { name: 'Ravi Shekhar', credits: 15, plan: 'pro' }; // Placeholder

  const [connectedAccounts, setConnectedAccounts] = useState({}); // Define connectedAccounts state
  const [videoHistory, setVideoHistory] = useState([
    { id: 1, title: 'The Rise of AI in 2024', url: '/GIF_Generation_Request_Fulfilled.mp4' },
    { id: 2, title: 'Marketing Tips for Startups', url: '/GIF_Generation_Request_Fulfilled_1.mp4' },
    { id: 3, title: 'A Journey Through the Alps', url: '/GIF_Generation_Request_Fulfilled.mp4' },
    { id: 4, title: 'The Future of Renewable Energy', url: '/GIF_Generation_Request_Fulfilled_1.mp4' },
    { id: 5, title: 'How to Bake the Perfect Sourdough', url: '/GIF_Generation_Request_Fulfilled.mp4' },
  ]);

  // State for AI Avatar Insights (mock data)
  const [avatarInsights, setAvatarInsights] = useState([

    { name: 'AI Persona Alpha', usage: '25%', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { name: 'AI Persona Beta', usage: '18%', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { name: 'AI Persona Gamma', usage: '12%', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
  ]);

  const socialPlatforms = [
    { name: 'YouTube', icon: <svg viewBox="0 0 28 20" fill="currentColor"><path d="M27.55 3.1s-.28-1.95-.55-2.7C26.25.4 25.4.4 25 .4 21.5 0 14 0 14 0S6.5 0 3 .4C2.6.4 1.75.4 1 .4.75 1.15.45 3.1.45 3.1S0 5.4 0 7.7v4.6c0 2.3.45 4.6.45 4.6s.28 1.95.55 2.7c.75.75 1.9.7 2.45.75 3.5.4 10.55.4 10.55.4s7.5 0 11-.4c.4-.05 1.25-.05 2-.75.28-.75.55-2.7.55-2.7S28 14.6 28 12.3v-4.6c0-2.3-.45-4.6-.45-4.6zM11.2 14.45V5.55l7.6 4.45-7.6 4.45z"></path></svg> },
    { name: 'TikTok', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.59 3.01 1.62 4.27 1.2 1.48 2.91 2.33 4.66 2.41.11-1.5.1-2.99-.01-4.48h2.81v16.21h-2.89v-4.75c-1.81.1-3.6.6-5.22 1.82-1.92 1.46-3.36 3.46-4.01 5.66-1.43.1-2.86-.3-4.15-1.1-1.31-.8-2.3-2-2.8-3.44-.55-1.5-.6-3.08-.36-4.61.24-1.52.78-2.95 1.58-4.25.81-1.3 1.89-2.4 3.16-3.25.9-.6 1.9-1 2.96-1.2.01 2.8.01 5.6-.01 8.4.01 1.43-.93 2.8-2.31 3.25-.83.28-1.7.3-2.5.12-.8-.18-1.5-.6-2.04-1.2-.53-.6-.8-1.4-.8-2.2v-2.8c.88.08 1.76.08 2.64.08 1.57 0 3.14 0 4.7-.02z"></path></svg> },
    { name: 'Instagram', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.117 0-3.482.01-4.71.068-2.828.13-4.017 1.31-4.147 4.147-.058 1.227-.068 1.58-.068 4.71s.01 3.482.068 4.71c.13 2.828 1.319 4.017 4.147 4.147 1.228.058 1.593.068 4.71.068s3.482-.01 4.71-.068c2.828-.13 4.017-1.319 4.147-4.147.058-1.228.068-1.593.068-4.71s-.01-3.482-.068-4.71c-.13-2.828-1.319-4.017-4.147-4.147-1.227-.058-1.58-.068-4.71-.068zm0 3.882c-1.998 0-3.618 1.62-3.618 3.618s1.62 3.618 3.618 3.618 3.618-1.62 3.618-3.618-1.62-3.618-3.618-3.618zm0 5.831c-1.221 0-2.213-.992-2.213-2.213s.992-2.213 2.213-2.213 2.213.992 2.213 2.213-.992 2.213-2.213 2.213zm4.965-6.413c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1z"></path></svg> },
    { name: 'Facebook', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.494v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path></svg> },
    { name: 'LinkedIn', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path></svg> },
  ];

  const downloadOptions = [
    { resolution: '1080p', label: 'Full HD (1080p)', requiredPlan: 'premium' },
    { resolution: '720p', label: 'HD (720p)', requiredPlan: 'pro' },
    { resolution: '480p', label: 'SD (480p)', requiredPlan: 'free' },
  ];

  const planLevels = {
    free: 1,
    pro: 2,
    premium: 3,
  };

  const pollingIntervalRef = useRef(null);

  // Fetch connected accounts on component mount
  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      // In a real app, you'd fetch this from your backend.
      // We'll simulate it with a timeout.
      setTimeout(() => {
        const mockData = {
          YouTube: { username: 'RaviPlays' },
          Instagram: { username: '@ravi_creates' },
        };
        setConnectedAccounts(mockData);
      }, 500);
    };

    fetchConnectedAccounts();

    // Assign the success handler to the window object
    window.handleSocialConnectSuccess = (platformName, username) => {
      setConnectedAccounts(prev => ({ ...prev, [platformName]: { username } }));
    };
  }, []);

  useEffect(() => {
    if (jobId && !pollingIntervalRef.current) {
      pollingIntervalRef.current = setInterval(checkJobStatus, 3000);
    }
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [jobId]);

  const checkJobStatus = async () => {
    try {
      const response = await fetch(`/api/video-status/${jobId}`);
      const data = await response.json();

      if (data.status === 'complete') {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        setVideoUrl(data.videoUrl);
        setIsLoading(false);
        setJobId(null);
        const newVideo = { id: Date.now(), title: script.substring(0, 30) + '...', url: data.videoUrl };
        setVideoHistory([newVideo, ...videoHistory].slice(0, 5));
      } else if (data.status === 'failed') {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        setIsLoading(false);
        setJobId(null);
        console.error('Video generation failed.');
      }
    } catch (error) {
      console.error('Error polling job status:', error);
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      setIsLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!script.trim()) return;
    setIsLoading(true);
    setVideoUrl(''); // Clear previous video
    setJobId(null);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, voiceStyle, aspectRatio }),
      });
      const data = await response.json();
      if (data.jobId) {
        setJobId(data.jobId);
      } else {
        throw new Error('Failed to start video generation job.');
      }
    } catch (error) {
      console.error('Error generating video:', error);
      setIsLoading(false);
    }
  };

  const handleConnectClick = (platformName) => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const url = `/connect/${platformName}`;
    window.open(url, 'social_connect', `width=${width},height=${height},left=${left},top=${top}`);
  };

  const handleDisconnectClick = (platformName) => {
    setPlatformToDisconnect(platformName);
    setShowDisconnectModal(true);
  };

  const confirmDisconnect = () => {
    if (platformToDisconnect) {
      // Simulate API call to disconnect
      const newAccounts = { ...connectedAccounts };
      delete newAccounts[platformToDisconnect];
      setConnectedAccounts(newAccounts);
    }
    setShowDisconnectModal(false);
    setPlatformToDisconnect(null);
  };

  return (
    <div className="dashboard-container"> {/* This is the main container for the dashboard content */}
        <div className="dashboard-main">
          <div className="content-header">
            <h1>Welcome to Your Studio</h1>
            <p>Start by entering a script below to generate your first AI video.</p>
          </div>

          <div className="video-creation-workflow">
            <div className="generation-panel">
              <div className="script-input-section">
                <label htmlFor="script-textarea">Video Script</label>
                <textarea
                  id="script-textarea"
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="e.g., A majestic lion roaming the savanna at sunrise..."
                />
              </div>
              <div className="options-section">
                <div className="option-group">
                  <label htmlFor="voice-style">Voice Style</label>
                  <select id="voice-style" value={voiceStyle} onChange={(e) => setVoiceStyle(e.target.value)}>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="energetic">Energetic</option>
                  </select>
                </div>
                <div className="option-group">
                  <label htmlFor="aspect-ratio">Aspect Ratio</label>
                  <select id="aspect-ratio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                    <option value="16:9">16:9 (YouTube, Widescreen)</option>
                    <option value="9:16">9:16 (TikTok, Reels, Shorts)</option>
                    <option value="1:1">1:1 (Instagram Post, Facebook)</option>
                    <option value="4:5">4:5 (Instagram Portrait)</option>
                  </select>
                </div>
              </div>
              <button onClick={handleGenerateVideo} disabled={isLoading || !script.trim()} className="generate-button">
                {isLoading ? 'Generating...' : 'Generate Video'}
              </button>
            </div>
            <div className="video-output-section">
              {isLoading && (
                <div className="progress-container">
                  <div className="progress-bar"></div>
                  <p>Generating your video... this may take a moment.</p>
                </div>
              )}
              {!isLoading && videoUrl && (
                <div className="video-player-wrapper">
                  <video src={videoUrl} controls autoPlay loop />
                  <div className="video-actions">
                    <div className="download-container">
                      <button className="download-button" onClick={() => setIsDownloadOpen(!isDownloadOpen)}>
                        Download Video
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                      {isDownloadOpen && (
                        <div className="download-dropdown">
                          {downloadOptions.map(option => {
                            const canDownload = planLevels[user.plan] >= planLevels[option.requiredPlan];
                            return (
                              <a
                                key={option.resolution}
                                href={canDownload ? `${videoUrl}?res=${option.resolution}` : undefined}
                                download={canDownload ? `faceless-ai-${option.resolution}-${Date.now()}.mp4` : undefined}
                                className={`download-item ${!canDownload ? 'disabled' : ''}`}
                                onClick={!canDownload ? (e) => e.preventDefault() : undefined}
                              >
                                <span>{option.label}</span>
                                {!canDownload && <span className="upgrade-prompt">Upgrade</span>}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="publish-container">
                      <h4>Publish to:</h4>
                      <div className="publish-buttons">
                        {socialPlatforms.map(platform => (
                          <button key={platform.name} className="publish-button" title={`Publish to ${platform.name}`} disabled={!connectedAccounts[platform.name]}>
                            {platform.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!isLoading && !videoUrl && (
                <div className="video-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
                  <p>Your generated video will appear here.</p>
                </div>
              )}
            </div>
          </div>

          <div className="connected-accounts-section">
            <h2>Connected Accounts</h2>
            <p>Connect your social media accounts to publish videos directly from Faceless AI.</p>
            <div className="accounts-list">
              {socialPlatforms.map(platform => (
                <div key={platform.name} className="account-item">
                  <div className="account-item-info">
                    {platform.icon}
                    <span>{platform.name}</span>
                  </div>
                  <button
                    onClick={() => connectedAccounts[platform.name] ? handleDisconnectClick(platform.name) : handleConnectClick(platform.name)}
                    className={`account-connect-button ${connectedAccounts[platform.name] ? 'connected' : ''}`}
                  >
                    {connectedAccounts[platform.name] ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}

export default Dashboard;