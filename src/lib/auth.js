// import { authAPI } from './api';

// Use consistent redirect URLs across the application
const API_URL = 'https://videora-ai.onrender.com';
const REDIRECT_URI = 'https://videora123.vercel.app/auth/google/callback';
const CLIENT_ID = '1035965460197-fingmcmt79qnhidf5j3iiubdb7ge2tas.apps.googleusercontent.com';

/**
 * Initiates Google OAuth flow by redirecting directly to Google auth
 */
export const initiateGoogleAuth = () => {
  const encodedRedirectUri = encodeURIComponent(REDIRECT_URI);
  const scope = encodeURIComponent('email profile openid');
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
};

/**
 * Handles the Google OAuth callback by exchanging the code for tokens
 * @param {string} code - The authorization code from Google
 * @returns {Promise<Object>} - The user data and tokens
 */
export const handleGoogleCallback = async (code) => {
  try {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    console.log('Google authentication response:', data);
    
    // Transform Google user data to the desired format
    let userData;
    if (data.user) {
      userData = data.user;
    } else {
      const googleData = data.decoded || data;
      userData = {
        name: googleData.name || `${googleData.given_name || ''} ${googleData.family_name || ''}`.trim(),
        email: googleData.email,
        profilePic: googleData.picture || googleData.profilePic
      };
    }
    
    // Store tokens and user data
    localStorage.setItem('access_token', data.jwt); // JWT token for API auth
    localStorage.setItem('token', data.access_token); // OAuth token
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('authType', 'google');
    
    return { ...data, user: userData };
  } catch (error) {
    console.error('Google authentication error:', error);
    throw error;
  }
};

/**
 * Gets the current user data from localStorage
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Gets the current authentication token (JWT)
 * @returns {string|null}
 */
export const getAuthToken = () => {
  return localStorage.getItem('access_token'); // Use JWT token for API auth
};

/**
 * Gets the OAuth2 access token specifically
 * @returns {string|null}
 */
export const getOAuthToken = () => {
  return localStorage.getItem('token'); // Use OAuth token for Google services
};

/**
 * Creates an authenticated fetch request with the access token
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - The fetch response
 */
export const authenticatedFetch = async (url, options = {}) => {
  const jwt = getAuthToken();
  
  if (!jwt) {
    throw new Error('No JWT token available. User may not be authenticated.');
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${jwt}`
  };
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });
}; 