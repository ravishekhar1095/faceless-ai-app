import React, { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './LandingPage.css';

const featureHighlights = [
  {
    title: 'Narrate with lifelike voices',
    description: 'Pick from 60+ multilingual voice models tuned for education, storytelling, and product launches.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 6v12"/><path d="M5 9v6"/><path d="M19 9v6"/><path d="M2 10a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/></svg>
    ),
  },
  {
    title: 'Curate cinematic visuals',
    description: 'Our storyboard AI suggests on-brand scenes, animations, and b-roll in seconds.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="m22 13-5-5"/><path d="M6 13h4"/><path d="m6 17 2 2 2-2"/></svg>
    ),
  },
  {
    title: 'Publish everywhere',
    description: 'Push videos to YouTube, TikTok, and LinkedIn with one-click captions and aspect ratios.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5v14l8-7z"/><rect x="13" y="5" width="8" height="14" rx="1"/></svg>
    ),
  },
];

const workflowPhases = [
  {
    badge: '01',
    title: 'Script & Strategy',
    description: 'Glow-guided prompts turn bullet points into storyboards personalized for your brand voice.',
  },
  {
    badge: '02',
    title: 'AI Studio',
    description: 'Faceless AI crafts scenes, selects backing tracks, and syncs narration automatically.',
  },
  {
    badge: '03',
    title: 'Review & Launch',
    description: 'Fine-tune timing, swap scenes, and publish to every social channel from a single dashboard.',
  },
];

const statHighlights = [
  { value: '12K+', label: 'Creators onboarded' },
  { value: '2.8M', label: 'Videos rendered' },
  { value: '4.8★', label: 'Average rating' },
  { value: '72%', label: 'Faster production time' },
];

const testimonialGrid = [
  {
    quote: '“We publish 40+ faceless explainers monthly. The AI voices feel natural and our brand stays consistent.”',
    author: 'Maya Chen',
    role: 'Head of Media, Luminate Labs',
  },
  {
    quote: '“Our global product team produces launch videos in every language without hiring external agencies.”',
    author: 'Leon Maxwell',
    role: 'Product Marketing, Altitude IoT',
  },
  {
    quote: '“It’s like having an in-house studio. Script, edit, and schedule in half the time with better engagement.”',
    author: 'Kaitlyn Ross',
    role: 'Content Director, Nova Fintech',
  },
];

const faqs = [
  {
    question: 'Do I need on-camera talent or studio equipment?',
    answer: 'Nope. Faceless AI was designed for creator anonymity. Upload a script or prompt and we do the rest—voice, visuals, captions, and delivery.',
  },
  {
    question: 'Can I customize voiceovers and pacing?',
    answer: 'Yes. Adjust tone, speed, emphasis, and emotion per scene. You can also upload brand pronunciation guides for perfect delivery.',
  },
  {
    question: 'Where can I publish my videos?',
    answer: 'Export in presets for YouTube, TikTok, Instagram, LinkedIn, or high-res MP4. Publishing integrations let you send content directly from the dashboard.',
  },
  {
    question: 'How does pricing work?',
    answer: 'Plans scale with output. Start free with 10 render credits, then upgrade for automated publishing, teams, and premium voices.',
  },
];

const navLinks = [
  { href: '#features', label: 'Platform' },
  { href: '#workflow', label: 'Workflow' },
  { href: '#testimonials', label: 'Results' },
  { href: '/welcome/pricing', label: 'Pricing', type: 'internal' },
];

function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq((current) => (current === index ? null : index));
  };

  const renderedFaqs = useMemo(
    () =>
      faqs.map((faq, index) => {
        const isOpen = activeFaq === index;
        return (
          <div key={faq.question} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
            <button type="button" onClick={() => toggleFaq(index)} aria-expanded={isOpen}>
              <span>{faq.question}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <p>{faq.answer}</p>
          </div>
        );
      }),
    [activeFaq]
  );

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container header-container">
          <NavLink to="/" className="landing-logo">
            <span className="logo-glyph">◎</span>
            <span>Faceless AI Studio</span>
          </NavLink>
          <nav className="landing-nav-links">
            {navLinks.map(({ href, label, type }) =>
              type === 'internal' ? (
                <NavLink key={href} to={href}>
                  {label}
                </NavLink>
              ) : (
                <a key={href} href={href}>
                  {label}
                </a>
              )
            )}
            <NavLink to="/login" className="login-btn">
              Launch Console
            </NavLink>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section page-section">
          <div className="container hero-container">
            <div className="hero-copy">
              <span className="hero-pill">AI-Native Video Engine</span>
              <h1>Scale faceless video content with cinematic quality.</h1>
              <p>
                Faceless AI unifies scriptwriting, voice, visuals, and publishing into a single studio. Ship story-driven
                content in any language—without cameras, crews, or burnout.
              </p>
              <div className="hero-actions">
                <NavLink to="/login" className="cta-primary">
                  Start generating
                </NavLink>
                <NavLink to="/welcome/pricing" className="cta-secondary">
                  View pricing
                </NavLink>
              </div>
              <div className="hero-metadata">
                <div>
                  <strong>Trusted by growth teams</strong>
                  <span>Creators, agencies, and SaaS storytellers</span>
                </div>
                <div>
                  <strong>Booth-free production</strong>
                  <span>No recording gear required</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-visual-shell">
                <div className="hero-visual-mesh" aria-hidden="true" />
                <div className="hero-visual-card">
                  <header>
                    <span className="status-dot" />
                    <span>Auto render in progress</span>
                    <span>94%</span>
                  </header>
                  <div className="hero-visual-media">
                    <video
                      src="/GIF_Generation_Request_Fulfilled.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      aria-hidden="true"
                    />
                  </div>
                  <footer>
                    <div>
                      <span className="label">Voice</span>
                      <strong>Atlas · Energetic</strong>
                    </div>
                    <div>
                      <span className="label">Distribution</span>
                      <strong>Youtube · TikTok · Reels</strong>
                    </div>
                  </footer>
                </div>
                <div className="hero-visual-float">
                  <span className="hero-float-label">New video credits</span>
                  <strong>+20 added</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section page-section">
          <div className="container stats-grid">
            {statHighlights.map((stat) => (
              <div key={stat.label} className="stat-tile">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="features-section page-section">
          <div className="container features-grid">
            {featureHighlights.map(({ title, description, icon }) => (
              <article key={title} className="feature-card">
                <div className="feature-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="workflow-section page-section">
          <div className="container workflow-wrapper">
            <div className="workflow-copy">
              <span className="section-label">Workflow</span>
              <h2>From script idea to published asset in under 8 minutes.</h2>
              <p>
                Whether you build product explainers or faceless influencers, our guided studio handles every step—from
                concept to render to publish.
              </p>
              <NavLink to="/login" className="ghost-link">
                Explore the console
              </NavLink>
            </div>
            <div className="workflow-cards">
              {workflowPhases.map(({ badge, title, description }) => (
                <article key={badge} className="workflow-card">
                  <span className="workflow-badge">{badge}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="studio-preview-section page-section">
          <div className="container studio-preview">
            <div className="studio-preview-header">
              <span className="section-label">Studio Preview</span>
              <h2>Everything your content team needs—centralized.</h2>
              <p>
                Manage voice libraries, avatar presets, credit usage, and performance analytics in real time. Your team
                stays aligned while the AI does the heavy lifting.
              </p>
            </div>
            <div className="studio-preview-media">
              <img src="/Gemini_Generated_Image_gvry45gvry45gvry.png" alt="Faceless AI dashboard preview" />
              <div className="studio-preview-callout">
                <span>Realtime Insights</span>
                <strong>Track render speed, credit usage, and channel performance without spreadsheets.</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="testimonials-section page-section">
          <div className="container testimonials-grid">
            {testimonialGrid.map(({ quote, author, role }) => (
              <article key={author} className="testimonial-card">
                <p>{quote}</p>
                <footer>
                  <strong>{author}</strong>
                  <span>{role}</span>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <section className="faq-section page-section">
          <div className="container faq-container">
            <div className="faq-copy">
              <span className="section-label">FAQs</span>
              <h2>All the details before you press record—without recording.</h2>
              <p>
                Everything you need to know about producing faceless content with studio-grade polish. Still curious?
                Our team is a DM away.
              </p>
            </div>
            <div className="faq-items">{renderedFaqs}</div>
          </div>
        </section>

        <section className="cta-section page-section">
          <div className="container cta-banner">
            <div>
              <span className="section-label">Start creating</span>
              <h2>Turn your next script into a faceless masterpiece.</h2>
              <p>Sign up in under 60 seconds. Your first 10 renders are on us.</p>
            </div>
            <div className="cta-actions">
              <NavLink to="/login" className="cta-primary">
                Claim free credits
              </NavLink>
              <NavLink to="/welcome/pricing" className="cta-secondary">
                Compare plans
              </NavLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="container footer-container">
          <div className="footer-brand">
            <span>© {new Date().getFullYear()} Faceless AI Studio. Privacy-first video automation.</span>
          </div>
          <div className="footer-links">
            <a href="#features">Platform</a>
            <a href="#workflow">Workflow</a>
            <NavLink to="/welcome/pricing">Pricing</NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
