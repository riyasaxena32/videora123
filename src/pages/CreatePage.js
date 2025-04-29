import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, UploadCloud, ChevronDown, Edit3, Upload as UploadIcon, Mic, HelpCircle, ArrowUpRight, ArrowLeft, ChevronRight, User, LogOut, Plus, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'ljildkpe'; // User's upload preset
const CLOUDINARY_CLOUD_NAME = 'dnxgnecn7'; // User's cloud name
const CLOUDINARY_API_KEY = '184426529586122'; // User's API key

function CreatePage() {
  const [activeTab, setActiveTab] = useState('Generate Video');
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#1a1a1a]">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <img src="/Play.png" alt="VIDEORA" className="h-8 md:h-12" />
          </Link>
        </div>
        
        {/* Hamburger menu for mobile */}
        <button 
          className="md:hidden text-white p-1"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        
        {/* Center navigation items - hide on mobile */}
        <div className="hidden md:flex flex-1 justify-center">
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
        
        {/* Profile and create buttons - hide on mobile when menu closed */}
        <div className="hidden md:flex items-center gap-4">
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
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/user-avatar.png";
                }}
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111] border-b border-[#333] z-40">
          <nav className="flex flex-col py-2">
            {['Generate Video', 'AI Video Edit', 'Video Narration'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-3 text-left text-sm transition-colors ${
                  activeTab === tab ? 'text-[#ED5606] bg-[#1A1A1A]' : 'text-[#b0b0b0] hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
              >
                {tab}
              </button>
            ))}
            <div className="border-t border-[#333] my-2"></div>
            <div className="flex items-center justify-between px-4 py-2">
              <Link to="/profile" className="flex items-center gap-2 text-sm text-white">
                <User className="w-4 h-4" />
                Profile
              </Link>
              <button 
                style={gradientButtonStyle}
                className="flex items-center gap-1 text-white px-3 py-1 text-xs transition-colors font-medium"
              >
                Create
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </nav>
        </div>
      )}

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
    videoURL: '',
    duration: 0,
    isPublic: true
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [voiceFile, setVoiceFile] = useState(null);
  const [creativePrompt, setCreativePrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('cartoon');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadResponse, setUploadResponse] = useState(null);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingError, setRecordingError] = useState('');
  
  const { user } = useAuth();
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const voiceInputRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  // Available video styles
  const videoStyles = [
    { name: 'cartoon', label: 'Cartoon' },
    { name: 'realistic', label: 'Realistic' },
    { name: 'anime', label: 'Anime' },
    { name: '3d', label: '3D Animation' },
    { name: 'pixar', label: 'Pixar Style' }
  ];

  // Available video categories
  const videoCategories = [
    { value: 'Education', label: 'Education' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Music', label: 'Music' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Cooking', label: 'Cooking' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Business', label: 'Business' },
    { value: 'Science', label: 'Science' },
    { value: 'Health', label: 'Health' },
    { value: 'Other', label: 'Other' }
  ];

  const handleStyleChange = (e) => {
    setSelectedStyle(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setVideoData(prevData => ({
      ...prevData,
      category: e.target.value
    }));
  };

  // Update handlePromptChange to only update state, not trigger API
  const handlePromptChange = async (e) => {
    const newPrompt = e.target.value;
    setCreativePrompt(newPrompt);
    
    // Also store in video data description
    setVideoData(prevData => ({
      ...prevData,
      description: newPrompt
    }));
  };

  // Handle video or image selection
  const handleVideoSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type - now accept both videos and images
      const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/mpeg'];
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      const isVideo = validVideoTypes.includes(file.type);
      const isImage = validImageTypes.includes(file.type);
      
      if (!isVideo && !isImage) {
        setErrorMessage(`Invalid file type. Please upload a valid video or image format.`);
        return;
      }
      
      // Check file size
      const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for video, 10MB for image
      if (file.size > maxSize) {
        setErrorMessage(`File too large. Maximum size is ${isVideo ? '100MB' : '10MB'}. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        return;
      }
      
      setVideoFile(file);
      setErrorMessage('');
      
      try {
        // Create temporary URL for the file
        const fileURL = URL.createObjectURL(file);
        
        if (isVideo) {
          // Handle video
          const videoElement = document.createElement('video');
          videoElement.src = fileURL;
          
          // Wait for metadata to load to get duration
          await new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
              resolve();
            };
          });
          
          // Duration in seconds
          const durationInSeconds = Math.floor(videoElement.duration);
          
          // Update state with video info
          setVideoData({
            ...videoData,
            duration: durationInSeconds,
            videoURL: fileURL, // Temporary URL for preview
            name: file.name.split('.')[0] // Use filename as the video name
          });
        } else {
          // Handle image
          // If it's an image, set it as both video source and thumbnail
          setVideoData({
            ...videoData,
            videoURL: fileURL, // Temporary URL for preview
            name: file.name.split('.')[0], // Use filename as the name
            duration: 0 // No duration for images
          });
          
          // Also set it as a thumbnail if no thumbnail is already set
          if (!thumbnailFile) {
            setThumbnailFile(file);
            setVideoData(prevData => ({
              ...prevData,
              thumbnailLogoUrl: fileURL
            }));
          }
        }
      } catch (error) {
        console.error('Error processing file:', error);
        setErrorMessage('Failed to process file. Please try again.');
      }
    }
  };

  // Handle voice file upload
  const handleVoiceSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/ogg'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage(`Invalid audio file type. Please upload a valid audio format (MP3, WAV, M4A, OGG)`);
        return;
      }
      
      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setErrorMessage(`Audio file too large. Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        return;
      }
      
      setVoiceFile(file);
      setErrorMessage('');
      
      // Update caption with the voice file name
      if (!caption) {
        setCaption(file.name.split('.')[0]);
      }
    }
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  // Voice recording functionality
  const startRecording = async () => {
    try {
      setRecordingError('');
      
      // Reset previous recording if any
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
        setAudioURL('');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];
      
      recorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });
      
      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Convert Blob to File object for upload
        const audioFile = new File([audioBlob], `recording-${Date.now()}.mp3`, { 
          type: 'audio/mpeg',
          lastModified: new Date().getTime()
        });
        
        setVoiceFile(audioFile);
        
        // Update caption with recording name if empty
        if (!caption) {
          setCaption(`Voice Recording ${new Date().toLocaleTimeString()}`);
        }
        
        // Stop all tracks on the stream
        stream.getTracks().forEach(track => track.stop());
      });
      
      // Start recording
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingError('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
    }
  };
  
  // Format recording time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  // Add Cloudinary upload function
  const uploadToCloudinary = async (file, fileType = 'video') => {
    try {
      setUploading(true);
      setErrorMessage('');
      
      // Create form data for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('api_key', CLOUDINARY_API_KEY);
      
      // Upload to Cloudinary - use different resource type based on file
      const resourceType = fileType === 'image' ? 'image' : 'video';
      
      // Upload to Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              console.log(`Cloudinary ${fileType} upload progress: ${percentCompleted}%`);
              setUploadProgress(percentCompleted);
            }
          }
        }
      );
      
      console.log(`Cloudinary ${fileType} response:`, response.data);
      
      // Return the secure URL from Cloudinary
      return response.data.secure_url;
    } catch (error) {
      console.error(`Error uploading ${fileType} to Cloudinary:`, error);
      throw new Error(`Cloudinary ${fileType} upload failed: ${error.message}`);
    }
  };

  // Modified handleUpload function to upload to Cloudinary first
  const handleUpload = async () => {
    if (!videoFile && !videoData.videoURL) {
      setErrorMessage('Please upload a video or image file');
      return;
    }
    
    try {
      setUploading(true);
      setUploadProgress(0);
      setErrorMessage('');
      
      // Get the token from local storage
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      
      console.log('Token found:', !!token);
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Determine file types
      const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/mpeg'];
      const isVideoFile = videoFile && validVideoTypes.includes(videoFile.type);
      
      // Upload to Cloudinary if there's a file
      let cloudinaryVideoURL = videoData.videoURL;
      if (videoFile) {
        // Use appropriate upload type (video or image)
        const fileType = isVideoFile ? 'video' : 'image';
        setErrorMessage(`Uploading ${fileType} to Cloudinary...`);
        cloudinaryVideoURL = await uploadToCloudinary(videoFile, fileType);
        setVideoData(prevData => ({
          ...prevData,
          videoURL: cloudinaryVideoURL
        }));
      }
      
      if (!cloudinaryVideoURL) {
        throw new Error('Failed to get a valid file URL');
      }
      
      // Upload thumbnail to Cloudinary if available and different from main file
      let cloudinaryThumbnailURL = videoData.thumbnailLogoUrl;
      if (thumbnailFile && (!videoFile || (videoFile && thumbnailFile !== videoFile))) {
        setErrorMessage('Uploading thumbnail to Cloudinary...');
        cloudinaryThumbnailURL = await uploadToCloudinary(thumbnailFile, 'image');
        setVideoData(prevData => ({
          ...prevData,
          thumbnailLogoUrl: cloudinaryThumbnailURL
        }));
      } else if (videoFile && !isVideoFile && !thumbnailFile) {
        // If user uploaded an image as main file and no thumbnail, use the same URL for thumbnail
        cloudinaryThumbnailURL = cloudinaryVideoURL;
      }
      
      // Upload voice file if available
      let cloudinaryVoiceURL = '';
      if (voiceFile) {
        setErrorMessage('Uploading voice to Cloudinary...');
        cloudinaryVoiceURL = await uploadToCloudinary(voiceFile, 'video'); // Audio uploads use video endpoint in Cloudinary
        console.log('Voice URL:', cloudinaryVoiceURL);
      }
      
      console.log('Uploading media info to API...');
      
      // Create JSON payload matching the curl request structure
      const videoPayload = {
        name: videoData.name || caption || 'Untitled Media',
        description: creativePrompt || 'No description provided',
        category: videoData.category || 'Education',
        tags: videoData.tags || [selectedStyle, isVideoFile ? 'video' : 'image'],
        thumbnailLogoUrl: cloudinaryThumbnailURL || '',
        videoURL: cloudinaryVideoURL,
        duration: videoData.duration || 0,
        uploadedBy: user?.name || 'Anonymous User',
        views: 0,
        likes: 0,
        dislikes: 0,
        comments: [],
        isPublic: videoData.isPublic,
        // Add the new fields
        style: selectedStyle,
        prompt: creativePrompt || '',
        caption: caption || videoData.name || 'Untitled Media',
        voiceURL: cloudinaryVoiceURL
      };
      
      console.log('Payload:', videoPayload);
      
      // Make API request
      const response = await axios.post(
        'https://videora-ai.onrender.com/videos/upload-videos',
        videoPayload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Upload response full:', JSON.stringify(response.data));
      console.log('Saved video fields:', Object.keys(response.data.savedvideo || {}));
      console.log('videoURL in payload:', videoPayload.videoURL);
      
      // Store the full response data
      setUploadResponse(response.data);
      
      // Update videoData with the response and preserve videoURL if missing
      if (response.data && response.data.savedvideo) {
        const savedVideo = response.data.savedvideo;
        
        // Check if videoURL is missing but videoURL exists (case difference)
        const responseVideoURL = savedVideo.videoURL || savedVideo.videoURL || cloudinaryVideoURL;
        
        setVideoData(prevData => ({
          ...prevData,
          ...savedVideo,
          videoURL: responseVideoURL // Ensure we have the video URL
        }));
        
        // Add videoURL to the response object if it's missing
        if (!savedVideo.videoURL && cloudinaryVideoURL) {
          response.data.savedvideo.videoURL = cloudinaryVideoURL;
        }
      }
      
      setUploadSuccess(true);
      setErrorMessage('');
      setUploading(false);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error uploading media:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error occurred';
      setErrorMessage(`Error: ${errorMsg}`);
      setUploading(false);
    }
  };

  // Reset form to create a new video
  const handleResetForm = () => {
    setVideoFile(null);
    setThumbnailFile(null);
    setVoiceFile(null);
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL('');
    }
    if (videoData.thumbnailLogoUrl && thumbnailFile) {
      URL.revokeObjectURL(videoData.thumbnailLogoUrl);
    }
    setCreativePrompt('');
    setCaption('');
    setUploadResponse(null);
    setErrorMessage('');
    setUploadSuccess(false);
    setVideoData({
      name: '',
      description: '',
      category: 'Education',
      tags: [],
      thumbnailLogoUrl: '',
      videoURL: '',
      duration: 0,
      isPublic: true
    });
  };

  const triggerVideoInput = () => {
    videoInputRef.current.click();
  };

  const triggerVoiceInput = () => {
    voiceInputRef.current.click();
  };

  // Handle thumbnail selection
  const handleThumbnailSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage(`Invalid thumbnail type. Please upload a valid image format (JPG, PNG, WebP)`);
        return;
      }
      
      // Check file size (limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrorMessage(`Thumbnail too large. Maximum size is 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        return;
      }
      
      setThumbnailFile(file);
      setErrorMessage('');
      
      // Create temporary URL for preview
      const thumbnailURL = URL.createObjectURL(file);
      setVideoData(prevData => ({
        ...prevData,
        thumbnailLogoUrl: thumbnailURL // Temporary URL for preview
      }));
    }
  };

  const triggerThumbnailInput = () => {
    thumbnailInputRef.current.click();
  };

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="flex flex-col md:grid md:grid-cols-3 md:gap-6">
        {/* Left Panel: Upload Media - Full width on mobile */}
        <div className="flex flex-col space-y-4 md:space-y-6 mb-6 md:mb-0">
          <h2 className="text-sm font-medium">Upload Your Media</h2>
          <div className="flex-1 border border-[#333] bg-[#111] rounded-md flex flex-col items-center justify-center p-4 md:p-6">
            <div 
              onClick={triggerVideoInput}
              className="w-full h-36 border-2 border-dashed border-[#333] rounded-md flex flex-col items-center justify-center mb-4 cursor-pointer hover:border-[#ED5606] transition-colors"
            >
              {videoFile ? (
                <div className="flex flex-col items-center">
                  {videoFile.type.startsWith('video/') ? (
                    <video className="h-24 max-w-full" controls>
                      <source src={videoData.videoURL} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img 
                      src={videoData.videoURL} 
                      alt="Image preview" 
                      className="h-24 max-w-full object-cover" 
                    />
                  )}
                  <p className="text-xs text-[#ED5606] mt-2 truncate max-w-full px-2">{videoFile.name}</p>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-[#666] mb-2" />
                  <p className="text-xs text-center text-[#777] px-2">
                    Drag and drop your video or image here, or click here to upload.
                  </p>
                </>
              )}
            </div>
            <input 
              ref={videoInputRef}
              type="file" 
              accept="video/*,image/*" 
              className="hidden"
              onChange={handleVideoSelect}
            />
            
            {/* Add thumbnail upload button */}
            <div className="w-full mt-4">
              <div 
                onClick={triggerThumbnailInput}
                className="w-full h-16 border-2 border-dashed border-[#333] rounded-md flex items-center justify-between px-4 py-2 cursor-pointer hover:border-[#ED5606] transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#191919] rounded overflow-hidden flex-shrink-0 flex items-center justify-center mr-3">
                    {thumbnailFile ? (
                      <img 
                        src={videoData.thumbnailLogoUrl} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <UploadIcon className="w-4 h-4 text-[#666]" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium">
                      {thumbnailFile ? 'Change thumbnail' : 'Upload custom thumbnail'}
                    </p>
                    <p className="text-[10px] text-[#777]">
                      {thumbnailFile ? thumbnailFile.name : 'JPG, PNG, or WebP (max 5MB)'}
                    </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="bg-[#191919] rounded px-2 py-1 text-xs hover:bg-[#333]"
                >
                  {thumbnailFile ? 'Change' : 'Upload'}
                </button>
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
          
          {/* Style Selector - Visible on mobile, hidden on desktop (duplicate) */}
          <div className="md:hidden">
            <h2 className="text-sm font-medium">Pick Your Style</h2>
            <div className="border border-[#333] bg-[#111] rounded-md p-4 mt-2">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Select a style for your video</span>
                </div>
                <select 
                  value={selectedStyle}
                  onChange={handleStyleChange}
                  className="w-full bg-[#191919] border border-[#333] rounded-md p-2 text-sm text-white focus:outline-none focus:border-[#ED5606]"
                >
                  {videoStyles.map(style => (
                    <option key={style.name} value={style.name}>{style.label}</option>
                  ))}
                </select>
                <p className="text-xs text-[#777] pl-1">Choose a style that matches your video's desired look and feel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Panel: Creative Prompt - Hidden on mobile in this position */}
        <div className="hidden md:flex md:flex-col space-y-6">
          <h2 className="text-sm font-medium">Pick Your Style</h2>
          <div className="border border-[#333] bg-[#111] rounded-md p-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Select a style for your video</span>
              </div>
              <select 
                value={selectedStyle}
                onChange={handleStyleChange}
                className="w-full bg-[#191919] border border-[#333] rounded-md p-2 text-sm text-white focus:outline-none focus:border-[#ED5606]"
              >
                {videoStyles.map(style => (
                  <option key={style.name} value={style.name}>{style.label}</option>
                ))}
              </select>
              <p className="text-xs text-[#777] pl-1">Choose a style that matches your video's desired look and feel</p>
            </div>
          </div>
          
          {/* Category Selector */}
          <h2 className="text-sm font-medium">Select Video Category</h2>
          <div className="border border-[#333] bg-[#111] rounded-md p-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Choose a category for your video</span>
              </div>
              <select 
                value={videoData.category}
                onChange={handleCategoryChange}
                className="w-full bg-[#191919] border border-[#333] rounded-md p-2 text-sm text-white focus:outline-none focus:border-[#ED5606]"
              >
                {videoCategories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
              <p className="text-xs text-[#777] pl-1">Categorizing your video helps viewers find your content</p>
            </div>
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

        {/* Category Selector - Mobile only */}
        <div className="md:hidden mb-6">
          <h2 className="text-sm font-medium">Select Video Category</h2>
          <div className="border border-[#333] bg-[#111] rounded-md p-4 mt-2">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Choose a category for your video</span>
              </div>
              <select 
                value={videoData.category}
                onChange={handleCategoryChange}
                className="w-full bg-[#191919] border border-[#333] rounded-md p-2 text-sm text-white focus:outline-none focus:border-[#ED5606]"
              >
                {videoCategories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
              <p className="text-xs text-[#777] pl-1">Categorizing your video helps viewers find your content</p>
            </div>
          </div>
          
          <h2 className="text-sm font-medium mt-4">Add Your Creative Prompt</h2>
          <div className="border border-[#333] bg-[#111] rounded-md p-4 mt-2">
            <textarea 
              className="w-full h-[150px] bg-transparent border-none text-[#999] text-sm focus:outline-none resize-none"
              placeholder="Type what you want in your video.

For example, 'Make it look like a sunny day at the beach.'"
              value={creativePrompt}
              onChange={handlePromptChange}
            ></textarea>
          </div>
        </div>

        {/* Right Panel: Audio & Caption */}
        <div className="flex flex-col space-y-4 md:space-y-6">
          <h2 className="text-sm font-medium">Add Audio</h2>
          <div className="border border-[#333] bg-[#111] rounded-md p-4">
            <h3 className="text-sm font-medium mb-2">Caption</h3>
            <div className="h-40 border border-[#222] bg-[#0a0a0a] rounded p-3 text-xs text-[#777]">
              {uploadResponse ? (
                <div className="h-full overflow-y-auto">
                  <p className="mb-2 text-green-400">Upload Successful!</p>
                  <p className="mb-1">Name: {uploadResponse.savedvideo?.name || 'None'}</p>
                  <p className="mb-1">Style: {uploadResponse.savedvideo?.style || 'None'}</p>
                  <p className="mb-1"><span className="text-[#ED5606] font-medium">Category:</span> {uploadResponse.savedvideo?.category || videoData.category || 'None'}</p>
                  <p className="mb-1">Caption: {uploadResponse.savedvideo?.caption || 'None'}</p>
                  <p className="mb-1">ID: {uploadResponse.savedvideo?._id || 'Unknown'}</p>
                  <p className="mb-1 break-all">Video URL: {uploadResponse.savedvideo?.videoURL || uploadResponse.savedvideo?.videoURL || 'Not returned from server'}</p>
                  <p className="mb-1 break-all">Thumbnail URL: {uploadResponse.savedvideo?.thumbnailLogoUrl || 'None'}</p>
                  <p className="mb-1 break-all">Voice URL: {uploadResponse.savedvideo?.voiceURL || 'None'}</p>
                  <p className="mb-1">Upload Date: {uploadResponse.savedvideo?.uploadDate ? new Date(uploadResponse.savedvideo.uploadDate).toLocaleString() : 'Unknown'}</p>
                  <p className="mb-1 break-all">Status: {uploadResponse.message || 'Unknown'}</p>
                  <p className="mt-3 text-xs text-yellow-400">Note: If Video URL is missing in the response, check your backend schema.</p>
                </div>
              ) : (
                <>
                  <textarea
                    className="w-full h-full bg-transparent border-none resize-none text-white focus:outline-none"
                    placeholder="Enter a caption for your video"
                    value={caption}
                    onChange={handleCaptionChange}
                  ></textarea>
                </>
              )}
            </div>
            
            {/* Voice recording controls */}
            {audioURL && (
              <div className="mt-3 border border-[#222] bg-[#111] rounded p-2">
                <audio ref={audioRef} src={audioURL} className="w-full h-8 mt-1" controls />
              </div>
            )}
            
            {recordingError && (
              <div className="mt-2 text-red-400 text-xs">
                {recordingError}
              </div>
            )}
            
            <div className="flex flex-wrap justify-end mt-4 gap-2">
              <button type="button" className="flex items-center gap-1 bg-[#222] hover:bg-[#333] text-white py-1 px-3 rounded text-xs">
                <Edit3 className="w-3 h-3" />
                Edit Text
              </button>
              <button 
                type="button" 
                className="flex items-center gap-1 bg-[#222] hover:bg-[#333] text-white py-1 px-3 rounded text-xs"
                onClick={triggerVoiceInput}
              >
                <UploadIcon className="w-3 h-3" />
                {voiceFile && !isRecording && !audioURL ? 
                  (window.innerWidth < 768 ? voiceFile.name.substring(0, 8) + '...' : voiceFile.name.substring(0, 15) + '...') 
                  : 'Upload Voice'}
              </button>
              <input 
                ref={voiceInputRef}
                type="file" 
                accept="audio/*" 
                className="hidden"
                onChange={handleVoiceSelect}
              />
              <button 
                type="button" 
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-1 ${isRecording ? 'bg-red-700 hover:bg-red-800' : 'bg-[#222] hover:bg-[#333]'} text-white py-1 px-3 rounded text-xs`}
              >
                <Mic className={`w-3 h-3 ${isRecording ? 'animate-pulse' : ''}`} />
                {isRecording ? `Recording ${formatTime(recordingTime)}...` : 'Record Voice'}
              </button>
            </div>
          </div>
          
          {/* Error message */}
          {errorMessage && (
            <div className="mt-2 p-3 bg-red-900 bg-opacity-30 border border-red-800 rounded-md text-red-200 text-xs">
              <div className="font-medium mb-1">Error:</div>
              {errorMessage}
            </div>
          )}
          
          {/* Upload progress */}
          {uploading && (
            <div className="mt-2 p-3 bg-[#1A1A1A] border border-[#333] rounded-md">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#999]">
                  {uploadProgress < 100 ? 
                    (videoFile && !videoData.videoURL ? 'Uploading to Cloudinary...' : 'Processing...') 
                    : 'Finalizing...'}
                </span>
                <span className="text-[#ED5606]">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[#333] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#ED5606] h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Success message */}
          {uploadSuccess && !errorMessage && (
            <div className="mt-2 p-3 bg-green-900 bg-opacity-30 border border-green-800 rounded-md text-green-200 text-xs">
              <div className="font-medium mb-1">Success!</div>
              <p>Video uploaded successfully to Cloudinary and saved to Videora.</p>
              <p className="mt-1">You can view the details in the caption box.</p>
            </div>
          )}
          
          {/* Generate Button */}
          <div className="flex justify-center md:justify-end mt-4 md:mt-auto pt-4 gap-2">
            {uploadResponse && (
              <button 
                onClick={handleResetForm}
                className="flex items-center gap-2 text-white bg-[#333] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#444] transition-colors"
              >
                Upload New Video
              </button>
            )}
            
            <button 
              onClick={handleUpload}
              disabled={uploading || !videoFile || uploadResponse}
              style={gradientButtonStyle}
              className={`flex items-center gap-2 text-white px-6 py-2 text-sm font-medium ${(uploading || !videoFile || uploadResponse) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? (
                <>
                  <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Uploading {uploadProgress > 0 ? `(${uploadProgress}%)` : '...'}
                </>
              ) : (
                <>
                  {uploadResponse ? 'Uploaded' : 'Upload Media'}
                  {!uploadResponse && <ArrowUpRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// AI Video Edit Tab Content
function AIVideoEditContent({ gradientButtonStyle }) {
  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="text-center md:text-left">
        <h2 className="text-xl font-bold mb-4">AI Video Edit</h2>
        <p className="text-sm text-[#999]">This feature is coming soon.</p>
        
        <div className="mt-8 p-6 border border-[#333] bg-[#111] rounded-md max-w-lg mx-auto md:mx-0">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-4">
              <Edit3 className="w-8 h-8 text-[#666]" />
            </div>
            <h3 className="text-lg font-medium mb-2">AI Video Editing</h3>
            <p className="text-sm text-center text-[#777] mb-6">
              Automatically enhance your videos with AI-powered editing features. 
              Trim, add effects, and more with just a few clicks.
            </p>
            <button 
              style={gradientButtonStyle}
              className="flex items-center gap-2 text-white px-6 py-2 text-sm font-medium opacity-50 cursor-not-allowed"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
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
      <div className="flex flex-col md:flex-row flex-1 max-h-[calc(100vh-4.5rem)]">
        {/* Left side - Video player */}
        <div className="w-full md:w-3/5 p-3 flex flex-col">
          {/* Video preview */}
          <div className="relative bg-[#0A0A0A] rounded-md overflow-hidden" style={{ height: 'min(30vh, 300px)' }}>
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
        <div className="w-full md:w-2/5 border-t md:border-t-0 md:border-l border-[#222] flex flex-col">
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
                  style={{ height: '10vh' }}
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