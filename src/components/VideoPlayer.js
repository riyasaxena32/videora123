import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VideoPlayer = ({ 
  videoUrl, 
  style = 'original', 
  prompt = '', 
  caption = '', 
  voiceUrl = '',
  onVideoProcessed = () => {} 
}) => {
  const [loading, setLoading] = useState(false);
  const [processedVideo, setProcessedVideo] = useState(null);
  const [error, setError] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);

  useEffect(() => {
    const processVideo = async () => {
      if (!videoUrl) return;
      
      setLoading(true);
      setError(null);
      setProcessingStatus('Initializing video processing...');
      setProcessingProgress(10);
      
      try {
        // Simulate progress updates for better UX
        const progressInterval = setInterval(() => {
          setProcessingProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            const newProgress = prev + Math.floor(Math.random() * 10);
            setProcessingStatus(getStatusMessage(newProgress));
            return Math.min(newProgress, 90);
          });
        }, 2000);

        // Using the correct API endpoint from the cURL command
        const response = await axios.post('https://videora-player-api.vercel.app/api/video-player-api', {
          videoUrl,
          style,
          prompt,
          caption,
          voiceURL: voiceUrl
        });

        clearInterval(progressInterval);
        
        if (response.data && response.data.status === 'success') {
          setProcessingProgress(100);
          setProcessingStatus('Processing complete!');
          setProcessedVideo(response.data.cloudinaryUrl);
          onVideoProcessed(response.data.cloudinaryUrl);
        } else {
          throw new Error(response.data?.message || 'Failed to process video');
        }
      } catch (err) {
        console.error('Error processing video:', err);
        setError(err.message || 'An error occurred while processing the video');
        setProcessingStatus('Processing failed');
      } finally {
        setLoading(false);
      }
    };

    // Helper to generate appropriate status messages
    const getStatusMessage = (progress) => {
      if (progress < 20) return 'Initializing video processing...';
      if (progress < 40) return 'Applying style transformations...';
      if (progress < 60) return 'Processing video content...';
      if (progress < 80) return 'Adding captions and effects...';
      if (progress < 95) return 'Finalizing your video...';
      return 'Processing complete!';
    };

    if (videoUrl && (style !== 'original' || prompt || caption || voiceUrl)) {
      processVideo();
    }
  }, [videoUrl, style, prompt, caption, voiceUrl, onVideoProcessed]);

  if (loading) {
    return (
      <div className="w-full aspect-video bg-black flex items-center justify-center">
        <div className="flex flex-col items-center max-w-md w-full px-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606] mb-4"></div>
          <p className="text-white text-sm mb-2">{processingStatus}</p>
          <div className="w-full bg-[#222] rounded-full h-2.5 mb-2">
            <div 
              className="bg-[#ED5606] h-2.5 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-xs">{processingProgress}% complete</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-black flex items-center justify-center">
        <div className="text-center p-4 max-w-md">
          <div className="text-red-500 mb-2">Error: {error}</div>
          <p className="text-gray-400 text-sm">Failed to process video</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-1.5 text-sm text-white rounded-md"
            style={{
              background: `
                linear-gradient(0deg, #270E00, #270E00),
                conic-gradient(from 0deg at 50% 38.89%, #ED5606 0deg, #1F1F1F 160.78deg, #ED5606 360deg)
              `,
              border: '1px solid #ED5606'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {processedVideo ? (
        <video
          src={processedVideo}
          controls
          className="w-full h-full object-contain"
          style={{ maxHeight: '70vh' }}
        />
      ) : videoUrl ? (
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-contain"
          style={{ maxHeight: '70vh' }}
          poster={style !== 'original' || prompt || caption || voiceUrl ? undefined : null}
        />
      ) : (
        <div className="w-full aspect-video bg-black flex items-center justify-center">
          <p className="text-gray-400">No video available</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer; 