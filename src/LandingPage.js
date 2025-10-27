import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './LandingPage.css';
import AnimatedSection from './AnimatedSection.js';
import './AnimatedSection.css';
import FeatureCard from './FeatureCard.js';
import Step from './Step.js';
import FAQItem from './FAQItem.js';
import { useTheme } from './ThemeContext.js';

const navLinks = [
  { href: '#features', text: 'Features' },
  { href: '#how-it-works', text: 'How It Works' },
  { href: '#testimonials', text: 'Testimonials' },
  { href: '/welcome/pricing', text: 'Pricing', isNavLink: true },
];

const features = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="12" width="16" height="8" rx="2"/><path d="M2 12h20"/><path d="M12 12v8"/></svg>,
    title: 'AI-Powered Generation',
    description: 'Our advanced AI analyzes your script to find the perfect visuals and generate natural voiceovers.',
    delay: '0ms'
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
    title: 'Privacy First',
    description: 'Create compelling content and build an audience without ever needing to show your face.',
    delay: '200ms'
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>,
    title: 'Simple & Cost-Effective',
    description: 'No expensive equipment or complex software needed. Go from idea to published video in minutes.',
    delay: '400ms'
  }
];

const steps = [
  {
    number: 1,
    title: 'Write Your Script',
    description: 'Provide the text for your video. It can be anything from a tutorial to a story.'
  },
  {
    number: 2,
    title: 'AI Generates',
    description: 'Our engine creates scenes, finds stock footage, and generates a voiceover.'
  },
  {
    number: 3,
    title: 'Download & Share',
    description: 'Receive your final video, ready to be shared with the world.'
  }
];

const initialFaqs = [
  {
    question: 'Do I need any video editing experience?',
    answer: 'Absolutely not! Faceless AI is designed for everyone, from complete beginners to experienced creators. If you can write a script, you can create a video. Our AI handles all the technical aspects for you.',
    open: false
  },
  {
    question: 'What kind of visuals does the AI use?',
    answer: 'Our AI sources high-quality, royalty-free stock footage and images from a vast library that best match the context of your script. This ensures your videos are both visually appealing and relevant.',
    open: false
  },
  {
    question: 'Can I customize the voiceover?',
    answer: 'Yes! You can choose from a wide variety of AI-generated voices, accents, and languages to find the perfect tone for your content. You can also adjust the speed and pitch to your liking.',
    open: false
  },
  {
    question: 'Is my content truly private?',
    answer: 'Yes, privacy is at the core of our platform. You create content based on your script, and the AI generates the visuals. You never have to appear on camera, ensuring your identity remains private.',
    open: false
  }
];

function LandingPage() {
  const [faqs, setFaqs] = useState(initialFaqs);
  // const { settings } = useTheme(); // Removed for fixed dark theme

  const toggleFAQ = index => {
    setFaqs(faqs.map((faq, i) => (i === index ? { ...faq, open: !faq.open } : { ...faq, open: false })));
  };
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
            {navLinks.map(link => (
              link.isNavLink ? (
                <NavLink key={link.href} to={link.href}>{link.text}</NavLink>
              ) : (
                <a key={link.href} href={link.href}>{link.text}</a>
              )
            ))}
            <NavLink to="/login" className="login-btn">Sign In</NavLink> {/* Kept separate for distinct styling */}
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section page-section">
          <div className="container hero-container">
            <div className="hero-content">
              <h1>Create Stunning Videos, Effortlessly.</h1>
              <p>Transform your ideas into captivating AI-generated videos with professional voiceovers and dynamic visuals. No camera, no crew, no hassle.</p>
              <NavLink to="/login" className="cta-button-hero">Get Started for Free</NavLink>
            </div>
            <div className="hero-visual">
              <video
                className="hero-video-background"
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
                {features.map((feature) => (
                  <FeatureCard
                    key={feature.title}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={feature.delay}
                  />
                ))}
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

        {/* <section className="stats-section page-section">
          <AnimatedSection className="stats-section-animator">
            <div className="container">
              <div className="stats-grid">
                <div className="stat-item">
                  <StatCounter end={10000} suffix="+" />
                  <p>Creators Empowered</p>
                </div>
                <div className="stat-item">
                  <StatCounter end={1000000} suffix="+" />
                  <p>Videos Generated</p>
                </div>
                <div className="stat-item">
                  <StatCounter end={98} suffix="%" />
                  <p>User Satisfaction</p>
                </div>
                <div className="stat-item">
                  <StatCounter end={5} suffix="x" />
                  <p>Faster Content Creation</p>
                </div>
              </div>
            </div>
          </AnimatedSection> */}
        {/* </section> */} {/* Removed for now to simplify and match airtop.ai's initial sections */}

        <section id="how-it-works" className="how-it-works-section page-section">
          <AnimatedSection>
            <div className="container">
              <h2>How It Works in 3 Simple Steps</h2>
              <div className="steps-container">
                {steps.map(step => (
                  <Step
                    key={step.number}
                    number={step.number}
                    title={step.title}
                    description={step.description}
                  />
                ))}
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

        <section id="faq" className="faq-section page-section">
          <AnimatedSection>
            <div className="container">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-container">
                {faqs.map((faq, i) => (
                  <FAQItem
                    key={i}
                    faq={faq}
                    index={i}
                    toggleFAQ={toggleFAQ}
                  />
                ))}
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