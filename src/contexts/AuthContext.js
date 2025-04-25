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
    // This function is not needed anymore as we'll check status from user profile
    // But we'll keep it as a no-op for compatibility
    console.log('Using user profile data for follow status instead');
  };
  
  // Check if a creator is followed
  const isCreatorFollowed = (creatorId) => {
    // Check if the user has a following list
    if (!user || !creatorId) return false;
    
    // Handle different possible structures of the following data
    // 1. If following is an array of IDs
    if (Array.isArray(user.following)) {
      return user.following.includes(creatorId);
    }
    
    // 2. If following is an array of objects with _id field
    if (Array.isArray(user.followingCreators)) {
      return user.followingCreators.some(creator => creator._id === creatorId);
    }
    
    // 3. If there's a specific format in the API response
    if (user.creators && Array.isArray(user.creators.following)) {
      return user.creators.following.includes(creatorId);
    }
    
    // Log the user object to debug followed creators structure
    console.log('User profile structure for debugging follow status:', 
      JSON.stringify({
        hasFollowing: !!user.following,
        hasFollowingCreators: !!user.followingCreators,
        hasCreators: !!user.creators,
        userKeys: Object.keys(user)
      })
    );
    
    return false;
  };

  // Toggle follow status for a creator (both follow and unfollow)
  const toggleFollowCreator = async (creatorId) => {
    if (!creatorId || !user) return { success: false };
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false };
      
      console.log(`Attempting to toggle follow for creator ${creatorId}`);
      
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
        console.log('Toggle follow response:', data);
        
        // Update user profile after toggle
        await fetchUserProfile();
        
        // Check if the creator is now in the followed list
        const nowFollowing = isCreatorFollowed(creatorId);
        
        console.log(`Creator ${creatorId} followed status after toggle: ${nowFollowing}`);
        
        // Return whether user is now following
        return { 
          success: true, 
          isFollowing: nowFollowing
        };
      }
      
      console.error('API response not OK when toggling follow status');
      return { success: false };
    } catch (error) {
      console.error('Error toggling follow status:', error);
      return { success: false };
    }
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
      
      // Log profile data structure to debug following information
      console.log('User profile data structure:', {
        hasFollowing: !!profileData.following,
        hasFollowingCreators: !!profileData.followingCreators,
        hasCreators: !!profileData.creators,
        userKeys: Object.keys(profileData),
        following: profileData.following,
        followingCreators: profileData.followingCreators,
        creators: profileData.creators
      });
      
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
      isCreatorFollowed,
      toggleFollowCreator,
      fetchFollowedCreators // keep for compatibility
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