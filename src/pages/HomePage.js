import React, { useState, useEffect, useRef } from "react";
import { Bell, ChevronRight, Clock, Info, MessageSquareShare, Plus, Settings, User, Menu, X, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

function HomePage() {
  const [activeNavItem, setActiveNavItem] = useState("Home");
  const [activeSidebarItem, setActiveSidebarItem] = useState("Recent");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

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

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://videora-ai.onrender.com/videos/get-videos');
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        
        const data = await response.json();
        console.log('Fetched videos:', data);
        
        if (data && data.video && Array.isArray(data.video)) {
          setVideos(data.video);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, []);
  
  // Group videos by category
  const educationalVideos = videos.filter(video => video.category === 'Education');
  const otherVideos = videos.filter(video => video.category !== 'Education');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://videora-ai.onrender.com/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        // Redirect to login page after successful logout
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
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

  useEffect(() => {
    const handleScrollButtonVisibility = (scrollId, leftBtnId, rightBtnId) => {
      const scrollContainer = document.getElementById(scrollId);
      const leftBtn = document.getElementById(leftBtnId);
      const rightBtn = document.getElementById(rightBtnId);
      
      if (!scrollContainer || !leftBtn || !rightBtn) return;
      
      // Initially hide left button as we're at the start
      leftBtn.style.display = scrollContainer.scrollLeft <= 10 ? 'none' : 'flex';
      
      // Check if we're at the end already
      rightBtn.style.display = 
        Math.ceil(scrollContainer.scrollLeft + scrollContainer.clientWidth) >= scrollContainer.scrollWidth - 10 
          ? 'none' : 'flex';
      
      // Add scroll event listener
      const handleScroll = () => {
        // Hide/show left button based on scroll position
        leftBtn.style.display = scrollContainer.scrollLeft <= 10 ? 'none' : 'flex';
        
        // Hide/show right button based on if we reached the end
        rightBtn.style.display = 
          Math.ceil(scrollContainer.scrollLeft + scrollContainer.clientWidth) >= scrollContainer.scrollWidth - 10
            ? 'none' : 'flex';
      };
      
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    };
    
    // Set up scroll button visibility for each section
    const sections = [
      { scrollId: 'topVideosScroll', leftBtnId: 'topVideosLeftBtn', rightBtnId: 'topVideosRightBtn' },
      { scrollId: 'animeScroll', leftBtnId: 'animeLeftBtn', rightBtnId: 'animeRightBtn' },
      { scrollId: 'creatorsScroll', leftBtnId: 'creatorsLeftBtn', rightBtnId: 'creatorsRightBtn' }
    ];
    
    // Set up listeners for each section
    const cleanupFunctions = sections.map(({ scrollId, leftBtnId, rightBtnId }) => 
      handleScrollButtonVisibility(scrollId, leftBtnId, rightBtnId)
    ).filter(Boolean); // Filter out any undefined cleanups
    
    // Add an event listener for window resize to auto-collapse sidebar on small screens
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    // Initial check on component mount
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    // Clean up all event listeners
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup && cleanup());
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to handle creator selection
  const handleCreatorSelect = (creator) => {
    setSelectedCreator(creator);
  };

  // Function to close creator profile
  const closeCreatorProfile = () => {
    setSelectedCreator(null);
  };

  // Return loading state if videos are still loading
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-black text-white items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
        <p className="mt-4">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* Creator Profile Overlay */}
      {selectedCreator && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-auto">
          <div className="container mx-auto py-10 px-6 max-w-6xl">
            <button 
              onClick={closeCreatorProfile}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-[#2f2f2f] hover:bg-[#414141] rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Creator Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
              <div className="w-36 h-36 rounded-full overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                <img 
                  src={selectedCreator.image} 
                  alt={selectedCreator.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{selectedCreator.name}</h1>
                <p className="text-[#b0b0b0] mb-4">{selectedCreator.subscribers}</p>
                <div className="flex gap-4">
                  <button 
                    style={gradientButtonStyle}
                    className="flex items-center gap-2 text-white px-6 py-2 text-sm font-medium rounded-full"
                  >
                    Subscribe
                  </button>
                  <button className="flex items-center gap-2 bg-[#2f2f2f] hover:bg-[#414141] text-white px-6 py-2 rounded-full transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>
            
            {/* Creator Stats */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="bg-[#111] rounded-lg p-6">
                <p className="text-sm text-[#b0b0b0] mb-1">Videos</p>
                <p className="text-2xl font-bold">{selectedCreator.videos}</p>
              </div>
              <div className="bg-[#111] rounded-lg p-6">
                <p className="text-sm text-[#b0b0b0] mb-1">Subscribers</p>
                <p className="text-2xl font-bold">{selectedCreator.subscribers}</p>
              </div>
              <div className="bg-[#111] rounded-lg p-6">
                <p className="text-sm text-[#b0b0b0] mb-1">AI Score</p>
                <p className="text-2xl font-bold">92%</p>
              </div>
            </div>
            
            {/* Creator Videos */}
            <h2 className="text-2xl font-bold mb-6">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <div className="overflow-hidden rounded-md aspect-video bg-[#1a1a1a]">
                    <img 
                      src="/image 28.png" 
                      alt={`${selectedCreator.name} video ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-12"></div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium">Video Title {index + 1}</h3>
                    <p className="text-xs text-[#b0b0b0]">1.2M views • 2 days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar - Full Width */}
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
                href="#"
                className={`text-sm transition-colors ${
                  activeNavItem === item ? "text-[#ED5606] border-b-2 border-[#ED5606] pb-1" : "text-[#b0b0b0] hover:text-white"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNavItem(item);
                }}
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
            Create
            <Plus className="w-3.5 h-3.5 ml-0.5" />
          </button>
          
          {/* Profile dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button 
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#270E00] hover:border-[#ED5606] transition-colors focus:outline-none"
              onClick={toggleProfileDropdown}
            >
              <img
                src="/user-avatar.png"
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

      {/* Main Content Area with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {!sidebarCollapsed && (
          <div 
            className={`sidebar-overlay ${isMobile ? 'block' : 'hidden'}`}
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Left Sidebar - Full on desktop, collapsible on mobile */}
        <aside 
          className={`${
            sidebarCollapsed 
              ? 'w-0 opacity-0 invisible' 
              : 'w-[80%] md:w-[190px] opacity-100 visible'
          } fixed md:static left-0 top-[57px] h-[calc(100vh-57px)] md:h-auto border-r border-[#1a1a1a] flex-shrink-0 overflow-y-auto bg-black transition-all duration-300 sidebar-mobile`}
        >
          <div className={`p-5 space-y-8 whitespace-nowrap ${sidebarCollapsed ? 'hidden' : 'block'}`}>
            <div className="space-y-4">
              <h3 className="text-xs font-medium text-[#b0b0b0] sidebar-heading">You</h3>
              <nav className="space-y-1">
                {[
                  { name: "Recent", icon: <Clock className="w-4 h-4" /> },
                  { name: "Shared", icon: <MessageSquareShare className="w-4 h-4" /> },
                  { name: "Your Video", icon: <User className="w-4 h-4" /> },
                  { name: "Watch Later", icon: <Clock className="w-4 h-4" /> },
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
                  { name: "Trending", icon: <TrendingIcon className="w-4 h-4" /> },
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
              <h3 className="text-xs font-medium text-[#b0b0b0] sidebar-heading">Creators</h3>
              <nav className="space-y-1">
                {[
                  { name: "MrWhosTheBoss", image: "/user-avatar.png" },
                  { name: "MKBHD", image: "/user-avatar.png" },
                  { name: "T-SERIES", image: "/user-avatar.png" },
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
                      if (isMobile) {
                        setSidebarCollapsed(true);
                      }
                    }}
                    title={item.name}
                  >
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-[#2f2f2f] flex items-center justify-center">
                      <img 
                        src={item.image} 
                        alt={`${item.name} avatar`} 
                        width={20} 
                        height={20} 
                        className="rounded-full" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="sidebar-text">{item.name}</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="pt-4 space-y-2">
              <h3 className="text-xs font-medium text-[#b0b0b0] sidebar-heading">Settings</h3>
              <nav className="space-y-1">
                {[
                  { name: "Settings", icon: <Settings className="w-4 h-4" /> },
                  { name: "Feedback", icon: <FeedbackIcon className="w-4 h-4" /> },
                  { name: "Report Error", icon: <ErrorIcon className="w-4 h-4" /> },
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
          {/* Hero Section */}
          <div className="relative h-[400px] overflow-hidden hero-rockstar">
            <img
              src={videos[0]?.thumbnailLogoUrl || "/image 28.png"}
              alt={videos[0]?.name || "Featured Video"}
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
            <div className="absolute bottom-0 left-0 p-8 w-full z-10">
              <h1 className="text-6xl font-bold mb-2">{videos[0]?.name || "VIDEORA"}</h1>
              <p className="text-xl mb-6">Category: {videos[0]?.category || "Featured"}</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-[#FF4500] hover:bg-[#e03e00] text-white px-6 py-2 rounded-full transition-colors font-medium">
                  <PlayIcon className="w-5 h-5" />
                  Play
                </button>
                <button className="flex items-center gap-2 bg-[#2f2f2f] hover:bg-[#414141] text-white px-6 py-2 rounded-full transition-colors">
                  <Info className="w-5 h-5" />
                  More Info.
                </button>
                <button className="flex items-center gap-2 bg-transparent hover:bg-[#2f2f2f] text-white px-6 py-2 rounded-full border border-[#545454] transition-colors">
                  <Plus className="w-5 h-5" />
                  Add to List
                </button>
              </div>
              <div className="flex items-center mt-4 gap-2">
                <p className="text-sm text-[#b0b0b0]">Uploaded by:</p>
                <div className="flex items-center gap-2">
                  <img
                    src="/user-avatar.png"
                    alt="Creator"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-sm">{videos[0]?.uploadedBy || "Creator"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* All Videos Section - Scrollable */}
          <div className="px-8 py-6 relative">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold">All Videos</h2>
              <div className="ml-auto flex gap-2">
                <button 
                  id="topVideosLeftBtn"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm"
                  onClick={() => document.getElementById('topVideosScroll').scrollBy({left: -300, behavior: 'smooth'})}>
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <button 
                  id="topVideosRightBtn"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm"
                  onClick={() => document.getElementById('topVideosScroll').scrollBy({left: 300, behavior: 'smooth'})}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto pb-4 hide-scrollbar scroll-smooth" id="topVideosScroll">
              <div className="flex gap-4 snap-x" style={{ minWidth: 'max-content' }}>
                {videos.map((video, index) => (
                  <div 
                    key={video._id} 
                    className="snap-start cursor-pointer" 
                    style={{ width: '280px', flexShrink: 0 }}
                    onClick={() => navigate(`/video/${video._id}`)}
                  >
                    <ApiVideoCard video={video} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Educational Videos Section - Scrollable */}
          {educationalVideos.length > 0 && (
            <div className="px-8 py-6 relative">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold">Educational</h2>
                <div className="ml-auto flex gap-2">
                  <button 
                    id="animeLeftBtn"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm"
                    onClick={() => document.getElementById('animeScroll').scrollBy({left: -300, behavior: 'smooth'})}>
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <button 
                    id="animeRightBtn"
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm"
                    onClick={() => document.getElementById('animeScroll').scrollBy({left: 300, behavior: 'smooth'})}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto pb-4 hide-scrollbar scroll-smooth" id="animeScroll">
                <div className="flex gap-4 snap-x" style={{ minWidth: 'max-content' }}>
                  {educationalVideos.map((video) => (
                    <div 
                      key={video._id} 
                      className="snap-start cursor-pointer" 
                      style={{ width: '280px', flexShrink: 0 }}
                      onClick={() => navigate(`/video/${video._id}`)}
                    >
                      <ApiVideoCard video={video} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Top Creators Section - Scrollable */}
          <div className="px-8 py-6 relative">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold">Top Creators</h2>
              <ChevronRight className="w-5 h-5 ml-2" />
              <div className="ml-auto flex gap-2">
                <button 
                  id="creatorsLeftBtn"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm"
                  onClick={() => document.getElementById('creatorsScroll').scrollBy({left: -300, behavior: 'smooth'})}>
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <button 
                  id="creatorsRightBtn"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm"
                  onClick={() => document.getElementById('creatorsScroll').scrollBy({left: 300, behavior: 'smooth'})}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto pb-4 hide-scrollbar scroll-smooth" id="creatorsScroll">
              <div className="flex gap-4 snap-x" style={{ minWidth: 'max-content' }}>
                {creatorsData.map((creator, index) => (
                  <div 
                    key={index} 
                    className="snap-start cursor-pointer" 
                    style={{ width: '280px', flexShrink: 0 }}
                    onClick={() => navigate(`/creator/${creator.id || creator.name.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    <CreatorCard {...creator} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Video card component for API videos
function ApiVideoCard({ video }) {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
  };

  return (
    <div className="relative group cursor-pointer video-card">
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
          {video.category}
        </div>
        {/* Duration tag */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white">
            {formatDuration(video.duration)}
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-12"></div>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium">{video.name}</h3>
        <p className="text-xs text-[#b0b0b0]">
          {video.views} views • Uploaded by {video.uploadedBy || "Unknown"}
        </p>
        <p className="text-xs text-[#b0b0b0]">
          {video.tags && video.tags.map(tag => `#${tag}`).join(" ")}
        </p>
      </div>
    </div>
  );
}

function VideoCard({ title, image, tag, id }) {
  // Use demo image placeholders for different categories
  const getImage = () => {
    // Set default image paths based on category tags
    if (tag.includes("Crime")) return "/image 28.png";
    if (tag.includes("Sci-Fi")) return "/image 28.png";
    if (tag.includes("History")) return "/image 28.png";
    if (tag.includes("Comedy")) return "/image 28.png";
    if (tag.includes("Anime")) return "/image 28.png";
    return "/image 28.png";
  };

  return (
    <div className="relative group cursor-pointer video-card">
      <div className="overflow-hidden rounded-md aspect-video bg-[#1a1a1a]">
        <img 
          src={image || getImage()} 
          alt={title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getImage();
          }}
        />
        {/* Category tag */}
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white">
          {tag.split("/")[0]}
        </div>
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-12"></div>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs text-[#b0b0b0]">{tag}</p>
      </div>
    </div>
  );
}

function CreatorCard({ name, image, subscribers, videos }) {
  return (
    <div className="relative group cursor-pointer video-card">
      <div className="overflow-hidden rounded-md aspect-video bg-[#1a1a1a]">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-12"></div>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium">{name}</h3>
        <p className="text-xs text-[#b0b0b0]">{subscribers}</p>
        <p className="text-xs text-[#b0b0b0]">{videos} videos</p>
      </div>
    </div>
  );
}

function PlayIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

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

function FeedbackIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M14 9a2 2 0 0 0-2-2H6" />
      <path d="M14 13a2 2 0 0 0-2-2H6" />
    </svg>
  );
}

function ErrorIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// Sample data with better image references and IDs
const topVideos = [
  { id: 1, title: "St Charming", image: "/image 28.png", tag: "Crime/Drama" },
  { id: 2, title: "Theory of Everything", image: "/image 28.png", tag: "Sci-Fi/Thriller" },
  { id: 3, title: "Oppenheimer", image: "/image 28.png", tag: "History/Drama" },
  { id: 4, title: "New Delhi", image: "/image 28.png", tag: "Comedy" },
];

const animeVideos = [
  { id: 5, title: "St Charming", image: "/image 28.png", tag: "Anime/Fantasy" },
  { id: 6, title: "Theory of Everything", image: "/image 28.png", tag: "Anime/Sci-Fi" },
  { id: 7, title: "Oppenheimer", image: "/image 28.png", tag: "Anime/History" },
  { id: 8, title: "New Delhi", image: "/image 28.png", tag: "Anime/Comedy" },
];

// Sample creator data
const creatorsData = [
  { name: "MrWhosTheBoss", image: "/user-avatar.png", subscribers: "12.5M subs", videos: 524 },
  { name: "MKBHD", image: "/user-avatar.png", subscribers: "18.2M subs", videos: 810 },
  { name: "T-SERIES", image: "/user-avatar.png", subscribers: "245M subs", videos: 1432 },
  { name: "Casey Neistat", image: "/user-avatar.png", subscribers: "10.1M subs", videos: 682 },
  { name: "PewDiePie", image: "/user-avatar.png", subscribers: "111M subs", videos: 2840 },
  { name: "Linus Tech Tips", image: "/user-avatar.png", subscribers: "15.3M subs", videos: 1215 },
];

export default HomePage; 