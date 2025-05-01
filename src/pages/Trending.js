import React, { useState, useEffect, useRef } from "react";
import { Bell, ChevronRight, Clock, Info, MessageSquareShare, Plus, Settings, User, Menu, X, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

function Trending() {
  const [activeNavItem, setActiveNavItem] = useState("Trending");
  const [activeSidebarItem, setActiveSidebarItem] = useState("Recent");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creators, setCreators] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        const fetchedVideos = dataVideos.video || [];
        
        // Sort videos by view count (highest first)
        const sortedVideos = [...fetchedVideos].sort((a, b) => (b.views || 0) - (a.views || 0));
        
        setVideos(sortedVideos);
        
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

  // Function to close creator profile
  const closeCreatorProfile = () => {
    setSelectedCreator(null);
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
            
            {/* Creator content would go here */}
          </div>
        </div>
      )}

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
                      className={`flex items-center gap-3 py-2 text-sm transition-colors ${
                        activeSidebarItem === item.name
                          ? "text-white bg-[#270E00] rounded-md px-2 font-medium"
                          : "text-[#b0b0b0] hover:text-white px-2"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSidebarItem(item.name);
                        if (item.action) {
                          item.action();
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
                    className={`flex items-center gap-3 py-2 text-sm transition-colors sidebar-item ${
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
          </div>
        </aside>

        {/* Main Content */}
        <div className={`flex-1 overflow-y-auto bg-black transition-all duration-300`}>
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
              {/* Hero Section - Video with most views */}
              {videos.length > 0 && (
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
                      <span className="bg-[#ED5606] text-white px-2 py-1 text-xs rounded-sm mr-2">TRENDING #1</span>
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
                      <button className="flex items-center gap-1 md:gap-2 bg-transparent hover:bg-[#2f2f2f] text-white px-3 md:px-6 py-1 md:py-2 rounded-full border border-[#545454] transition-colors text-xs md:text-base">
                        <Plus className="w-3 h-3 md:w-5 md:h-5" />
                        Add to List
                      </button>
                    </div>
                    <div className="hidden md:flex items-center mt-4 gap-2">
                      <p className="text-sm text-[#b0b0b0]">Uploaded by:</p>
                      {videos[0].uploadedBy && (
                        <div className="flex items-center gap-2">
                          {(() => {
                            // Find creator in the creators list
                            const creator = creators.find(c => 
                              c.name.toLowerCase() === videos[0].uploadedBy.toLowerCase()
                            );
                            return (
                              <>
                                <img
                                  src={creator?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(videos[0].uploadedBy)}&background=ED5606&color=fff&size=40`}
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
                                    // Find creator in the creators list
                                    const creator = creators.find(c => 
                                      c.name.toLowerCase() === videos[0].uploadedBy.toLowerCase()
                                    );
                                    // Create URL-friendly version of the creator name
                                    const creatorId = creator?.id || videos[0].uploadedBy.toLowerCase().replace(/\s+/g, '-');
                                    navigate(`/creator/${creatorId}`);
                                  }}
                                >
                                  {videos[0].uploadedBy}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Trending Videos Section */}
              <div className="px-4 md:px-8 py-6 md:py-8">
                <div className="flex items-center mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold">Trending Now</h2>
                  <TrendingIcon className="w-5 h-5 md:w-6 md:h-6 ml-2 text-[#ED5606]" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {videos.slice(0, 15).map((video, index) => (
                    <div 
                      key={video._id} 
                      className="cursor-pointer relative"
                      onClick={() => navigate(`/video/${video._id}`)}
                    >
                      <div className="absolute top-2 left-2 bg-[#111]/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-sm">
                        #{index + 1}
                      </div>
                      <VideoCard 
                        title={video.caption || video.name}
                        image={video.thumbnailLogoUrl}
                        tag={video.category + (video.tags?.length > 0 ? `/${video.tags[0]}` : '')}
                        views={video.views}
                      />
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

// Helper components
function VideoCard({ title, image, tag, id, views }) {
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
        <div className="absolute top-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] md:text-xs text-white">
          {tag ? tag.split("/")[0] : "Unknown"}
        </div>
        {/* Views count */}
        <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] md:text-xs text-white">
          {views || 0} views
        </div>
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-12"></div>
      </div>
      <div className="mt-2">
        <h3 className="text-xs md:text-sm font-medium truncate">{title}</h3>
        <p className="text-[10px] md:text-xs text-[#b0b0b0] truncate">{tag || "Unknown"}</p>
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

export default Trending;
