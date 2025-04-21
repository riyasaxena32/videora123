// Video API service
const API_URL = 'https://videora-ai.onrender.com';

export const videoAPI = {
  // Get all videos 
  getAllVideos: async () => {
    try {
      const response = await fetch(`${API_URL}/videos/get-videos`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get videos error:', error);
      throw error;
    }
  },
  
  // Get single video details
  getVideoById: async (videoId) => {
    try {
      const response = await fetch(`${API_URL}/videos/get-video/${videoId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get video error:', error);
      throw error;
    }
  },
  
  // Upload video
  uploadVideo: async (videoData, token) => {
    try {
      const response = await fetch(`${API_URL}/videos/upload-videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(videoData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload video');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload video error:', error);
      throw error;
    }
  },
  
  // Play video with special processing
  playVideo: async (videoOptions, token) => {
    try {
      const response = await fetch(`${API_URL}/videoplayer/paly-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(videoOptions)
      });
      
      if (!response.ok) {
        throw new Error('Failed to process video for playback');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Video playback error:', error);
      throw error;
    }
  }
}; 