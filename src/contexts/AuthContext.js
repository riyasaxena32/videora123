import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

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
        console.log("Checking authentication state on app load");
        
        // First check for JWT token
        const jwtToken = localStorage.getItem('access_token');
        // Then check for OAuth2 token
        const oauthToken = localStorage.getItem('token');
        // Check for user data directly in localStorage
        const storedUserData = localStorage.getItem('userData');
        
        console.log("Tokens in localStorage:", { 
          jwt: jwtToken ? "exists" : "none", 
          oauth: oauthToken ? "exists" : "none",
          userData: storedUserData ? "exists" : "none"
        });
        
        if (jwtToken || oauthToken) {
          // If either token exists, try to fetch the user profile
          await fetchUserProfile(null, jwtToken || oauthToken);
        } else if (storedUserData) {
          // If we have stored user data but no tokens, try using that
          try {
            const userData = JSON.parse(storedUserData);
            console.log("Initializing from stored user data:", userData);
            setUser(userData);
            setIsAuthenticated(true);
          } catch (parseError) {
            console.error("Failed to parse stored user data:", parseError);
            clearAuthData();
          }
        } else {
          // No tokens or user data found
          clearAuthData();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
      } finally {
        setLoading(false);
        setAuthChecked(true);
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
    const token = sessionStorage.getItem('jwt') || localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired
          sessionStorage.removeItem('jwt');
          localStorage.removeItem('access_token');
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
        localStorage.removeItem('access_token');
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
      console.log("Fetching user profile with token:", token ? token.substring(0, 10) + '...' : 'No token');
      
      // If token is provided, use it; otherwise get from localStorage
      const authToken = token || (user?.tokenType === 'jwt' ? 
        localStorage.getItem('access_token') : 
        localStorage.getItem('token'));
      
      if (!authToken) {
        console.error("No auth token available");
        // Try to get user data from localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          console.log("Using user data from localStorage:", userData);
          setUser(userData);
          setIsAuthenticated(true);
          return;
        }
        throw new Error("No authentication token or stored user data");
      }
      
      // Fetch user details from API using axios
      const response = await axios.get('https://videora-ai.onrender.com/user/profile', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const profileData = response.data.user;
      console.log("Received user profile data:", profileData);
      
      // Set user data including profile picture
      setUser({
        ...profileData,
        name: profileData.name || '',
        email: profileData.email || '',
        profilePic: profileData.profilePic || '',
        PhoneNumber: profileData.PhoneNumber || '',
        Address: profileData.Address || '',
        username: profileData.username || ''
      });
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      
      // Try to get user data from localStorage
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          console.log("Falling back to stored user data:", userData);
          setUser(userData);
          setIsAuthenticated(true);
          return;
        } catch (e) {
          console.error("Error parsing stored user data:", e);
        }
      }
      
      // Fallback to token data if we have a token
      if (token) {
        try {
          const decoded = jwtDecode(token);
          console.log("Using decoded token data:", decoded);
          setUser({
            id: decoded.id || decoded.sub,
            email: decoded.email,
            name: decoded.name || (decoded.given_name ? `${decoded.given_name} ${decoded.family_name || ''}`.trim() : ''),
            profilePic: decoded.picture || ''
          });
          setIsAuthenticated(true);
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
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
      checkJwtToken,
      fetchUserProfile, 
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