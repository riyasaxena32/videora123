import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, User, Bell, ChevronDown, Menu, Clock, LogOut, Search, ArrowUpRight, Info, Heart, MessageSquareShare, Settings, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function WatchLater() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("Home");
  const [activeSidebarItem, setActiveSidebarItem] = useState("Watch Later");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [creators, setCreators] = useState([]);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();
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

  // Custom CSS for mobile sidebar
  const mobileMenuStyle = {
    boxShadow: '8px 0px 30px rgba(0, 0, 0, 0.5)',
    animation: 'slideIn 0.3s ease-out',
  };
  
  // Overlay background style
  const overlayStyle = {
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    }
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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !mobileMenuOpen) {
        setSidebarCollapsed(true);
      }
    };

    // Initial check on component mount
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

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

  // Fetch watch later videos
  useEffect(() => {
    const fetchWatchLaterVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('https://videora-ai.onrender.com/videos/get/watch-later', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch watch later videos');
        }

        const data = await response.json();
        console.log('Watch Later videos:', data);
        
        // Set the videos state with the watch later videos
        setVideos(data.watchLater || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching watch later videos:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWatchLaterVideos();
  }, []);

  // Component for individual video card
  const VideoCard = ({ video }) => {
    return (
      <div 
        className="relative cursor-pointer group" 
        onClick={() => navigate(`/video/${video._id}`)}
      >
        <div className="overflow-hidden rounded-md aspect-video bg-[#1a1a1a]">
          <img 
            src={video.thumbnailLogoUrl || "/image 28.png"} 
            alt={video.name} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/image 28.png";
            }}
          />
          
          {/* Category tag */}
          <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white">
            {video.category || "Unknown"}
          </div>
          
          {/* Video indicator */}
          {video.videoURL && (
            <div className="absolute top-2 left-2 bg-[#ED5606] px-1.5 py-0.5 rounded text-xs text-white flex items-center gap-0.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3L19 12L5 21V3Z" fill="white"/>
              </svg>
              Video
            </div>
          )}
          
          {/* Duration indicator */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white">
              {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="mt-2">
          <h3 className="text-xs md:text-sm font-medium truncate">{video.caption || video.name || "Untitled"}</h3>
          <p className="text-[10px] md:text-xs text-[#b0b0b0]">{video.uploadedBy || "Unknown"} • {video.views || 0} views</p>
          <p className="text-[10px] md:text-xs text-[#b0b0b0]">{formatDateAgo(video.uploadDate)}</p>
        </div>
      </div>
    );
  };

  // Helper component for PlayIcon
  const PlayIcon = (props) => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    );
  };
  
  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* Top Navbar - Full Width */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#1a1a1a] w-full bg-black sticky top-0 z-30">
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

        {/* Center navigation links - Hidden on mobile */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <nav className="flex items-center gap-8">
            {["Home", "Trending", "Genre", "Browse"].map((item) => (
              <a
                key={item}
                href="#"
                className={`text-sm transition-colors ${
                  activeNavItem === item ? "text-[#ED5606] border-b-2 border-[#ED5606] pb-1" : "text-[#b0b0b0] hover:text-white"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNavItem(item);
                  if (item === "Home") {
                    navigate('/home');
                  } else {
                    navigate(`/${item.toLowerCase()}`);
                  }
                }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            style={gradientButtonStyle}
            className="hidden md:flex items-center gap-1 text-white px-3 md:px-4 py-1.5 text-xs md:text-sm transition-colors font-medium"
            onClick={() => navigate('/create')}
          >
            Create
            <Plus className="w-3 h-3 md:w-3.5 md:h-3.5 ml-0.5" />
          </button>
          
          {/* Mobile Menu Dots */}
          <button className="flex md:hidden flex-col items-center justify-center h-8 w-8 gap-[3px]">
            <span className="w-[3px] h-[3px] bg-white rounded-full"></span>
            <span className="w-[3px] h-[3px] bg-white rounded-full"></span>
            <span className="w-[3px] h-[3px] bg-white rounded-full"></span>
          </button>
          
          {/* Profile dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button 
              className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border-2 border-[#270E00] hover:border-[#ED5606] transition-colors focus:outline-none"
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
          
          <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-[#270E00] hover:bg-[#3a1500] rounded-full transition-colors">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/75 z-40 md:hidden" 
          onClick={toggleSidebar}
          style={overlayStyle}
        >
          <div 
            className="w-[80%] h-full bg-black border-r border-[#1a1a1a] p-5 pt-16"
            onClick={(e) => e.stopPropagation()}
            style={mobileMenuStyle}
          >
            {/* Mobile Navigation */}
            <nav className="mb-8">
              <h3 className="text-xs font-medium text-[#b0b0b0] mb-3">Navigation</h3>
              <div className="space-y-1">
                {["Home", "Trending", "Genre", "Browse"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={`flex items-center gap-3 py-2 text-sm transition-colors ${
                      activeNavItem === item ? "text-white bg-[#270E00] rounded-md px-2 font-medium" : "text-[#b0b0b0] hover:text-white px-2"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNavItem(item);
                      if (item === "Home") {
                        navigate('/home');
                      } else {
                        navigate(`/${item.toLowerCase()}`);
                      }
                      setMobileMenuOpen(false);
                      setSidebarCollapsed(true);
                    }}
                  >
                    <span>{item}</span>
                  </a>
                ))}
              </div>
            </nav>
            
            {/* Rest of mobile sidebar content */}
            <div className="space-y-8 whitespace-nowrap">
              <div className="space-y-4">
                <h3 className="text-xs font-medium text-[#b0b0b0]">You</h3>
                <nav className="space-y-1">
                  {[
                    { name: "Recent", icon: <Clock className="w-4 h-4" />, path: "/home" },
                    { name: "Shared", icon: <MessageSquareShare className="w-4 h-4" /> },
                    { name: "Your Videos", icon: <User className="w-4 h-4" />, path: `/creator/${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'profile'}` },
                    { name: "Watch Later", icon: <Clock className="w-4 h-4" />, path: "/watch-later" },
                    { name: "Saved", icon: <Heart className="w-4 h-4" />, path: "/saved-videos" }
                  ].map((item) => (
                    <a
                      key={item.name}
                      href="#"
                      className={`flex items-center gap-3 py-2 text-sm transition-colors ${
                        activeSidebarItem === item.name
                          ? "text-white bg-[#270E00] rounded-md px-2 font-medium"
                          : "text-[#b0b0b0] hover:text-white px-2"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSidebarItem(item.name);
                        if (item.path) {
                          navigate(item.path);
                        }
                        setMobileMenuOpen(false);
                        setSidebarCollapsed(true);
                      }}
                    >
                      <div className={`w-5 h-5 flex items-center justify-center ${
                        activeSidebarItem === item.name ? "text-[#ED5606]" : ""
                      }`}>
                        {item.icon}
                      </div>
                      <span>{item.name}</span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Mobile Create Button */}
              <button 
                style={gradientButtonStyle}
                className="flex items-center gap-2 text-white px-4 py-1.5 text-sm transition-colors font-medium w-full justify-center"
                onClick={() => {
                  navigate('/create');
                  setMobileMenuOpen(false);
                  setSidebarCollapsed(true);
                }}
              >
                Create
                <Plus className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Only visible on desktop */}
        <aside 
          className={`${
            sidebarCollapsed 
              ? 'w-0 opacity-0 invisible' 
              : 'w-[190px] opacity-100 visible'
          } hidden md:block border-r border-[#1a1a1a] flex-shrink-0 overflow-y-auto bg-black transition-all duration-300`}
        >
          <div className={`p-5 space-y-8 whitespace-nowrap ${sidebarCollapsed ? 'hidden' : 'block'}`}>
            <div className="space-y-4">
              <h3 className="text-xs font-medium text-[#b0b0b0] sidebar-heading">You</h3>
              <nav className="space-y-1">
                {[
                  { name: "Recent", icon: <Clock className="w-4 h-4" />, path: "/home" },
                  { name: "Shared", icon: <MessageSquareShare className="w-4 h-4" /> },
                  { name: "Your Videos", icon: <User className="w-4 h-4" />, path: `/creator/${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'profile'}` },
                  { name: "Watch Later", icon: <Clock className="w-4 h-4" />, path: "/watch-later" },
                  { name: "Saved", icon: <Heart className="w-4 h-4" />, path: "/saved-videos" }
                ].map((item) => (
                  <a
                    key={item.name}
                    href="#"
                    className={`flex items-center gap-3 py-2 text-sm transition-colors sidebar-item ${
                      activeSidebarItem === item.name
                        ? "text-white bg-[#270E00] rounded-md px-2 font-medium sidebar-item-active"
                        : "text-[#b0b0b0] hover:text-white px-2"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSidebarItem(item.name);
                      if (item.path) {
                        navigate(item.path);
                      }
                      if (isMobile) {
                        setSidebarCollapsed(true);
                      }
                    }}
                    title={item.name}
                  >
                    <div className={`w-5 h-5 flex items-center justify-center ${
                      activeSidebarItem === item.name ? "text-[#ED5606]" : ""
                    }`}>
                      {item.icon}
                    </div>
                    <span className="sidebar-text">{item.name}</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-medium text-[#b0b0b0] sidebar-heading">Explore</h3>
              <nav className="space-y-1">
                {[
                  { name: "Trending", icon: <TrendingIcon className="w-4 h-4" />, path: "/trending" },
                  { name: "Short Films", icon: <FilmIcon className="w-4 h-4" /> },
                ].map((item) => (
                  <a
                    key={item.name}
                    href="#"
                    className={`flex items-center gap-3 py-2 text-sm transition-colors sidebar-item ${
                      activeSidebarItem === item.name
                        ? "text-white bg-[#270E00] rounded-md px-2 font-medium sidebar-item-active"
                        : "text-[#b0b0b0] hover:text-white px-2"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSidebarItem(item.name);
                      if (item.path) {
                        navigate(item.path);
                      }
                      if (isMobile) {
                        setSidebarCollapsed(true);
                      }
                    }}
                    title={item.name}
                  >
                    <div className={`w-5 h-5 flex items-center justify-center ${
                      activeSidebarItem === item.name ? "text-[#ED5606]" : ""
                    }`}>
                      {item.icon}
                    </div>
                    <span className="sidebar-text">{item.name}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className={`flex-1 overflow-y-auto bg-black transition-all duration-300`}>
          {/* Rest of your content */}
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12 bg-[#1a1a1a] rounded-lg max-w-[1600px] mx-auto px-4 md:px-8">
              <h3 className="text-xl font-medium text-red-500 mb-2">Error</h3>
              <p className="text-white/70">{error}</p>
              <button 
                className="mt-4 bg-[#2a2a2a] hover:bg-[#333] transition-colors px-4 py-2 rounded-md"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && videos.length === 0 && (
            <div className="text-center py-12 bg-[#1a1a1a] rounded-lg max-w-[1600px] mx-auto px-4 md:px-8 my-8">
              <h3 className="text-xl font-medium mb-2">No Watch Later Videos</h3>
              <p className="text-white/70 mb-4">You haven't added any videos to watch later</p>
              <button 
                className="bg-[#ED5606] text-white px-4 py-2 rounded-full hover:bg-[#c84805] transition-colors flex items-center gap-2 mx-auto"
                onClick={() => navigate('/home')}
              >
                Explore Videos
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {!loading && !error && videos.length > 0 && (
            <>
              {/* Hero Section - Featured First Video */}
              <div className="relative h-[280px] md:h-[400px] overflow-hidden hero-rockstar">
                <img
                  src={videos[0].thumbnailLogoUrl || "/image 28.png"}
                  alt={videos[0].caption || videos[0].name}
                  width={1200}
                  height={800}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/image 28.png";
                  }}
                />
                {/* Darker overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full z-10">
                  <div className="flex items-center mb-2">
                    <span className="bg-[#ED5606] text-white px-2 py-1 text-xs rounded-sm mr-2">WATCH LATER</span>
                    <span className="text-sm text-white">{videos[0].views || 0} views</span>
                  </div>
                  <h1 className="text-3xl md:text-6xl font-bold mb-1 md:mb-2">{(videos[0].caption ? videos[0].caption.toUpperCase() : videos[0].name.toUpperCase())}</h1>
                  <p className="text-sm md:text-xl mb-2 md:mb-6">Category: {videos[0].category || "Uncategorized"}</p>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4">
                    <button 
                      className="flex items-center gap-1 md:gap-2 bg-[#FF4500] hover:bg-[#e03e00] text-white px-3 md:px-6 py-1 md:py-2 rounded-full transition-colors font-medium text-xs md:text-base"
                      onClick={() => navigate(`/video/${videos[0]._id}`)}
                    >
                      <PlayIcon className="w-3 h-3 md:w-5 md:h-5" />
                      Play
                    </button>
                    <button className="flex items-center gap-1 md:gap-2 bg-[#2f2f2f] hover:bg-[#414141] text-white px-3 md:px-6 py-1 md:py-2 rounded-full transition-colors text-xs md:text-base">
                      <Info className="w-3 h-3 md:w-5 md:h-5" />
                      More Info.
                    </button>
                  </div>
                  <div className="hidden md:flex items-center mt-4 gap-2">
                    <p className="text-sm text-[#b0b0b0]">Uploaded by:</p>
                    {videos[0].uploadedBy && (
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(videos[0].uploadedBy)}&background=ED5606&color=fff&size=40`}
                          alt={videos[0].uploadedBy}
                          width={24}
                          height={24}
                          className="rounded-full"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/user-avatar.png";
                          }}
                        />
                        <span 
                          className="text-sm cursor-pointer hover:text-[#ED5606] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Create URL-friendly version of the creator name
                            const creatorId = videos[0].uploadedBy.toLowerCase().replace(/\s+/g, '-');
                            navigate(`/creator/${creatorId}`);
                          }}
                        >
                          {videos[0].uploadedBy}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Video Grid Section */}
              <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6">
                {/* Header */}
                <div className="flex items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold">Watch Later</h2>
                  <Clock className="w-5 h-5 md:w-6 md:h-6 ml-2 text-[#ED5606]" />
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {videos.map((video, index) => (
                    <div 
                      key={video._id} 
                      className="cursor-pointer relative"
                      onClick={() => navigate(`/video/${video._id}`)}
                    >
                      <VideoCard video={video} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Custom CSS */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @media (max-width: 768px) {
          .video-card {
            max-width: 200px;
          }
          
          .hero-rockstar {
            height: 280px;
          }
        }
      `}</style>
    </div>
  );
}

// Icon components
function TrendingIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function FilmIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  );
}

export default WatchLater; 