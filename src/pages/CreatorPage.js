import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, User, Bell, ChevronRight, Menu, LogOut, Clock, MessageSquareShare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Components for consistency with other pages
function VideoCard({ video, onClick, onDelete, isCurrentUser }) {
  const [imageError, setImageError] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent triggering the onClick of the card
    
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }
    
    try {
      setDeleteLoading(true);
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`https://videora-ai.onrender.com/videos/delete-video/${video._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete video');
      }

      const data = await response.json();
      console.log('Video deleted successfully:', data.message);
      
      // Call the onDelete function to update the UI
      if (onDelete) {
        onDelete(video._id);
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      alert('Failed to delete video. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };
  
  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      <div className="overflow-hidden rounded-md aspect-video bg-[#1a1a1a]">
        {!video ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse w-full h-full bg-gray-700"></div>
          </div>
        ) : (
          <img 
            src={imageError ? "/image 28.png" : (video.thumbnailUrl || video.thumbnailLogoUrl || "/image 28.png")} 
            alt={video.caption || video.name || "Video thumbnail"} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Category tag */}
        {video && (
          <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white">
            {video.style || video.category || "Unknown"}
          </div>
        )}
        
        {/* Video indicator */}
        {video && (video.videoURL || video.videoUrl) && (
          <div className="absolute top-2 left-2 bg-[#ED5606] px-1.5 py-0.5 rounded text-xs text-white flex items-center gap-0.5 sm:px-2 sm:gap-1">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[10px] sm:h-[10px]">
              <path d="M5 3L19 12L5 21V3Z" fill="white"/>
            </svg>
            Video
          </div>
        )}
        
        {/* Audio indicator */}
        {video && video.voiceURL && (
          <div className="absolute top-9 left-2 bg-[#333] px-1.5 py-0.5 rounded text-xs text-white flex items-center gap-0.5 sm:px-2 sm:gap-1">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[10px] sm:h-[10px]">
              <path d="M12 3V21M3 12H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Audio
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-12"></div>
        
        {/* Delete icon in bottom overlay - only for user's own videos */}
        {isCurrentUser && (
          <div 
            className={`absolute bottom-2 right-2 ${deleteLoading ? 'opacity-50' : 'opacity-100'} hover:text-red-500 text-white cursor-pointer z-10 transition-colors`}
            onClick={handleDelete}
            title="Delete video"
          >
            {deleteLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            )}
          </div>
        )}
      </div>
      {video && (
        <div className="mt-1.5 sm:mt-2">
          <h3 className="text-xs sm:text-sm font-medium truncate">{video.caption || video.name || 'Untitled'}</h3>
          <p className="text-xs text-[#b0b0b0] truncate">{video.views || 0} views • {formatDateAgo(video.uploadDate)}</p>
        </div>
      )}
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

function Sidebar({ creators, loading, error, handleCreatorClick, selectedCreator, mobileOpen, setMobileOpen }) {
  const closeSidebar = () => setMobileOpen(false);
  
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}
      
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0D0D0D] border-r border-[#252525] transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:z-auto`}>
        <div className="p-4 flex justify-between items-center border-b border-[#252525]">
          <h2 className="text-lg font-semibold">Creators</h2>
          <button 
            className="md:hidden text-white p-1" 
            onClick={closeSidebar}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="p-3">
          {loading && (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-sm p-3">
              Failed to load creators: {error}
            </div>
          )}
          
          {!loading && !error && creators.length === 0 && (
            <div className="text-gray-400 text-sm p-3">
              No creators found
            </div>
          )}
          
          <div className="space-y-2 max-h-[calc(100vh-150px)] overflow-y-auto pr-1">
            {creators.map((creator) => (
              <div
                key={creator.id}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                  selectedCreator?.id === creator.id
                    ? "bg-[#252525]"
                    : "hover:bg-[#1A1A1A]"
                }`}
                onClick={() => {
                  handleCreatorClick(creator);
                  if (window.innerWidth < 768) closeSidebar();
                }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-[#252525]">
                  <img
                    src={creator.profilePic || creator.avatar || creator.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=ED5606&color=fff&size=80`}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/user-avatar.png";
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium truncate">{creator.name}</h3>
                  <p className="text-xs text-[#b0b0b0] truncate">
                    {creator.videoCount || 0} videos
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

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
  const [apiCreators, setApiCreators] = useState([]);
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const profileDropdownRef = useRef(null);
  const { logout, user, isCreatorFollowed, followCreator, unfollowCreator, fetchFollowedCreators } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Fetch creators from API
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await fetch('https://videora-ai.onrender.com/api/creator/getcreator');
        if (!response.ok) {
          throw new Error('Failed to fetch creators');
        }
        const data = await response.json();
        const creatorsList = data.creator || [];
        
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
          
          return {
            name: creator.name || 'Unknown Creator',
            id: creator.name ? creator.name.toLowerCase().replace(/\s+/g, '-') : `creator-${creator._id}`,
            videoCount: typeof creator.TotalVideos === 'number' ? creator.TotalVideos : 0,
            followers: followersCount,
            about: creator.about || '',
            _id: creator._id || '',
            profilePic: profilePicUrl
          };
        });
        
        setApiCreators(mappedCreators);
      } catch (err) {
        console.error('Error fetching creators from API:', err);
      }
    };
    
    fetchCreators();
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
        
        console.log('API response videos:', videos);
        
        // Extract unique creators from videos based on uploadedBy field
        const uniqueCreators = Array.from(new Set(
          videos
            .filter(v => v.uploadedBy) // Filter out videos without uploadedBy
            .map(v => v.uploadedBy)
        ))
        .map(creatorName => {
          // Find all videos by this creator
          const creatorVideos = videos.filter(v => v.uploadedBy === creatorName);
          // Use the first video for thumbnail
          const firstVideo = creatorVideos[0];
          
          // Try to find this creator in the API creators list
          const apiCreator = apiCreators.find(c => c.name.toLowerCase() === creatorName.toLowerCase());
          
          return {
            name: creatorName,
            id: creatorName.toLowerCase().replace(/\s+/g, '-'),
            videoCount: creatorVideos.length,
            thumbnailUrl: firstVideo?.thumbnailLogoUrl || '/user-avatar.png',
            profilePic: apiCreator?.profilePic || null
          };
        });
        
        setCreators(uniqueCreators);
        
        // Find the creator based on the URL parameter
        const normalizedCreatorId = creatorId.toLowerCase();
        
        // Try to find by ID first
        let foundCreator = uniqueCreators.find(c => c.id === normalizedCreatorId);
        
        // If not found, use profile for current user
        if (!foundCreator && (normalizedCreatorId === 'profile' || normalizedCreatorId === user?.name?.toLowerCase().replace(/\s+/g, '-'))) {
          // Current user's profile
          const userName = user?.name || 'Your Profile';
          
          // Try to find this user in API creators
          const apiCreator = apiCreators.find(c => c.name.toLowerCase() === userName.toLowerCase());
          
          foundCreator = {
            name: userName,
            id: normalizedCreatorId,
            videoCount: videos.filter(v => v.uploadedBy === userName).length,
            thumbnailUrl: apiCreator?.profilePic || user?.profilePic || '/user-avatar.png',
            _id: apiCreator?._id || '',
            isCurrentUser: true
          };
          
          setCreator(foundCreator);
          
          // Find videos uploaded by current user
          const userVideos = videos.filter(v => v.uploadedBy === userName);
          console.log(`Found ${userVideos.length} videos for user: ${userName}`);
          setCreatorVideos(userVideos);
        } 
        // Regular creator profile
        else if (foundCreator) {
          // Try to find this creator in API creators for additional info
          const apiCreator = apiCreators.find(c => c.name.toLowerCase() === foundCreator.name.toLowerCase());
          
          if (apiCreator) {
            foundCreator = {
              ...foundCreator,
              thumbnailUrl: apiCreator.profilePic || foundCreator.thumbnailUrl,
              followers: apiCreator.followers,
              _id: apiCreator._id
            };
          }
          
          console.log('Setting creator with data:', foundCreator);
          setCreator(foundCreator);
          const creatorVids = videos.filter(v => v.uploadedBy === foundCreator.name);
          console.log(`Found ${creatorVids.length} videos for creator: ${foundCreator.name}`);
          setCreatorVideos(creatorVids);
        } 
        // Creator not found
        else {
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
  }, [creatorId, user?.name, apiCreators]);

  // Check if the current user follows this creator
  useEffect(() => {
    const checkIfFollowing = async () => {
      if (!user || !creator || !creator._id) return;
      
      // First check the local state in auth context
      const isFollowed = isCreatorFollowed(creator._id);
      setIsFollowing(isFollowed);
      
      // If we have a token, also verify with the API
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        // Make a direct API call to check follow status
        const response = await fetch(`https://videora-ai.onrender.com/api/creator/${creator._id}/checkfollow`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Update the state based on the API response
          setIsFollowing(data.isFollowing || false);
          
          // If there's a mismatch between our local state and the API,
          // refresh our followed creators list
          if (isFollowed !== data.isFollowing) {
            fetchFollowedCreators();
          }
        }
      } catch (err) {
        console.error('Error verifying follow status with API:', err);
      }
    };
    
    checkIfFollowing();
  }, [user, creator, isCreatorFollowed, fetchFollowedCreators]);

  // Function to toggle follow/unfollow a creator
  const toggleFollowCreator = async (creatorId) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login');
      return;
    }

    console.log(`Attempting to ${isFollowing ? 'unfollow' : 'follow'} creator with ID:`, creatorId);
    
    if (!creatorId) {
      console.error('Cannot follow/unfollow creator: Missing valid creator ID');
      alert('Cannot update follow status for this creator at the moment. Please try again later.');
      return;
    }

    try {
      setFollowLoading(true);
      
      // Use followCreator for both actions - it detects the current status and toggles
      const success = await followCreator(creatorId);
      
      if (success) {
        // Update local following state
        setIsFollowing(!isFollowing);
        
        // Update the creator state with the new follower count
        setCreator(prevCreator => ({
          ...prevCreator,
          followers: isFollowing 
            ? (prevCreator.followers > 0 ? prevCreator.followers - 1 : 0) 
            : (prevCreator.followers || 0) + 1
        }));
        
        console.log(`Successfully ${isFollowing ? 'unfollowed' : 'followed'} creator`);
      } else {
        console.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'} creator`);
        alert(`Failed to ${isFollowing ? 'unfollow' : 'follow'} creator. Please try again.`);
      }
    } catch (err) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} creator:`, err);
    } finally {
      setFollowLoading(false);
    }
  };

  // Handle video deletion and update the UI
  const handleVideoDelete = (videoId) => {
    // Update the creatorVideos state to remove the deleted video
    setCreatorVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
    
    // Update the allVideos state as well
    setAllVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
    
    // Update the creator's video count
    setCreator(prevCreator => ({
      ...prevCreator,
      videoCount: prevCreator.videoCount > 0 ? prevCreator.videoCount - 1 : 0
    }));
  };

  // Refresh followed creators list when component mounts
  useEffect(() => {
    if (user) {
      fetchFollowedCreators();
    }
  }, [user, fetchFollowedCreators]);

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

  const handleCreatorClick = (creator) => {
    setCreator(creator);
    setCreatorVideos(creatorVideos.filter(v => v.uploadedBy === creator.name));
    setActiveSidebarItem(creator.name);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const selectedCreator = creator;

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
                href="#"
                className={`text-sm font-medium transition-colors ${
                  item === "Home" ? "text-white" : "text-[#b0b0b0] hover:text-white"
                }`}
                onClick={(e) => {
                  e.preventDefault();
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
              : 'w-[80%] md:w-[220px] lg:w-[240px] opacity-100 visible'
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
        <div className="flex-1 overflow-y-auto pl-0 md:pl-4 lg:pl-6">
          {/* Creator Cover Section */}
          <div className="relative w-full overflow-hidden">
            {/* Profile image as background */}
            <div className="absolute inset-0 z-0">
              <img 
                src={creator.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=ED5606&color=fff&size=400`} 
                alt={creator.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/user-avatar.png";
                }}
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black to-black/80"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
              <div className="flex flex-col">
                {/* Creator name and stats */}
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{creator.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-black/30 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium">Total Videos</span>
                      <span className="ml-2 text-sm font-bold">{creator.videoCount}</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-300 max-w-2xl mb-6">
                    {creator.about || "A breathtaking cinematic anime scene set in a futuristic cyberpunk city at night. Neon lights reflect off the rain-soaked streets as a lone warrior in a sleek black trench coat and a glowing cybernetic eye walks forward, katana in hand."}
                  </p>
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                      <Bell className="w-5 h-5" />
                    </button>
                    
                    {!isCurrentUserProfile ? (
                      <button 
                        className={`flex items-center gap-2 ${followLoading ? 'bg-[#270E00]/50' : isFollowing ? 'bg-[#270E00]' : 'border border-white/20'} px-5 py-2 rounded-full ${followLoading ? 'cursor-not-allowed' : 'hover:bg-white/10'} transition-colors`}
                        onClick={() => {
                          // Make sure we have a valid _id before calling the API
                          if (creator._id) {
                            toggleFollowCreator(creator._id);
                          } else {
                            console.error("Cannot toggle follow: Missing valid creator ID");
                            alert("Cannot update follow status for this creator at the moment. Please try again later.");
                          }
                        }}
                        disabled={followLoading}
                      >
                        <span className="text-sm font-medium">
                          {followLoading ? 'Processing...' : isFollowing ? 'Following' : 'Follow'} 
                          {creator.followers && !followLoading ? ` (${creator.followers})` : ''}
                        </span>
                      </button>
                    ) : (
                      <button 
                        className="flex items-center gap-2 border border-white/20 px-5 py-2 rounded-full hover:bg-white/10 transition-colors"
                        onClick={() => navigate('/create')}
                      >
                        <span className="text-sm font-medium">Upload Video</span>
                      </button>
                    )}
                    
                    <button className="flex items-center gap-2 bg-transparent px-5 py-2 rounded-full hover:bg-white/10 transition-colors">
                      <span className="text-sm font-medium">About</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Videos Grid */}
          <div className="mt-8 px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
            <h2 className="text-xl font-semibold mb-4">Videos</h2>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
              </div>
            ) : creatorVideos.length === 0 ? (
              <div className="text-center py-12 bg-[#1a1a1a] rounded-md">
                <p className="text-gray-400">No videos found</p>
                {isCurrentUserProfile && (
                  <button
                    onClick={() => navigate('/create')}
                    className="mt-4 bg-[#ED5606] text-white px-4 py-2 rounded-full hover:bg-[#ff6a1a] transition-colors"
                  >
                    Upload Your First Video
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
                {creatorVideos.map((video) => (
                  <VideoCard 
                    key={video._id} 
                    video={video} 
                    onClick={() => navigate(`/video/${video._id}`)} 
                    onDelete={handleVideoDelete} 
                    isCurrentUser={isCurrentUserProfile} 
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