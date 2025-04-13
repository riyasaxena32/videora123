// import { authAPI } from './api';

const API_URL = 'https://videora-ai.onrender.com';

/**
 * Handle Google authentication with authorization code
 * This supports both the OAuth redirect flow and the direct curl command:
 * 
 * curl --location 'https://videora-ai.onrender.com/auth/google' \
 *   --header 'Content-Type: application/json' \
 *   --data '{ "code": "YOUR_AUTHORIZATION_CODE" }'
 */
export const handleGoogleCallback = async (code) => {
  try {
    console.log('Processing authorization code');
    
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Auth error response:', errorText);
      throw new Error(`Authentication failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Google authentication successful');
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', data.access_token || '');
    localStorage.setItem('token', data.token || '');
    
    if (data.user) {
      localStorage.setItem('userData', JSON.stringify(data.user));
    } else if (process.env.NODE_ENV === 'development') {
      // Create mock user if not returned (development only)
      console.log('Creating mock user for development');
      const mockUser = {
        id: `google_${Math.random().toString(36).substring(2, 15)}`,
        name: 'Google User',
        email: 'user@example.com',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('userData', JSON.stringify(mockUser));
    }
    
    localStorage.setItem('authType', 'google');
    
    // Reset query limits if applicable
    localStorage.removeItem('queryLimitReached');
    localStorage.removeItem('queryCount');
    
    return data;
  } catch (error) {
    console.error('Google authentication error:', error);
    
    // For testing/demo purposes, create a mock user even on failure in development
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

// Method to directly login using auth code (for curl command)
export const directGoogleLogin = async (code) => {
  try {
    console.log('Attempting direct Google login with code:', code);
    
    // Use the same endpoint as handleGoogleCallback
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Direct login error response:', errorText);
      throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Direct Google login response:', data);
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', data.access_token || '');
    localStorage.setItem('token', data.token || '');
    
    if (data.user) {
      localStorage.setItem('userData', JSON.stringify(data.user));
    } else {
      // Create mock user if not returned
      const mockUser = {
        id: `google_${Math.random().toString(36).substring(2, 15)}`,
        name: 'Google User',
        email: 'user@example.com',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('userData', JSON.stringify(mockUser));
    }
    
    localStorage.setItem('authType', 'google');
    
    // Reset query limits if applicable
    localStorage.removeItem('queryLimitReached');
    localStorage.removeItem('queryCount');
    
    return data;
  } catch (error) {
    console.error('Direct Google login error:', error);
    
    // For testing/demo purposes, create a mock user even on failure
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
      localStorage.removeItem('queryLimitReached');
      localStorage.removeItem('queryCount');
      
      return { user: mockUser, token: 'mock_token' };
    }
    
    throw error;
  }
}; 