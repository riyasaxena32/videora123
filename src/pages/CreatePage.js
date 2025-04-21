import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, UploadCloud, ChevronDown, Edit3, Upload as UploadIcon, Mic, HelpCircle, ArrowUpRight, ArrowLeft, ChevronRight, User, LogOut, Plus, Video, Users, Settings, Clock, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function CreatePage() {
  const [activeTab, setActiveTab] = useState('Generate Video');
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userVideos, setUserVideos] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const profileDropdownRef = useRef(null);
  const sidebarRef = useRef(null);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Fetch user videos and creators on component mount
  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        
        if (!token) {
          console.error('No authentication token found');
          return;
        }
        
        // Fetch videos uploaded by current user
        const response = await axios.get(
          'https://videora-ai.onrender.com/videos/get-videos',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (response.data && Array.isArray(response.data)) {
          // Filter to only show videos uploaded by current user
          const userVideosList = response.data.filter(video => 
            video.uploadedBy === user?.name || video.uploadedBy === user?.email
          );
          setUserVideos(userVideosList);
          
          // Extract unique creators from all videos
          const uniqueCreators = [...new Set(response.data.map(video => video.uploadedBy))];
          setCreators(uniqueCreators.filter(creator => creator)); // Remove null/undefined
        }
        
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserVideos();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && sidebarOpen) {
        // Only close if clicking outside when sidebar is open
        if (!event.target.closest('[data-sidebar-toggle]')) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

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

  // Render video card
  const VideoCard = ({ video }) => (
    <div className="bg-[#111] border border-[#333] rounded-md overflow-hidden">
      <div className="aspect-video bg-black relative">
        {video.videoUrl ? (
          <video 
            src={video.videoUrl} 
            className="w-full h-full object-cover"
            poster={video.thumbnailLogoUrl || '/thumbnail-placeholder.png'}
          />
        ) : (
          <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
            <Video className="w-8 h-8 text-[#444]" />
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-white truncate">{video.name || 'Untitled Video'}</h3>
        <p className="text-xs text-[#777] mt-1 line-clamp-1">{video.description || 'No description'}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1 text-xs text-[#999]">
            <Clock className="w-3 h-3" />
            <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
          </div>
          <div className="text-xs text-[#ED5606]">
            {video.style || 'Default Style'}
          </div>
        </div>
      </div>
    </div>
  );

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
            data-sidebar-toggle
            onClick={toggleSidebar}
            className="text-[#999] hover:text-white focus:outline-none transition-colors"
          >
            <Users className="w-5 h-5" />
          </button>
          
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

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 relative">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
          
          {/* My Videos Section */}
          <div className="p-6 border-t border-[#222]">
            <h2 className="text-lg font-medium mb-4">My Videos</h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED5606]"></div>
              </div>
            ) : userVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[#777]">
                <Video className="w-12 h-12 mx-auto mb-4 text-[#444]" />
                <p>You haven't uploaded any videos yet</p>
                <p className="text-sm mt-2">Create your first video to get started</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar - Creators */}
        <div 
          ref={sidebarRef}
          className={`fixed inset-y-0 right-0 w-64 bg-[#0A0A0A] border-l border-[#222] transition-transform transform z-10 overflow-y-auto
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-4 border-b border-[#222] flex justify-between items-center">
            <h2 className="font-medium">Video Creators</h2>
            <button 
              onClick={toggleSidebar}
              className="text-[#999] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-2">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ED5606]"></div>
              </div>
            ) : creators.length > 0 ? (
              <div className="space-y-1">
                {creators.map((creator, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 p-2 hover:bg-[#1a1a1a] rounded-md transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center">
                      <User className="w-4 h-4 text-[#999]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{creator}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-[#777] text-sm">No creators found</p>
            )}
          </div>
        </div>
      </div>
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

  const handleStyleChange = (e) => {
    setSelectedStyle(e.target.value);
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

  // Handle video selection without API call
  const handleVideoSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/mpeg'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage(`Invalid file type. Please upload a valid video format (${validTypes.join(', ')})`);
        return;
      }
      
      // Check file size (limit to 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      if (file.size > maxSize) {
        setErrorMessage(`File too large. Maximum size is 100MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        return;
      }
      
      setVideoFile(file);
      setErrorMessage('');
      
      try {
        // Create temporary URL for the video
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
        
        // Update state with video info
        setVideoData({
          ...videoData,
          duration: durationInSeconds,
          videoUrl: videoURL, // Temporary URL for preview
          name: file.name.split('.')[0] // Use filename as the video name
        });
      } catch (error) {
        console.error('Error processing video:', error);
        setErrorMessage('Failed to process video. Please try again.');
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

  // Modified handleUpload function to call API only on button click
  const handleUpload = async () => {
    if (!videoFile) {
      setErrorMessage('Please upload a video first');
      return;
    }
    
    try {
      setUploading(true);
      setUploadProgress(0);
      setErrorMessage('');
      
      // Get the token from local storage - use exact format from curl
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      
      console.log('Token found:', !!token); // Log if token exists
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      console.log('Uploading video to API...');
      
      // Create FormData object for multipart/form-data upload
      const formData = new FormData();
      
      // Append values in the exact same order as the curl request
      formData.append('video', videoFile);
      formData.append('style', selectedStyle);
      formData.append('prompt', creativePrompt || '');
      formData.append('caption', caption || videoData.name || '');
      
      // Add voice file if available
      if (voiceFile) {
        formData.append('voice', voiceFile);
      }
      
      // Debug logging for FormData
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        if (key === 'video') {
          console.log('video file details:', {
            name: videoFile.name,
            type: videoFile.type,
            size: videoFile.size
          });
        } else if (key === 'voice') {
          console.log('voice file details:', {
            name: voiceFile.name,
            type: voiceFile.type,
            size: voiceFile.size
          });
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      // Try using fetch instead of axios as an alternative
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, the browser will set it with the correct boundary
        },
        body: formData,
        mode: 'cors',
        credentials: 'omit'
      };
      
      // Track upload progress with XMLHttpRequest if needed
      const xhr = new XMLHttpRequest();
      const url = 'https://videora-ai.onrender.com/videos/upload-videos';
      
      // Set up progress tracking
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          console.log(`Upload progress: ${percentCompleted}%`);
          setUploadProgress(percentCompleted);
        }
      };
      
      // Set up completion handlers
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const responseData = JSON.parse(xhr.responseText);
          console.log('Upload response:', responseData);
          
          // Store the full response data
          setUploadResponse(responseData);
          
          // Update videoData with the response URL
          if (responseData && responseData.videoUrl) {
            setVideoData(prevData => ({
              ...prevData,
              videoUrl: responseData.videoUrl
            }));
          }
          
          setUploadSuccess(true);
          setErrorMessage('');
          setUploading(false);
          
          // Reset success message after 5 seconds
          setTimeout(() => {
            setUploadSuccess(false);
          }, 5000);
        } else {
          console.error('Upload failed with status:', xhr.status);
          setErrorMessage(`Server error (${xhr.status}): ${xhr.responseText || 'Unknown error'}`);
          setUploading(false);
        }
      };
      
      xhr.onerror = () => {
        console.error('XHR error occurred during upload');
        setErrorMessage('Network error occurred. This may be due to CORS restrictions. Please try again or contact support.');
        setUploading(false);
      };
      
      xhr.timeout = 300000; // 5 minutes timeout
      xhr.ontimeout = () => {
        setErrorMessage('Upload timed out. Please try with a smaller file or check your connection.');
        setUploading(false);
      };
      
      // Open the request and send the form data
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
      
      // Note: We don't need to set the response or success states here
      // as they will be set in the xhr.onload handler above
      // We're also not setting uploading to false here, as that will be done in the handlers
      
    } catch (error) {
      console.error('Error setting up upload:', error);
      setErrorMessage(`Error preparing upload: ${error.message}`);
      setUploading(false);
    }
  };

  // Reset form to create a new video
  const handleResetForm = () => {
    setVideoFile(null);
    setVoiceFile(null);
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL('');
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
      videoUrl: '',
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
            {uploadResponse ? (
              <div className="h-full overflow-y-auto">
                <p className="mb-2 text-green-400">Upload Successful!</p>
                <p className="mb-1">Caption: {uploadResponse.video?.caption || 'None'}</p>
                <p className="mb-1">Style: {uploadResponse.video?.style || 'None'}</p>
                <p className="mb-1">ID: {uploadResponse.video?._id || 'Unknown'}</p>
                <p className="mb-1">Upload Date: {uploadResponse.video?.uploadDate ? new Date(uploadResponse.video.uploadDate).toLocaleString() : 'Unknown'}</p>
                <p className="mb-1 break-all">Video URL: {uploadResponse.videoUrl || 'Not available'}</p>
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
          
          <div className="flex justify-end mt-4 gap-2">
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
              {voiceFile && !isRecording && !audioURL ? voiceFile.name.substring(0, 15) + '...' : 'Upload Voice'}
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
          <div className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-800 rounded-md text-red-200 text-xs">
            <div className="font-medium mb-1">Error uploading video:</div>
            {errorMessage}
          </div>
        )}
        
        {/* Upload progress */}
        {uploading && (
          <div className="mt-4 p-3 bg-[#1A1A1A] border border-[#333] rounded-md">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#999]">Uploading video...</span>
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
          <div className="mt-4 p-3 bg-green-900 bg-opacity-30 border border-green-800 rounded-md text-green-200 text-xs">
            <div className="font-medium mb-1">Success!</div>
            Video uploaded successfully! You can view the details in the caption box.
          </div>
        )}
        
        {/* Generate Button */}
        <div className="flex justify-end mt-auto pt-4 gap-2">
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
                {uploadResponse ? 'Uploaded' : 'Get Started'}
                {!uploadResponse && <ArrowUpRight className="w-4 h-4" />}
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