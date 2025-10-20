import React from 'react';

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <div className="feature-card" style={{ transitionDelay: delay }}>
      <div className="feature-icon">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;