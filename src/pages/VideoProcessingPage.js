import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VideoUploader from '../components/VideoUploader';
import VideoPlayer from '../components/VideoPlayer';
import VideoCustomizationForm from '../components/VideoCustomizationForm';

function VideoProcessingPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoSettings, setVideoSettings] = useState({
    style: 'original',
    prompt: '',
    caption: '',
    voiceUrl: ''
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] w-full bg-black">
        <Link to="/" className="flex items-center">
          <img src="/VIDEORA.svg" alt="VIDEORA" className="h-4" />
        </Link>
        <h1 className="text-xl font-bold text-[#E0A87D]">Video Processing Lab</h1>
        <div className="w-8"></div> {/* Empty div for layout balance */}
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Create AI-Enhanced Videos</h2>
          <p className="text-gray-300 mb-8">
            Upload a video and customize it with AI processing. Add styles, captions, and voice-overs to create unique content.
          </p>

          {/* Video Uploader Component */}
          <VideoUploader onVideoUploaded={setVideoUrl} />
        </div>

        {videoUrl && (
          <>
            {/* Video Customization Form */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-white">Customize Your Video</h3>
              <p className="text-gray-300 mb-4">
                Modify your video with different styles and add captions or voice-overs.
              </p>
              <VideoCustomizationForm
                initialValues={videoSettings}
                onApplyChanges={setVideoSettings}
              />
            </div>

            {/* Video Preview */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-white">Video Preview</h3>
              <p className="text-gray-300 mb-4">
                See how your video looks with the applied customizations.
              </p>
              <div className="rounded-lg overflow-hidden border border-[#333]">
                <VideoPlayer
                  videoUrl={videoUrl}
                  style={videoSettings.style}
                  prompt={videoSettings.prompt}
                  caption={videoSettings.caption}
                  voiceUrl={videoSettings.voiceUrl}
                  onVideoProcessed={(url) => {
                    console.log('Video processed:', url);
                  }}
                />
              </div>
            </div>

            {/* Processing Settings Explanation */}
            <div className="bg-[#111] border border-[#333] rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-3 text-[#E0A87D]">Current Processing Settings</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2 w-16">Style:</span>
                  <span className="text-white">{videoSettings.style || 'Original'}</span>
                </li>
                {videoSettings.prompt && (
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 w-16">Prompt:</span>
                    <span className="text-white">{videoSettings.prompt}</span>
                  </li>
                )}
                {videoSettings.caption && (
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 w-16">Caption:</span>
                    <span className="text-white">{videoSettings.caption}</span>
                  </li>
                )}
                {videoSettings.voiceUrl && (
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 w-16">Voice URL:</span>
                    <span className="text-white break-words">{videoSettings.voiceUrl}</span>
                  </li>
                )}
              </ul>
            </div>
          </>
        )}

        {/* API Information Section */}
        <div className="mt-12 bg-[#0A0500] border border-[#333] rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-[#E0A87D]">API Information</h3>
          <p className="text-gray-300 mb-4">
            This page is using the Videora Video Player API to process and enhance videos.
          </p>
          <div className="bg-[#1A1A1A] p-4 rounded-md overflow-x-auto">
            <pre className="text-sm text-gray-300">
              <code>{`curl -X POST https://videora-player-api.vercel.app/api/video-player-api \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://example.com/video.mp4",
    "style": "cinematic",
    "prompt": "Make this video look like a movie",
    "caption": "My awesome video",
    "voiceURL": "https://example.com/voice.mp3"
  }'`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoProcessingPage; 