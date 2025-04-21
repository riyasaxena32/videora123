import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, User, Bell, ChevronRight, Menu, Heart, Share, MessageSquare, ThumbsUp, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
  const [creators, setCreators] = useState([]);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const profileDropdownRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const { logout, user } = useAuth();

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
        
        console.log('Fetching video with ID:', videoId);
        
        // First fetch all videos
        const response = await fetch('https://videora-ai.onrender.com/videos/get-videos');
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        
        const data = await response.json();
        const videos = data.video || [];
        
        console.log(`Found ${videos.length} videos in total`);
        
        // Find the specific video
        const foundVideo = videos.find(v => v._id === videoId);
        
        if (!foundVideo) {
          throw new Error('Video not found');
        }
        
        console.log('Found video:', foundVideo);
        
        // Set the video
        setVideo(foundVideo);
        
        // Set related videos (all other videos)
        setRelatedVideos(videos.filter(v => v._id !== videoId));
        
        // Extract unique creators from videos
        const uniqueCreators = Array.from(new Set(videos.map(v => v.uploadedBy)))
          .filter(Boolean)
          .map(creator => {
            // Find the first video by this creator
            const creatorVideo = videos.find(v => v.uploadedBy === creator);
            return {
              name: creator,
              id: creator.toLowerCase().replace(/\s+/g, '-'),
              videoCount: videos.filter(v => v.uploadedBy === creator).length,
              thumbnailUrl: creatorVideo?.thumbnailLogoUrl || '/user-avatar.png'
            };
          });
        
        setCreators(uniqueCreators);
        setLoading(false);

        // Preload video if possible
        if (foundVideo.videoURL && videoRef.current) {
          videoRef.current.load();
        }
      } catch (err) {
        console.error('Error fetching video:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    if (videoId) {
      fetchVideo();
    }
    
    // Cleanup function
    return () => {
      // Stop video and audio playback when component unmounts
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [videoId]);

  // Handle synchronized audio-video playback
  useEffect(() => {
    if (video && video.voiceURL && videoRef.current && audioRef.current) {
      // Sync video with audio
      const videoElement = videoRef.current;
      const audioElement = audioRef.current;

      const handleVideoPlay = () => {
        if (audioElement.paused) {
          audioElement.play()
            .then(() => setAudioPlaying(true))
            .catch(err => console.error('Error playing audio:', err));
        }
      };

      const handleVideoPause = () => {
        if (!audioElement.paused) {
          audioElement.pause();
          setAudioPlaying(false);
        }
      };

      const handleVideoTimeUpdate = () => {
        // Keep audio in sync with video
        if (Math.abs(audioElement.currentTime - videoElement.currentTime) > 0.5) {
          audioElement.currentTime = videoElement.currentTime;
        }
      };

      const handleAudioEnd = () => {
        setAudioPlaying(false);
      };

      // Add event listeners
      videoElement.addEventListener('play', handleVideoPlay);
      videoElement.addEventListener('pause', handleVideoPause);
      videoElement.addEventListener('timeupdate', handleVideoTimeUpdate);
      audioElement.addEventListener('ended', handleAudioEnd);

      // Clean up
      return () => {
        videoElement.removeEventListener('play', handleVideoPlay);
        videoElement.removeEventListener('pause', handleVideoPause);
        videoElement.removeEventListener('timeupdate', handleVideoTimeUpdate);
        audioElement.removeEventListener('ended', handleAudioEnd);
      };
    }
  }, [video]);

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
          <div className="p-3">
            <h3 className="text-xs font-medium text-[#b0b0b0] uppercase mb-2">Creators</h3>
            {creators.map((creator) => (
              <div 
                key={creator.id}
                className="flex items-center gap-2 py-2 px-2 hover:bg-[#111] rounded cursor-pointer"
                onClick={() => navigate(`/creator/${creator.id}`)}
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-[#222] flex-shrink-0">
                  <img 
                    src={creator.thumbnailUrl}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/user-avatar.png";
                    }}
                  />
                </div>
                <div className="truncate">
                  <p className="text-xs text-white truncate">{creator.name}</p>
                  <p className="text-[9px] text-gray-400">{creator.videoCount} videos</p>
                </div>
              </div>
            ))}
            
            <h3 className="text-xs font-medium text-[#b0b0b0] uppercase mt-4 mb-2">Related Videos</h3>
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
            {!loading && (video.videoURL || video.videoUrl) ? (
              <div className="video-container" style={{ maxHeight: '70vh' }}>
                <video
                  ref={videoRef}
                  src={video.videoURL || video.videoUrl}
                  poster={video.thumbnailLogoUrl || "/image 28.png"}
                  controls
                  className="w-full h-full object-contain"
                  style={{ maxHeight: '70vh' }}
                  playsInline
                  preload="auto"
                  onLoadedData={() => console.log('Video loaded successfully')}
                  onError={(e) => console.error('Video load error:', e)}
                />
                
                {/* Hidden audio element for voice narration */}
                {video.voiceURL && (
                  <audio 
                    ref={audioRef} 
                    src={video.voiceURL} 
                    preload="auto" 
                    className="hidden"
                  />
                )}
                
                {/* Audio indicator when voice narration is playing */}
                {video.voiceURL && audioPlaying && (
                  <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-white text-xs flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                    Voice Narration
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center" style={{ height: '50vh' }}>
                {loading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
                ) : (
                  <img 
                    src={video?.thumbnailLogoUrl || "/image 28.png"} 
                    alt={video?.name || 'Video thumbnail'}
                    className="w-full h-full object-contain"
                    style={{ maxHeight: '70vh' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/image 28.png";
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="p-6 max-w-[1200px] mx-auto">
            {/* Days ago indicator */}
            <div className="text-xs text-gray-400 mb-2">
              {formatDateAgo(video.uploadDate)}
            </div>
            
            {/* Video Title */}
            <div className="mb-4">
              <h1 className="text-xl font-bold flex items-center gap-2 mb-1">
                {video.name || video.caption || 'Untitled Video'} 
                {video.category && (
                  <>
                    <span className="text-xs font-normal">•</span> 
                    <span className="text-sm font-normal">{video.category}</span>
                  </>
                )}
                {video.style && (
                  <>
                    <span className="text-xs font-normal">•</span> 
                    <span className="text-sm font-normal text-[#ED5606]">{video.style}</span>
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
                {video.description || video.prompt || 'No description provided.'}
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
              {video.voiceURL && (
                <div className="mt-3 text-xs text-[#ED5606]">
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Voice narration available (plays automatically with video)
                  </span>
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