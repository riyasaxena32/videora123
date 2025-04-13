// import { authAPI } from './api';

// Use consistent redirect URLs across the application
const API_URL = 'https://videora-ai.onrender.com';
const REDIRECT_URI = 'https://videora123.vercel.app/auth/google/callback';
const CLIENT_ID = '382914397769-d7u5ssj0tih6cu8lj2ge1ooqvf6gajll.apps.googleusercontent.com';

/**
 * Initiates Google OAuth flow with a loading screen
 * Redirects user first to loading screen, then to Google auth
 */
export const initiateGoogleAuth = () => {
  // First navigate to the loading screen
  window.location.href = "/auth/loading";

  // Then set a timeout to redirect to Google auth
  setTimeout(() => {
    const encodedRedirectUri = encodeURIComponent(REDIRECT_URI);
    window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=email%20profile%20openid&access_type=offline&prompt=consent`;
  }, 1000); // Small delay to show loading screen
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
    // Store tokens in localStorage
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('userData', JSON.stringify(data.user));
    localStorage.setItem('authType', 'google');
    
    return data;
  } catch (error) {
    console.error('Google authentication error:', error);
    throw error;
  }
};

/**
 * Creates a free session for users without authentication
 * @returns {Promise<Object>} - Mock user data for free session
 */
export const createFreeSession = async () => {
  try {
    // Create a free session user
    const freeUser = {
      id: `free_${Math.random().toString(36).substring(2, 15)}`,
      name: 'Free User',
      email: 'free@videora.app',
      createdAt: new Date().toISOString(),
      isFree: true
    };
    
    // Store the free user in localStorage
    localStorage.setItem('userData', JSON.stringify(freeUser));
    localStorage.setItem('authType', 'free');
    localStorage.setItem('access_token', 'free_token');
    
    // Set query limits for free users
    localStorage.setItem('queryCount', '0');
    
    return freeUser;
  } catch (error) {
    console.error('Free session creation error:', error);
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
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Gets the OAuth2 access token specifically
 * @returns {string|null}
 */
export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

/**
 * Creates an authenticated fetch request with the access token
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - The fetch response
 */
export const authenticatedFetch = async (url, options = {}) => {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    throw new Error('No access token available. User may not be authenticated.');
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`
  };
  
  return fetch(url, {
    ...options,
    headers
  });
}; 