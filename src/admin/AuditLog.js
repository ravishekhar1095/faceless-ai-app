import React, { useState, useEffect } from 'react';
import './Admin.css';

function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/admin/logs');
        if (!response.ok) throw new Error('Failed to fetch audit logs.');
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <div className="content-header">
        <h1>Audit Logs</h1>
        <p>A record of all administrative actions.</p>
      </div>
      <div className="page-content">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Admin</th>
              <th>Action</th>
              <th>Details</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.admin_username}</td>
                <td><span className={`log-action ${log.action.toLowerCase()}`}>{log.action}</span></td>
                <td>{log.details}</td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AuditLog;