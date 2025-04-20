import React, { useState } from 'react';

const VideoCustomizationForm = ({ 
  onApplyChanges, 
  initialValues = { 
    style: 'original', 
    prompt: '', 
    caption: '', 
    voiceUrl: '' 
  } 
}) => {
  const [style, setStyle] = useState(initialValues.style);
  const [prompt, setPrompt] = useState(initialValues.prompt);
  const [caption, setCaption] = useState(initialValues.caption);
  const [voiceUrl, setVoiceUrl] = useState(initialValues.voiceUrl);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyChanges({ style, prompt, caption, voiceUrl });
    setIsOpen(false);
  };

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
    <div className="relative mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={gradientButtonStyle}
        className="flex items-center gap-2 text-white px-4 py-1.5 text-sm transition-colors font-medium"
      >
        {isOpen ? 'Hide Customization' : 'Customize Video'}
      </button>

      {isOpen && (
        <div className="mt-4 bg-[#111] border border-[#333] rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4 text-[#E0A87D]">Customize Video</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ED5606]"
              >
                <option value="original">Original</option>
                <option value="cinematic">Cinematic</option>
                <option value="anime">Anime</option>
                <option value="cartoon">Cartoon</option>
                <option value="noir">Noir</option>
                <option value="vaporwave">Vaporwave</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how you want to modify the video..."
                className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ED5606]"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Caption</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption to the video"
                className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ED5606]"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Voice URL (optional)</label>
              <input
                type="text"
                value={voiceUrl}
                onChange={(e) => setVoiceUrl(e.target.value)}
                placeholder="URL to voice audio file"
                className="w-full bg-[#222] border border-[#444] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ED5606]"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mr-2 px-4 py-1.5 text-sm font-medium text-gray-300 bg-[#2A2A2A] hover:bg-[#333] rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                style={gradientButtonStyle}
                className="px-4 py-1.5 text-sm font-medium text-white transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VideoCustomizationForm; 