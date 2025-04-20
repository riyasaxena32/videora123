import React, { useState, useRef } from 'react';
import axios from 'axios';

const VideoUploader = ({ onVideoUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      setError(null);
    } else if (selectedFile) {
      setError('Please select a valid video file');
      setFile(null);
    }
  };

  const uploadVideo = async () => {
    if (!file) {
      setError('Please select a video file to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    // Create FormData
    const formData = new FormData();
    formData.append('video', file);

    try {
      // Upload to a temporary storage service first
      const response = await axios.post('https://temporary-upload-service.example.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      // If successful, call the onVideoUploaded callback with the URL
      if (response.data && response.data.url) {
        onVideoUploaded(response.data.url);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error('Failed to get video URL from server');
      }
    } catch (err) {
      console.error('Error uploading video:', err);
      setError(err.message || 'An error occurred while uploading the video');
    } finally {
      setUploading(false);
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-[#111] border border-[#333] rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium mb-4 text-[#E0A87D]">Upload a Video</h3>
      
      <div className="mb-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/*"
          className="hidden"
        />
        
        <div 
          onClick={openFileSelector}
          className={`border-2 border-dashed ${file ? 'border-[#ED5606]' : 'border-gray-600'} 
            rounded-lg p-6 text-center cursor-pointer hover:border-[#ED5606] transition-colors`}
        >
          {file ? (
            <div className="flex flex-col items-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2 text-[#ED5606]">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#ED5606"/>
              </svg>
              <p className="text-white mb-1">{file.name}</p>
              <p className="text-gray-400 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2 text-gray-400">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-white mb-1">Click to select a video</p>
              <p className="text-gray-400 text-sm">Or drag and drop a file here</p>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 mb-4 text-sm">{error}</div>
      )}
      
      {uploading && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Uploading...</span>
            <span className="text-white">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-[#222] rounded-full h-2">
            <div 
              className="bg-[#ED5606] h-2 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          onClick={uploadVideo}
          disabled={!file || uploading}
          style={gradientButtonStyle}
          className={`px-4 py-1.5 text-sm font-medium text-white transition-colors ${(!file || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </div>
    </div>
  );
};

export default VideoUploader; 