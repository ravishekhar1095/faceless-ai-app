import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Dashboard.css';

const voicePresets = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'storyteller', label: 'Storyteller' },
];

const aspectPresets = [
  { value: '16:9', label: '16:9 · Widescreen' },
  { value: '9:16', label: '9:16 · Shorts & Reels' },
  { value: '1:1', label: '1:1 · Square' },
  { value: '4:5', label: '4:5 · Portrait' },
];

const downloadOptions = [
  { resolution: '1080p', label: 'Full HD 1080p', requiredPlan: 'premium' },
  { resolution: '720p', label: 'HD 720p', requiredPlan: 'pro' },
  { resolution: '480p', label: 'SD 480p', requiredPlan: 'free' },
];

const planLevels = {
  free: 1,
  pro: 2,
  premium: 3,
};

const modeOptions = [
  {
    value: 'script',
    label: 'Script to Video',
    description: 'Paste your finished narration to render instantly.',
  },
  {
    value: 'idea',
    label: 'Idea to Script',
    description: 'Share a topic and let AI craft the story.',
  },
  {
    value: 'article',
    label: 'Article to Summary',
    description: 'Transform research notes into a shareable video.',
  },
];

const placeholderByMode = {
  script: 'Paste your narration — include intro, key points, and ending CTA.',
  idea: 'Describe the big idea, audience, and why it matters.',
  article: 'Paste key paragraphs or bullet notes you want summarized.',
};

const generationTipsByMode = {
  script: [
    'Use short sentences for easier voice syncing.',
    'Include stage directions like “[show product demo]” for clarity.',
    'End with a clear call-to-action to boost engagement.',
  ],
  idea: [
    'Mention the target audience so tone fits their expectations.',
    'Highlight 2-3 takeaways you want viewers to remember.',
    'Add emotion words like “inspiring” or “urgent” to shape delivery.',
  ],
  article: [
    'Focus on the most surprising stats or quotes.',
    'Call out the core tension or problem the article solves.',
    'Add a concluding stance or recommendation for viewers.',
  ],
};

const maxLengthByMode = {
  script: 1500,
  idea: 320,
  article: 2200,
};

const modeLabelMap = modeOptions.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

const socialPlatforms = [
  { name: 'YouTube', icon: <svg viewBox="0 0 28 20" fill="currentColor"><path d="M27.55 3.1s-.28-1.95-.55-2.7C26.25.4 25.4.4 25 .4 21.5 0 14 0 14 0S6.5 0 3 .4C2.6.4 1.75.4 1 .4.75 1.15.45 3.1.45 3.1S0 5.4 0 7.7v4.6c0 2.3.45 4.6.45 4.6s.28 1.95.55 2.7c.75.75 1.9.7 2.45.75 3.5.4 10.55.4 10.55.4s7.5 0 11-.4c.4-.05 1.25-.05 2-.75.28-.75.55-2.7.55-2.7S28 14.6 28 12.3v-4.6c0-2.3-.45-4.6-.45-4.6zM11.2 14.45V5.55l7.6 4.45-7.6 4.45z"></path></svg> },
  { name: 'TikTok', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.59 3.01 1.62 4.27 1.2 1.48 2.91 2.33 4.66 2.41.11-1.5.1-2.99-.01-4.48h2.81v16.21h-2.89v-4.75c-1.81.1-3.6.6-5.22 1.82-1.92 1.46-3.36 3.46-4.01 5.66-1.43.1-2.86-.3-4.15-1.1-1.31-.8-2.3-2-2.8-3.44-.55-1.5-.6-3.08-.36-4.61.24-1.52.78-2.95 1.58-4.25.81-1.3 1.89-2.4 3.16-3.25.9-.6 1.9-1 2.96-1.2.01 2.8.01 5.6-.01 8.4.01 1.43-.93 2.8-2.31 3.25-.83.28-1.7.3-2.5.12-.8-.18-1.5-.6-2.04-1.2-.53-.6-.8-1.4-.8-2.2v-2.8c.88.08 1.76.08 2.64.08 1.57 0 3.14 0 4.7-.02z"></path></svg> },
  { name: 'Instagram', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.117 0-3.482.01-4.71.068-2.828.13-4.017 1.31-4.147 4.147-.058 1.227-.068 1.58-.068 4.71s.01 3.482.068 4.71c.13 2.828 1.319 4.017 4.147 4.147 1.228.058 1.593.068 4.71.068s3.482-.01 4.71-.068c2.828-.13 4.017-1.319 4.147-4.147.058-1.228.068-1.593.068-4.71s-.01-3.482-.068-4.71c-.13-2.828-1.319-4.017-4.147-4.147-1.227-.058-1.58-.068-4.71-.068zm0 3.882c-1.998 0-3.618 1.62-3.618 3.618s1.62 3.618 3.618 3.618 3.618-1.62 3.618-3.618-1.62-3.618-3.618-3.618zm0 5.831c-1.221 0-2.213-.992-2.213-2.213s.992-2.213 2.213-2.213 2.213.992 2.213 2.213-.992 2.213-2.213 2.213zm4.965-6.413c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1z"></path></svg> },
  { name: 'Facebook', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.494v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path></svg> },
  { name: 'LinkedIn', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path></svg> },
];

function Dashboard() {
  const [mode, setMode] = useState('script');
  const [script, setScript] = useState('');
  const [voiceStyle, setVoiceStyle] = useState('professional');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState({});
  const [videoHistory, setVideoHistory] = useState([]);
  const [generatedScenes, setGeneratedScenes] = useState([]);
  const [generationError, setGenerationError] = useState(null);
  const [avatarInsights] = useState([
    { name: 'Persona Alpha', usage: '34%', trend: '+6.2%' },
    { name: 'Persona Horizon', usage: '21%', trend: '+2.1%' },
    { name: 'Persona Orbit', usage: '18%', trend: '-1.4%' },
  ]);
  const pollingIntervalRef = useRef(null);
  const user = { name: 'Ravi Shekhar', credits: 15, plan: 'pro' };

  useEffect(() => {
    const mockData = {
      YouTube: { username: 'RaviPlays' },
      Instagram: { username: '@ravi_creates' },
      LinkedIn: { username: 'ravishekhar' },
    };
    const timeoutId = setTimeout(() => setConnectedAccounts(mockData), 350);
    window.handleSocialConnectSuccess = (platformName, username) => {
      setConnectedAccounts((prev) => ({ ...prev, [platformName]: { username } }));
    };
    return () => clearTimeout(timeoutId);
  }, []);

  // Load preset from Samples
  useEffect(() => {
    try {
      const raw = localStorage.getItem('faceless:composerPreset');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.text || parsed.mode)) {
          if (parsed.mode) setMode(parsed.mode);
          if (parsed.text) setScript(parsed.text);
        }
        localStorage.removeItem('faceless:composerPreset');
      }
    } catch {}
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

  const activeMode = useMemo(
    () => modeOptions.find((option) => option.value === mode) || modeOptions[0],
    [mode]
  );

  const activePlaceholder = placeholderByMode[mode] || placeholderByMode.script;
  const activeMaxLength = maxLengthByMode[mode] || maxLengthByMode.script;

  const quickStats = useMemo(
    () => [
      { label: 'Available credits', value: user.credits },
      { label: 'Render queue', value: isLoading ? '1 active' : 'Idle' },
      { label: 'Generation mode', value: modeLabelMap[mode] || 'Script to Video' },
      { label: 'Aspect preset', value: aspectRatio },
      { label: 'Voice preset', value: voicePresets.find((preset) => preset.value === voiceStyle)?.label ?? '—' },
    ],
    [user.credits, isLoading, aspectRatio, voiceStyle, mode]
  );

  const activeTips = useMemo(() => generationTipsByMode[mode] || [], [mode]);

  const refreshHistory = useCallback(async () => {
    try {
      const response = await fetch('/api/jobs/recent');
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      setVideoHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load recent jobs:', error);
    }
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  useEffect(() => {
    setGenerationError(null);
    setGeneratedScenes([]);
    setVideoUrl('');
    setIsDownloadOpen(false);
  }, [mode]);

  const formatJobTimestamp = useCallback((timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleString();
  }, []);

  const handleModeChange = (nextMode) => {
    if (mode === nextMode) return;
    setMode(nextMode);
    setScript('');
  };

  const handleGenerateVideo = async () => {
    const trimmedInput = script.trim();

    if (!trimmedInput) {
      setGenerationError('Add some content before generating a video.');
      return;
    }

    if (mode === 'script' && trimmedInput.length < 30) {
      setGenerationError('Your script is a bit short. Add more context so we can storyboard it.');
      return;
    }

    if (mode !== 'script' && trimmedInput.length < 8) {
      setGenerationError('Share a few more words so we can understand your prompt.');
      return;
    }

    setIsLoading(true);
    setVideoUrl('');
    setJobId(null);
    setGeneratedScenes([]);
    setIsDownloadOpen(false);
    setGenerationError(null);

    const payload = {
      mode,
      voiceStyle,
      aspectRatio,
    };

    if (mode === 'script') {
      payload.script = trimmedInput;
    } else if (mode === 'idea') {
      payload.idea = trimmedInput;
    } else if (mode === 'article') {
      payload.article = trimmedInput;
    }

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Request failed.');
      }
      if (data.jobId) {
        setJobId(data.jobId);
        refreshHistory();
      } else {
        throw new Error('Failed to start video generation job.');
      }
    } catch (error) {
      console.error('Error generating video:', error);
      setIsLoading(false);
      setGenerationError(error.message || 'Unable to start video generation. Please try again.');
    }
  };

  const checkJobStatus = async () => {
    try {
      const response = await fetch(`/api/video-status/${jobId}`);
      if (!response.ok) {
        throw new Error(`Status request failed with ${response.status}`);
      }
      const data = await response.json();

      if (data.status === 'complete') {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        setVideoUrl(data.videoUrl);
        setGeneratedScenes(data.scenes || []);
        setIsLoading(false);
        setJobId(null);
        setGenerationError(null);
        setIsDownloadOpen(false);
        refreshHistory();
      } else if (data.status === 'failed') {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        setIsLoading(false);
        setJobId(null);
        setVideoUrl('');
        setGeneratedScenes([]);
        setIsDownloadOpen(false);
        setGenerationError(data.error || 'Video generation failed. Please try again.');
        refreshHistory();
      }
    } catch (error) {
      console.error('Error polling job status:', error);
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      setIsLoading(false);
      setVideoUrl('');
      setGeneratedScenes([]);
      setIsDownloadOpen(false);
      setGenerationError(error instanceof Error ? error.message : 'We lost connection to the renderer. Please try again.');
      refreshHistory();
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

  const toggleConnection = (platformName) => {
    if (connectedAccounts[platformName]) {
      const confirmDisconnect = window.confirm(`Disconnect ${platformName}?`);
      if (!confirmDisconnect) return;
      setConnectedAccounts((prev) => {
        const next = { ...prev };
        delete next[platformName];
        return next;
      });
      return;
    }
    handleConnectClick(platformName);
  };

  const canDownload = (requiredPlan) => planLevels[user.plan] >= planLevels[requiredPlan];

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <span className="dashboard-label">Faceless Studio</span>
          <h1>Hey {user.name.split(' ')[0]}, let’s build your next faceless hit.</h1>
          <p>
            Provide a script, choose your voice and aspect preset, then let the AI render, caption, and prep your video
            for any channel.
          </p>
        </div>
        <div className="dashboard-hero-stats">
          {quickStats.map((stat) => (
            <article key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-grid">
        <div className="composer-card">
          <div className="mode-toggle" role="tablist" aria-label="Video generation mode">
            {modeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={mode === option.value}
                className={mode === option.value ? 'is-active' : ''}
                onClick={() => handleModeChange(option.value)}
              >
                <span>{option.label}</span>
                <small>{option.description}</small>
              </button>
            ))}
          </div>
          <header>
            <div>
              <h2>AI Script-to-Video Composer</h2>
              <p>{activeMode.description}</p>
            </div>
            <span className="character-count">{script.length}/{activeMaxLength}</span>
          </header>
          <textarea
            value={script}
            onChange={(event) => setScript(event.target.value.slice(0, activeMaxLength))}
            placeholder={activePlaceholder}
            maxLength={activeMaxLength}
          />
          <div className="composer-controls">
            <label>
              <span>Voice preset</span>
              <div className="select-wrapper">
                <select value={voiceStyle} onChange={(event) => setVoiceStyle(event.target.value)}>
                  {voicePresets.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>
            </label>
            <label>
              <span>Aspect ratio</span>
              <div className="select-wrapper">
                <select value={aspectRatio} onChange={(event) => setAspectRatio(event.target.value)}>
                  {aspectPresets.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>
            </label>
            <div className="composer-actions">
              <button
                type="button"
                className="primary-action"
                onClick={handleGenerateVideo}
                disabled={isLoading || !script.trim()}
              >
                {isLoading ? 'Rendering...' : 'Generate video'}
              </button>
              <button type="button" className="secondary-action" onClick={() => setScript('')}>
                Clear
              </button>
            </div>
          </div>
          <ul className="composer-tips">
            {activeTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className="preview-card">
          <header>
            <h2>Live preview</h2>
            {isLoading && <span className="badge badge-processing">Processing</span>}
            {videoUrl && !isLoading && <span className="badge badge-ready">Ready</span>}
          </header>

          <div className="preview-stage">
            {isLoading && (
              <div className="preview-progress">
                <div className="progress-bar" />
                <p>Rendering scenes, syncing narration, and packaging assets…</p>
              </div>
            )}

            {!isLoading && generationError && (
              <div className="preview-error">
                <p>{generationError}</p>
                <button type="button" onClick={handleGenerateVideo} disabled={!script.trim()}>
                  Retry render
                </button>
              </div>
            )}

            {!isLoading && !generationError && videoUrl && (
              <div className="preview-player">
                <video src={videoUrl} controls autoPlay loop />
                <div className="preview-meta">
                  <div>
                    <span className="label">Voice</span>
                    <strong>{voicePresets.find((preset) => preset.value === voiceStyle)?.label}</strong>
                  </div>
                  <div>
                    <span className="label">Aspect</span>
                    <strong>{aspectRatio}</strong>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !generationError && !videoUrl && (
              <div className="preview-placeholder">
                <svg width="60" height="60" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="2.3" />
                  <line x1="2" y1="9" x2="22" y2="9" />
                  <line x1="2" y1="15" x2="22" y2="15" />
                  <line x1="9" y1="2" x2="9" y2="22" />
                  <line x1="15" y1="2" x2="15" y2="22" />
                </svg>
                <p>Your generated video will play here.</p>
              </div>
            )}
          </div>

          {generatedScenes.length > 0 && (
            <div className="preview-scenes">
              <h4>Scene breakdown</h4>
              <ol>
                {generatedScenes.map((scene, index) => (
                  <li key={`${index}-${scene.keywords}`}>
                    <span className="scene-index">{index + 1}</span>
                    <div>
                      <p>{scene.text}</p>
                      <small>{scene.keywords || 'Keywords pending'}</small>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <footer className="preview-footer">
            <div className="download-menu">
              <button type="button" onClick={() => setIsDownloadOpen((prev) => !prev)} disabled={!videoUrl}>
                Download
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </button>
              {isDownloadOpen && videoUrl && (
                <div className="download-dropdown">
                  {downloadOptions.map((option) => {
                    const enabled = canDownload(option.requiredPlan);
                    return (
                      <a
                        key={option.resolution}
                        className={enabled ? '' : 'is-disabled'}
                        href={enabled ? `${videoUrl}?res=${option.resolution}` : undefined}
                        download={enabled ? `faceless-ai-${option.resolution}-${Date.now()}.mp4` : undefined}
                        onClick={!enabled ? (event) => event.preventDefault() : undefined}
                      >
                        <span>{option.label}</span>
                        {!enabled && <em>Upgrade</em>}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="share-menu">
              <span>Publish</span>
              <div className="share-buttons">
                {socialPlatforms.map((platform) => (
                  <button
                    key={platform.name}
                    type="button"
                    title={platform.name}
                    onClick={() => toggleConnection(platform.name)}
                    className={connectedAccounts[platform.name] ? 'is-connected' : ''}
                  >
                    {platform.icon}
                  </button>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </section>

      <section className="secondary-grid">
        <div className="history-card">
          <header>
            <h3>Recent renders</h3>
            <span>{videoHistory.length} saved</span>
          </header>
          <ul>
            {videoHistory.length === 0 && (
              <li className="history-empty">
                <p>No renders yet. Generate a video to see it appear here.</p>
              </li>
            )}
            {videoHistory.map((job) => {
              const canDownloadHistory = Boolean(job.videoUrl);
              const modeLabel = modeLabelMap[job.mode] || 'Script to Video';
              const completedLabel = formatJobTimestamp(job.completedAt || job.createdAt);
              const statusLabel =
                job.status === 'complete'
                  ? completedLabel || 'Completed'
                  : job.status === 'failed'
                  ? 'Failed'
                  : 'Processing';

              return (
                <li key={job.id}>
                  <div className="history-thumbnail">
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="M3 5h18v14H3z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <path d="m10 9 5 3-5 3z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="history-meta">
                    <strong>{job.title}</strong>
                    <span>
                      {modeLabel} · {statusLabel}
                    </span>
                  </div>
                  {canDownloadHistory ? (
                    <a
                      href={job.videoUrl}
                      download={`faceless-ai-${job.id}.mp4`}
                      className="history-link"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="history-link disabled">
                      {job.status === 'failed' ? 'Failed' : 'Pending'}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="accounts-card">
          <header>
            <h3>Channel automations</h3>
            <span>Connect once, publish everywhere</span>
          </header>
          <div className="accounts-grid">
            {socialPlatforms.map((platform) => {
              const connection = connectedAccounts[platform.name];
              return (
                <article key={platform.name}>
                  <div className="account-icon">{platform.icon}</div>
                  <div>
                    <strong>{platform.name}</strong>
                    <span>{connection ? connection.username : 'Not connected'}</span>
                  </div>
                  <button type="button" onClick={() => toggleConnection(platform.name)}>
                    {connection ? 'Disconnect' : 'Connect'}
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <div className="insights-card">
          <header>
            <h3>Avatar insights</h3>
            <span>Top performing personas this week</span>
          </header>
          <ul>
            {avatarInsights.map((avatar) => (
              <li key={avatar.name}>
                <div>
                  <strong>{avatar.name}</strong>
                  <span>Usage {avatar.usage}</span>
                </div>
                <span className={avatar.trend.startsWith('-') ? 'trend-down' : 'trend-up'}>{avatar.trend}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
