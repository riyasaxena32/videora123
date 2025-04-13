import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleCallback } from '../lib/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for token in localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Invalid user data', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Handle Google login success from Google button
  const handleGoogleLogin = (credentialResponse) => {
    try {
      // Store the credential in localStorage
      localStorage.setItem('token', credentialResponse.credential);
      
      // For the @react-oauth/google library credential format
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const userData = JSON.parse(jsonPayload);
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      
      // Navigate to home page after successful login
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  // Handle Google login with authorization code
  const handleGoogleAuthCode = async (code) => {
    try {
      setLoading(true);
      const response = await handleGoogleCallback(code);
      
      // User data should already be stored in localStorage by handleGoogleCallback
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      // Navigate to home page after successful login
      navigate('/');
      return response;
    } catch (error) {
      console.error('Google auth code login failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('userData');
    localStorage.removeItem('authType');
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin h-10 w-10 border-4 border-[#9747ff] rounded-full border-t-transparent"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      handleGoogleLogin, 
      handleGoogleAuthCode, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 