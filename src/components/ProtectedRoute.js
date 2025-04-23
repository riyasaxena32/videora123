import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated, authChecked } = useAuth();

  // Add debug logging to understand the component's behavior
  useEffect(() => {
    console.log('ProtectedRoute state:', { user, loading, isAuthenticated, authChecked });
  }, [user, loading, isAuthenticated, authChecked]);

  // Show loading state until auth check is complete
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
        <div className="ml-4">Loading user data...</div>
      </div>
    );
  }

  // Only redirect if auth check is complete
  if (authChecked && (!user || !isAuthenticated)) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 