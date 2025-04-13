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