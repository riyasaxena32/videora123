import React, { useState, useEffect } from "react";
import { Bell, ChevronRight, Clock, Info, MessageSquareShare, Plus, Settings, User, Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  const [activeNavItem, setActiveNavItem] = useState("Home");
  const [activeSidebarItem, setActiveSidebarItem] = useState("Recent");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
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
            <img src="/Image2.png" alt="VIDEORA" className="h-6" />
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
          <button className="w-9 h-9 flex items-center justify-center bg-[#270E00] hover:bg-[#3a1500] rounded-full transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <div className="relative group">
            <button className="w-9 h-9 flex items-center justify-center bg-[#270E00] hover:bg-[#3a1500] rounded-full transition-colors">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-user.jpg';
                  }}
                />
              ) : (
                <User className="w-4 h-4" />
              )}
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
              {user && (
                <div className="px-4 py-2 border-b border-[#333]">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-[#b0b0b0] truncate">{user.email}</p>
                </div>
              )}
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#270E00] transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
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
              ? 'w-0 md:w-[60px] opacity-0 md:opacity-100 invisible md:visible' 
              : 'w-[80%] md:w-[190px] opacity-100 visible'
          } fixed md:static left-0 top-[57px] h-[calc(100vh-57px)] md:h-auto border-r border-[#1a1a1a] flex-shrink-0 overflow-y-auto bg-black transition-all duration-300 sidebar-mobile ${
            sidebarCollapsed ? 'md:sidebar-collapsed' : ''
          }`}
        >
          <div className={`p-5 space-y-8 whitespace-nowrap ${sidebarCollapsed ? 'p-2' : 'p-5'}`}>
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
                  { name: "MrWhosTheBoss", image: "/placeholder-user.jpg" },
                  { name: "MKBHD", image: "/placeholder-user.jpg" },
                  { name: "T-SERIES", image: "/placeholder-user.jpg" },
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
        <div className={`flex-1 overflow-y-auto bg-black transition-all duration-300 ${
          sidebarCollapsed ? 'content-with-collapsed-sidebar' : ''
        }`}>
          {/* Hero Section */}
          <div className="relative h-[400px] overflow-hidden hero-rockstar">
            <img
              src="/image 28.png"
              alt="Rockstar"
              width={1200}
              height={800}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.jpg";
              }}
            />
            {/* Darker overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full z-10">
              <h1 className="text-6xl font-bold mb-2">ROCKSTAR</h1>
              <p className="text-xl mb-6">Vibe: Retro</p>
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
                <p className="text-sm text-[#b0b0b0]">Created by:</p>
                <div className="flex items-center gap-2">
                  <img
                    src="/placeholder-user.jpg"
                    alt="Creator"
                    width={24}
                    height={24}
                    className="rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                     
                    }}
                  />
                  <span className="text-sm">Naruto</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Videos Section - Scrollable */}
          <div className="px-8 py-6 relative">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold">Top Videos</h2>
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
                {topVideos.map((video, index) => (
                  <div key={index} className="snap-start" style={{ width: '280px', flexShrink: 0 }}>
                    <VideoCard {...video} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Anime Section - Scrollable */}
          <div className="px-8 py-6 relative">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold">Anime</h2>
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
                {animeVideos.map((video, index) => (
                  <div key={index} className="snap-start" style={{ width: '280px', flexShrink: 0 }}>
                    <VideoCard {...video} />
                  </div>
                ))}
              </div>
            </div>
          </div>

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
                  <div key={index} className="snap-start" style={{ width: '280px', flexShrink: 0 }}>
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

function VideoCard({ title, image, tag }) {
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
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-user.jpg';
          }}
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

// Sample data with better image references
const topVideos = [
  { title: "St Charming", image: "/image 28.png", tag: "Crime/Drama" },
  { title: "Theory of Everything", image: "/image 28.png", tag: "Sci-Fi/Thriller" },
  { title: "Oppenheimer", image: "/image 28.png", tag: "History/Drama" },
  { title: "New Delhi", image: "/image 28.png", tag: "Comedy" },
];

const animeVideos = [
  { title: "St Charming", image: "/image 28.png", tag: "Anime/Fantasy" },
  { title: "Theory of Everything", image: "/image 28.png", tag: "Anime/Sci-Fi" },
  { title: "Oppenheimer", image: "/image 28.png", tag: "Anime/History" },
  { title: "New Delhi", image: "/image 28.png", tag: "Anime/Comedy" },
];

// Sample creator data
const creatorsData = [
  { name: "MrWhosTheBoss", image: "/placeholder-user.jpg", subscribers: "12.5M subs", videos: 524 },
  { name: "MKBHD", image: "/placeholder-user.jpg", subscribers: "18.2M subs", videos: 810 },
  { name: "T-SERIES", image: "/placeholder-user.jpg", subscribers: "245M subs", videos: 1432 },
  { name: "Casey Neistat", image: "/placeholder-user.jpg", subscribers: "10.1M subs", videos: 682 },
  { name: "PewDiePie", image: "/placeholder-user.jpg", subscribers: "111M subs", videos: 2840 },
  { name: "Linus Tech Tips", image: "/placeholder-user.jpg", subscribers: "15.3M subs", videos: 1215 },
];

export default HomePage; 