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
  const [creativePrompt, setCreativePrompt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const handleVideoSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setUploading(true);
      setErrorMessage('');
      
      try {
        // Create temporary URL for the video preview
        const videoURL = URL.createObjectURL(file);
        
        // Load video to get duration
        const videoElement = document.createElement('video');
        videoElement.src = videoURL;
        
        // Wait for metadata to load to get duration
        await new Promise((resolve) => {
          videoElement.onloadedmetadata = () => {
            resolve();
          };
        });
        
        // Duration in seconds
        const durationInSeconds = Math.floor(videoElement.duration);
        
        // Update state with video info for preview
        setVideoData({
          ...videoData,
          duration: durationInSeconds,
          videoUrl: videoURL, // Temporary URL for preview
          name: file.name.split('.')[0] // Use filename as the video name
        });
        
        // Upload to Cloudinary
        await uploadToCloudinary(file, durationInSeconds, file.name.split('.')[0]);
      } catch (error) {
        console.error('Error processing video:', error);
        setErrorMessage('Failed to process video. Please try again.');
        setUploading(false);
      }
    }
  };

  // Upload to Cloudinary first
  const uploadToCloudinary = async (file, duration, name) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'videora_uploads'); // Replace with your Cloudinary upload preset
      
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/your-cloud-name/video/upload', // Replace with your cloud name
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      );
      
      console.log('Cloudinary upload response:', response.data);
      
      // After successful upload to Cloudinary, update the API
      const cloudinaryUrl = response.data.secure_url;
      await uploadVideoToAPI(cloudinaryUrl, duration, name);
      
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      setErrorMessage('Failed to upload to Cloudinary. Please try again.');
      setUploading(false);
    }
  };

  // Separate function to upload to API
  const uploadVideoToAPI = async (videoURL, duration, name) => {
    try {
      const token = user?.tokenType === 'jwt' ? 
        localStorage.getItem('access_token') : 
        localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      console.log('Uploading video to API...');
      
      const payload = {
        name: name || 'Untitled Video',
        description: creativePrompt || 'No description provided',
        category: 'Education',
        tags: ['ai-generated'],
        thumbnailLogoUrl: videoData.thumbnailLogoUrl || '',
        videoUrl: videoURL, // Now this will be the Cloudinary URL
        duration: duration,
        uploadedBy: user?.name || 'Anonymous',
        views: 0,
        likes: 0,
        dislikes: 0,
        comments: [],
        isPublic: true
      };
      
      console.log('Upload payload:', payload);
      
      // Use the correct API endpoint from the curl command
      const response = await axios.post(
        'http://videora.ai-onrender.com/videos/upload-videos', 
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
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading to API:', error);
      let errorMessage = 'Failed to upload video. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        
        errorMessage = `Server error (${error.response.status}): ${error.response.data?.message || error.message}`;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        errorMessage = 'No response from server. Please check your network connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        errorMessage = error.message;
      }
      
      setErrorMessage(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Update handlePromptChange to also trigger API update with new description
  const handlePromptChange = async (e) => {
    const newPrompt = e.target.value;
    setCreativePrompt(newPrompt);
    
    // Also store in video data description
    setVideoData(prevData => ({
      ...prevData,
      description: newPrompt
    }));
    
    // If we already have a video uploaded, update its description
    if (videoFile && videoData.videoUrl) {
      try {
        await uploadVideoToAPI(videoData.videoUrl, videoData.duration, videoData.name);
      } catch (error) {
        console.error('Error updating video description:', error);
      }
    }
  };

  // Keep the handleUpload function, but now it'll be used for retrying uploads
  const handleUpload = async () => {
    if (!videoFile) {
      setErrorMessage('Please upload a video first');
      return;
    }
    
    try {
      setUploading(true);
      setErrorMessage('');
      await uploadVideoToAPI(videoData.videoUrl, videoData.duration, videoData.name);
    } catch (error) {
      setErrorMessage('Failed to upload video. Please try again.');
    }
  };

  const triggerVideoInput = () => {
    videoInputRef.current.click();
  };

  return (
    <div className="flex-1 grid grid-cols-3 gap-6 p-6">
      {/* Left Panel: Upload Media */}
      <div className="flex flex-col space-y-6">
        <h2 className="text-sm font-medium">Upload Your Media</h2>
        <div className="flex-1 border border-[#333] bg-[#111] rounded-md flex flex-col items-center justify-center p-6">
          <div 
            onClick={triggerVideoInput}
            className="w-full h-36 border-2 border-dashed border-[#333] rounded-md flex flex-col items-center justify-center mb-4 cursor-pointer hover:border-[#ED5606] transition-colors"
          >
            {videoFile ? (
              <div className="flex flex-col items-center">
                <video className="h-24 max-w-full" controls>
                  <source src={videoData.videoUrl} />
                  Your browser does not support the video tag.
                </video>
                <p className="text-xs text-[#ED5606] mt-2">{videoFile.name}</p>
              </div>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-[#666] mb-2" />
                <button type="button" className="mt-2 text-[#666]">
                  <Upload className="w-5 h-5" />
                </button>
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
          <p className="text-xs text-[#777] text-center">
            Drag and drop your video or image here, or click here to upload.
          </p>
        </div>
        
        {/* Camera Movements */}
        <h2 className="text-sm font-medium">Choose Camera Movements</h2>
        <div className="flex-1 border border-[#333] bg-[#111] rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-xs text-[#888] border border-[#333] bg-[#191919] rounded px-3 py-2">
              <ChevronDown className="w-4 h-4" />
              <span>Click to add camera movement</span>
            </div>
            <div className="text-xs text-[#888] border border-[#333] bg-[#191919] rounded px-2 py-2">
              Set camera movement timing
            </div>
          </div>
          <div className="h-20 flex items-center justify-center">
            <p className="text-xs text-[#777] text-center">
              Your selected camera movements and timing will appear here
            </p>
          </div>
        </div>
      </div>

      {/* Middle Panel: Creative Prompt */}
      <div className="flex flex-col space-y-6">
        <h2 className="text-sm font-medium">Pick Your Style</h2>
        <div className="border border-[#333] bg-[#111] rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <ChevronDown className="w-4 h-4" />
            <span className="text-sm">Select a vibe that matches your version</span>
          </div>
          <p className="text-xs text-[#777] pl-4">Lorem ipsum description text</p>
        </div>
        
        <h2 className="text-sm font-medium">Add Your Creative Prompt</h2>
        <div className="flex-1 border border-[#333] bg-[#111] rounded-md p-4">
          <textarea 
            className="w-full h-[300px] bg-transparent border-none text-[#999] text-sm focus:outline-none resize-none"
            placeholder="Type what you want in your video.

For example, 'Make it look like a sunny day at the beach.'"
            value={creativePrompt}
            onChange={handlePromptChange}
          ></textarea>
        </div>
      </div>

      {/* Right Panel: Audio & Caption */}
      <div className="flex flex-col space-y-6">
        <h2 className="text-sm font-medium">Add Audio</h2>
        <div className="border border-[#333] bg-[#111] rounded-md p-4">
          <h3 className="text-sm font-medium mb-2">Caption</h3>
          <div className="h-40 border border-[#222] bg-[#0a0a0a] rounded p-3 text-xs text-[#777]">
            Your live caption will appear here after the file is uploaded and processed.
          </div>
          
          <div className="flex justify-end mt-4 gap-2">
            <button type="button" className="flex items-center gap-1 bg-[#222] hover:bg-[#333] text-white py-1 px-3 rounded text-xs">
              <Edit3 className="w-3 h-3" />
              Edit Text
            </button>
            <button type="button" className="flex items-center gap-1 bg-[#222] hover:bg-[#333] text-white py-1 px-3 rounded text-xs">
              <UploadIcon className="w-3 h-3" />
              Upload Voice
            </button>
            <button type="button" className="flex items-center gap-1 bg-[#222] hover:bg-[#333] text-white py-1 px-3 rounded text-xs">
              <Mic className="w-3 h-3" />
              Record Voice
            </button>
          </div>
        </div>
        
        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-800 rounded-md text-red-200 text-xs">
            {errorMessage}
          </div>
        )}
        
        {/* Success message */}
        {uploadSuccess && (
          <div className="mt-4 p-3 bg-green-900 bg-opacity-30 border border-green-800 rounded-md text-green-200 text-xs">
            Video uploaded successfully!
          </div>
        )}
        
        {/* Upload Progress */}
        {uploading && uploadProgress > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Uploading video to Cloudinary</span>
              <span className="text-xs text-gray-400">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-[#222] rounded-full h-2.5">
              <div 
                className="bg-[#ED5606] h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Generate Button */}
        <div className="flex justify-end mt-auto pt-4">
          <button 
            onClick={handleUpload}
            disabled={uploading || !videoFile}
            style={gradientButtonStyle}
            className="flex items-center gap-2 text-white px-6 py-2 text-sm font-medium"
          >
            {uploading ? (
              <>
                <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              <>
                Get Started
                <ArrowUpRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
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