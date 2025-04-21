import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { videoAPI } from '../lib/videoApi';

const VideoPlayer = ({ 
  videoId, 
  videoUrl, 
  posterUrl, 
  title, 
  description,
  voiceURL = "",
  initialStyle = "default", 
  onError 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoStyle, setVideoStyle] = useState(initialStyle);
  const [playbackUrl, setPlaybackUrl] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const { token } = useAuth();
  
  const styleOptions = [
    { value: "default", label: "Default" },
    { value: "cartoon", label: "Cartoon" },
    { value: "cinematic", label: "Cinematic" },
    { value: "vintage", label: "Vintage" }
  ];
  
  // Initialize video player
  useEffect(() => {
    if (!videoUrl) return;
    
    const initializeVideo = async () => {
      try {
        setLoading(true);
        await loadVideoWithStyle(videoStyle);
      } catch (err) {
        console.error('Error initializing video:', err);
        setError(err.message);
        if (onError) onError(err);
        // Fall back to direct URL
        setPlaybackUrl(videoUrl);
      } finally {
        setLoading(false);
      }
    };
    
    initializeVideo();
  }, [videoUrl, videoStyle]);
  
  // Load video with selected style
  const loadVideoWithStyle = async (style) => {
    try {
      const data = await videoAPI.playVideo({
        videoUrl: videoUrl,
        style: style,
        prompt: description || `Apply ${style} style`,
        caption: title,
        voiceURL: voiceURL
      }, token);
      
      setPlaybackUrl(data.cloudinaryUrl || videoUrl);
      return data.cloudinaryUrl;
    } catch (err) {
      console.error(`Error applying ${style} style:`, err);
      throw err;
    }
  };
  
  // Handle style change
  const handleStyleChange = async (newStyle) => {
    if (newStyle === videoStyle) return;
    
    try {
      setLoading(true);
      setShowSettings(false);
      const currentTime = videoRef.current?.currentTime || 0;
      
      // Load video with new style
      await loadVideoWithStyle(newStyle);
      setVideoStyle(newStyle);
      
      // After loading, restore playback state
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime;
        if (isPlaying) {
          videoRef.current.play().catch(console.error);
        }
      }
    } catch (err) {
      console.error('Error changing video style:', err);
      setError(`Failed to apply ${newStyle} style`);
    } finally {
      setLoading(false);
    }
  };
  
  // Video event handlers
  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Update progress bar
      if (progressRef.current && duration) {
        const percent = (videoRef.current.currentTime / duration) * 100;
        progressRef.current.style.width = `${percent}%`;
      }
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };
  
  const handleProgressClick = (e) => {
    if (videoRef.current && progressRef.current?.parentElement) {
      const progressBar = progressRef.current.parentElement;
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="relative w-full bg-black">
      {/* Video */}
      <div className="relative" style={{ maxHeight: '70vh' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60">
            <div className="text-red-500 bg-black/80 p-3 rounded">
              {error}
            </div>
          </div>
        )}
        
        <video
          ref={videoRef}
          src={playbackUrl || videoUrl}
          poster={posterUrl}
          className="w-full h-full object-contain"
          style={{ maxHeight: '70vh' }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => {
            console.error('Video error:', e);
            setError('Failed to load video');
            if (onError) onError(e);
          }}
        />
        
        {/* Overlay controls (visible on hover or when paused) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
          {/* Play/Pause big button in center */}
          <div className="absolute inset-0 flex items-center justify-center" onClick={handlePlay}>
            {!isPlaying && (
              <button className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center text-white">
                <Play className="w-8 h-8" />
              </button>
            )}
          </div>
          
          {/* Bottom controls */}
          <div className="p-4">
            {/* Progress bar */}
            <div 
              className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                ref={progressRef}
                className="h-full bg-[#ED5606] rounded-full" 
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              ></div>
            </div>
            
            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={handlePlay} className="text-white">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                
                <button onClick={handleMute} className="text-white">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowSettings(!showSettings)} 
                    className="text-white"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  
                  {/* Settings dropdown */}
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-black/90 rounded-md shadow-lg z-50 border border-[#333]">
                      <div className="p-2">
                        <div className="text-white text-sm font-medium mb-2">Style</div>
                        {styleOptions.map(option => (
                          <button
                            key={option.value}
                            className={`w-full text-left text-sm p-2 rounded-md transition-colors ${
                              videoStyle === option.value 
                                ? 'bg-[#ED5606] text-white' 
                                : 'text-gray-300 hover:bg-[#1A1A1A]'
                            }`}
                            onClick={() => handleStyleChange(option.value)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button onClick={handleFullscreen} className="text-white">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 