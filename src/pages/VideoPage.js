import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, User, Bell, ChevronRight, Menu, Heart, Share, MessageSquare, ThumbsUp, Play, Pause, Volume2, VolumeX } from 'lucide-react';

function VideoPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const videoRef = useRef(null);

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

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const progressPercent = (currentTime / duration) * 100;
      
      setProgress(progressPercent);
      setCurrentTime(currentTime);
    }
  };

  // Handle seeking in the video
  const handleSeek = (e) => {
    if (videoRef.current) {
      const seekBar = e.currentTarget;
      const rect = seekBar.getBoundingClientRect();
      const seekPos = (e.clientX - rect.left) / rect.width;
      
      videoRef.current.currentTime = videoRef.current.duration * seekPos;
    }
  };

  useEffect(() => {
    // Fetch video data from API
    const fetchVideo = async () => {
      setLoading(true);
      
      try {
        // Fetch all videos first
        const response = await fetch('https://videora-ai.onrender.com/videos/get-videos');
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        
        const data = await response.json();
        console.log('Fetched videos:', data);
        
        if (data && data.video && Array.isArray(data.video)) {
          // Find the specific video by ID
          const foundVideo = data.video.find(v => v._id === videoId);
          
          if (foundVideo) {
            setVideo(foundVideo);
            // Set related videos (other videos excluding the current one)
            setRelatedVideos(data.video.filter(v => v._id !== videoId));
          } else {
            console.error('Video not found');
            // Fallback to the first video if specific one not found
            if (data.video.length > 0) {
              setVideo(data.video[0]);
              setRelatedVideos(data.video.slice(1));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideo();
  }, [videoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Video Not Found</h2>
        <p className="mb-6">The video you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')} 
          style={gradientButtonStyle}
          className="px-6 py-2 text-white"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] w-full bg-black">
        <div className="flex items-center gap-8">
          <button 
            className="p-1 hover:bg-[#1a1a1a] rounded-md transition-colors" 
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="text-xl font-bold flex items-center">
            <img src="/Logo.png" alt="VIDEORA" className="h-8" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
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
          <button className="w-9 h-9 flex items-center justify-center bg-[#270E00] hover:bg-[#3a1500] rounded-full transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-[#270E00] hover:bg-[#3a1500] rounded-full transition-colors">
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Left Sidebar - Video List */}
        <div className="w-[120px] md:w-[220px] border-r border-[#222] overflow-y-auto bg-black hidden md:block">
          <div className="py-1">
            {relatedVideos.map((relatedVideo) => (
              <div 
                key={relatedVideo._id}
                className={`relative cursor-pointer mb-2 ${relatedVideo._id === videoId ? 'border border-[#ED5606]' : ''}`}
                onClick={() => navigate(`/video/${relatedVideo._id}`)}
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={relatedVideo.thumbnailLogoUrl || "/image 28.png"} 
                    alt={relatedVideo.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/image 28.png";
                    }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 px-2">
                  <p className="text-[10px] text-white truncate">{relatedVideo.name}</p>
                </div>
                {relatedVideo._id === videoId && (
                  <div className="absolute top-0 right-0 bottom-0 w-[3px] bg-[#ED5606]"></div>
                )}
                <div className="absolute top-1 right-1 bg-black/70 text-[8px] px-1 rounded text-white">
                  {formatTime(relatedVideo.duration || 0)}
                </div>
                <div className="absolute bottom-6 left-1 text-[8px] bg-black/70 px-1 rounded text-white">
                  {relatedVideo.category}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Video Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player */}
          <div className="w-full bg-black relative" style={{ maxHeight: '70vh' }}>
            {/* Video element */}
            <div className="relative w-full aspect-video bg-black">
              {video.videoUrl ? (
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  poster={video.thumbnailLogoUrl || "/image 28.png"}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onError={(e) => {
                    console.error('Video error:', e);
                  }}
                  onEnded={() => setIsPlaying(false)}
                ></video>
              ) : (
                <img 
                  src={video.thumbnailLogoUrl || "/image 28.png"} 
                  alt={video.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/image 28.png";
                  }}
                />
              )}
              
              {/* Custom video controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress bar */}
                <div 
                  className="w-full h-1 bg-gray-600 rounded-full mb-3 cursor-pointer"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-[#ED5606] rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {/* Play/Pause button */}
                    <button 
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    
                    {/* Mute/Unmute button */}
                    <button 
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    
                    {/* Time display */}
                    <div className="text-sm">
                      {formatTime(currentTime)} / {formatTime(video.duration || 0)}
                    </div>
                  </div>
                  
                  {/* Video quality indicator */}
                  <div className="text-xs px-2 py-1 bg-black/60 rounded">
                    HD
                  </div>
                </div>
              </div>
              
              {/* Play button overlay when paused */}
              {!isPlaying && (
                <button 
                  className="absolute inset-0 flex items-center justify-center"
                  onClick={togglePlay}
                >
                  <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Video Info */}
          <div className="p-6 max-w-[1200px] mx-auto">
            {/* Upload date indicator */}
            <div className="text-xs text-gray-400 mb-2">
              {video.uploadDate ? new Date(video.uploadDate).toLocaleDateString() : 'Recently uploaded'}
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
                  style={gradientButtonStyle}
                >
                  Follow
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="bg-[#1c1c1c] hover:bg-[#222] text-white rounded-full p-2 flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-xs mr-1">Like {video.likes || 0}</span>
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
              <p className="text-sm text-gray-300 mb-2">{video.description}</p>
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {video.tags.map((tag, index) => (
                    <span key={index} className="text-xs text-[#ED5606]">#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-medium">Comments</h3>
                <div className="text-xs text-gray-400">{video.comments?.length || 0}</div>
              </div>
              
              {/* Comment input */}
              <div className="flex gap-3 mb-6">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#222] flex-shrink-0">
                  <img src="/user-avatar.png" alt="Your avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    className="w-full bg-transparent border-b border-[#333] p-2 text-sm focus:outline-none focus:border-[#ED5606]"
                  />
                </div>
              </div>
              
              {/* Comments list */}
              {video.comments && video.comments.length > 0 ? (
                <div className="space-y-4">
                  {video.comments.map((comment, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-[#222] flex-shrink-0">
                        <img src="/user-avatar.png" alt="User avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-sm font-medium">{comment.userId}</div>
                          <div className="text-xs text-gray-400">
                            {comment.timestamp && new Date(comment.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm">{comment.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">No comments yet. Be the first to comment!</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPage; 