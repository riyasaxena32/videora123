import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
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

  // Function to handle Google Sign In
  const handleGoogleSignIn = () => {
    initiateGoogleAuth();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header with logo and menu */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center">
          <img src="/Logo.png" alt="VIDEORA" className="h-8" />
        </Link>
        
        <button className="text-white">
          <Menu className="w-6 h-6" />
        </button>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-between px-6 py-4">
        {/* Welcome text */}
        <div className="text-center mt-8">
          <h2 className="text-[#ED5606] text-sm mb-1">Welcome to</h2>
          <h1 className="text-4xl font-bold mb-2">VIDEORA</h1>
          <p className="text-sm">Where <span className="text-[#ED5606]">AI</span> Meets Creativity</p>
        </div>
        
        {/* Anime girl image */}
        <div className="flex justify-center my-4 flex-1 items-center">
          <img 
            src="/image 66.png" 
            alt="Anime girl with laptop" 
            className="w-52 object-contain"
          />
        </div>
        
        {/* Login form */}
        <div className="w-full mt-4 mb-8">
          <div className="border border-[#ED5606]/30 rounded-lg p-6 w-full">
            <h2 className="text-lg font-medium mb-6 text-center">Get started with us</h2>
            
            <p className="mb-4 text-sm text-center">Sign in or sign up using</p>
            
            {/* Google Sign-In Button */}
            <button 
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-3 w-full bg-[#270E00] border border-[#ED5606] hover:bg-[#3A1500] text-white rounded-lg py-3 px-4 mb-4 transition-colors"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span>Continue using Google</span>
            </button>
            
            <div className="text-center text-xs text-[#777] mt-4">
              <p>
                By continuing, you agree to Videora's
                <br />
                <Link to="/terms" className="text-[#ED5606] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#ED5606] hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage; 