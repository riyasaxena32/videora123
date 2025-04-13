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
    
    // For testing/demo purposes in development, create a mock user on failure
    if (process.env.NODE_ENV === 'development') {
      console.log('Creating mock user for development environment');
      const mockUser = {
        id: `google_mock_${Math.random().toString(36).substring(2, 15)}`,
        name: 'Mock Google User',
        email: 'mock@example.com',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('userData', JSON.stringify(mockUser));
      localStorage.setItem('authType', 'google');
      localStorage.setItem('access_token', 'mock_token');
      localStorage.setItem('token', 'mock_token');
      
      return { user: mockUser, token: 'mock_token' };
    }
    
    throw error;
  }
}; 