import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import LoginPage from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import CreatorPage from './pages/CreatorPage';
import VideoPage from './pages/VideoPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/google/callback" element={<AuthCallback />} />
      <Route path="/creator/:creatorId" element={<CreatorPage />} />
      <Route path="/video/:videoId" element={<VideoPage />} />
      <Route path="/profile" element={<ProfilePage />} />
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