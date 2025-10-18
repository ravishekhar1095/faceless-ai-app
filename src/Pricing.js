import React, { useState } from 'react';

function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <>
      <div className="content-header">
        <h1>Pricing Plans</h1>
        <p>Choose the plan that's right for you and your team.</p>
        <div className="billing-toggle">
          <button
            className={billingCycle === 'monthly' ? 'active' : ''}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={billingCycle === 'yearly' ? 'active' : ''}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly (Save 20%)
          </button>
        </div>
      </div>
      <div className="pricing-grid">
        <div className="pricing-card">
          <h3>Free</h3>
          <p className="price">
            <span>$0</span>/month
          </p>
          <ul>
            <li>10 Credits per month</li>
            <li>Standard Quality Videos</li>
            <li>Community Support</li>
          </ul>
          <button className="pricing-button current-plan">Current Plan</button>
        </div>
        <div className="pricing-card featured">
          <div className="popular-badge">Most Popular</div>
          <h3>Pro</h3>
          <p className="price">
            <span>{billingCycle === 'monthly' ? '$29' : '$23'}</span>/month
          </p>
          <ul>
            <li>500 Credits per month</li>
            <li>High Quality (1080p) Videos</li>
            <li>Priority Support</li>
            <li>Access to Premium Assets</li>
          </ul>
          <button className="pricing-button upgrade-button">Upgrade to Pro</button>
        </div>
        <div className="pricing-card">
          <h3>Enterprise</h3>
          <p className="price">
            <span>Custom</span>
          </p>
          <ul>
            <li>Unlimited Credits</li>
            <li>4K Video Exports</li>
            <li>Dedicated Support & Onboarding</li>
            <li>Custom API Integrations</li>
          </ul>
          <button className="pricing-button current-plan">Contact Us</button>
        </div>
      </div>
    </>
  );
}

export default Pricing;