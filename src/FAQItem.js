import React from 'react';

const FAQItem = ({ faq, index, toggleFAQ }) => {
  return (
    <div
      className={`faq-item ${faq.open ? 'open' : ''}`}
      key={index}
      onClick={() => toggleFAQ(index)}
    >
      <div className="faq-question">
        <h4>{faq.question}</h4>
        <div className="faq-toggle-icon">
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="faq-answer">{faq.answer}</div>
    </div>
  );
};

export default FAQItem;