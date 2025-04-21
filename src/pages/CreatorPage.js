import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, User, Bell, ChevronRight, Menu, LogOut, Clock, MessageSquareShare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Components for consistency with other pages
function VideoCard({ video, onClick }) {
  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
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
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-12"></div>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium">{video.name}</h3>
        <p className="text-xs text-[#b0b0b0]">{video.views || 0} views • {formatDateAgo(video.uploadDate)}</p>
      </div>
    </div>
  );
}

// Format date to show how long ago
const formatDateAgo = (dateString) => {
  if (!dateString) return 'Unknown date';
  
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

function CreatorPage() {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [creatorVideos, setCreatorVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('Your Videos');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [creators, setCreators] = useState([]);
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

  // Add an event listener for window resize to auto-collapse sidebar on small screens
  useEffect(() => {
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
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Fetch all videos from API
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://videora-ai.onrender.com/videos/get-videos');
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        
        const data = await response.json();
        const videos = data.video || [];
        setAllVideos(videos);
      
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
      
        // Find the creator based on the URL parameter
        const normalizedCreatorId = creatorId.toLowerCase();
        const foundCreator = uniqueCreators.find(c => 
          c.id === normalizedCreatorId || 
          c.name.toLowerCase().replace(/\s+/g, '-') === normalizedCreatorId
        );
        
        // If creator found, set creator data and their videos
        if (foundCreator) {
          setCreator(foundCreator);
          const creatorVids = videos.filter(v => 
            v.uploadedBy && v.uploadedBy.toLowerCase() === foundCreator.name.toLowerCase()
          );
          setCreatorVideos(creatorVids);
        } else if (normalizedCreatorId === 'profile' || normalizedCreatorId === user?.name?.toLowerCase().replace(/\s+/g, '-')) {
          // Current user's profile
          const currentUserCreator = {
            name: user?.name || 'Your Profile',
            id: normalizedCreatorId,
            videoCount: videos.filter(v => v.uploadedBy && v.uploadedBy.toLowerCase() === (user?.name || '').toLowerCase()).length,
            thumbnailUrl: user?.profilePic || '/user-avatar.png',
            isCurrentUser: true
          };
          
          setCreator(currentUserCreator);
          const userVideos = videos.filter(v => 
            v.uploadedBy && v.uploadedBy.toLowerCase() === (user?.name || '').toLowerCase()
          );
          setCreatorVideos(userVideos);
        } else {
          setError('Creator not found');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [creatorId, user?.name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Error: {error}</h1>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#2f2f2f] hover:bg-[#414141] px-6 py-2 rounded-full"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Creator not found</h1>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#2f2f2f] hover:bg-[#414141] px-6 py-2 rounded-full"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const isCurrentUserProfile = creator.isCurrentUser || 
    (user && creator.name.toLowerCase() === user.name?.toLowerCase());

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
                  { 
                    name: "Your Videos", 
                    icon: <User className="w-4 h-4" />,
                    action: () => navigate(`/creator/${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'profile'}`)
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
              <h3 className="text-xs font-medium text-[#b0b0b0] sidebar-heading">Creators</h3>
              <nav className="space-y-1">
                {creators.length > 0 ? creators.slice(0, 5).map((creator) => (
                  <a
                    key={creator.id}
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
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-[#2f2f2f] flex items-center justify-center">
                      <img 
                        src={creator.thumbnailUrl} 
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
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Creator Cover Section */}
          <div className="relative w-full h-[40vh] overflow-hidden">
        <img 
          src="/image 28.png" 
          alt={`${creator.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
            {/* Creator Info Overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#ED5606] bg-[#1a1a1a]">
                  <img 
                    src={creator.thumbnailUrl || "/user-avatar.png"} 
                    alt={creator.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/user-avatar.png";
                    }}
                  />
            </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{creator.name}</h1>
                  <p className="text-sm text-gray-300">{creator.videoCount} videos</p>
          </div>
          
                {!isCurrentUserProfile && (
                  <button 
                    className="ml-auto bg-[#ED5606] hover:bg-[#ff6a1a] px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                  >
                    Subscribe
            </button>
                )}
                
                {isCurrentUserProfile && (
              <button 
                    className="ml-auto bg-[#222] hover:bg-[#333] px-4 py-1.5 rounded-full text-sm transition-colors"
                    onClick={() => navigate('/create')}
                  >
                    Upload New Video
              </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Creator Videos Section */}
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">
              {isCurrentUserProfile ? 'Your Videos' : `${creator.name}'s Videos`}
            </h2>
        
            {creatorVideos.length === 0 ? (
              <div className="p-8 text-center border border-[#333] rounded-lg bg-[#111]">
                <h3 className="text-lg font-medium mb-2">No videos found</h3>
                <p className="text-gray-400 mb-4">
                  {isCurrentUserProfile 
                    ? "You haven't uploaded any videos yet." 
                    : `${creator.name} hasn't uploaded any videos yet.`}
                </p>
                
                {isCurrentUserProfile && (
              <button 
                    onClick={() => navigate('/create')}
                    className="bg-[#ED5606] hover:bg-[#ff6a1a] px-6 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    Upload Your First Video
              </button>
                )}
            </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {creatorVideos.map((video) => (
                  <VideoCard 
                    key={video._id} 
                    video={video} 
                    onClick={() => navigate(`/video/${video._id}`)} 
                  />
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatorPage; 