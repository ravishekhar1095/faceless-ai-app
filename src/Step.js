import React from 'react';

const Step = ({ number, title, description }) => {
  return (
    <div className="step">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Step;