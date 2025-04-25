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
  const [followedCreators, setFollowedCreators] = useState([]);
  const navigate = useNavigate();

  // Check for authentication on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check for OAuth2 token
        const oauthToken = localStorage.getItem('token');
        // Then check for JWT access token
        const jwtToken = localStorage.getItem('access_token');
        
        if (oauthToken || jwtToken) {
          // If either token exists, try to fetch the user profile
          await fetchUserProfile(null, oauthToken || jwtToken);
          
          // Also fetch followed creators
          fetchFollowedCreators();
        } else {
          // No tokens found
          clearAuthData();
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

  // Fetch followed creators
  const fetchFollowedCreators = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      
      if (!token) return;
      
      const response = await fetch('https://videora-ai.onrender.com/api/creator/followed', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Store the creator IDs from the response
        setFollowedCreators(data.followedCreators || []);
      }
    } catch (error) {
      console.error('Failed to fetch followed creators:', error);
    }
  };
  
  // Check if a creator is followed
  const isCreatorFollowed = (creatorId) => {
    // First check if the user object has following property
    if (user && user.following && Array.isArray(user.following)) {
      // Check if creator is in user's following array
      return user.following.some(followedCreator => 
        // Handle both object with _id or simple id in the array
        (followedCreator._id && followedCreator._id === creatorId) || 
        followedCreator === creatorId
      );
    }
    
    // Fallback to the followedCreators state
    return followedCreators.includes(creatorId);
  };
  
  // Add a creator to followed list
  const addFollowedCreator = (creatorId) => {
    if (!followedCreators.includes(creatorId)) {
      setFollowedCreators(prev => [...prev, creatorId]);
    }
  };
  
  // Remove a creator from followed list
  const removeFollowedCreator = (creatorId) => {
    setFollowedCreators(prev => prev.filter(id => id !== creatorId));
  };

  // Function to follow a creator
  const followCreator = async (creatorId) => {
    if (!creatorId) return false;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      const response = await fetch(`https://videora-ai.onrender.com/api/creator/${creatorId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Check if the response indicates follow or unfollow action
        if (data.message === "Unfollowed") {
          // If unfollowed, remove from list
          removeFollowedCreator(creatorId);
          
          // Also update the user's following array if it exists
          if (user && user.following) {
            setUser(prevUser => ({
              ...prevUser,
              following: prevUser.following.filter(item => {
                if (typeof item === 'object' && item._id) {
                  return item._id !== creatorId;
                }
                return item !== creatorId;
              })
            }));
          }
        } else {
          // If followed, add to list
          addFollowedCreator(creatorId);
          
          // Also update the user's following array if it exists
          if (user) {
            setUser(prevUser => ({
              ...prevUser,
              following: [
                ...(prevUser.following || []),
                // Add as an object with _id to match schema format
                { _id: creatorId, ref: 'creator' }
              ]
            }));
          }
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error toggling follow status:', error);
      return false;
    }
  };
  
  // Function to unfollow a creator - Just an alias to followCreator for backward compatibility
  const unfollowCreator = async (creatorId) => {
    // Use the same endpoint as it handles both follow and unfollow
    return await followCreator(creatorId);
  };

  const clearAuthData = () => {
    localStorage.removeItem('token'); // OAuth2 token
    localStorage.removeItem('access_token'); // JWT token
    localStorage.removeItem('userData');
    localStorage.removeItem('authType');
    setUser(null);
    setFollowedCreators([]);
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

  // Add a new function to fetch user profile
  const fetchUserProfile = async (userId, token) => {
    try {
      // Get the token like in UserProfile.js
      // If token is provided, use it; otherwise get from localStorage
      const authToken = token || (user?.tokenType === 'jwt' ? 
        localStorage.getItem('access_token') : 
        localStorage.getItem('token'));
      
      // Fetch user details from API using axios
      const response = await axios.get('https://videora-ai.onrender.com/user/profile', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const profileData = response.data.user;
      
      // Set user data including profile picture and following list
      setUser({
        ...profileData,
        name: profileData.name || '',
        email: profileData.email || '',
        profilePic: profileData.profilePic || '',
        PhoneNumber: profileData.PhoneNumber || '',
        Address: profileData.Address || '',
        username: profileData.username || '',
        following: profileData.following || [] // Make sure to capture the following list
      });
      
      // If we have following data in the profile, update the followedCreators state
      if (profileData.following && Array.isArray(profileData.following)) {
        const followedIds = profileData.following.map(item => 
          typeof item === 'object' && item._id ? item._id : item
        );
        setFollowedCreators(followedIds);
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Fallback to token data if we have a token
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser({
            id: decoded.id,
            email: decoded.email
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
      isAuthenticated: !!user,
      followedCreators,
      isCreatorFollowed,
      followCreator,
      unfollowCreator,
      fetchFollowedCreators
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