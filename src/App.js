import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/loading" element={<div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606] mx-auto mb-4"></div>
          <p className="text-xl">Connecting to Google...</p>
        </div>
      </div>} />
      <Route path="/auth/google/callback" element={<LoginPage />} />
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