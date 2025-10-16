import React, { useState, useEffect } from 'react';
import './Admin.css';

function CreditManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) throw new Error('Failed to fetch users.');
        const data = await response.json();
        // Ensure newCredits is never null or undefined to prevent uncontrolled -> controlled input warning.
        // Also, ensure credits has a fallback for display.
        setUsers(data.map(u => ({ ...u, credits: u.credits ?? 0, newCredits: u.credits ?? 0 })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleCreditChange = (userId, value) => {
    // Ensure the value is a number before setting state
    setUsers(users.map(u => u.id === userId ? { ...u, newCredits: value === '' ? '' : Number(value) } : u));
  };

  const handleUpdateCredits = async (userId) => {
    const user = users.find(u => u.id === userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/credits`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits: user.newCredits }),
      });
      if (!response.ok) throw new Error('Failed to update credits.');
      // Update the main credits value on success
      setUsers(users.map(u => u.id === userId ? { ...u, credits: Number(u.newCredits) } : u));
      alert('Credits updated successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <div className="content-header">
        <h1>Credit Management</h1>
        <p>View and update user credit balances.</p>
      </div>
      <div className="page-content">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Current Credits</th>
              <th>New Credits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.credits}</td>
                <td><input type="number" value={user.newCredits ?? ''} onChange={(e) => handleCreditChange(user.id, e.target.value)} className="credit-input" /></td>
                <td><button onClick={() => handleUpdateCredits(user.id)} className="action-button update-button">Update</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CreditManagement;