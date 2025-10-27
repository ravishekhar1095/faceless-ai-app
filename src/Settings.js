import React, { useState } from 'react';
import './Settings.css';

function Settings() {
  // Mock data, in a real app this would come from user context/API
  const [profile, setProfile] = useState({
    name: 'Ravi Shekhar',
    email: 'ravi.shekhar@example.com',
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [notifications, setNotifications] = useState({
    productUpdates: true,
    weeklySummary: false,
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  return (
    <div className="settings-page">
      <div className="content-header">
        <h1>Settings</h1>
        <p>Manage your account, billing, and notification preferences.</p>
      </div>

      <div className="settings-section">
        <h2>Profile</h2>
        <div className="settings-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={profile.name} onChange={handleProfileChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={profile.email} onChange={handleProfileChange} />
          </div>
          <button className="settings-button">Save Profile</button>
        </div>
      </div>

      <div className="settings-section">
        <h2>Change Password</h2>
        <div className="settings-form">
          <div className="form-group">
            <label htmlFor="current">Current Password</label>
            <input type="password" id="current" name="current" value={password.current} onChange={handlePasswordChange} />
          </div>
          <div className="form-group">
            <label htmlFor="new">New Password</label>
            <input type="password" id="new" name="new" value={password.new} onChange={handlePasswordChange} />
          </div>
          <div className="form-group">
            <label htmlFor="confirm">Confirm New Password</label>
            <input type="password" id="confirm" name="confirm" value={password.confirm} onChange={handlePasswordChange} />
          </div>
          <button className="settings-button">Update Password</button>
        </div>
      </div>

      <div className="settings-section">
        <h2>Plan & Billing</h2>
        <div className="plan-info">
          <p>You are currently on the <strong>Pro Plan</strong>.</p>
          <button className="settings-button secondary">Manage Subscription</button>
        </div>
      </div>

      <div className="settings-section">
        <h2>Notifications</h2>
        <div className="notification-options">
          <div className="notification-toggle">
            <label htmlFor="productUpdates">
              <span>Product Updates</span>
              <small>Receive emails about new features and updates.</small>
            </label>
            <input type="checkbox" id="productUpdates" name="productUpdates" checked={notifications.productUpdates} onChange={handleNotificationChange} />
          </div>
          <div className="notification-toggle">
            <label htmlFor="weeklySummary">
              <span>Weekly Summary</span>
              <small>Get a weekly summary of your video creation activity.</small>
            </label>
            <input type="checkbox" id="weeklySummary" name="weeklySummary" checked={notifications.weeklySummary} onChange={handleNotificationChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;