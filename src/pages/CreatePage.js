import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, UploadCloud, ChevronDown, Edit3, Upload as UploadIcon, Mic, HelpCircle, ArrowUpRight } from 'lucide-react';

function CreatePage() {
  const [activeTab, setActiveTab] = useState('Generate Video');

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
            <span className="text-xl font-bold">+</span>
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-[#2f2f2f] hover:bg-[#414141] rounded-full transition-colors">
            <img
              src="/user-avatar.jpg"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* Main Content */}
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
    </div>
  );
}

export default CreatePage; 