import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for authentication on initial load
  useEffect(() => {
    // First check for userData in localStorage (new auth method)
    const userData = localStorage.getItem('userData');
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Invalid user data', error);
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('authType');
        setUser(null);
      }
    } else if (token) {
      // Fallback to old token-based auth
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('access_token');
          setUser(null);
        } else {
          setUser(decoded);
        }
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('access_token');
        setUser(null);
      }
    }
    
    setLoading(false);
  }, []);

  // Handle Google login success with credential
  const handleGoogleLogin = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      // Store the credential in localStorage
      localStorage.setItem('access_token', credentialResponse.credential);
      setUser(decoded);
      
      // Navigate to home page after successful login
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      // Make API call to logout endpoint
      await fetch('https://api.videora.ai/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if needed
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear all auth-related localStorage items
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('userData');
      localStorage.removeItem('authType');
      
      setUser(null);
      navigate('/login');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      handleGoogleLogin,
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