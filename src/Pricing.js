import React from 'react';

function Pricing() {
  return (
    <>
      <div className="content-header">
        <h1>Pricing Plans</h1>
        <p>Choose the plan that's right for you.</p>
      </div>
      <div className="pricing-grid">
        <div className="pricing-card">
          <h3>Free</h3>
          <p className="price"><span>$0</span>/month</p>
          <ul>
            <li>10 Credits per month</li>
            <li>Standard Quality Videos</li>
            <li>Community Support</li>
          </ul>
          <button className="pricing-button">Current Plan</button>
        </div>
        <div className="pricing-card featured">
          <h3>Pro</h3>
          <p className="price"><span>$29</span>/month</p>
          <ul>
            <li>500 Credits per month</li>
            <li>High Quality (1080p) Videos</li>
            <li>Priority Support</li>
            <li>Access to Premium Assets</li>
          </ul>
          <button className="pricing-button">Upgrade to Pro</button>
        </div>
      </div>
    </>
  );
}

export default Pricing;