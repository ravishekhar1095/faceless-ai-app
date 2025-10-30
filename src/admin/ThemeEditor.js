import React, { useState, useEffect } from 'react';
import './Admin.css';

function ThemeEditor() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/theme-settings');
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError('Failed to load theme settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSuccess('');
    setError('');
    try {
      const response = await fetch('/api/admin/theme-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSuccess('Settings saved successfully!');
      // Optional: force a reload on the main site to see changes
      // window.opener.location.reload();
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <>
      <div className="content-header">
        <h1>Theme & Content Editor</h1>
        <p>Customize the look and feel of your public-facing pages.</p>
      </div>
      <div className="page-content">
        <div className="theme-editor-form">
          <h3>Landing Page</h3>
          <div className="form-group">
            <label htmlFor="hero_title">Hero Title</label>
            <input type="text" id="hero_title" name="hero_title" value={settings.hero_title || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="hero_subtitle">Hero Subtitle</label>
            <textarea id="hero_subtitle" name="hero_subtitle" value={settings.hero_subtitle || ''} onChange={handleChange} rows="3"></textarea>
          </div>

          <h3>Global Styles</h3>
          <div className="form-group">
            <label htmlFor="primary_color">Primary Color</label>
            <input type="color" id="primary_color" name="primary_color" value={settings.primary_color || '#6366f1'} onChange={handleChange} />
          </div>

          <div className="admin-toolbar">
            <button onClick={handleSave} className="action-button update-button">Save Changes</button>
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </div>
      </div>
    </>
  );
}

export default ThemeEditor;