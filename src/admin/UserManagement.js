import React, { useState, useEffect } from 'react';
import './Admin.css'; // We'll create this for admin-specific styles

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users.');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Failed to delete user.');
        }
        // Remove the user from the local state to update the UI instantly
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <div className="content-header">
        <h1>User Management</h1>
        <p>View and manage all registered users.</p>
      </div>
      <div className="admin-dashboard-metrics">
        <div className="metric-card">
          <h4>Total Users</h4>
          <p>{users.length}</p>
        </div>
      </div>
      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search by username..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="page-content">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Joined On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email || 'N/A'}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDelete(user.id)} className="action-button delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserManagement;