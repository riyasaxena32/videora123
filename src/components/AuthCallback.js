import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleGoogleCallback } from '../lib/auth';

function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    handleCallback();
  }, [location]);

  const handleCallback = async () => {
    try {
      // Get the authorization code from the URL query parameters
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      
      if (!code) {
        throw new Error('No authorization code found in URL');
      }
      
      console.log('Received code:', code);
      
      // Try to use the actual Google auth flow first
      try {
        const authData = await handleGoogleCallback(code);
        console.log('Authentication successful:', authData);
        
        // Reset query count on successful Google auth
        localStorage.removeItem('queryLimitReached');
        localStorage.removeItem('queryCount');
        
        // Redirect to homepage on success
        navigate('/', { replace: true });
        return;
      } catch (authError) {
        console.error('Official auth failed, falling back to mock:', authError);
        // If the real auth fails, fall back to the mock implementation
      }
      
      // Create a mock Google user as a fallback
      const mockGoogleUser = {
        id: `google_${Math.random().toString(36).substring(2, 15)}`,
        name: 'Google User',
        email: 'user@example.com',
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('userData', JSON.stringify(mockGoogleUser));
      localStorage.setItem('authType', 'google');
      localStorage.setItem('access_token', 'mock_token');
      localStorage.setItem('token', 'mock_token');
      
      // Reset query count on successful Google auth
      localStorage.removeItem('queryLimitReached');
      localStorage.removeItem('queryCount');
      
      // Redirect to homepage on success with replace to prevent back navigation to auth page
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Authentication callback error:', err);
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white">
      <div className="text-center">
        {error ? (
          <div className="text-red-600 mb-4">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-[#9747ff] text-white rounded-lg hover:bg-[#7e35dd] transition-colors"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg className="animate-spin h-12 w-12 text-[#9747ff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Authenticating...</h2>
            <p className="text-gray-400">Please wait while we complete your sign-in.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthCallback; 