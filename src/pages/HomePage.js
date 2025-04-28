import React, { useState, useEffect, useRef } from "react";
import { Bell, ChevronRight, Clock, Info, MessageSquareShare, Plus, Settings, User, Menu, X, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  const [activeNavItem, setActiveNavItem] = useState("Home");
  const [activeSidebarItem, setActiveSidebarItem] = useState("Recent");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [videosByCategory, setVideosByCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creators, setCreators] = useState([]);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
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

  // Fetch videos and creators from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch videos
        const responseVideos = await fetch('https://videora-ai.onrender.com/videos/get-videos');
        if (!responseVideos.ok) {
          throw new Error('Failed to fetch videos');
        }
        
        const dataVideos = await responseVideos.json();
        const videos = dataVideos.video || [];
        
        console.log(`Found ${videos.length} videos`);
        
        // Group videos by category
        const groupedVideos = {};
        const categorySet = new Set();

        videos.forEach(video => {
          // Use "Uncategorized" if no category is specified
          const category = video.category || "Uncategorized";
          categorySet.add(category);
          
          if (!groupedVideos[category]) {
            groupedVideos[category] = [];
          }
          groupedVideos[category].push(video);
        });
        
        setVideosByCategory(groupedVideos);
        setCategories(Array.from(categorySet));
        setVideos(videos);
        
        // Get creators from API
        const responseCreators = await fetch('https://videora-ai.onrender.com/api/creator/getcreator');
        if (!responseCreators.ok) {
          throw new Error('Failed to fetch creators');
        }
        
        const dataCreators = await responseCreators.json();
        const creatorsList = dataCreators.creator || [];
        
        // Map creators with additional info
        const mappedCreators = creatorsList.map(creator => {
          // Check if profilePic exists and has a valid URL
          let profilePicUrl = null;
          if (creator.profilePic && creator.profilePic.length > 0 && typeof creator.profilePic[0] === 'string') {
            profilePicUrl = creator.profilePic[0];
          }
          
          // Check followers array
          const followersCount = Array.isArray(creator.followers) ? creator.followers.length : 
                                (typeof creator.Totalfollowers === 'number' ? creator.Totalfollowers : 0);
          
          // Check if current user is following this creator
          let isUserFollowing = false;
          if (user && Array.isArray(creator.followers)) {
            isUserFollowing = creator.followers.some(follower => 
              typeof follower === 'object' && follower._id === user._id
            );
          }
          
          return {
            name: creator.name || 'Unknown Creator',
            id: creator.name ? creator.name.toLowerCase().replace(/\s+/g, '-') : `creator-${creator._id}`,
            videoCount: typeof creator.TotalVideos === 'number' ? creator.TotalVideos : 0,
            followers: followersCount,
            about: creator.about || '',
            _id: creator._id || '',
            profilePic: profilePicUrl,
            isFollowing: isUserFollowing
          };
        });
        
        setCreators(mappedCreators);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

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
      { scrollId: 'creatorsScroll', leftBtnId: 'creatorsLeftBtn', rightBtnId: 'creatorsRightBtn' }
    ];
    
    // Add category sections
    categories.forEach(category => {
      sections.push({
        scrollId: `${category.replace(/\s+/g, '')}Scroll`,
        leftBtnId: `${category.replace(/\s+/g, '')}LeftBtn`,
        rightBtnId: `${category.replace(/\s+/g, '')}RightBtn`
      });
    });
    
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
  }, [categories]);

  // Function to handle creator selection
  const handleCreatorSelect = (creator) => {
    setSelectedCreator(creator);
  };

  // Function to close creator profile
  const closeCreatorProfile = () => {
    setSelectedCreator(null);
  };

  // Default video if needed
  const defaultVideo = {
    _id: "default",
    name: "Default Video",
    description: "Default video when no videos are available",
    category: "Default",
    tags: ["default"],
    thumbnailLogoUrl: "/image 28.png",
    videoUrl: "",
    duration: 0,
    uploadedBy: "System",
    uploadDate: new Date().toISOString(),
    views: 0,
    likes: 0
  };

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
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#1a1a1a] w-full bg-black sticky top-0 z-40">
        <div className="flex items-center gap-2">
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

        {/* Center navigation links - hidden on mobile */}
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
                    navigate('/');
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
        
        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Create Button - Text hidden on mobile */}
          <button 
            style={gradientButtonStyle}
            className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-4 sm:py-1.5 text-sm transition-colors rounded-full sm:rounded-full font-medium"
            onClick={() => navigate('/create')}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1">Create</span>
          </button>
          
          {/* Profile dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button 
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#270E00] hover:border-[#ED5606] transition-colors focus:outline-none"
              onClick={toggleProfileDropdown}
            >
              <img
                src={user && user.profilePic ? user.profilePic : "/user-avatar.png"}
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
          
          {/* Menu button (right side) - mobile only */}
          <button className="flex md:hidden items-center justify-center w-8 h-8 text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="6" r="2" fill="white"/>
              <circle cx="12" cy="12" r="2" fill="white"/>
              <circle cx="12" cy="18" r="2" fill="white"/>
            </svg>
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
          } fixed md:static left-0 top-[49px] h-[calc(100vh-49px)] md:h-auto border-r border-[#1a1a1a] flex-shrink-0 overflow-y-auto bg-black transition-all duration-300 z-50 sidebar-mobile`}
        >
          <div className={`p-4 sm:p-5 space-y-6 sm:space-y-8 whitespace-nowrap ${sidebarCollapsed ? 'hidden' : 'block'}`}>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xs font-medium text-[#b0b0b0] sidebar-heading">You</h3>
              <nav className="space-y-1">
                {[
                  { name: "Recent", icon: <Clock className="w-4 h-4" /> },
                  { name: "Shared", icon: <MessageSquareShare className="w-4 h-4" /> },
                  { 
                    name: "Your Videos", 
                    icon: <User className="w-4 h-4" />,
                    action: () => {
                      const userId = user?.name ? user.name.toLowerCase().replace(/\s+/g, '-') : 'profile';
                      navigate(`/creator/${userId}`);
                    }
                  },
                  { name: "Watch Later", icon: <Clock className="w-4 h-4" /> },
                ].map((item) => (
                  <a
                    key={item.name}
                    href="#"
                    className={`flex items-center gap-2 sm:gap-3 py-2 text-sm transition-colors sidebar-item ${
                      activeSidebarItem === item.name
                        ? "text-white bg-[#270E00] rounded-md px-2 font-medium sidebar-item-active"
                        : "text-[#b0b0b0] hover:text-white px-2"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSidebarItem(item.name);
                      if (item.action) {
                        item.action();
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

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xs font-medium text-[#b0b0b0] sidebar-heading">Explore</h3>
              <nav className="space-y-1">
                {[
                  { name: "Trending", icon: <TrendingIcon className="w-4 h-4" /> },
                  { name: "Short Films", icon: <FilmIcon className="w-4 h-4" /> },
                ].map((item) => (
                  <a
                    key={item.name}
                    href="#"
                    className={`flex items-center gap-2 sm:gap-3 py-2 text-sm transition-colors sidebar-item ${
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
                {creators.length > 0 ? creators.slice(0, 5).map((creator) => (
                  <a
                    key={creator._id}
                    href="#"
                    className={`flex items-center gap-3 py-2 text-sm transition-colors sidebar-item ${
                      activeSidebarItem === creator.name
                        ? "text-white bg-[#270E00] rounded-md px-2 font-medium sidebar-item-active"
                        : "text-[#b0b0b0] hover:text-white px-2"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSidebarItem(creator.name);
                      navigate(`/creator/${creator.id}`);
                      if (isMobile) {
                        setSidebarCollapsed(true);
                      }
                    }}
                    title={creator.name}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full overflow-hidden bg-[#2f2f2f] flex items-center justify-center">
                          <img 
                            src={creator.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=ED5606&color=fff&size=30`} 
                            alt={`${creator.name} avatar`} 
                            width={20} 
                            height={20} 
                            className="rounded-full" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/user-avatar.png";
                            }}
                          />
                        </div>
                        <span className="sidebar-text">{creator.name}</span>
                      </div>
                      {user && creator._id && (user.name === creator.name || user.userName === creator.name) && (
                        <span className="text-xs text-white px-2 py-0.5 rounded-full text-[10px] bg-[#270E00] border border-[#ED5606]">
                          You
                        </span>
                      )}
                    </div>
                  </a>
                )) : (
                  <div className="text-xs text-[#777] px-2 py-1">No creators found</div>
                )}
                
                {creators.length > 5 && (
                  <a
                    href="#"
                    className="flex items-center gap-3 py-2 text-sm text-[#ED5606] hover:text-[#ff6a1a] px-2"
                    onClick={(e) => {
                      e.preventDefault();
                      // Show all creators
                    }}
                  >
                    <span className="sidebar-text">View All Creators</span>
                  </a>
                )}
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
        <div className={`flex-1 overflow-y-auto bg-black transition-all duration-300 pb-16`}>
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-10">
              <p className="text-red-500 mb-2">Error loading videos</p>
              <p className="text-sm text-[#999]">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Hero Section - Feature video from top creator if available */}
              {videos.length > 0 && creators.length > 0 && (
                (() => {
                  // Sort creators by follower count (highest first)
                  const sortedCreators = [...creators].sort((a, b) => b.followers - a.followers);
                  const topCreator = sortedCreators[0];
                  
                  // Find a video by the top creator
                  let featuredVideo = videos.find(video => 
                    video.uploadedBy && video.uploadedBy.toLowerCase() === topCreator.name.toLowerCase()
                  );
                  
                  // If no video found from top creator, use the first video
                  if (!featuredVideo && videos.length > 0) {
                    featuredVideo = videos[0];
                  }
                  
                  return featuredVideo ? (
                    <div className="relative h-[300px] sm:h-[400px] overflow-hidden hero-rockstar">
                      <img
                        src={featuredVideo.thumbnailLogoUrl || "/image 28.png"}
                        alt={featuredVideo.caption || featuredVideo.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/image 28.png";
                        }}
                      />
                      {/* Darker overlay gradient for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 sm:p-8 w-full z-10">
                        <h1 className="text-4xl sm:text-6xl font-bold mb-1 sm:mb-2">
                          {(featuredVideo.caption ? featuredVideo.caption.toUpperCase() : featuredVideo.name.toUpperCase())}
                        </h1>
                        <p className="text-sm sm:text-xl mb-3 sm:mb-6">
                          Vibe: {featuredVideo.category || "Retro"}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-4">
                          <button 
                            className="flex items-center justify-center w-8 h-8 bg-transparent text-white border border-white/30 rounded-full"
                            onClick={() => navigate(`/video/${featuredVideo._id}/info`)}
                          >
                            <Info className="w-4 h-4" />
                          </button>
                          <span className="text-sm sm:text-base">More Info.</span>
                          <button className="flex items-center justify-center w-8 h-8 bg-transparent text-white border border-white/30 rounded-full ml-3">
                            <Plus className="w-4 h-4" />
                          </button>
                          <span className="text-sm sm:text-base">Add to List</span>
                        </div>
                        
                        {/* Mobile indicator dots */}
                        <div className="flex justify-center mt-4 sm:mt-6 gap-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()
              )}

              {/* Videos Sections - One per category */}
              {categories.map((category) => {
                const categoryVideos = videosByCategory[category] || [];
                if (categoryVideos.length === 0) return null;
                
                const categoryId = category.replace(/\s+/g, '');
                
                return (
                  <div key={category} className="px-4 sm:px-8 py-4 sm:py-6 relative">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <h2 className="text-lg sm:text-xl font-bold">Top Videos</h2>
                      <ChevronRight className="w-4 h-4 ml-1" />
                      <div className="ml-auto flex gap-2">
                        <button 
                          id={`${categoryId}LeftBtn`}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm"
                          onClick={() => document.getElementById(`${categoryId}Scroll`).scrollBy({left: -300, behavior: 'smooth'})}>
                          <ChevronRight className="w-4 h-4 rotate-180" />
                        </button>
                        <button 
                          id={`${categoryId}RightBtn`}
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm"
                          onClick={() => document.getElementById(`${categoryId}Scroll`).scrollBy({left: 300, behavior: 'smooth'})}>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto pb-4 hide-scrollbar scroll-smooth" id={`${categoryId}Scroll`}>
                      <div className="flex gap-3 sm:gap-4 snap-x" style={{ minWidth: 'max-content' }}>
                        {categoryVideos.map((video) => (
                          <div 
                            key={video._id} 
                            className="snap-start cursor-pointer" 
                            style={{ width: '220px', flexShrink: 0 }}
                            onClick={() => navigate(`/video/${video._id}`)}
                          >
                            <VideoCard 
                              id={video._id}
                              title={video.caption || video.name}
                              image={video.thumbnailLogoUrl}
                              tag={video.category + (video.tags?.length > 0 ? `/${video.tags[0]}` : '')}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Top Creators Section - Sorted by follower count */}
              <div className="px-4 sm:px-8 py-4 sm:py-6 relative">
                <div className="flex items-center mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl font-bold">Top Creators</h2>
                  <ChevronRight className="w-4 h-4 ml-1" />
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
                  <div className="flex gap-3 sm:gap-4 snap-x" style={{ minWidth: 'max-content' }}>
                    {creators.length > 0 ? 
                      // Sort creators by follower count (highest first) and filter out current user
                      [...creators]
                        .filter(creator => !user || (user.name !== creator.name && user.userName !== creator.name))
                        .sort((a, b) => b.followers - a.followers)
                        .map((creator) => (
                          <div 
                            key={creator._id} 
                            className="snap-start cursor-pointer" 
                            style={{ width: '220px', flexShrink: 0 }}
                            onClick={() => navigate(`/creator/${creator.id}`)}
                          >
                            <CreatorCard 
                              name={creator.name}
                              followers={creator.followers}
                              videos={creator.videoCount}
                              _id={creator._id}
                              profilePic={creator.profilePic}
                              isFollowing={creator.isFollowing}
                              onFollowChange={(creatorId, newFollowState) => {
                                // Update the creators list in the state
                                setCreators(prevCreators =>
                                  prevCreators.map(c =>
                                    c._id === creatorId ? { ...c, isFollowing: newFollowState } : c
                                  )
                                );
                              }}
                            />
                          </div>
                        )) : (
                          <div className="w-full text-center py-10">
                            <p className="text-gray-400">No creators found</p>
                          </div>
                        )
                    }
                  </div>
                </div>
              </div>

              {/* Mobile Navigation - Fixed bottom navigation for mobile */}
              <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#1a1a1a] z-30">
                <div className="flex justify-around py-2">
                  {[
                    { name: "Home", icon: <HomeIcon className="w-5 h-5" />, active: true },
                    { name: "Search", icon: <SearchIcon className="w-5 h-5" /> },
                    { name: "Library", icon: <FilmIcon className="w-5 h-5" /> },
                    { name: "Profile", icon: <User className="w-5 h-5" /> }
                  ].map((item) => (
                    <a
                      key={item.name}
                      href="#"
                      className={`flex flex-col items-center justify-center px-3 py-1 ${
                        item.active ? "text-[#ED5606]" : "text-[#777]"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle navigation
                      }}
                    >
                      {item.icon}
                      <span className="text-[10px] mt-1">{item.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoCard({ title, image, tag, id }) {
  return (
    <div className="relative group cursor-pointer video-card">
      <div className="overflow-hidden rounded-md aspect-video bg-[#1a1a1a]">
        <img 
          src={image || "/image 28.png"} 
          alt={title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/image 28.png";
          }}
        />
        {/* Category tag */}
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white">
          {tag ? tag.split("/")[0] : "Unknown"}
        </div>
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-12"></div>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium truncate">{title}</h3>
        <p className="text-xs text-[#b0b0b0] truncate">{tag || "Unknown"}</p>
      </div>
    </div>
  );
}

function CreatorCard({ name, image, followers, videos, _id, profilePic, isFollowing, onFollowChange }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollow, setIsFollow] = useState(isFollowing || false);
  
  // Check if this creator is the current user
  const isCurrentUser = user && (user.name === name || user.userName === name);
  
  // Function to follow a creator
  const followCreator = async (creatorId, event) => {
    // Stop click propagation to parent elements
    event.stopPropagation(); 
    
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login');
      return;
    }

    if (!creatorId) {
      console.error('Cannot follow creator: Missing valid creator ID');
      return;
    }

    try {
      setFollowLoading(true);
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`https://videora-ai.onrender.com/api/creator/${creatorId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to follow creator');
      }

      const data = await response.json();
      
      // Toggle following state
      const newFollowState = !isFollow;
      setIsFollow(newFollowState);
      
      // Notify parent component about the change
      if (onFollowChange) {
        onFollowChange(creatorId, newFollowState);
      }

      // Show success notification (optional)
      console.log('Successfully followed creator:', data.message);
    } catch (err) {
      console.error('Error following creator:', err);
      // Show error notification (optional)
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="relative group cursor-pointer video-card bg-[#111] rounded-md overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img 
          src={profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ED5606&color=fff&size=200`} 
          alt={name} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/user-avatar.png";
          }}
        />
      </div>
      <div className="p-2 sm:p-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium truncate mb-0.5">{name}</h3>
            <p className="text-xs text-[#b0b0b0]">{typeof followers === 'number' ? followers : 0} followers</p>
          </div>
          {user && _id && !isCurrentUser && (
            <button 
              className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full ${followLoading ? 'opacity-70' : ''}`}
              style={{
                background: isFollow ? 
                  `#333333` : 
                  `linear-gradient(0deg, #270E00, #270E00),
                  conic-gradient(from 0deg at 50% 38.89%, #ED5606 0deg, #1F1F1F 160.78deg, #ED5606 360deg)`,
                border: isFollow ? '1px solid #555555' : '1px solid #ED5606'
              }}
              onClick={(e) => followCreator(_id, e)}
              disabled={followLoading}
            >
              {followLoading ? '...' : (isFollow ? 'Following' : 'Follow')}
            </button>
          )}
          {isCurrentUser && (
            <button 
              className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[#270E00] border border-[#ED5606]"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/create');
              }}
            >
              My Page
            </button>
          )}
        </div>
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

function HomeIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

export default HomePage; 