import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, User, Bell, ChevronRight, Menu, Heart, Share, MessageSquare, ThumbsUp, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import VideoCustomizationForm from '../components/VideoCustomizationForm';

function VideoPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const { logout, user } = useAuth();
  const [videoSettings, setVideoSettings] = useState({
    style: 'original',
    prompt: '',
    caption: '',
    voiceUrl: ''
  });

  // Custom button styles
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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format date to show how long ago
  const formatDateAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  };

  useEffect(() => {
    // Fetch video data from API
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First fetch all videos
        const response = await fetch('https://videora-ai.onrender.com/videos/get-videos');
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        
        const data = await response.json();
        const videos = data.video || [];
        
        // Find the specific video
        const foundVideo = videos.find(v => v._id === videoId);
        
        if (!foundVideo) {
          throw new Error('Video not found');
        }
        
        // Set the video
        setVideo(foundVideo);
        
        // Set related videos (all other videos)
        setRelatedVideos(videos.filter(v => v._id !== videoId));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4 text-xl">Error: {error}</div>
        <button 
          className="bg-[#1c1c1c] hover:bg-[#222] text-white rounded px-4 py-2"
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="text-white mb-4 text-xl">Video not found</div>
        <button 
          className="bg-[#1c1c1c] hover:bg-[#222] text-white rounded px-4 py-2"
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] w-full bg-black">
        <div className="flex items-center gap-3">
          <button 
            className="p-1 hover:bg-[#1a1a1a] rounded-md transition-colors" 
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center">
            <img src="/VIDEORA.svg" alt="VIDEORA" className="h-4" />
          </Link>
        </div>
        
        {/* Center navigation links */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <nav className="flex items-center gap-8">
            {["Home", "Trending", "Genre", "Browse"].map((item) => (
              <a
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={`text-sm font-medium transition-colors ${
                  item === "Home" ? "text-white" : "text-[#b0b0b0] hover:text-white"
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            style={gradientButtonStyle}
            className="flex items-center gap-2 text-white px-4 py-1.5 text-sm transition-colors font-medium"
            onClick={() => navigate('/create')}
          >
            Create <Plus className="w-4 h-4" />
          </button>
          
          {/* Profile dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button 
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#270E00] hover:border-[#ED5606] transition-colors focus:outline-none"
              onClick={toggleProfileDropdown}
            >
              <img
                src={user?.profilePic || "/user-avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
            
            {/* Dropdown menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#111111] border border-[#333] rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="py-2">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#1A1A1A] transition-colors">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    User Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#1A1A1A] transition-colors"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <LogOut className="w-4 h-4" />
                    </div>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button className="w-9 h-9 flex items-center justify-center bg-[#270E00] hover:bg-[#3a1500] rounded-full transition-colors">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Left Sidebar - Related Videos List */}
        <div className="w-[120px] md:w-[220px] border-r border-[#222] overflow-y-auto bg-black hidden md:block">
          <div className="py-1">
            {relatedVideos.map((relVideo) => (
              <div 
                key={relVideo._id}
                className="relative cursor-pointer mb-2"
                onClick={() => navigate(`/video/${relVideo._id}`)}
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={relVideo.thumbnailLogoUrl || "/image 28.png"} 
                    alt={relVideo.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/image 28.png";
                    }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 px-2">
                  <p className="text-[10px] text-white truncate">{relVideo.name}</p>
                </div>
                <div className="absolute top-1 right-1 bg-black/70 text-[8px] px-1 rounded text-white">
                  {Math.floor(relVideo.duration / 60)}:{String(relVideo.duration % 60).padStart(2, '0')}
                </div>
                <div className="absolute bottom-6 left-1 text-[8px] bg-black/70 px-1 rounded text-white">
                  {relVideo.category}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Video Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player */}
          <div className="w-full bg-black relative" style={{ maxHeight: '70vh' }}>
            {video.videoUrl ? (
              <VideoPlayer
                videoUrl={video.videoUrl}
                style={videoSettings.style}
                prompt={videoSettings.prompt}
                caption={videoSettings.caption}
                voiceUrl={videoSettings.voiceUrl}
                onVideoProcessed={(url) => {
                  console.log('Video processed:', url);
                  // You can update the video object if needed
                }}
              />
            ) : (
              <img 
                src={video.thumbnailLogoUrl || "/image 28.png"} 
                alt={video.name}
                className="w-full h-full object-cover"
                style={{ maxHeight: '70vh' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/image 28.png";
                }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Add play button overlay if needed */}
            </div>
          </div>

          {/* Video Info */}
          <div className="p-6 max-w-[1200px] mx-auto">
            {/* Video Customization Form */}
            {video.videoUrl && (
              <VideoCustomizationForm 
                initialValues={videoSettings}
                onApplyChanges={(newSettings) => setVideoSettings(newSettings)}
              />
            )}
            
            {/* Days ago indicator */}
            <div className="text-xs text-gray-400 mb-2">
              {formatDateAgo(video.uploadDate)}
            </div>
            
            {/* Video Title */}
            <div className="mb-4">
              <h1 className="text-xl font-bold flex items-center gap-2 mb-1">
                {video.name} 
                {video.category && (
                  <>
                    <span className="text-xs font-normal">•</span> 
                    <span className="text-sm font-normal">{video.category}</span>
                  </>
                )}
              </h1>
            </div>
            
            {/* Creator Info and Action Buttons */}
            <div className="flex items-center justify-between mb-8">
              {/* Creator */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#222]">
                  <img 
                    src="/user-avatar.png" 
                    alt={video.uploadedBy}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium">{video.uploadedBy}</h3>
                  <p className="text-xs text-gray-400">{video.views || 0} views</p>
                </div>
                <button 
                  className="ml-2 text-xs text-white px-4 py-1 rounded-full"
                  style={{
                    background: `
                      linear-gradient(0deg, #270E00, #270E00),
                      conic-gradient(from 0deg at 50% 38.89%, #ED5606 0deg, #1F1F1F 160.78deg, #ED5606 360deg)
                    `,
                    border: '1px solid #ED5606'
                  }}
                >
                  Follow
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="bg-[#1c1c1c] hover:bg-[#222] text-white rounded-full p-2 flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-xs mr-1">Like {video.likes > 0 ? `(${video.likes})` : ''}</span>
                </button>
                <button className="bg-[#1c1c1c] hover:bg-[#222] text-white rounded-full p-2 flex items-center gap-1">
                  <Share className="w-4 h-4" />
                  <span className="text-xs mr-1">Share</span>
                </button>
                <button className="bg-[#1c1c1c] hover:bg-[#222] text-white rounded-full p-2 flex items-center gap-1">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21L12 17L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-xs mr-1">Save</span>
                </button>
              </div>
            </div>
            
            {/* Video Description */}
            <div className="mb-6 bg-[#101010] p-3 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">
                {video.description || 'No description provided.'}
              </p>
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {video.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-[#1A1A1A] text-[#ED5606] px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section - Only show if video has comments */}
            {video.comments && video.comments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium mb-4">Comments ({video.comments.length})</h3>
                <div className="space-y-4">
                  {video.comments.map((comment, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#222] flex-shrink-0">
                        <img 
                          src="/user-avatar.png" 
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">{comment.userId}</h4>
                          <span className="text-xs text-gray-400">
                            {comment.timestamp ? formatDateAgo(comment.timestamp) : 'Recently'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{comment.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPage; 