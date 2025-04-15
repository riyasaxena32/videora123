import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, UploadCloud, ChevronDown, Edit3, Upload as UploadIcon, Mic, HelpCircle, ArrowUpRight, ArrowLeft, ChevronRight, Tag, Video, Clock } from 'lucide-react';

function CreatePage() {
  const [activeTab, setActiveTab] = useState('Generate Video');
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState(null);

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

  // Content to display based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'Generate Video':
        return <GenerateVideoContent gradientButtonStyle={gradientButtonStyle} />;
      case 'AI Video Edit':
        return <AIVideoEditContent gradientButtonStyle={gradientButtonStyle} />;
      case 'Video Narration':
        return <VideoNarrationContent gradientButtonStyle={gradientButtonStyle} />;
      case 'Upload Video':
        return (
          <UploadVideoContent 
            gradientButtonStyle={gradientButtonStyle} 
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            uploadSuccess={uploadSuccess}
            setUploadSuccess={setUploadSuccess}
            uploadedVideo={uploadedVideo}
            setUploadedVideo={setUploadedVideo}
            navigate={navigate}
          />
        );
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
            {['Generate Video', 'AI Video Edit', 'Video Narration', 'Upload Video'].map((tab) => (
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
            <span className="text-xl font-bold">+</span>
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-[#2f2f2f] hover:bg-[#414141] rounded-full transition-colors">
            <img
              src="/user-avatar.png"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* Main Content */}
      {renderContent()}
    </div>
  );
}

// Upload Video Tab Content - New component for video uploads
function UploadVideoContent({ 
  gradientButtonStyle, 
  isUploading, 
  setIsUploading, 
  uploadSuccess, 
  setUploadSuccess,
  uploadedVideo,
  setUploadedVideo,
  navigate
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Education',
    tags: '',
    thumbnailLogoUrl: 'https://i.imgur.com/kVtpynm.jpg',
    videoUrl: 'https://media.istockphoto.com/id/1387190930/video/digital-particle-wave-and-light-abstract-background.mp4?s=mp4-640x640-is&k=20&c=o_TRLQDGvNlxGpYfrMEMGCgNANA-Nt9lWe6fYYGWISY=',
    duration: 300,
    uploadedBy: 'Ashish Mishra',
    views: 0,
    likes: 0,
    dislikes: 0,
    comments: [],
    isPublic: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTagsChange = (e) => {
    const tagsValue = e.target.value;
    setFormData({
      ...formData,
      tags: tagsValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format the form data to match the expected API structure
    const apiData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()), // Convert comma-separated tags to array
    };
    
    setIsUploading(true);
    
    try {
      const response = await fetch('https://videora-ai.onrender.com/videos/upload-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUploadSuccess(true);
        setUploadedVideo(data.PostingVideo);
        console.log('Upload successful:', data);
      } else {
        console.error('Upload failed:', data);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const viewUploadedVideo = () => {
    if (uploadedVideo && uploadedVideo._id) {
      navigate(`/video/${uploadedVideo._id}`);
    }
  };

  if (uploadSuccess && uploadedVideo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#111]">
        <div className="max-w-lg w-full bg-[#1A1A1A] rounded-lg p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-[#270E00] rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="#ED5606" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Upload Successful</h2>
          <p className="text-[#999] mb-6">Your video has been uploaded successfully</p>
          
          <div className="border border-[#333] rounded-lg p-4 mb-6 text-left">
            <h3 className="text-lg font-medium mb-2">{uploadedVideo.name}</h3>
            <p className="text-sm text-[#999] mb-4">{uploadedVideo.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {uploadedVideo.tags.map((tag, index) => (
                <span key={index} className="bg-[#270E00] text-[#ED5606] px-2 py-1 rounded-sm text-xs">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center text-sm text-[#999]">
              <span className="flex items-center mr-4">
                <Tag className="w-4 h-4 mr-1" />
                {uploadedVideo.category}
              </span>
              <span className="flex items-center mr-4">
                <Clock className="w-4 h-4 mr-1" />
                {Math.floor(uploadedVideo.duration / 60)}:{(uploadedVideo.duration % 60).toString().padStart(2, '0')}
              </span>
              <span className="flex items-center">
                <Video className="w-4 h-4 mr-1" />
                ID: {uploadedVideo._id.substr(0, 8)}...
              </span>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button 
              className="px-6 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg hover:bg-[#222]"
              onClick={() => {
                setUploadSuccess(false);
                setUploadedVideo(null);
                setFormData({
                  name: '',
                  description: '',
                  category: 'Education',
                  tags: '',
                  thumbnailLogoUrl: 'https://i.imgur.com/kVtpynm.jpg',
                  videoUrl: 'https://media.istockphoto.com/id/1387190930/video/digital-particle-wave-and-light-abstract-background.mp4?s=mp4-640x640-is&k=20&c=o_TRLQDGvNlxGpYfrMEMGCgNANA-Nt9lWe6fYYGWISY=',
                  duration: 300,
                  uploadedBy: 'Ashish Mishra',
                  views: 0,
                  likes: 0,
                  dislikes: 0,
                  comments: [],
                  isPublic: true
                });
              }}
            >
              Upload Another
            </button>
            <button 
              style={gradientButtonStyle}
              className="px-6 py-2 text-white"
              onClick={viewUploadedVideo}
            >
              View Video
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Upload Your Video</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Video details */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Video Title</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:outline-none focus:border-[#ED5606]"
                placeholder="Enter video title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:outline-none focus:border-[#ED5606] min-h-[120px]"
                placeholder="Enter video description"
                required
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleTagsChange}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:outline-none focus:border-[#ED5606]"
                placeholder="e.g. coding, tutorial, education"
              />
            </div>
          </div>
          
          {/* Right column - Additional settings */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:outline-none focus:border-[#ED5606]"
              >
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Gaming">Gaming</option>
                <option value="Tech">Tech</option>
                <option value="Music">Music</option>
                <option value="News">News</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:outline-none focus:border-[#ED5606]"
                placeholder="Duration in seconds"
                min="1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Creator Name</label>
              <input
                type="text"
                name="uploadedBy"
                value={formData.uploadedBy}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:outline-none focus:border-[#ED5606]"
                placeholder="Your name"
                required
              />
            </div>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={() => setFormData({...formData, isPublic: !formData.isPublic})}
                className="mr-2"
              />
              <label htmlFor="isPublic" className="text-sm">Make this video public</label>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                style={gradientButtonStyle}
                className="flex items-center gap-2 text-white px-6 py-2 text-sm font-medium"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Video'}
                {!isUploading && <ArrowUpRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Generate Video Tab Content
function GenerateVideoContent({ gradientButtonStyle }) {
  return (
    <div className="flex-1 grid grid-cols-3 gap-6 p-6">
      {/* Left Panel: Upload Media */}
      <div className="flex flex-col space-y-6">
        <h2 className="text-sm font-medium">Upload Your Media</h2>
        <div className="flex-1 border border-[#333] bg-[#111] rounded-md flex flex-col items-center justify-center p-6">
          <div className="w-full h-36 border-2 border-dashed border-[#333] rounded-md flex flex-col items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8 text-[#666] mb-2" />
            <button className="mt-2 text-[#666]">
              <Upload className="w-5 h-5" />
            </button>
          </div>
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
            <button className="flex items-center gap-1 bg-[#222] hover:bg-[#333] text-white py-1 px-3 rounded text-xs">
              <Edit3 className="w-3 h-3" />
              Edit Text
            </button>
            <button className="flex items-center gap-1 bg-[#222] hover:bg-[#333] text-white py-1 px-3 rounded text-xs">
              <UploadIcon className="w-3 h-3" />
              Upload Voice
            </button>
            <button className="flex items-center gap-1 bg-[#222] hover:bg-[#333] text-white py-1 px-3 rounded text-xs">
              <Mic className="w-3 h-3" />
              Record Voice
            </button>
          </div>
        </div>
        
        {/* Generate Button */}
        <div className="flex justify-end mt-auto pt-4">
          <button 
            style={gradientButtonStyle}
            className="flex items-center gap-2 text-white px-6 py-2 text-sm font-medium"
          >
            Get Started
            <ArrowUpRight className="w-4 h-4" />
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