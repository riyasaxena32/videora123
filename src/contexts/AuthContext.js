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

  // Function to clear authentication data
  const clearAuthData = () => {
    console.log("🧹 Clearing auth data");
    localStorage.removeItem('token'); // OAuth2 token
    localStorage.removeItem('access_token'); // JWT token
    localStorage.removeItem('userData');
    localStorage.removeItem('authType');
    setUser(null);
    setIsAuthenticated(false);
    console.log("✅ Auth data cleared");
  };

  // Function to fetch user profile
  const fetchUserProfile = async (userId, token) => {
    try {
      setLoading(true);
      console.log("⏳ fetchUserProfile started");
      
      // Get the token like in UserProfile.js
      // If token is provided, use it; otherwise get from localStorage
      const authToken = token || (user?.tokenType === 'jwt' ? 
        localStorage.getItem('access_token') : 
        localStorage.getItem('token'));
      
      if (!authToken) {
        console.error("❌ No auth token available");
        setUser(null);
        setIsAuthenticated(false);
        setAuthChecked(true);
        setLoading(false);
        return;
      }
      
      console.log("🔑 Fetching user profile with token:", authToken.substring(0, 15) + "...");
      
      // Try the first API endpoint
      try {
        console.log("🔄 Making request to profile API (primary URL)");
        const response = await axios.get('https://videora-ai.onrender.com/user/profile', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (response.data && response.data.user) {
          console.log("✅ Profile API response from primary URL:", response.data);
          processProfileData(response.data.user);
          return;
        }
      } catch (primaryUrlError) {
        console.log("⚠️ Primary URL failed, trying alternative URL:", primaryUrlError.message);
      }
      
      // Try alternative URL as backup
      console.log("🔄 Making request to profile API (alternative URL)");
      const response = await axios.get('https://api.videora.ai/user/profile', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      console.log("✅ Profile API response:", response.data);
      
      // Ensure we have user data in the response
      if (!response.data || !response.data.user) {
        console.error("❌ Invalid profile data format:", response.data);
        throw new Error("Invalid profile data format");
      }
      
      processProfileData(response.data.user);
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      console.error("Error details:", error.response ? error.response.data : "No response data");
      
      // Fallback to token data if we have a token
      handleProfileFetchError(token);
    } finally {
      setAuthChecked(true);
      setLoading(false);
      console.log("⏳ fetchUserProfile completed, loading:", false, "isAuthenticated:", isAuthenticated);
    }
  };

  // Helper function to process profile data
  const processProfileData = (profileData) => {
    console.log("👤 Profile data:", profileData);
    
    // Set user data including profile picture
    const userData = {
      ...profileData,
      name: profileData.name || '',
      email: profileData.email || '',
      profilePic: profileData.profilePic || '',
      PhoneNumber: profileData.PhoneNumber || '',
      Address: profileData.Address || '',
      username: profileData.username || ''
    };
    
    console.log("📝 Setting user data:", userData);
    setUser(userData);
    setIsAuthenticated(true);
    
    // Also update userData in localStorage to ensure consistency
    localStorage.setItem('userData', JSON.stringify(userData));
    
    console.log("✅ User profile fetched and state updated successfully");
  };

  // Helper function to handle profile fetch error
  const handleProfileFetchError = (token) => {
    // Fallback to token data if we have a token
    if (token) {
      try {
        console.log("⚠️ Attempting to fallback to token data");
        const decoded = jwtDecode(token);
        console.log("🔍 Decoded token:", decoded);
        
        // Get the stored userData as backup
        const storedUserData = localStorage.getItem('userData');
        let userData;
        
        if (storedUserData) {
          try {
            userData = JSON.parse(storedUserData);
            console.log("📋 Using stored user data:", userData);
          } catch (e) {
            console.error("❌ Error parsing stored user data:", e);
          }
        }
        
        // If we have stored user data, use that; otherwise, use minimal data from the token
        if (userData) {
          setUser(userData);
        } else {
          setUser({
            id: decoded.userId || decoded.id || decoded.sub,
            email: decoded.email,
            name: decoded.name || ''
          });
        }
        
        setIsAuthenticated(true);
        console.log("✅ User authentication set with fallback data");
      } catch (decodeError) {
        console.error("❌ Error decoding token:", decodeError);
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      console.log("❌ No token available for fallback");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Check for authentication on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("🔍 Checking authentication on initial load");
        setLoading(true);
        
        // First check for userData in localStorage
        const storedUserData = localStorage.getItem('userData');
        
        // First check for OAuth2 token
        const oauthToken = localStorage.getItem('token');
        // Then check for JWT access token
        const jwtToken = localStorage.getItem('access_token');
        
        console.log("🔑 Tokens found:", { 
          oauthToken: !!oauthToken, 
          jwtToken: !!jwtToken,
          storedUserData: !!storedUserData
        });
        
        if (oauthToken || jwtToken) {
          // If either token exists, try to fetch the user profile
          console.log("🔄 Tokens found, fetching user profile");
          try {
            // Note: fetchUserProfile will handle setting loading to false
            await fetchUserProfile(null, oauthToken || jwtToken);
          } catch (profileError) {
            console.error("❌ Error fetching profile during auth check:", profileError);
            
            // If profile fetch fails but we have stored user data, use that
            if (storedUserData) {
              try {
                const userData = JSON.parse(storedUserData);
                console.log("📋 Falling back to stored user data:", userData);
                setUser(userData);
                setIsAuthenticated(true);
              } catch (parseError) {
                console.error("❌ Error parsing stored user data:", parseError);
                clearAuthData();
              }
            } else {
              clearAuthData();
            }
            setLoading(false);
          }
        } else {
          // No tokens found
          console.log("❌ No tokens found, clearing auth data");
          clearAuthData();
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Auth check failed:', error);
        clearAuthData();
        setLoading(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

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
      
        localStorage.clear("access_token")
        localStorage.clear("token")

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
  const checkJwtToken = async () => {
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
          await fetchUserProfile(decoded.id, token);
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      authChecked,
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