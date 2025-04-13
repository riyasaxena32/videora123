/**
 * Google Auth Testing Utility
 * 
 * This script provides utility functions for testing Google authentication.
 * 
 * For testing with curl:
 * curl --location 'https://videora-ai.onrender.com/auth/google' \
 *   --header 'Content-Type: application/json' \
 *   --data '{ "code": "YOUR_AUTHORIZATION_CODE" }'
 */

// Get the Google OAuth URL for auth flow
export const getGoogleAuthUrl = () => {
  const redirectUri = window.location.origin + '/auth/google/callback';
  const clientId = '1035965460197-fingmcmt79qnhidf5j3iiubdb7ge2tas.apps.googleusercontent.com';
  
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile&access_type=offline`;
};

// Get curl command for testing in terminal
export const getCurlCommand = (code = 'YOUR_AUTHORIZATION_CODE') => {
  return `curl --location 'https://videora-ai.onrender.com/auth/google' \\
  --header 'Content-Type: application/json' \\
  --data '{ "code": "${code}" }'`;
};

/**
 * Authentication Testing Utility
 * 
 * This script provides utilities for testing backend token generation.
 */

// Mock curl command for testing backend token generation
export const getTokenCurlCommand = (googleCredential = 'YOUR_GOOGLE_CREDENTIAL') => {
  return `curl --location 'https://videora-ai.onrender.com/auth/token' \\
  --header 'Content-Type: application/json' \\
  --data '{ "googleCredential": "${googleCredential}" }'`;
};

// Mock backend response for testing
export const mockBackendTokenResponse = {
  access_token: 'mock_access_token_from_backend',
  token: 'mock_jwt_token_from_backend',
  user: {
    id: 'user_123456',
    name: 'Test User',
    email: 'test@example.com',
    picture: 'https://example.com/avatar.jpg',
    createdAt: new Date().toISOString()
  }
};

// Parse a JWT token (for debugging)
export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT token:', error);
    return null;
  }
}; 