/**
 * Google Auth Testing Utility
 * 
 * This script provides utilities for testing the Google authentication.
 */

// Use the same constants as auth.js for consistency
const API_URL = 'https://videora-ai.onrender.com';
const REDIRECT_URI = 'https://videora123.vercel.app/auth/google/callback';
const CLIENT_ID = '382914397769-d7u5ssj0tih6cu8lj2ge1ooqvf6gajll.apps.googleusercontent.com';

/**
 * Get the Google OAuth URL for testing
 */
export const getGoogleAuthUrl = () => {
  const encodedRedirectUri = encodeURIComponent(REDIRECT_URI);
  return `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=email%20profile%20openid&access_type=offline&prompt=consent`;
};

/**
 * Get a curl command for testing authentication via command line
 */
export const getCurlCommand = (code = 'YOUR_AUTHORIZATION_CODE') => {
  return `curl --location '${API_URL}/auth/google' \\
  --header 'Content-Type: application/json' \\
  --data '{ "code": "${code}" }'`;
}; 