import React, { useState, useEffect, useRef } from 'react';
import './AnimatedSection.css';

const AnimatedSection = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger animation only when the element is intersecting
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing once the animation is triggered to save resources
          observer.unobserve(entry.target);
        }
      },
      {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the element is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`animated-section ${isVisible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default AnimatedSection;