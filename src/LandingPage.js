import React from 'react';
import { NavLink } from 'react-router-dom';
import './LandingPage.css';
import AnimatedSection from './AnimatedSection.js';
import './AnimatedSection.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container header-container">
          <div className="landing-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            </svg>
            <span>Faceless AI</span>
          </div>
          <nav className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <NavLink to="/login" className="login-btn">Sign In</NavLink>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section page-section">
          <div className="container hero-container">
            <div className="hero-content">
              <h1>Create Compelling Videos, Anonymously.</h1>
              <p>Turn your scripts into high-quality videos with AI-powered voiceovers and visuals. No camera, no crew, no problem.</p>
              <NavLink to="/login" className="cta-button-hero">Get Started for Free</NavLink>
            </div>
            <div className="hero-visual">
              <img
                className="hero-video"
                src="/Gemini_Generated_Image_gvry45gvry45gvry.png"
                alt="Abstract AI-generated visual representing creativity"
              />
            </div>
          </div>
        </section>

        <section id="features" className="features-section page-section">
          <AnimatedSection>
            <div className="container">
              <h2>Why Creators Love Faceless AI</h2>
              <div className="feature-grid">
                <div className="feature-card" style={{ transitionDelay: '0ms' }}>
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="12" width="16" height="8" rx="2"/><path d="M2 12h20"/><path d="M12 12v8"/></svg>
                  </div>
                  <h3>AI-Powered Generation</h3>
                  <p>Our advanced AI analyzes your script to find the perfect visuals and generate natural voiceovers.</p>
                </div>
                <div className="feature-card" style={{ transitionDelay: '200ms' }}>
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <h3>Privacy First</h3>
                  <p>Create compelling content and build an audience without ever needing to show your face.</p>
                </div>
                <div className="feature-card" style={{ transitionDelay: '400ms' }}>
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                  </div>
                  <h3>Simple & Cost-Effective</h3>
                  <p>No expensive equipment or complex software needed. Go from idea to published video in minutes.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section className="showcase-section page-section">
          <AnimatedSection>
            <div className="container">
              <h2>From Script to Screen, Instantly</h2>
              <p>Watch how our AI takes a simple text prompt and transforms it into a dynamic, ready-to-share video in seconds.</p>
              <div className="showcase-video-container">
                <video
                  className="showcase-video"
                  src="/GIF_Generation_Request_Fulfilled.mp4"
                  alt="Animation showing AI video generation from a script"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section className="stats-section page-section">
          <AnimatedSection>
            <div className="container">
              <div className="stats-grid">
                <div className="stat-item">
                  <h3>10,000+</h3>
                  <p>Creators Empowered</p>
                </div>
                <div className="stat-item">
                  <h3>1M+</h3>
                  <p>Videos Generated</p>
                </div>
                <div className="stat-item">
                  <h3>98%</h3>
                  <p>User Satisfaction</p>
                </div>
                <div className="stat-item">
                  <h3>5x</h3>
                  <p>Faster Content Creation</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section id="how-it-works" className="how-it-works-section page-section">
          <AnimatedSection>
            <div className="container">
              <h2>How It Works in 3 Simple Steps</h2>
              <div className="steps-container">
                <div className="step"><span>1</span><h3>Write Your Script</h3><p>Provide the text for your video. It can be anything from a tutorial to a story.</p></div>
                <div className="step"><span>2</span><h3>AI Generates</h3><p>Our engine creates scenes, finds stock footage, and generates a voiceover.</p></div>
                <div className="step"><span>3</span><h3>Download & Share</h3><p>Receive your final video, ready to be shared with the world.</p></div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section id="testimonials" className="testimonials-section page-section">
          <AnimatedSection>
            <div className="container">
              <h2>Trusted by Creators Worldwide</h2>
              <div className="testimonial-grid">
                <div className="testimonial-card">
                  <p>"Faceless AI transformed my YouTube channel. I can produce content 5x faster without worrying about being on camera. A total game-changer!"</p>
                  <cite>– Alex R., Tech Reviewer</cite>
                </div>
                <div className="testimonial-card">
                  <p>"As an educator, this tool is invaluable. I can create engaging instructional videos for my students in a fraction of the time. Highly recommended."</p>
                  <cite>– Dr. Sarah K., Online Educator</cite>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section id="ai-evolution" className="ai-evolution-section page-section">
          <AnimatedSection>
            <div className="container">
              <h2>The Evolution of Content Creation</h2>
              <p className="evolution-intro">From complex software and expensive hardware to the simple power of a script. AI is revolutionizing how we tell stories. We are at the forefront of this change, making video creation accessible to everyone, everywhere.</p>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-content">
                    <h4>The Past</h4>
                    <p>Manual editing, expensive cameras, and hours of post-production.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-content">
                    <h4>The Present</h4>
                    <p>Template-based editors and basic automation tools.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-content">
                    <h4>The Future</h4>
                    <p>Truly autonomous, script-to-video generation with Faceless AI.</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section className="final-cta-section page-section">
          <AnimatedSection>
            <div className="container">
              <h2>Ready to Bring Your Ideas to Life?</h2>
              <p>Join thousands of creators and start building your audience today. Your first video is on us.</p>
              <NavLink to="/login" className="cta-button-hero">Sign Up Now</NavLink>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="container footer-container">
          <div className="footer-logo">Faceless AI</div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <p className="footer-copyright">&copy; {new Date().getFullYear()} Faceless AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;