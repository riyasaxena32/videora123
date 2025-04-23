import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { 
      isAuthenticated: !!user, 
      loading, 
      user: user ? { name: user.name, email: user.email } : null,
      path: location.pathname
    });
  }, [user, loading, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute - Redirecting to login, no user found');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - Rendering protected content');
  return children;
};

export default ProtectedRoute; 