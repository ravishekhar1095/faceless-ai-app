import React from 'react';
import { NavLink } from 'react-router-dom';

function About() {
  return (
    <>
      <div className="content-header">
        <h1>Create Videos Without Being a Video Pro</h1>
        <p>Your story, your voice, your privacy. Turn simple text into stunning videos, effortlessly.</p>
      </div>

      <div className="feature-grid about-page-section">
        <div className="feature-card">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="12" width="16" height="8" rx="2"/><path d="M2 12h20"/><path d="M12 12v8"/></svg>
          <h3>AI-Powered Generation</h3>
          <p>Our advanced AI analyzes your script to find the perfect visuals and generate natural voiceovers.</p>
        </div>
        <div className="feature-card">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <h3>Privacy First</h3>
          <p>Create compelling content and build an audience without ever needing to show your face.</p>
        </div>
        <div className="feature-card">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
          <h3>Simple & Cost-Effective</h3>
          <p>No expensive equipment or complex software needed. Go from idea to published video in minutes.</p>
        </div>
      </div>

      <div className="how-it-works-section about-page-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step"><span>1</span><h3>Write Your Script</h3><p>Provide the text for your video. It can be anything from a tutorial to a story.</p></div>
          <div className="step"><span>2</span><h3>AI Generates</h3><p>Our engine creates scenes, finds stock footage, and generates a voiceover.</p></div>
          <div className="step"><span>3</span><h3>Download & Share</h3><p>Receive your final video, ready to be shared with the world.</p></div>
        </div>
      </div>

      <div className="mission-section about-page-section">
        <h2>Our Mission</h2>
        <p>We believe everyone has a story to tell. Faceless AI was built for the modern creator who values privacy and efficiency. Our platform is designed to save you time and money, empowering you to tell your story to the world, anonymously and effectively.</p>
      </div>

      <div className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Transform your ideas into videos today.</p>
        <NavLink to="/welcome/dashboard" className="cta-button">Create Your First Video</NavLink>
      </div>
    </>
  );
}

export default About;