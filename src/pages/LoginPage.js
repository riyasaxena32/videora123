import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { initiateGoogleAuth } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';

// API URL for authentication
const API_URL = 'https://videora-ai.onrender.com';

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

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

  // Function to handle Google Sign In
  const handleGoogleSignIn = () => {
    initiateGoogleAuth();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with navigation */}
      <header className="flex items-center justify-between px-6 py-3 w-full">
        <Link to="/" className="flex items-center">
          <img src="/Logo.png" alt="VIDEORA" className="h-8" />
        </Link>
        
        <div className="hidden md:flex space-x-8 text-sm">
          <Link to="/about" className="hover:text-[#ED5606]">About</Link>
          <Link to="/playground" className="hover:text-[#ED5606]">Playground</Link>
          <Link to="/studio" className="hover:text-[#ED5606]">Studio</Link>
          <Link to="/community" className="hover:text-[#ED5606]">Community</Link>
        </div>
        
        <Link 
          to="/" 
          style={gradientButtonStyle}
          className="flex items-center gap-2 text-white px-6 py-2 text-sm font-medium"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>
      
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-10 md:py-20">
        {/* Left content with text and anime girl */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-center justify-center">
          <div className="mb-8 text-center md:text-center">
            <h2 className="text-[#ED5606] text-xl mb-2">Welcome to</h2>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">VIDEORA</h1>
            <p className="text-xl">Where <span className="text-[#ED5606]">AI</span> Meets Creativity</p>
          </div>
          
          <div className="flex justify-center my-4">
            <img 
              src="/image 66.png" 
              alt="Anime girl with laptop" 
              className="w-64 md:w-80 object-contain"
            />
          </div>
        </div>
        
        {/* Right side with login form */}
        <div className="w-full md:w-2/5 mt-8 md:mt-0">
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-8 max-w-md mx-auto md:mr-0">
            <h2 className="text-xl font-medium mb-8 text-center">Get started with us</h2>
            
            <p className="mb-4 text-sm text-center">Sign in or sign up using</p>
            
            {/* Google Sign-In Button */}
            <button 
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-3 w-full bg-[#270E00] border border-[#ED5606] hover:bg-[#3A1500] text-white rounded-lg py-3 px-4 mb-6 transition-colors"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span>Continue using Google</span>
            </button>
            
            <div className="text-center text-xs text-[#777] mt-6">
              <p>
                By continuing, you agree to Videora's
                <br />
                <Link to="/terms" className="text-[#ED5606] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#ED5606] hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 