import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import LoginPage from './pages/LoginPage';

// Temporary Google Auth callback handler component
const GoogleAuthCallback = () => {
  React.useEffect(() => {
    // Parse the URL params to get the auth token
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      // Store the token in localStorage or your auth state management
      localStorage.setItem('auth_token', token);
      console.log('Auth token received:', token);
    }
    
    // You might want to add more robust error handling here
  }, []);
  
  // Redirect to home page after processing auth
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
      {/* Add other routes for About, Playground, Studio, Community, etc. */}
      <Route path="/about" element={<div className="p-10 bg-black text-white">About Page</div>} />
      <Route path="/playground" element={<div className="p-10 bg-black text-white">Playground</div>} />
      <Route path="/studio" element={<div className="p-10 bg-black text-white">Studio</div>} />
      <Route path="/community" element={<div className="p-10 bg-black text-white">Community</div>} />
      <Route path="/terms" element={<div className="p-10 bg-black text-white">Terms of Service</div>} />
      <Route path="/privacy" element={<div className="p-10 bg-black text-white">Privacy Policy</div>} />
    </Routes>
  );
}

export default App; 