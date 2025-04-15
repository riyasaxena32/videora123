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
    const userData = localStorage.getItem('userData');
    const jwt = localStorage.getItem('access_token');
    
    if (userData && jwt) {
      try {
        // Verify JWT is valid
        const decoded = jwtDecode(jwt);
        if (decoded.exp * 1000 < Date.now()) {
          // Token expired, clear auth
          logout();
        } else {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Invalid token', error);
        logout();
      }
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  // Handle logout
  const logout = () => {
    // Clear only the specific items we're using
    localStorage.removeItem('access_token'); // JWT
    localStorage.removeItem('token'); // OAuth token
    localStorage.removeItem('userData');
    localStorage.removeItem('authType');
    
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
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