import React, { useState, useEffect, useRef } from 'react';

function Dashboard() {
  const [script, setScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');

  // Mock data for video history. In a real app, this would be fetched from your backend.
  const [videoHistory, setVideoHistory] = useState([
    { id: 1, title: 'The Rise of AI in 2024', url: '/login-animation.mp4' },
    { id: 2, title: 'Marketing Tips for Startups', url: '/login-animation.mp4' },
    { id: 3, title: 'A Journey Through the Alps', url: '/login-animation.mp4' },
    { id: 4, title: 'The Future of Renewable Energy', url: '/login-animation.mp4' },
    { id: 5, title: 'How to Bake the Perfect Sourdough', url: '/login-animation.mp4' },
  ]);

  const pollingInterval = useRef(null);

  useEffect(() => {
    if (jobId) {
      pollingInterval.current = setInterval(checkJobStatus, 3000);
    }
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [jobId]);

  const checkJobStatus = async () => {
    try {
      const response = await fetch(`/api/video-status/${jobId}`);
      const data = await response.json();

      if (data.status === 'complete') {
        clearInterval(pollingInterval.current);
        setVideoUrl(data.videoUrl);
        setIsLoading(false);
        setJobId(null);
        const newVideo = { id: Date.now(), title: script.substring(0, 30) + '...', url: data.videoUrl };
        setVideoHistory([newVideo, ...videoHistory].slice(0, 5));
      } else if (data.status === 'failed') {
        clearInterval(pollingInterval.current);
        setIsLoading(false);
        setJobId(null);
        // You could set an error state here
        console.error('Video generation failed.');
      }
    } catch (error) {
      console.error('Error polling job status:', error);
      clearInterval(pollingInterval.current);
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
        body: JSON.stringify({ script }),
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

  return (
    <>
      <div className="content-header">
        <h1>Welcome to Your Studio</h1>
        <p>Start by entering a script below to generate your first AI video.</p>
      </div>
      <div className="video-creation-workflow">
        <div className="script-input-section">
          <textarea value={script} onChange={(e) => setScript(e.target.value)} placeholder="e.g., A majestic lion roaming the savanna at sunrise..."></textarea>
          <button onClick={handleGenerateVideo} disabled={isLoading || !script.trim()} className="generate-button">
            {isLoading ? 'Generating...' : 'Generate Video'}
          </button>
        </div>
        <div className="video-output-section">
          {isLoading && <div className="spinner"></div>}
          {!isLoading && videoUrl && <video src={videoUrl} controls autoPlay loop />}
          {!isLoading && !videoUrl && <div className="video-placeholder-text">Your generated video will appear here.</div>}
        </div>
      </div>

      <div className="video-history-section">
        <h2>Recent Videos</h2>
        <div className="history-list">
          {videoHistory.map((video) => (
            <div key={video.id} className="history-item" onClick={() => setVideoUrl(video.url)}>
              <div className="history-item-thumbnail">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
              <span className="history-item-title">{video.title}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;