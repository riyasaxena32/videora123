import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { initiateGoogleAuth } from '../lib/auth';

// Use the same constants as auth.js for consistency
const REDIRECT_URI = 'https://videora123.vercel.app/auth/google/callback';
const CLIENT_ID = '382914397769-d7u5ssj0tih6cu8lj2ge1ooqvf6gajll.apps.googleusercontent.com';

function LoginPage() {
  const { handleGoogleLogin, handleGoogleAuthCode, isAuthenticated } = useAuth();
  const location = useLocation();
  const [authCode, setAuthCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle redirect from Google OAuth
  useEffect(() => {
    // Check if this is a callback from Google OAuth
    if (location.pathname === '/auth/google/callback') {
      const urlParams = new URLSearchParams(window.location.search);
      const credential = urlParams.get('credential');
      
      if (credential) {
        handleGoogleLogin({ credential });
      }
    }
  }, [location, handleGoogleLogin]);

  // Handle auth code submission
  const handleAuthCodeSubmit = async (e) => {
    e.preventDefault();
    if (!authCode.trim()) return;
    
    setIsLoading(true);
    try {
      await handleGoogleAuthCode(authCode.trim());
    } catch (error) {
      console.error('Auth code login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign-in button click
  const handleGoogleButtonClick = (e) => {
    e.preventDefault();
    initiateGoogleAuth();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#111] rounded-lg border border-[#333]">
        <div className="text-center">
          <img src="/Image2.png" alt="VIDEORA" className="h-10 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-2">Welcome to VIDEORA</h2>
          <p className="text-[#b0b0b0] mb-8">Sign in to continue to your account</p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col space-y-4 items-center">
            {/* Original Google Login Button */}
            <GoogleLogin
              clientId={CLIENT_ID}
              onSuccess={handleGoogleLogin}
              onError={() => console.log('Login Failed')}
              useOneTap
              theme="filled_black"
              shape="pill"
              text="signin_with"
              size="large"
              width="300"
              locale="en"
              redirectUri={REDIRECT_URI}
            />
            
            {/* New Google Auth Link */}
            <button 
              onClick={handleGoogleButtonClick}
              className="flex items-center justify-center px-6 py-2 bg-white text-gray-800 rounded-pill text-sm font-medium w-full max-w-[300px] hover:bg-gray-100 transition-colors"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="h-5 w-5 mr-2"
              />
              Sign in with Google (Redirect)
            </button>
          </div>

          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-[#333]"></div>
            <span className="flex-shrink mx-4 text-[#777]">or</span>
            <div className="flex-grow border-t border-[#333]"></div>
          </div>

          <form onSubmit={handleAuthCodeSubmit} className="space-y-4">
            <div>
              <label htmlFor="authCode" className="block text-sm font-medium text-[#b0b0b0] mb-1">
                Google Authorization Code
              </label>
              <input
                id="authCode"
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="w-full px-4 py-2 bg-[#222] border border-[#444] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="Paste your authorization code here"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !authCode.trim()}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-medium rounded-md transition duration-200"
            >
              {isLoading ? 'Signing in...' : 'Sign in with Auth Code'}
            </button>
          </form>

          <div className="pt-4 text-center">
            <p className="text-sm text-[#777]">
              By continuing, you agree to VIDEORA's Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 