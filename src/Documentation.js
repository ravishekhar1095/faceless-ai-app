import React from 'react';

function Documentation() {
  return (
    <>
      <div className="content-header">
        <h1>Documentation</h1>
        <p>Find everything you need to get started and master Faceless AI.</p>
      </div>
      <div className="page-content">
        <h2>Introduction</h2>
        <p>Welcome to the Faceless AI API documentation. Our API allows you to programmatically generate videos, manage your account, and integrate our powerful video creation engine into your own applications and workflows.</p>

        <h2>Authentication</h2>
        <p>All API requests must be authenticated using an API key. You can find your API key in your account settings. Include your API key in the `Authorization` header of your requests.</p>
        <pre><code>Authorization: Bearer YOUR_API_KEY</code></pre>

        <h2>Endpoints</h2>
        <h3>1. Generate a Video</h3>
        <p>This endpoint starts a new video generation job. It returns a `jobId` which you can use to check the status of the generation process.</p>
        <p><strong>POST</strong> `/api/generate-video`</p>
        <h4>Request Body:</h4>
        <pre><code>{`{
  "script": "Your full video script goes here. The AI will analyze this text to create scenes and generate a voiceover."
}`}</code></pre>

        <h3>2. Check Video Status</h3>
        <p>Poll this endpoint to check the status of your video generation job. Once the status is `complete`, the response will include the final `videoUrl`.</p>
        <p><strong>GET</strong> `/api/video-status/:jobId`</p>
        <h4>Success Response (Complete):</h4>
        <pre><code>{`{
  "success": true,
  "status": "complete",
  "videoUrl": "https://your-video-url.mp4"
}`}</code></pre>
      </div>
    </>
  );
}

export default Documentation;