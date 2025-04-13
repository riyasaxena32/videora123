// API service for authentication
const API_URL = 'https://videora-ai.onrender.com';

export const authAPI = {
  // Google login with authorization code
  googleLogin: async (code) => {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }
}; 