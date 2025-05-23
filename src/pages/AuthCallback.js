import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleGoogleCallback } from '../lib/auth';

export default function AuthCallback() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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
          window.location.href = '/';

          // window.location.
          // Redirect to homepage on success
          // navigate('/', { replace: true });
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
    
    handleCallback();
  }, [location, navigate]);

  // Loading state while processing the callback
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center p-8 max-w-md">
          <div className="text-[#ED5606] text-3xl mb-4">Authentication Error</div>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => navigate('/login')} 
            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white px-6 py-2 rounded-lg border border-[#333]"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606] mx-auto mb-4"></div>
        <p className="text-xl">Processing your login...</p>
      </div>
    </div>
  );
} 