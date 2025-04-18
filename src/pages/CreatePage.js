import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, UploadCloud, ChevronDown, Edit3, Upload as UploadIcon, Mic, HelpCircle, ArrowUpRight, ArrowLeft, ChevronRight, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function CreatePage() {
  const [activeTab, setActiveTab] = useState('Generate Video');
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
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

  // Content to display based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'Generate Video':
        return <GenerateVideoContent gradientButtonStyle={gradientButtonStyle} />;
      case 'AI Video Edit':
        return <AIVideoEditContent gradientButtonStyle={gradientButtonStyle} />;
      case 'Video Narration':
        return <VideoNarrationContent gradientButtonStyle={gradientButtonStyle} />;
      default:
        return <GenerateVideoContent gradientButtonStyle={gradientButtonStyle} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a]">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <img src="/Play.png" alt="VIDEORA x PLAYGROUND" className="h-12" />
          </Link>
        </div>
        
        {/* Center the navigation items */}
        <div className="flex-1 flex justify-center">
          <nav className="flex">
            {['Generate Video', 'AI Video Edit', 'Video Narration'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm transition-colors ${
                  activeTab === tab ? 'text-[#ED5606]' : 'text-[#b0b0b0] hover:text-white'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            style={gradientButtonStyle}
            className="flex items-center gap-2 text-white px-4 py-1.5 text-sm transition-colors font-medium"
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
        </div>
      </header>

      {/* Main Content */}
      {renderContent()}
    </div>
  );
}

// Generate Video Tab Content
function GenerateVideoContent({ gradientButtonStyle }) {
  const [videoData, setVideoData] = useState({
    name: '',
    description: '',
    category: 'Education',
    tags: [],
    thumbnailLogoUrl: '',
    videoUrl: '',
    duration: 0,
    isPublic: true
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  
  const categories = [
    'Education', 'Entertainment', 'Gaming', 'Music', 
    'Sports', 'Technology', 'Travel', 'Vlog', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoData({
      ...videoData,
      [name]: value
    });
  };

  const handleCategoryChange = (e) => {
    setVideoData({
      ...videoData,
      category: e.target.value
    });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setVideoData({
        ...videoData,
        tags: [...videoData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setVideoData({
      ...videoData,
      tags: videoData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      
      // Create temporary URL for the video
      const videoURL = URL.createObjectURL(file);
      
      // Load video to get duration
      const videoElement = document.createElement('video');
      videoElement.src = videoURL;
      videoElement.onloadedmetadata = () => {
        // Duration in seconds
        const durationInSeconds = Math.floor(videoElement.duration);
        setVideoData({
          ...videoData,
          duration: durationInSeconds,
          videoUrl: videoURL // Temporary URL for preview
        });
      };
    }
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      // Create temporary URL for thumbnail preview
      const thumbnailURL = URL.createObjectURL(file);
      setVideoData({
        ...videoData,
        thumbnailLogoUrl: thumbnailURL // Temporary URL for preview
      });
    }
  };

  const triggerVideoInput = () => {
    videoInputRef.current.click();
  };

  const triggerThumbnailInput = () => {
    thumbnailInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setErrorMessage('');
    
    try {
      // In production, you'd upload the video and thumbnail files to a storage service
      // and get back URLs to use in your API call. For now, we'll use temporary URLs

      // In a real implementation, videoUrl and thumbnailUrl would be the cloud storage URLs
      // after uploading the files
      
      // For demo purposes, we'll use the fake URLs from the videoData state
      // In production, these would be the actual URLs from your file storage service
      
      const token = user?.tokenType === 'jwt' ? 
        localStorage.getItem('access_token') : 
        localStorage.getItem('token');
      
      const payload = {
        name: videoData.name,
        description: videoData.description,
        category: videoData.category,
        tags: videoData.tags,
        thumbnailLogoUrl: videoData.thumbnailLogoUrl,
        videoUrl: videoData.videoUrl,
        duration: videoData.duration,
        uploadedBy: user?.name || 'Anonymous',
        views: 0,
        likes: 0,
        dislikes: 0,
        comments: [],
        isPublic: videoData.isPublic
      };
      
      const response = await axios.post(
        'https://videora-ai.onrender.com/upload-videos', 
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Upload response:', response.data);
      setUploadSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setVideoData({
          name: '',
          description: '',
          category: 'Education',
          tags: [],
          thumbnailLogoUrl: '',
          videoUrl: '',
          duration: 0,
          isPublic: true
        });
        setVideoFile(null);
        setThumbnailFile(null);
        setUploadSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading video:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const customInputStyle = {
    backgroundColor: 'rgba(15, 7, 0, 0.5)',
    border: '1px solid #843D0C',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '4px',
    width: '100%',
    outline: 'none',
    fontSize: '16px'
  };

  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold mb-6">Upload Your Video</h2>
      
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-[#111] border border-[#333] rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Video Upload */}
            <div>
              <h3 className="text-sm font-medium mb-2">Upload Video</h3>
              <div 
                onClick={triggerVideoInput}
                className="h-40 border-2 border-dashed border-[#333] rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#ED5606] transition-colors"
              >
                {videoFile ? (
                  <div className="flex flex-col items-center">
                    <video className="h-28 max-w-full" controls>
                      <source src={videoData.videoUrl} />
                      Your browser does not support the video tag.
                    </video>
                    <p className="text-xs text-[#ED5606] mt-2">{videoFile.name}</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-[#666] mb-2" />
                    <p className="text-xs text-[#777] text-center">
                      Drag and drop your video here, or click to upload.
                    </p>
                  </>
                )}
              </div>
              <input 
                ref={videoInputRef}
                type="file" 
                accept="video/*" 
                className="hidden"
                onChange={handleVideoSelect}
              />
            </div>
            
            {/* Thumbnail Upload */}
            <div>
              <h3 className="text-sm font-medium mb-2">Upload Thumbnail</h3>
              <div 
                onClick={triggerThumbnailInput}
                className="h-40 border-2 border-dashed border-[#333] rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#ED5606] transition-colors"
              >
                {thumbnailFile ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={videoData.thumbnailLogoUrl} 
                      alt="Thumbnail preview" 
                      className="h-28 max-w-full object-contain"
                    />
                    <p className="text-xs text-[#ED5606] mt-2">{thumbnailFile.name}</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-[#666] mb-2" />
                    <p className="text-xs text-[#777] text-center">
                      Drag and drop your thumbnail here, or click to upload.
                    </p>
                  </>
                )}
              </div>
              <input 
                ref={thumbnailInputRef}
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={handleThumbnailSelect}
              />
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Video Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Video Title</label>
              <input
                type="text"
                name="name"
                value={videoData.name}
                onChange={handleInputChange}
                style={customInputStyle}
                placeholder="Enter video title"
                required
              />
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={videoData.description}
                onChange={handleInputChange}
                style={{...customInputStyle, height: '100px', resize: 'none'}}
                placeholder="Describe your video"
                required
              ></textarea>
            </div>
            
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={videoData.category}
                onChange={handleCategoryChange}
                style={{...customInputStyle, appearance: 'none'}}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags (Press Enter to add)</label>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                style={customInputStyle}
                placeholder="Add tags"
              />
              
              {/* Display tags */}
              <div className="flex flex-wrap gap-2 mt-2">
                {videoData.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-[#270E00] text-white px-2 py-1 rounded-md text-xs flex items-center"
                  >
                    {tag}
                    <button 
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-[#ED5606] hover:text-white"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium mb-2">Visibility</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={videoData.isPublic}
                  onChange={() => setVideoData({...videoData, isPublic: !videoData.isPublic})}
                  className="mr-2 h-4 w-4"
                />
                <span className="text-sm">Make this video public</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-800 rounded-md text-red-200">
            {errorMessage}
          </div>
        )}
        
        {/* Success message */}
        {uploadSuccess && (
          <div className="mt-4 p-3 bg-green-900 bg-opacity-30 border border-green-800 rounded-md text-green-200">
            Video uploaded successfully!
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button 
            type="submit"
            style={gradientButtonStyle}
            className="flex items-center gap-2 text-white px-6 py-2.5 text-sm font-medium"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                Uploading...
              </>
            ) : (
              <>
                Upload Video
                <Upload className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// AI Video Edit Tab Content
function AIVideoEditContent({ gradientButtonStyle }) {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold mb-4">AI Video Edit</h2>
      <p className="text-sm text-[#999]">This feature is coming soon.</p>
    </div>
  );
}

// Video Narration Tab Content - Matches the UI from the image
function VideoNarrationContent({ gradientButtonStyle }) {
  const [currentTime, setCurrentTime] = useState('00:08');
  const [duration, setDuration] = useState('00:20');
  
  return (
    <div className="flex-1 flex flex-col bg-black">
      {/* Main content area */}
      <div className="flex flex-1 max-h-[calc(100vh-4.5rem)]">
        {/* Left side - Video player */}
        <div className="w-3/5 p-3 flex flex-col">
          {/* Video preview */}
          <div className="relative bg-[#0A0A0A] rounded-md overflow-hidden" style={{ height: '36vh' }}>
            <img 
              src="/image 28.png" 
              alt="Video preview" 
              className="w-full h-full object-cover"
            />
            
            {/* Video controls overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-4">
                <button className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12L5 21V3L19 12Z" fill="white"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Time indicators and progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center px-3">
              <div className="text-xs text-white mr-2">{currentTime}</div>
              <div className="flex-1 bg-[#333] h-1 rounded-full overflow-hidden">
                <div className="bg-[#ED5606] h-full" style={{ width: '40%' }}></div>
              </div>
              <div className="text-xs text-white ml-2">{duration}</div>
            </div>
          </div>
          
          {/* Bottom controls section */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 grid grid-cols-3 gap-2">
              <div className="border border-[#222] rounded-md bg-[#0A0A0A] p-2 flex flex-col items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[9px] text-center text-[#999]">Upload your video</span>
              </div>
              
              <div className="border border-[#222] rounded-md bg-[#0A0A0A] p-2 flex flex-col items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1">
                  <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[9px] text-center text-[#999]">Auto Generate</span>
              </div>
              
              <div className="border border-[#222] rounded-md bg-[#0A0A0A] p-2 flex flex-col items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1">
                  <path d="M21 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 6L21 12L15 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[9px] text-center text-[#999]">AI Edit</span>
              </div>
            </div>
          </div>
          
          {/* Organize Your Video section */}
          <div className="mt-2">
            <div className="border border-[#222] rounded-md bg-[#0A0A0A] p-2">
              <h3 className="text-xs font-medium mb-1">Organize Your Video</h3>
              <p className="text-[9px] text-[#777] mb-2">Choose a setting to control who can see this content</p>
              
              <div className="relative">
                <select className="w-full appearance-none bg-[#151515] border border-[#333] rounded p-1.5 text-xs text-white px-3 pr-8 focus:outline-none">
                  <option>Public (anyone can access)</option>
                  <option>Private (only you can access)</option>
                  <option>Unlisted (anyone with link can access)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Narration details */}
        <div className="w-2/5 border-l border-[#222] flex flex-col">
          <div className="p-3">
            <h2 className="text-xs font-medium">Details</h2>
            <div className="mt-2">
              <div className="mb-2">
                <label className="block text-[9px] text-[#777] mb-1">Provide Your video title here...</label>
                <input 
                  type="text" 
                  className="w-full bg-[#151515] border border-[#333] rounded p-2 text-xs text-white focus:outline-none focus:border-[#ED5606]"
                  placeholder="Enter video title..."
                />
              </div>
              
              <div className="mb-2">
                <label className="block text-[9px] text-[#777] mb-1">Provide Your video description here...</label>
                <textarea 
                  className="w-full bg-[#151515] border border-[#333] rounded p-2 text-xs text-white focus:outline-none focus:border-[#ED5606] resize-none"
                  style={{ height: '14vh' }}
                  placeholder="Enter video description..."
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Bottom navigation */}
          <div className="mt-auto p-3 border-t border-[#222] flex justify-between">
            <button className="flex items-center gap-1 text-white bg-[#151515] hover:bg-[#222] px-3 py-1.5 rounded text-xs">
              <ArrowLeft className="w-3 h-3" />
              <span>Back</span>
            </button>
            <button 
              style={gradientButtonStyle}
              className="flex items-center gap-1 text-white px-4 py-1.5 text-xs font-medium"
            >
              <span>Publish Video</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePage; 