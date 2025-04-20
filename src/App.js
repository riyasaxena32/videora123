import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import LoginPage from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import CreatorPage from './pages/CreatorPage';
import VideoPage from './pages/VideoPage';
import UserProfile from './pages/UserProfile';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/google/callback" element={<AuthCallback />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/create" element={
          <ProtectedRoute>
            <CreatePage />
          </ProtectedRoute>
        } />
        <Route path="/creator/:creatorId" element={
          <ProtectedRoute>
            <CreatorPage />
          </ProtectedRoute>
        } />
        <Route path="/video/:videoId" element={
          <ProtectedRoute>
            <VideoPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        {/* Static Pages */}
        <Route path="/about" element={<div className="p-10 bg-black text-white">About Page</div>} />
        <Route path="/playground" element={<div className="p-10 bg-black text-white">Playground</div>} />
        <Route path="/studio" element={
          <ProtectedRoute>
            <div className="p-10 bg-black text-white">Studio</div>
          </ProtectedRoute>
        } />
        <Route path="/community" element={<div className="p-10 bg-black text-white">Community</div>} />
        <Route path="/terms" element={<div className="p-10 bg-black text-white">Terms of Service</div>} />
        <Route path="/privacy" element={<div className="p-10 bg-black text-white">Privacy Policy</div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App; 