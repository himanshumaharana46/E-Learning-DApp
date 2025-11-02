import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ProtectedRoute({ children, role }) {
  const wallet = localStorage.getItem('wallet');
  const userRole = localStorage.getItem('role');
  const location = useLocation();

  useEffect(() => {
    if (!wallet || userRole !== role) {
      toast.warning('⚠️ Please login first to access this page.');
    }
  }, [wallet, userRole, role, location.pathname]);

  if (!wallet || userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
