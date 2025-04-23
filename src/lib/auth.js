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
      const errorText = await response.text();
      console.error('Authentication error response:', errorText);
      throw new Error(`Authentication failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Google authentication response:', data);
    
    // Normalize token structure to ensure we always have both access_token and token
    const accessToken = data.access_token || data.token;
    const token = data.token || data.access_token;
    
    if (!accessToken) {
      console.error('No access_token or token received from API.');
      throw new Error('No access_token received from API');
    }
    
    // Transform Google user data to the desired format
    let userData;
    if (data.user) {
      // If API already returns user in the right format
      userData = data.user;
    } else {
      // If API returns decoded JWT or Google data, transform it
      const googleData = data.decoded || data;
      userData = {
        name: googleData.name || `${googleData.given_name || ''} ${googleData.family_name || ''}`.trim(),
        email: googleData.email,
        profilePic: googleData.picture || googleData.profilePic
      };
    }
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('authType', 'google');
    
    console.log('Access token stored:', accessToken);
    console.log('User data stored:', userData);
    
    // Return a consistent object structure
    return { 
      access_token: accessToken,
      token: token, 
      user: userData 
    };
  } catch (error) {
    console.error('Google authentication error:', error);
    
    // For testing/demo purposes in development, create a mock user on failure
    if (process.env.NODE_ENV === 'development') {
      console.log('Creating mock user for development environment');
      const mockUser = {
        name: 'Mock Google User',
        email: 'mock@example.com',
        profilePic: 'https://ui-avatars.com/api/?name=Mock+User&background=random'
      };
      
      const mockToken = 'mock_token_' + Date.now();
      localStorage.setItem('userData', JSON.stringify(mockUser));
      localStorage.setItem('authType', 'google');
      localStorage.setItem('access_token', mockToken);
      localStorage.setItem('token', mockToken);
      
      return { 
        user: mockUser, 
        token: mockToken,
        access_token: mockToken
      };
    }
    
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