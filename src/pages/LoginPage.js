import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { initiateGoogleAuth, handleGoogleCallback } from '../lib/auth';

// API URL for authentication
const API_URL = 'https://videora-ai.onrender.com';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
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

  // Check for auth code in URL (for Google callback)
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    
    if (code) {
      // Process the Google auth code
      handleGoogleCallback(code)
        .then(data => {
          console.log('Authentication successful', data);
          navigate('/');
        })
        .catch(error => {
          console.error('Authentication error:', error);
        });
    }
  }, [navigate]);

  // Function to handle Google Sign In
  const handleGoogleSignIn = () => {
    initiateGoogleAuth();
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
          
          <p className="mb-8 text-lg">Sign in or sign up using</p>
          
          {/* Google Sign-In Button */}
          <div 
            className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white rounded-lg p-3 mb-6 cursor-pointer border border-[#333]"
            onClick={handleGoogleSignIn}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            <span>Continue using Google</span>
          </div>
          
          <div className="text-center text-xs text-[#777] mt-12">
            <p>
              By continuing, you agree to Video's 
              <br />
              <Link to="/terms" className="text-[#ED5606] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#ED5606] hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-16 flex justify-end">
          <Link 
            to="/" 
            style={gradientButtonStyle}
            className="flex items-center gap-2 text-white px-6 py-2 text-sm font-medium"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 