import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AdminProtectedRoute = () => {
  const [status, setStatus] = useState({ loading: true, allowed: false });
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      try {
        const response = await fetch('/api/check-session');
        if (!response.ok) {
          throw new Error('No active session');
        }
        const data = await response.json();
        if (isMounted && data?.user?.user_type === 'admin') {
          setStatus({ loading: false, allowed: true });
        } else if (isMounted) {
          setStatus({ loading: false, allowed: false });
        }
      } catch (error) {
        if (isMounted) {
          setStatus({ loading: false, allowed: false });
        }
      }
    };

    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  if (status.loading) {
    return <div className="admin-loading">Checking access…</div>;
  }

  if (!status.allowed) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
