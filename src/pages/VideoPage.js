import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, User, Bell, ChevronRight, Menu, Heart, Share, MessageSquare, ThumbsUp, LogOut, X, ArrowLeft, MoreVertical, ThumbsDown, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function VideoPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [creators, setCreators] = useState([]);
  const [apiCreators, setApiCreators] = useState([]);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRelatedMobile, setShowRelatedMobile] = useState(false);
  const [videoLikes, setVideoLikes] = useState(0);
  const [videoDislikes, setVideoDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [viewUpdated, setViewUpdated] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentPosting, setCommentPosting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const profileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const commentsEndRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeControlRef = useRef(null);
  const { logout, user } = useAuth();

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleRelatedMobile = () => {
    setShowRelatedMobile(!showRelatedMobile);
  };

  const handleLogout = () => {
    logout();
  };

  // Toggle volume slider visibility
  const toggleVolumeSlider = (e) => {
    e.stopPropagation();
    setShowVolumeSlider(!showVolumeSlider);
  };

  // Handle volume button double click to mute/unmute
  const handleVolumeButtonClick = (e) => {
    if (e.detail === 2) {
      // Double click
      toggleMute();
    } else {
      // Single click
      toggleVolumeSlider(e);
    }
  };

  // Close volume slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
      if (volumeControlRef.current && !volumeControlRef.current.contains(event.target)) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format date to show how long ago
  const formatDateAgo = (dateString) => {
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
          
          // Check if current user is following this creator
          let isUserFollowing = false;
          if (user && Array.isArray(creator.followers)) {
            isUserFollowing = creator.followers.some(follower => 
              typeof follower === 'object' && follower._id === user._id
            );
          }
          
          return {
            name: creator.name || 'Unknown Creator',
            id: creator.name ? creator.name.toLowerCase().replace(/\s+/g, '-') : `creator-${creator._id}`,
            videoCount: typeof creator.TotalVideos === 'number' ? creator.TotalVideos : 0,
            followers: followersCount,
            about: creator.about || '',
            _id: creator._id || '',
            profilePic: profilePicUrl,
            isFollowing: isUserFollowing
          };
        });
        
        setApiCreators(mappedCreators);
      } catch (err) {
        console.error('Error fetching creators from API:', err);
      }
    };
    
    fetchCreators();
  }, [user]);

  // Function to update view count
  const updateViewCount = async () => {
    // Only update view count once per video session
    if (viewUpdated || !videoId) return;

    try {
      const response = await fetch(`https://videora-ai.onrender.com/api/videos/${videoId}/views`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Failed to update view count');
        return;
      }

      const data = await response.json();
      console.log('View count updated:', data.message);
      
      // Update view count in state
      setViewCount(data.views || (viewCount + 1));
      // Mark as updated so we don't call the API again
      setViewUpdated(true);
    } catch (err) {
      console.error('Error updating view count:', err);
    }
  };

  // Fetch video data from API
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching video with ID:', videoId);
        
        // First fetch all videos
        const response = await fetch('https://videora-ai.onrender.com/videos/get-videos');
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        
        const data = await response.json();
        const videos = data.video || [];
        
        console.log(`Found ${videos.length} videos in total`);
        
        // Find the specific video
        const foundVideo = videos.find(v => v._id === videoId);
        
        if (!foundVideo) {
          throw new Error('Video not found');
        }
        
        console.log('Found video:', foundVideo);
        
        // Set the video
        setVideo(foundVideo);
        
        // Set view count
        setViewCount(foundVideo.views || 0);
        // Reset view updated flag when a new video is loaded
        setViewUpdated(false);
        
        // Set video likes/dislikes counts from TotalLike and TotalDislike fields
        setVideoLikes(foundVideo.TotalLike || 0);
        setVideoDislikes(foundVideo.TotalDislike || 0);
        
        // Check if the current user has liked or disliked this video
        // The likes and dislikes fields are arrays of user IDs
        if (user && foundVideo.likes && Array.isArray(foundVideo.likes)) {
          setUserLiked(foundVideo.likes.includes(user._id));
        }
        
        if (user && foundVideo.dislikes && Array.isArray(foundVideo.dislikes)) {
          setUserDisliked(foundVideo.dislikes.includes(user._id));
        }
        
        // Set related videos (videos from the same creator)
        const creatorVideos = videos.filter(v => 
          v._id !== videoId && 
          v.uploadedBy && 
          foundVideo.uploadedBy && 
          v.uploadedBy.toLowerCase() === foundVideo.uploadedBy.toLowerCase()
        );
        setRelatedVideos(creatorVideos);
        
        // Extract unique creators from videos
        const uniqueCreators = Array.from(new Set(videos.map(v => v.uploadedBy)))
          .filter(Boolean)
          .map(creator => {
            // Find the first video by this creator
            const creatorVideo = videos.find(v => v.uploadedBy === creator);
            
            // Try to find this creator in the API creators list
            const apiCreator = apiCreators.find(c => c.name.toLowerCase() === creator.toLowerCase());
            
            return {
              name: creator,
              id: creator.toLowerCase().replace(/\s+/g, '-'),
              videoCount: videos.filter(v => v.uploadedBy === creator).length,
              thumbnailUrl: creatorVideo?.thumbnailLogoUrl || '/user-avatar.png',
              profilePic: apiCreator?.profilePic || null,
              _id: apiCreator?._id || '',
              isFollowing: apiCreator?.isFollowing || false
            };
          });
        
        setCreators(uniqueCreators);
        
        // Check if user is following the video creator
        if (foundVideo.uploadedBy) {
          const videoCreator = apiCreators.find(c => 
            c.name.toLowerCase() === foundVideo.uploadedBy.toLowerCase()
          );
          if (videoCreator) {
            setIsFollowing(videoCreator.isFollowing || false);
          }
        }
        
        setLoading(false);

        // Preload video if possible
        if (foundVideo.videoURL && videoRef.current) {
          videoRef.current.load();
        }
      } catch (err) {
        console.error('Error fetching video:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    if (videoId) {
      fetchVideo();
    }
    
    // Cleanup function
    return () => {
      // Stop video and audio playback when component unmounts
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [videoId, apiCreators, user]);

  // Function to format time in MM:SS format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle play/pause toggle
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // Update video progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle progress bar click
  const handleProgressBarClick = (e) => {
    if (videoRef.current && progressBarRef.current) {
      const progressBar = progressBarRef.current;
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / progressBar.offsetWidth;
      videoRef.current.currentTime = pos * videoDuration;
    }
  };

  // Update video duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      console.log('Video metadata loaded, duration:', videoRef.current.duration);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  // Show/hide controls based on mouse movement
  const handleMouseMove = () => {
    setShowControls(true);
    // Add a timer to hide controls after inactivity
    clearTimeout(window.controlsTimer);
    window.controlsTimer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Handle synchronized audio-video playback and view count update
  useEffect(() => {
    if (video && videoRef.current) {
      const videoElement = videoRef.current;
      
      // Function to handle video play event
      const handleVideoPlay = () => {
        // Update view count when video starts playing
        updateViewCount();
        setIsPlaying(true);
        
        // Handle audio sync if voice narration is available
        if (video.voiceURL && audioRef.current) {
          const audioElement = audioRef.current;
          if (audioElement.paused) {
            audioElement.play()
              .then(() => setAudioPlaying(true))
              .catch(err => console.error('Error playing audio:', err));
          }
        }
      };
      
      // Function to handle video pause event
      const handleVideoPause = () => {
        setIsPlaying(false);
        
        // Handle audio sync if voice narration is available
        if (video.voiceURL && audioRef.current) {
          const audioElement = audioRef.current;
          if (!audioElement.paused) {
            audioElement.pause();
            setAudioPlaying(false);
          }
        }
      };
      
      // Function to handle video time update
      const handleVideoTimeUpdate = () => {
        // Update current time for progress bar
        setCurrentTime(videoElement.currentTime);
        
        // Keep audio in sync with video if voice narration is available
        if (video.voiceURL && audioRef.current) {
          const audioElement = audioRef.current;
          if (Math.abs(audioElement.currentTime - videoElement.currentTime) > 0.5) {
            audioElement.currentTime = videoElement.currentTime;
          }
        }
      };
      
      // Function to handle audio end
      const handleAudioEnd = () => {
        setAudioPlaying(false);
      };
      
      // Add event listeners
      videoElement.addEventListener('play', handleVideoPlay);
      videoElement.addEventListener('pause', handleVideoPause);
      videoElement.addEventListener('timeupdate', handleVideoTimeUpdate);
      
      if (video.voiceURL && audioRef.current) {
        audioRef.current.addEventListener('ended', handleAudioEnd);
      }
      
      // Clean up
      return () => {
        videoElement.removeEventListener('play', handleVideoPlay);
        videoElement.removeEventListener('pause', handleVideoPause);
        videoElement.removeEventListener('timeupdate', handleVideoTimeUpdate);
        
        if (video.voiceURL && audioRef.current) {
          audioRef.current.removeEventListener('ended', handleAudioEnd);
        }
      };
    }
  }, [video, videoId]);

  // Function to follow a creator
  const followCreator = async (creatorId) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login');
      return;
    }

    console.log('Attempting to follow creator with ID:', creatorId);
    
    if (!creatorId) {
      console.error('Cannot follow creator: Missing valid creator ID');
      alert('Cannot follow this creator at the moment. Please try again later.');
      return;
    }

    try {
      setFollowLoading(true);
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`https://videora-ai.onrender.com/api/creator/${creatorId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to follow creator');
      }

      const data = await response.json();
      
      // Update the following state
      setIsFollowing(prev => !prev);

      // Show success notification (optional)
      console.log('Successfully followed creator:', data.message);
    } catch (err) {
      console.error('Error following creator:', err);
      // Show error notification (optional)
    } finally {
      setFollowLoading(false);
    }
  };

  // Function to handle like action
  const handleLike = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login');
      return;
    }

    try {
      setLikeLoading(true);
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // If already liked, we're toggling the like off
      const currentLikeState = userLiked;

      const response = await fetch(`https://videora-ai.onrender.com/api/videos/${videoId}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user._id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to like video');
      }

      const data = await response.json();
      
      // Update like status and count with the value from the API response
      setVideoLikes(data.TotalLike || (currentLikeState ? videoLikes - 1 : videoLikes + 1));
      setUserLiked(!currentLikeState);
      
      // If user previously disliked and is now liking, remove dislike
      if (userDisliked && !currentLikeState) {
        setUserDisliked(false);
        setVideoDislikes(prev => Math.max(0, prev - 1));
      }

      console.log('Successfully liked video:', data.message);
    } catch (err) {
      console.error('Error liking video:', err);
      // Show error notification (optional)
    } finally {
      setLikeLoading(false);
    }
  };

  // Function to handle dislike action
  const handleDislike = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login');
      return;
    }

    try {
      setLikeLoading(true);
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // If already disliked, we're toggling the dislike off
      const currentDislikeState = userDisliked;

      const response = await fetch(`https://videora-ai.onrender.com/api/videos/${videoId}/dislike`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user._id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to dislike video');
      }

      const data = await response.json();
      
      // Update dislike status and count with the value from the API response
      setVideoDislikes(data.TotalDislike || (currentDislikeState ? videoDislikes - 1 : videoDislikes + 1));
      setUserDisliked(!currentDislikeState);
      
      // If user previously liked and is now disliking, remove like
      if (userLiked && !currentDislikeState) {
        setUserLiked(false);
        setVideoLikes(prev => Math.max(0, prev - 1));
      }

      console.log('Successfully disliked video:', data.message);
    } catch (err) {
      console.error('Error disliking video:', err);
      // Show error notification (optional)
    } finally {
      setLikeLoading(false);
    }
  };

  // Function to fetch comments
  const fetchComments = async () => {
    if (!videoId) return;
    
    try {
      setCommentsLoading(true);
      const response = await fetch(`https://videora-ai.onrender.com/api/videos/${videoId}/allcomments`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      console.log('Fetched comments:', data);
      
      setComments(data.comments || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Function to post a comment
  const postComment = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login');
      return;
    }

    if (!commentText.trim() || !videoId) return;
    
    try {
      setCommentPosting(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`https://videora-ai.onrender.com/api/videos/${videoId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user._id,
          comment: commentText.trim()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
      
      const data = await response.json();
      console.log('Comment posted successfully:', data);
      
      // Update comments list with the new comments from the API response
      setComments(data.comments || []);
      
      // Clear the comment input
      setCommentText('');
      
      // Scroll to the bottom to show the new comment
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setCommentPosting(false);
    }
  };

  // Function to delete a comment
  const deleteComment = async (commentId) => {
    if (!user || !videoId || !commentId) return;
    
    try {
      setDeleteLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`https://videora-ai.onrender.com/api/videos/${videoId}/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user._id
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      
      const data = await response.json();
      console.log('Comment deleted successfully:', data.message);
      
      // Remove the deleted comment from the state
      setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
      
    } catch (err) {
      console.error('Error deleting comment:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Call fetchComments when the video ID changes
  useEffect(() => {
    if (videoId) {
      fetchComments();
    }
  }, [videoId]);

  // Function to check if video is already saved
  const checkIfVideoSaved = async () => {
    if (!user || !videoId) return;

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        return;
      }
      
      // Use the correct endpoint from the curl example: 'videos/get/saved-videos'
      const response = await fetch('https://videora-ai.onrender.com/videos/get/saved-videos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const savedVideos = data.savedVideos || [];
      
      // Check if current video is in the saved videos list
      const isCurrentVideoSaved = savedVideos.some(video => video._id === videoId);
      setIsSaved(isCurrentVideoSaved);
      
    } catch (err) {
      console.error('Error checking saved videos:', err);
    }
  };

  // Call checkIfVideoSaved when the component loads
  useEffect(() => {
    if (user && videoId) {
      checkIfVideoSaved();
    }
  }, [user, videoId]);

  // Function to handle save video action
  const handleSaveVideo = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login');
      return;
    }

    try {
      setSaveLoading(true);
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Use the direct endpoint from the curl example without toggle logic
      const response = await fetch('https://videora-ai.onrender.com/videos/saved-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          videoId: videoId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save video');
      }

      const data = await response.json();
      console.log('Video saved:', data.message);
      
      // Set saved state to true since we've saved it
      setIsSaved(true);
      
      // Show success message
      alert('Video saved');
      
    } catch (err) {
      console.error('Error saving video:', err);
      alert('Failed to save video. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4 text-xl">Error: {error}</div>
        <button 
          className="bg-[#1c1c1c] hover:bg-[#222] text-white rounded px-4 py-2"
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="text-white mb-4 text-xl">Video not found</div>
        <button 
          className="bg-[#1c1c1c] hover:bg-[#222] text-white rounded px-4 py-2"
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation Bar - Desktop */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] w-full bg-black">
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
        <div className="flex items-center justify-center flex-1">
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

      {/* Mobile Header */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-[#1a1a1a] w-full bg-black sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            className="p-1 hover:bg-[#1a1a1a] rounded-md transition-colors" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center">
            <img src="/VIDEORA.svg" alt="VIDEORA" className="h-4" />
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className="w-8 h-8 flex items-center justify-center bg-transparent hover:bg-[#1a1a1a] rounded-full transition-colors"
            onClick={toggleMobileMenu}
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="absolute right-4 top-12 w-48 bg-[#111111] border border-[#333] rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div className="py-2">
              <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#1A1A1A] transition-colors">
                <div className="w-5 h-5 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                User Profile
              </Link>
              <Link to="/create" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#1A1A1A] transition-colors">
                <div className="w-5 h-5 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                Create
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
      </header>

      <div className="flex flex-col md:flex-row h-[calc(100vh-60px)]">
        {/* Left Sidebar - Creator's Videos Only - Desktop */}
        <div className="w-[120px] md:w-[220px] border-r border-[#222] overflow-y-auto bg-black hidden md:block">
          <div className="p-3">
            <h3 className="text-xs font-medium text-[#b0b0b0] uppercase mb-2">
              {video.uploadedBy ? `${video.uploadedBy}'s Videos` : 'Related Videos'}
            </h3>
            {relatedVideos.length > 0 ? (
              relatedVideos.map((relVideo) => (
                <div 
                  key={relVideo._id}
                  className="relative cursor-pointer mb-2"
                  onClick={() => navigate(`/video/${relVideo._id}`)}
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={relVideo.thumbnailLogoUrl || "/image 28.png"} 
                      alt={relVideo.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/image 28.png";
                      }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 px-2">
                    <p className="text-[10px] text-white truncate">{relVideo.name}</p>
                  </div>
                  <div className="absolute top-1 right-1 bg-black/70 text-[8px] px-1 rounded text-white">
                    {Math.floor(relVideo.duration / 60)}:{String(relVideo.duration % 60).padStart(2, '0')}
                  </div>
                  <div className="absolute bottom-6 left-1 text-[8px] bg-black/70 px-1 rounded text-white">
                    {relVideo.category}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400">No other videos from this creator</p>
            )}
          </div>
        </div>
        
        {/* Main Video Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player */}
          <div className="w-full bg-black relative" style={{ maxHeight: '70vh' }} onMouseMove={handleMouseMove}>
            {!loading && (video.videoURL || video.videoUrl) ? (
              <div className="video-container relative" style={{ maxHeight: '70vh' }}>
                <video
                  ref={videoRef}
                  src={video.videoURL || video.videoUrl}
                  poster={video.thumbnailLogoUrl || "/image 28.png"}
                  className="w-full h-full object-contain"
                  style={{ maxHeight: '70vh' }}
                  playsInline
                  preload="auto"
                  onClick={togglePlay}
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedData={() => console.log('Video loaded successfully')}
                  onError={(e) => console.error('Video load error:', e)}
                />
                
                {/* Hidden audio element for voice narration */}
                {video.voiceURL && (
                  <audio 
                    ref={audioRef} 
                    src={video.voiceURL} 
                    preload="auto" 
                    className="hidden"
                  />
                )}
                
                {/* Audio indicator when voice narration is playing */}
                {video.voiceURL && audioPlaying && (
                  <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-white text-xs flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                    Voice Narration
                  </div>
                )}

                {/* Center play button overlay - visible when paused or on hover */}
                {(!isPlaying || showControls) && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={togglePlay}
                  >
                    {!isPlaying && (
                      <div className="w-20 h-20 flex items-center justify-center bg-black/40 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#ED5606" stroke="none">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    )}
                  </div>
                )}

                {/* Custom video controls */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                >
                  {/* Progress bar */}
                  <div 
                    className="w-full h-1 bg-[#222] mb-3 cursor-pointer" 
                    onClick={handleProgressBarClick}
                    ref={progressBarRef}
                  >
                    <div 
                      className="h-full bg-[#ED5606] relative"
                      style={{ width: `${videoDuration ? (currentTime / videoDuration) * 100 : 0}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#ED5606] rounded-full transform translate-x-1/2"></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {/* Play/Pause button in bottom left */}
                      <button 
                        className="text-white hover:text-[#ED5606]"
                        onClick={togglePlay}
                      >
                        {isPlaying ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        )}
                      </button>

                      {/* Skip button */}
                      <button 
                        className="text-white hover:text-[#ED5606]"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime += 10;
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <polygon points="5 4 15 12 5 20 5 4"></polygon>
                          <line x1="19" y1="5" x2="19" y2="19"></line>
                        </svg>
                      </button>

                      {/* Volume control */}
                      <div className="flex items-center gap-2 relative" ref={volumeControlRef}>
                        <button 
                          className="text-white hover:text-[#ED5606]"
                          onClick={toggleMute}
                          title={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                              <line x1="22" y1="9" x2="16" y2="15"></line>
                              <line x1="16" y1="9" x2="22" y2="15"></line>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            </svg>
                          )}
                        </button>
                        
                        {/* Inline volume slider */}
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.01" 
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-16 h-1 rounded-full appearance-none bg-[#333]"
                          style={{
                            backgroundImage: `linear-gradient(to right, #ED5606 0%, #ED5606 ${volume * 100}%, #333 ${volume * 100}%, #333 100%)`
                          }}
                        />
                      </div>

                      {/* Time display */}
                      <div className="text-white text-xs">
                        {formatTime(currentTime)} / {formatTime(videoDuration)}
                      </div>
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center">
                      <button 
                        className="text-white hover:text-[#ED5606]"
                        onClick={() => {
                          if (videoRef.current) {
                            if (videoRef.current.requestFullscreen) {
                              videoRef.current.requestFullscreen();
                            } else if (videoRef.current.webkitRequestFullscreen) {
                              videoRef.current.webkitRequestFullscreen();
                            } else if (videoRef.current.msRequestFullscreen) {
                              videoRef.current.msRequestFullscreen();
                            }
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                          <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                          <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                          <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center" style={{ height: '50vh' }}>
                {loading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
                ) : (
                  <img 
                    src={video?.thumbnailLogoUrl || "/image 28.png"} 
                    alt={video?.caption || video?.name || 'Video thumbnail'}
                    className="w-full h-full object-contain"
                    style={{ maxHeight: '70vh' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/image 28.png";
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
            {/* Days ago indicator */}
            <div className="text-xs text-gray-400 mb-2">
              {formatDateAgo(video.uploadDate)}
            </div>
            
            {/* Video Title */}
            <div className="mb-4">
              <h1 className="text-lg md:text-xl font-bold mb-1">
                {video.caption || video.name || 'Untitled Video'} 
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {video.category && (
                  <span className="text-sm font-normal">{video.category}</span>
                )}
                {video.category && video.style && (
                  <span className="text-xs font-normal">•</span>
                )}
                {video.style && (
                  <span className="text-sm font-normal text-[#ED5606]">{video.style}</span>
                )}
              </div>
            </div>
            
            {/* Creator Info and Action Buttons */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6">
              {/* Creator */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#222]">
                  {video.uploadedBy && (() => {
                    // Find creator in the creators list for profile pic
                    const creator = creators.find(c => c.name.toLowerCase() === video.uploadedBy.toLowerCase());
                    return (
                      <img 
                        src={creator?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(video.uploadedBy)}&background=ED5606&color=fff&size=80`} 
                        alt={video.uploadedBy}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/user-avatar.png";
                        }}
                      />
                    );
                  })()}
                </div>
                <div>
                  <h3 
                    className="text-sm font-medium cursor-pointer hover:text-[#ED5606]" 
                    onClick={() => {
                      const creator = apiCreators.find(c => c.name.toLowerCase() === video.uploadedBy.toLowerCase());
                      if (creator) {
                        // Use the 'id' property which is the URL-friendly name format
                        // or create a URL-friendly version of the name if 'id' doesn't exist
                        const creatorId = creator.id || video.uploadedBy.toLowerCase().replace(/\s+/g, '-');
                        navigate(`/creator/${creatorId}`);
                      }
                    }}
                  >
                    {video.uploadedBy}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {(() => {
                      const creator = apiCreators.find(c => c.name.toLowerCase() === video.uploadedBy.toLowerCase());
                      return creator ? `${creator.followers || 0} followers` : '0 followers';
                    })()}
                  </p>
                </div>
                {video.uploadedBy && (() => {
                  // Find creator in the list to get their ID
                  const creator = apiCreators.find(c => c.name.toLowerCase() === video.uploadedBy.toLowerCase());
                  return (
                    <button 
                      className={`ml-2 text-xs text-white px-4 py-1 rounded-full ${followLoading ? 'opacity-70' : ''}`}
                      style={{
                        background: isFollowing ? 
                          `linear-gradient(0deg, #333333, #333333),
                          conic-gradient(from 0deg at 50% 38.89%, #555555 0deg, #333333 160.78deg, #555555 360deg)` 
                          : 
                          `linear-gradient(0deg, #270E00, #270E00),
                          conic-gradient(from 0deg at 50% 38.89%, #ED5606 0deg, #1F1F1F 160.78deg, #ED5606 360deg)`,
                        border: isFollowing ? '1px solid #555555' : '1px solid #ED5606'
                      }}
                      onClick={() => {
                        if (creator && creator._id) {
                          followCreator(creator._id);
                        } else {
                          console.error("Cannot follow creator: Missing valid creator ID");
                          alert("Cannot follow this creator at the moment. Please try again later.");
                        }
                      }}
                      disabled={followLoading}
                    >
                      {followLoading ? 'Processing...' : (isFollowing ? 'Following' : 'Follow')}
                    </button>
                  );
                })()}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3 overflow-x-auto py-1 md:py-0 md:overflow-visible">
                <div className="bg-[#1a1a1a] rounded-full flex overflow-hidden">
                  <button 
                    className={`p-2 flex items-center gap-1 whitespace-nowrap transition-colors ${userLiked ? 'bg-[#270E00] text-[#ED5606]' : 'text-white hover:bg-[#222]'}`}
                    onClick={handleLike}
                    disabled={likeLoading}
                  >
                    <ThumbsUp className={`w-4 h-4 ${userLiked ? 'fill-[#ED5606] text-[#ED5606]' : ''}`} />
                    <span className="text-xs mr-1">Like{videoLikes > 0 ? ` ${videoLikes}` : ''}</span>
                  </button>
                  <div className="w-px h-full bg-[#333]"></div>
                  <button 
                    className={`p-2 flex items-center gap-1 whitespace-nowrap transition-colors ${userDisliked ? 'bg-[#270E00] text-[#ED5606]' : 'text-white hover:bg-[#222]'}`}
                    onClick={handleDislike}
                    disabled={likeLoading}
                  >
                    <ThumbsDown className={`w-4 h-4 ${userDisliked ? 'fill-[#ED5606] text-[#ED5606]' : ''}`} />
                  </button>
                </div>
                <button className="bg-[#1c1c1c] hover:bg-[#222] text-white rounded-full p-2 flex items-center gap-1 whitespace-nowrap">
                  <Share className="w-4 h-4" />
                  <span className="text-xs mr-1">Share</span>
                </button>
                <button 
                  className={`bg-[#1c1c1c] hover:bg-[#222] text-white rounded-full p-2 flex items-center gap-1 whitespace-nowrap ${isSaved ? 'bg-[#270E00] text-[#ED5606] border border-[#ED5606]' : ''}`}
                  onClick={handleSaveVideo}
                  disabled={saveLoading}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved ? "#ED5606" : "none"} xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21L12 17L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke={isSaved ? "#ED5606" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-xs mr-1">{saveLoading ? 'Saving...' : (isSaved ? 'Saved' : 'Save')}</span>
                </button>
              </div>
            </div>
            
            {/* Video Description */}
            <div className="mb-6 bg-[#101010] p-3 rounded-lg">
              <div className="text-sm text-gray-400 mb-2 flex items-center">
                <span className="mr-2">{viewCount || video.views || 0} views</span>
                {video.uploadDate && <span>• {formatDateAgo(video.uploadDate)}</span>}
              </div>
              <p className="text-sm text-gray-300 mb-2">
                {video.description || video.prompt || 'No description provided.'}
              </p>
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {video.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-[#1A1A1A] text-[#ED5606] px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              {video.voiceURL && (
                <div className="mt-3 text-xs text-[#ED5606]">
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Voice narration available (plays automatically with video)
                  </span>
                </div>
              )}
            </div>

            {/* Toggle for Related Videos on Mobile */}
            <div className="mb-4 md:hidden">
              <button 
                onClick={toggleRelatedMobile}
                className="flex items-center justify-between w-full bg-[#101010] p-3 rounded-lg text-sm font-medium"
              >
                <span>{video.uploadedBy ? `${video.uploadedBy}'s Videos` : 'Related Videos'}</span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${showRelatedMobile ? 'rotate-90' : ''}`} />
              </button>
              
              {/* Mobile Related Videos */}
              {showRelatedMobile && relatedVideos.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {relatedVideos.map((relVideo) => (
                    <div 
                      key={relVideo._id}
                      className="relative cursor-pointer"
                      onClick={() => navigate(`/video/${relVideo._id}`)}
                    >
                      <div className="aspect-video w-full overflow-hidden rounded-lg">
                        <img 
                          src={relVideo.thumbnailLogoUrl || "/image 28.png"} 
                          alt={relVideo.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/image 28.png";
                          }}
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 px-2 rounded-b-lg">
                        <p className="text-[10px] text-white truncate">{relVideo.name}</p>
                      </div>
                      <div className="absolute top-1 right-1 bg-black/70 text-[8px] px-1 rounded text-white">
                        {Math.floor(relVideo.duration / 60)}:{String(relVideo.duration % 60).padStart(2, '0')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium">Comments {comments.length > 0 ? `(${comments.length})` : ''}</h3>
              </div>
              
              {/* Add comment form */}
              {user && (
                <div className="mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#222] flex-shrink-0">
                    <img 
                      src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=ED5606&color=fff&size=60`}
                      alt="User"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/user-avatar.png";
                      }}
                    />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-[#ED5606]"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          postComment();
                        }
                      }}
                    />
                    <button 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-[#222]"
                      onClick={postComment}
                      disabled={commentPosting || !commentText.trim()}
                    >
                      <Send className={`w-4 h-4 ${commentPosting ? 'opacity-50' : ''}`} />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Comments list */}
              {commentsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#ED5606]"></div>
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment, index) => (
                    <div key={index} className="flex gap-3 group">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#222] flex-shrink-0">
                        {comment.userId && typeof comment.userId === 'object' ? (
                          <img 
                            src={comment.userId.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userId.name || comment.userId._id || 'User')}&background=ED5606&color=fff&size=60`}
                            alt={comment.userId.name || "User"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/user-avatar.png";
                            }}
                          />
                        ) : (
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userId || 'User')}&background=ED5606&color=fff&size=60`}
                            alt="User"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/user-avatar.png";
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium">
                              {comment.userId && typeof comment.userId === 'object' && comment.userId.name 
                                ? comment.userId.name 
                                : (comment.userId && typeof comment.userId === 'object' ? comment.userId._id : comment.userId)}
                            </h4>
                            <span className="text-xs text-gray-400">
                              {comment.timestamp ? formatDateAgo(comment.timestamp) : 'Recently'}
                            </span>
                          </div>
                          
                          {/* Delete button - only show for the user's own comments */}
                          {user && (
                            (comment.userId === user._id || 
                             (comment.userId && typeof comment.userId === 'object' && comment.userId._id === user._id)
                            ) && (
                              <button 
                                className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteComment(comment._id)}
                                disabled={deleteLoading}
                                title="Delete comment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )
                          )}
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{comment.comment}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={commentsEndRef} />
                </div>
              ) : (
                <div className="text-center text-sm text-gray-400 py-4">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for video controls */}
      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          height: 4px;
          border-radius: 5px;
          background: #333;
          outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ED5606;
          cursor: pointer;
        }

        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ED5606;
          cursor: pointer;
          border: none;
        }

        input[type="range"]::-ms-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ED5606;
          cursor: pointer;
        }

        .video-container {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default VideoPage; 