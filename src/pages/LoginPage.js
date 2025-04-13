import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { createFreeSession, handleGoogleCallback } from '../lib/auth';

// API URL for authentication
const API_URL = 'https://videora-ai.onrender.com';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Gradient button style
  const gradientButtonStyle = {
    background: `
      linear-gradient(0deg, #270E00, #270E00),
      conic-gradient(from 0deg at 50% 38.89%, #ED5606 0deg, #1F1F1F 160.78deg, #ED5606 360deg),
      linear-gradient(180deg, rgba(69, 24, 0, 0.3) 74.07%, rgba(217, 75, 0, 0.3) 100%),
      linear-gradient(270deg, rgba(69, 24, 0, 0.3) 91.54%, rgba(217, 75, 0, 0.3) 100%),
      linear-gradient(90deg, rgba(69, 24, 0, 0.3) 91.54%, rgba(217, 75, 0, 0.3) 100%)
    `,
    border: '1px solid #ED5606',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '9999px'
  };

  useEffect(() => {
    // Check for code parameter in URL (Google OAuth callback)
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    
    if (code) {
      setIsLoading(true);
      handleGoogleCallback(code)
        .then(() => {
          // Redirect to homepage after successful login
          navigate('/');
        })
        .catch(err => {
          console.error("Error processing Google callback:", err);
          setError("Failed to authenticate with Google. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [location, navigate]);

  // Handle creating free session when clicking the "Get Started" button
  const handleFreeSession = async () => {
    setIsLoading(true);
    try {
      await createFreeSession();
      navigate('/');
    } catch (err) {
      console.error("Error creating free session:", err);
      setError("Failed to create a free session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Google Sign-In
  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: '382914397769-d7u5ssj0tih6cu8lj2ge1ooqvf6gajll.apps.googleusercontent.com',
            callback: handleCredentialResponse,
            ux_mode: 'redirect',
            redirect_uri: `https://videora123.vercel.app/auth/google/callback`
          });
          
          // Display the Google Sign-In button
          window.google.accounts.id.renderButton(
            document.getElementById('googleSignInButton'),
            { 
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'center',
              width: 280
            }
          );
        }
      };
    };
    
    loadGoogleScript();
    
    return () => {
      // Clean up the script when component unmounts
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = (response) => {
    // This function will receive the JWT credential from Google
    if (response && response.credential) {
      // The credential is a JWT token that can be sent to your server
      console.log("Google credential received:", response.credential);
      
      // Redirect to the backend auth endpoint with the credential
      window.location.href = `${API_URL}/auth/google?credential=${response.credential}&redirect=https://videora123.vercel.app/auth/google/callback`;
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left side with anime girl image */}
      <div className="flex-1 relative hidden md:block">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute left-10 top-36 z-20">
          <h1 className="text-7xl font-bold tracking-tight mb-6">VIDEORA</h1>
          <h2 className="text-2xl mb-2">Where <span className="text-[#ED5606]">AI</span> Meets Creativity</h2>
        </div>
        <img 
          src="/image 28.png" 
          alt="AI-generated anime character" 
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.jpg';
          }}
        />
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-2/5 flex flex-col p-8 md:p-16 relative">
        {/* Logo in top right on mobile, top left on desktop */}
        <div className="flex justify-between items-center mb-16">
          <Link to="/" className="flex items-center">
            <img src="/Image2.png" alt="VIDEORA" className="h-8" />
          </Link>
          
          <div className="flex space-x-8 text-sm">
            <Link to="/about" className="hover:text-[#ED5606]">About</Link>
            <Link to="/playground" className="hover:text-[#ED5606]">Playground</Link>
            <Link to="/studio" className="hover:text-[#ED5606]">Studio</Link>
            <Link to="/community" className="hover:text-[#ED5606]">Community</Link>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold mb-8">Get started with us</h2>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-2 rounded mb-6">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
            </div>
          ) : (
            <>
              <p className="mb-8 text-lg">Sign in or sign up using</p>
              
              {/* Google Sign-In Button */}
              <div id="googleSignInButton" className="flex justify-center mb-6"></div>
            </>
          )}
          
          <div className="text-center text-xs text-[#777] mt-12">
            <p>
              By continuing, you agree to Video's 
              <br />
              <Link to="/terms" className="text-[#ED5606] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#ED5606] hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-16 flex justify-end">
          <button 
            onClick={handleFreeSession}
            disabled={isLoading}
            style={gradientButtonStyle}
            className="flex items-center gap-2 text-white px-6 py-2 text-sm font-medium"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 