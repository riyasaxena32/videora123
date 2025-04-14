import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, User, Bell, ChevronRight, Menu, Heart, Share, MessageSquare, ThumbsUp } from 'lucide-react';

function VideoPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

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

  useEffect(() => {
    // Simulate fetching video data
    const fetchVideo = () => {
      setLoading(true);
      
      // Find video in our mock data
      const foundVideo = videos.find(v => v.id === parseInt(videoId)) || videos[0];
      setVideo(foundVideo);
      
      setLoading(false);
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
            {sideVideoThumbnails.map((thumbnailVideo, index) => (
              <div 
                key={index}
                className={`relative cursor-pointer mb-2 ${thumbnailVideo.id === parseInt(videoId) ? 'border border-[#ED5606]' : ''}`}
                onClick={() => navigate(`/video/${thumbnailVideo.id}`)}
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={thumbnailVideo.image} 
                    alt={thumbnailVideo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 px-2">
                  <p className="text-[10px] text-white truncate">{thumbnailVideo.title}</p>
                </div>
                {thumbnailVideo.id === parseInt(videoId) && (
                  <div className="absolute top-0 right-0 bottom-0 w-[3px] bg-[#ED5606]"></div>
                )}
                <div className="absolute top-1 right-1 bg-black/70 text-[8px] px-1 rounded text-white">
                  {thumbnailVideo.duration}
                </div>
                <div className="absolute bottom-6 left-1 text-[8px] bg-black/70 px-1 rounded text-white">
                  {thumbnailVideo.quality}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Video Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player */}
          <div className="w-full bg-black relative" style={{ maxHeight: '70vh' }}>
            <img 
              src={video.image} 
              alt={video.title}
              className="w-full h-full object-cover"
              style={{ maxHeight: '70vh' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Add play button overlay if needed */}
            </div>
          </div>

          {/* Video Info */}
          <div className="p-6 max-w-[1200px] mx-auto">
            {/* Days ago indicator */}
            <div className="text-xs text-gray-400 mb-2">
              08 Days Ago
            </div>
            
            {/* Video Title */}
            <div className="mb-4">
              <h1 className="text-xl font-bold flex items-center gap-2 mb-1">
                {video.title} <span className="text-xs font-normal">•</span> <span className="text-sm font-normal">{video.subtitle}</span>
              </h1>
            </div>
            
            {/* Creator Info and Action Buttons */}
            <div className="flex items-center justify-between mb-8">
              {/* Creator */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#222]">
                  <img 
                    src={video.creator.image} 
                    alt={video.creator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium">{video.creator.name}</h3>
                  <p className="text-xs text-gray-400">{video.creator.subscribers} subscribers</p>
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
                  <span className="text-xs mr-1">Like</span>
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
                Naruto the Movie: Legend of the Stone of Gelel | 劇場版 NARUTO -ナルト- 大活劇！雪姫忍法帖だってばよ！！ Gekijō-ban Naruto: Daigekitotsu! Maboroshi no Chiteiiseki Dattebayo (2005)
              </p>
              <button className="text-xs text-[#ED5606]">See More</button>
            </div>

            {/* Comments Section */}
            <div className="border-t border-[#222] pt-6">
              <h2 className="text-lg font-medium mb-4">Comments</h2>
              
              {video.comments.map((comment, index) => (
                <div key={index} className="flex gap-3 mb-6 pb-4 border-b border-[#222]">
                  <div className="w-8 h-8 bg-[#222] rounded-full flex-shrink-0 overflow-hidden">
                    <img 
                      src={comment.user.image} 
                      alt={comment.user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xs font-medium">{comment.user.name}</h4>
                      <span className="text-xs text-[#666]">{comment.time}</span>
                    </div>
                    <p className="text-xs text-[#ddd] mb-2">{comment.text}</p>
                    <div className="flex items-center gap-3">
                      <button className="text-xs text-[#666] hover:text-white transition-colors flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> <span className="text-[10px]">{comment.likes}</span>
                      </button>
                      <button className="text-xs text-[#666] hover:text-white transition-colors">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="w-80 border-l overflow-y-auto flex-shrink-0 hidden lg:block" 
          style={{
            borderImageSource: "linear-gradient(90deg, #140F0A 0%, #7B3F0E 49.59%, #140F0A 100%), linear-gradient(180deg, #401C00 0%, #A15111 49.59%, #401C00 100%)",
            borderImageSlice: "1",
            background: "linear-gradient(0deg, #000000, #000000), linear-gradient(180deg, rgba(141, 78, 22, 0.2) -11.48%, rgba(24, 15, 7, 0.2) 50.18%)"
          }}
        >
          {/* Chat Header */}
          <div className="border-b flex" 
            style={{
              borderImageSource: "linear-gradient(90deg, #140F0A 0%, #7B3F0E 49.59%, #140F0A 100%), linear-gradient(180deg, #401C00 0%, #A15111 49.59%, #401C00 100%)",
              borderImageSlice: "1"
            }}
          >
            <div className="flex-1 py-3 text-sm font-medium text-white text-center">
              Chat in Video
            </div>
          </div>
          
          <div className="flex flex-col h-[calc(100%-48px)]" 
            style={{
              background: "linear-gradient(0deg, #000000, #000000), linear-gradient(180deg, rgba(141, 78, 22, 0.2) -11.48%, rgba(24, 15, 7, 0.2) 50.18%)"
            }}
          >
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto">
              {chatMessages.map((message, index) => (
                <div key={index} 
                  className="flex gap-2 items-center p-2.5 border-t" 
                  style={{
                    borderImageSource: "linear-gradient(90deg, #140F0A 0%, #7B3F0E 49.59%, #140F0A 100%)",
                    borderImageSlice: "1"
                  }}
                >
                  <img 
                    src="/user-avatar.png" 
                    alt="User" 
                    className="w-5 h-5 opacity-70"
                  />
                  <div className="text-[11px] text-gray-400">
                    <span className="text-white">{message.user}</span> {message.text}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="mt-auto border-t p-3 flex items-center" 
              style={{
                borderImageSource: "linear-gradient(90deg, #140F0A 0%, #7B3F0E 49.59%, #140F0A 100%)",
                borderImageSlice: "1"
              }}
            >
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 bg-transparent text-[12px] text-gray-400 focus:outline-none pl-2 py-1.5"
              />
              <button 
                className="text-white p-1.5 rounded-full flex items-center justify-center"
                style={{
                  background: `
                    linear-gradient(0deg, #270E00, #270E00),
                    conic-gradient(from 0deg at 50% 38.89%, #ED5606 0deg, #1F1F1F 160.78deg, #ED5606 360deg),
                    linear-gradient(180deg, rgba(69, 24, 0, 0.3) 74.07%, rgba(217, 75, 0, 0.3) 100%),
                    linear-gradient(270deg, rgba(69, 24, 0, 0.3) 91.54%, rgba(217, 75, 0, 0.3) 100%),
                    linear-gradient(90deg, rgba(69, 24, 0, 0.3) 91.54%, rgba(217, 75, 0, 0.3) 100%)
                  `,
                  border: '1px solid #ED5606'
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample chat messages
const chatMessages = [
  { user: "Gekijō-ban Naruto:", text: "Legend of the Stone of Gelel" },
  { user: "Legend of the Stone of Gelel", text: "" },
  { user: "Gekijō-ban Naruto:", text: "Legend of the Stone of Gelel" },
  { user: "Legend of the Stone of Gelel", text: "" },
  { user: "Gekijō-ban Naruto:", text: "Legend of the Stone of Gelel" },
  { user: "Legend of the Stone of Gelel", text: "" }
];

// Sample video data
const videos = [
  {
    id: 1,
    title: "My Neighbor Totoro (1988)",
    subtitle: "A heartwarming story of two sisters and their encounters with forest spirits",
    image: "/image 28.png",
    tag: "Retro Themed",
    creator: {
      id: "muse-asia",
      name: "Muse Asia",
      image: "/user-avatar.png",
      subscribers: "1.2M"
    },
    comments: [
      {
        user: { name: "Shubham Kumar", image: "/user-avatar.png" },
        text: "Naruto the Movie: Legend of the Stone of Gelel | 劇場版 NARUTO -ナルト- 大活劇！雪姫忍法帖だってばよ！！ Gekijōban Naruto: Daigekitotsu! Maboroshi no Chiteiiseki Dattebayo (2005)",
        time: "3 days ago",
        likes: 42
      },
      {
        user: { name: "Shubham Kumar", image: "/user-avatar.png" },
        text: "Naruto the Movie: Legend of the Stone of Gelel | 劇場版 NARUTO -ナルト- 大活劇！雪姫忍法帖だってばよ！！ Gekijōban Naruto: Daigekitotsu! Maboroshi no Chiteiiseki Dattebayo (2005)",
        time: "3 days ago",
        likes: 42
      },
      {
        user: { name: "Sparsh Agrawal", image: "/user-avatar.png" },
        text: "Naruto the Movie: Legend of the Stone of Gelel | 劇場版 NARUTO -ナルト- 大活劇！雪姫忍法帖だってばよ！！ Gekijōban Naruto: Daigekitotsu! Maboroshi no Chiteiiseki Dattebayo (2005)",
        time: "4 days ago",
        likes: 31
      },
      {
        user: { name: "Shubham Kumar", image: "/user-avatar.png" },
        text: "Naruto the Movie: Legend of the Stone of Gelel | 劇場版 NARUTO -ナルト- 大活劇！雪姫忍法帖だってばよ！！ Gekijōban Naruto: Daigekitotsu! Maboroshi no Chiteiiseki Dattebayo (2005)",
        time: "5 days ago",
        likes: 19
      }
    ]
  }
];

// Sample related videos
const relatedVideos = [
  { id: 2, title: "S Charming", image: "/image 28.png", creator: { name: "Sparsh" }, views: "1.5M" },
  { id: 3, title: "Theory of everything", image: "/image 28.png", creator: { name: "MKBHD" }, views: "2.1M" },
  { id: 4, title: "Openhiemer", image: "/image 28.png", creator: { name: "T-SERIES" }, views: "3.7M" },
  { id: 5, title: "New Delhi", image: "/image 28.png", creator: { name: "Casey Neistat" }, views: "900K" },
  { id: 6, title: "S Charming", image: "/image 28.png", creator: { name: "Sparsh" }, views: "1.5M" },
  { id: 7, title: "Theory of everything", image: "/image 28.png", creator: { name: "MKBHD" }, views: "2.1M" },
  { id: 8, title: "Openhiemer", image: "/image 28.png", creator: { name: "T-SERIES" }, views: "3.7M" },
  { id: 9, title: "New Delhi", image: "/image 28.png", creator: { name: "Casey Neistat" }, views: "900K" }
];

// Sample data for the left sidebar thumbnails
const sideVideoThumbnails = [
  { id: 1, title: "My Neighbor Totoro (1988)", image: "/image 28.png", duration: "2:42", quality: "Ultra HD" },
  { id: 2, title: "S Charming", image: "/image 28.png", duration: "3:15", quality: "HD" },
  { id: 3, title: "Theory of everything", image: "/image 28.png", duration: "1:36", quality: "4K" },
  { id: 4, title: "Openhiemer", image: "/image 28.png", duration: "4:20", quality: "HD" },
  { id: 5, title: "New Delhi", image: "/image 28.png", duration: "2:18", quality: "Ultra HD" },
  { id: 6, title: "Spirited Away", image: "/image 28.png", duration: "2:45", quality: "HD" },
  { id: 7, title: "The Matrix", image: "/image 28.png", duration: "3:22", quality: "4K" },
  { id: 8, title: "Naruto and the Legend", image: "/image 28.png", duration: "5:10", quality: "Ultra HD" }
];

export default VideoPage; 