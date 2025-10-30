import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './Admin.css';

const SKELETON_COUNT = 6;

const SEGMENTS = [
  { value: 'all', label: 'All users' },
  { value: 'new7', label: 'New · 7 days' },
  { value: 'new30', label: 'New · 30 days' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Joined · newest' },
  { value: 'oldest', label: 'Joined · oldest' },
  { value: 'username', label: 'Username A–Z' },
  { value: 'email', label: 'Email A–Z' },
];

function differenceInDays(date) {
  if (!date) return Infinity;
  const diff = Date.now() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatDate(date) {
  if (!date) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatRelative(date) {
  if (!date) return 'Unknown';
  const diffMs = Date.now() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays < 1) {
    const diffHours = diffMs / (1000 * 60 * 60);
    return `${Math.max(1, Math.round(diffHours))} hour${diffHours >= 2 ? 's' : ''} ago`;
  }
  if (diffDays < 30) {
    return `${Math.round(diffDays)} day${diffDays >= 2 ? 's' : ''} ago`;
  }
  const diffMonths = diffDays / 30;
  if (diffMonths < 12) {
    return `${Math.round(diffMonths)} month${diffMonths >= 2 ? 's' : ''} ago`;
  }
  const diffYears = diffDays / 365;
  return `${Math.round(diffYears)} year${diffYears >= 2 ? 's' : ''} ago`;
}

function deriveStatus(userDate) {
  const days = differenceInDays(userDate);
  if (days <= 7) {
    return { label: 'New', className: 'status-new' };
  }
  if (days <= 30) {
    return { label: 'Active', className: 'status-active' };
  }
  return { label: 'Established', className: 'status-established' };
}

function exportToCsv(rows) {
  const header = ['ID', 'Username', 'Email', 'User Type', 'Joined'];
  const csvRows = [header.join(',')];
  rows.forEach((row) => {
    csvRows.push([
      row.id,
      JSON.stringify(row.username || ''),
      JSON.stringify(row.email || ''),
      JSON.stringify(row.user_type || ''),
      row.created_at ? new Date(row.created_at).toISOString() : '',
    ].join(','));
  });
  return csvRows.join('\n');
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [segment, setSegment] = useState('all');
  const [sortKey, setSortKey] = useState('recent');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const loadUsers = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
      setError('');
      if (showToast) {
        setActionMessage('User list refreshed.');
      }
    } catch (err) {
      setError(err.message || 'Unable to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers(false);
  }, [loadUsers]);

  useEffect(() => {
    if (!actionMessage) return;
    const timer = setTimeout(() => setActionMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [actionMessage]);

  const metrics = useMemo(() => {
    if (!users.length) {
      return {
        total: 0,
        newWeek: 0,
        newMonth: 0,
        earliest: null,
      };
    }
    let newWeek = 0;
    let newMonth = 0;
    let earliest = new Date();

    users.forEach((user) => {
      const createdAt = user.created_at ? new Date(user.created_at) : null;
      if (!createdAt || Number.isNaN(createdAt.getTime())) return;
      const days = differenceInDays(createdAt);
      if (days <= 7) newWeek += 1;
      if (days <= 30) newMonth += 1;
      if (createdAt < earliest) earliest = createdAt;
    });

    return {
      total: users.length,
      newWeek,
      newMonth,
      earliest,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return users.filter((user) => {
      const createdAt = user.created_at ? new Date(user.created_at) : null;
      const matchesTerm = !term
        || (user.username && user.username.toLowerCase().includes(term))
        || (user.email && user.email.toLowerCase().includes(term))
        || String(user.id).includes(term);

      if (!matchesTerm) return false;

      if (segment === 'new7') {
        return createdAt && differenceInDays(createdAt) <= 7;
      }
      if (segment === 'new30') {
        return createdAt && differenceInDays(createdAt) <= 30;
      }
      return true;
    });
  }, [users, searchTerm, segment]);

  const sortedUsers = useMemo(() => {
    const list = [...filteredUsers];
    const direction = sortDirection === 'asc' ? 1 : -1;

    list.sort((a, b) => {
      const aDate = a.created_at ? new Date(a.created_at) : null;
      const bDate = b.created_at ? new Date(b.created_at) : null;
      switch (sortKey) {
        case 'username':
          return direction * String(a.username || '').localeCompare(String(b.username || ''));
        case 'email':
          return direction * String(a.email || '').localeCompare(String(b.email || ''));
        case 'oldest':
          if (!aDate || !bDate) return 0;
          return direction * (aDate.getTime() - bDate.getTime());
        case 'recent':
        default:
          if (!aDate || !bDate) return 0;
          return direction * (bDate.getTime() - aDate.getTime());
      }
    });

    return list;
  }, [filteredUsers, sortKey, sortDirection]);

  const handleSortChange = useCallback((key) => {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  }, [sortKey]);

  const handleDelete = useCallback(async (userId) => {
    const confirmed = window.confirm('Delete this account? This action cannot be undone.');
    if (!confirmed) return;
    try {
      const response = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete user.');
      }
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setActionMessage('User removed successfully.');
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
      }
    } catch (err) {
      setError(err.message || 'Unable to delete user.');
    }
  }, [selectedUser]);

  const handleCopyEmail = useCallback((email) => {
    if (!email) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => setActionMessage('Email copied to clipboard.'));
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = email;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setActionMessage('Email copied to clipboard.');
    } catch (err) {
      console.warn('Clipboard API unavailable', err);
    }
    document.body.removeChild(textarea);
  }, []);

  const handleExport = useCallback(() => {
    if (!users.length) return;
    try {
      setIsExporting(true);
      const csv = exportToCsv(sortedUsers);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `faceless-users-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setActionMessage('Exported CSV successfully.');
    } catch (err) {
      setError(err.message || 'Export failed.');
    } finally {
      setIsExporting(false);
    }
  }, [sortedUsers, users.length]);

  const renderSkeleton = () => (
    <div className="user-list">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <div className="user-row skeleton" key={`skeleton-${index}`}>
          <div className="user-cell wide">
            <div className="skeleton-line large" />
          </div>
          <div className="user-cell">
            <div className="skeleton-line" />
          </div>
          <div className="user-cell hide-sm">
            <div className="skeleton-line" />
          </div>
          <div className="user-cell hide-sm">
            <div className="skeleton-line" />
          </div>
          <div className="user-cell actions">
            <div className="skeleton-line" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="empty-state">
      <h3>No users match your filters</h3>
      <p>Try broadening your search or clearing the segment filter.</p>
    </div>
  );

  return (
    <div className="user-management-shell">
      <div className="content-header enhanced">
        <div>
          <h1>User directory</h1>
          <p>Monitor adoption, filter new sign-ups, and manage accounts in one place.</p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="btn ghost"
            onClick={() => loadUsers(true)}
            disabled={loading}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={handleExport}
            disabled={isExporting || !users.length}
          >
            {isExporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>
      </div>

      {actionMessage && <div className="action-toast">{actionMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="admin-dashboard-metrics enhanced">
        <div className="metric-card gradient indigo">
          <span className="metric-label">Total users</span>
          <span className="metric-value">{metrics.total}</span>
        </div>
        <div className="metric-card gradient emerald">
          <span className="metric-label">Joined this week</span>
          <span className="metric-value">{metrics.newWeek}</span>
        </div>
        <div className="metric-card gradient sky">
          <span className="metric-label">Joined this month</span>
          <span className="metric-value">{metrics.newMonth}</span>
        </div>
        <div className="metric-card gradient slate">
          <span className="metric-label">Earliest signup</span>
          <span className="metric-value small">{metrics.earliest ? formatDate(metrics.earliest) : '—'}</span>
        </div>
      </div>

      <div className="user-management-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by username, email, or ID…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="segmented-control">
          {SEGMENTS.map((item) => (
            <button
              type="button"
              key={item.value}
              className={segment === item.value ? 'is-active' : ''}
              onClick={() => setSegment(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="sort-control">
          <label htmlFor="sort">Sort</label>
          <select
            id="sort"
            value={sortKey}
            onChange={(event) => handleSortChange(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn ghost"
            onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {loading && renderSkeleton()}

      {!loading && !sortedUsers.length && renderEmptyState()}

      {!loading && sortedUsers.length > 0 && (
        <div className="user-table">
          <div className="user-list-header">
            <div className="user-cell wide">User</div>
            <div className="user-cell">Email</div>
            <div className="user-cell hide-sm">Joined</div>
            <div className="user-cell hide-sm">Role</div>
            <div className="user-cell actions">Actions</div>
          </div>
          <div className="user-list">
            {sortedUsers.map((user) => {
              const createdAt = user.created_at ? new Date(user.created_at) : null;
              const status = deriveStatus(createdAt);
              const initials = user.username
                ? user.username
                  .split(' ')
                  .map((part) => part[0]?.toUpperCase())
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('') || 'U'
                : 'U';

              return (
                <div
                  className="user-row"
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="user-cell wide">
                    <div className="user-name-cell">
                      <div className="avatar-circle small">{initials}</div>
                      <div>
                        <span className="user-name">{user.username || 'Unnamed user'}</span>
                        <span className={`status-pill ${status.className}`}>{status.label}</span>
                      </div>
                    </div>
                  </div>
                  <div className="user-cell">
                    <span className="user-email">{user.email || 'No email on file'}</span>
                  </div>
                  <div className="user-cell hide-sm">
                    <span className="meta-label">Date</span>
                    <span>{formatDate(createdAt)}</span>
                  </div>
                  <div className="user-cell hide-sm">
                    <span className="meta-label">Role</span>
                    <span>{(user.user_type || 'standard').toUpperCase()}</span>
                  </div>
                  <div className="user-cell actions">
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCopyEmail(user.email);
                      }}
                      disabled={!user.email}
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      className="btn danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(user.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedUser && (
        <>
          <div className="user-detail-overlay" onClick={() => setSelectedUser(null)} />
          <aside className="user-detail-panel" aria-label="User details">
            <header>
              <button type="button" className="close" onClick={() => setSelectedUser(null)}>×</button>
              <div className="avatar-circle large">
                {(selectedUser.username || 'U')
                  .split(' ')
                  .map((part) => part[0]?.toUpperCase())
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('') || 'U'}
              </div>
              <h2>{selectedUser.username || 'Unnamed user'}</h2>
              <p>{selectedUser.email || 'No email on file'}</p>
            </header>
            <div className="user-detail-body">
              <div className="detail-row">
                <span>Joined</span>
                <strong>{formatDate(selectedUser.created_at ? new Date(selectedUser.created_at) : null)}</strong>
              </div>
              <div className="detail-row">
                <span>Relative</span>
                <strong>{formatRelative(selectedUser.created_at ? new Date(selectedUser.created_at) : null)}</strong>
              </div>
              <div className="detail-row">
                <span>User ID</span>
                <strong>#{selectedUser.id}</strong>
              </div>
              <div className="detail-row">
                <span>Status</span>
                <strong>{deriveStatus(selectedUser.created_at ? new Date(selectedUser.created_at) : null).label}</strong>
              </div>
              <div className="detail-row">
                <span>Role</span>
                <strong>{(selectedUser.user_type || 'standard').toUpperCase()}</strong>
              </div>
            </div>
            <footer className="user-detail-footer">
              <button
                type="button"
                className="btn ghost"
                onClick={() => handleCopyEmail(selectedUser.email)}
                disabled={!selectedUser.email}
              >
                Copy email
              </button>
              <button
                type="button"
                className="btn danger"
                onClick={() => handleDelete(selectedUser.id)}
              >
                Delete user
              </button>
            </footer>
          </aside>
        </>
      )}
    </div>
  );
}

export default UserManagement;
