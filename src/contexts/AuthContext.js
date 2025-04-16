import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  // Check for authentication on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check for OAuth2 token
        const oauthToken = localStorage.getItem('token');
        // Then check for JWT access token
        const jwtToken = localStorage.getItem('access_token');
        
        if (oauthToken) {
          // Handle OAuth2 token
          try {
            // Store user data from OAuth token
            const userData = {
              token: oauthToken,
              tokenType: 'oauth2'
            };
            setUser(userData);
          } catch (error) {
            console.error('Invalid OAuth token:', error);
            clearAuthData();
          }
        } else if (jwtToken) {
          // Handle JWT token
          try {
            const decoded = jwtDecode(jwtToken);
            // Check if JWT token is expired
            if (decoded.exp * 1000 < Date.now()) {
              console.error('JWT token expired');
              clearAuthData();
            } else {
              setUser({
                ...decoded,
                token: jwtToken,
                tokenType: 'jwt'
              });
            }
          } catch (error) {
            console.error('Invalid JWT token:', error);
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('token'); // OAuth2 token
    localStorage.removeItem('access_token'); // JWT token
    localStorage.removeItem('userData');
    localStorage.removeItem('authType');
    setUser(null);
  };

  // Handle Google login success with credential
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      // Google OAuth returns a JWT token
      const decoded = jwtDecode(credentialResponse.credential);
      
      // Store the JWT token
      localStorage.setItem('access_token', credentialResponse.credential);
      localStorage.setItem('authType', 'google');
      
      setUser({
        ...decoded,
        token: credentialResponse.credential,
        tokenType: 'jwt'
      });
      
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      clearAuthData();
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      const token = user?.tokenType === 'jwt' ? 
        localStorage.getItem('access_token') : 
        localStorage.getItem('token');

      // Make API call to logout endpoint with appropriate token
      await fetch('https://api.videora.ai/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      clearAuthData();
      navigate('/login');
    }
  };

  // Modify the checkJwtToken function to fetch profile data after JWT validation
  const checkJwtToken = () => {
    const token = sessionStorage.getItem('jwt');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired
          sessionStorage.removeItem('jwt');
          setUser(null);
          setIsAuthenticated(false);
          setAuthChecked(true);
          return false;
        } else {
          // Valid token - fetch user details from API
          fetchUserProfile(decoded.id, token);
          return true;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        sessionStorage.removeItem('jwt');
        setUser(null);
        setIsAuthenticated(false);
        setAuthChecked(true);
        return false;
      }
    }
    setAuthChecked(true);
    return false;
  };

  // Add a new function to fetch user profile
  const fetchUserProfile = async (userId, token) => {
    try {
      // Fetch user details from API
      const response = await fetch(`https://videora-ai.onrender.com/auth/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        // Set user data including profile picture
        setUser({
          ...userData.user,
          profilePic: userData.user.profilePic || null
        });
        setIsAuthenticated(true);
      } else {
        // API call failed but token is valid
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id,
          email: decoded.email
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Fallback to token data
      const decoded = jwtDecode(token);
      setUser({
        id: decoded.id,
        email: decoded.email
      });
      setIsAuthenticated(true);
    } finally {
      setAuthChecked(true);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
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