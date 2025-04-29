import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#222]">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            <img src="/Play.png" alt="VIDEORA" className="h-6 sm:h-8" />
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
            About
          </Link>
          <Link to="/playground" className="text-sm text-gray-400 hover:text-white transition-colors">
            Playground
          </Link>
          <Link to="/studio" className="text-sm text-gray-400 hover:text-white transition-colors">
            Studio
          </Link>
          <Link to="/community" className="text-sm text-gray-400 hover:text-white transition-colors">
            Community
          </Link>
        </nav>
        
        {/* Get Started button - hidden on smallest screens, visible on small+ */}
        <div className="hidden sm:block">
          <Link 
            to="/home"
            style={gradientButtonStyle}
            className="flex items-center gap-2 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-colors font-medium"
          >
            Get Started
            <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col justify-center items-center md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 text-white"
          >
            <X size={24} />
          </button>
          
          <nav className="flex flex-col items-center space-y-6">
            <Link 
              to="/about" 
              className="text-lg text-gray-200 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/playground" 
              className="text-lg text-gray-200 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Playground
            </Link>
            <Link 
              to="/studio" 
              className="text-lg text-gray-200 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Studio
            </Link>
            <Link 
              to="/community" 
              className="text-lg text-gray-200 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </Link>
            
            <Link 
              to="/home"
              style={gradientButtonStyle}
              className="flex items-center gap-2 text-white px-6 py-2 text-sm transition-colors font-medium mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 sm:px-6 text-center py-8 sm:py-12 md:py-16">
        {/* Checkered background pattern */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <img 
            src="/Group 191.png" 
            alt=""
            className="w-full h-full object-cover opacity-90"
          />
          {/* Subtle dark overlay to improve text readability */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto pt-4 sm:pt-6 md:pt-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-0 text-white tracking-wider uppercase drop-shadow-md">VIDEORA</h1>
          <p className="text-xs sm:text-sm text-gray-200 mb-4 sm:mb-6 md:mb-8 tracking-wide drop-shadow-md">Where AI Meets Creativity</p>
          
          {/* Anime girl image */}
          <div className="relative mx-auto h-48 sm:h-64 md:h-96 flex items-center justify-center">
            <img 
              src="/image 66.png" 
              alt="AI Creator" 
              className="h-full object-contain drop-shadow-[0_0_20px_rgba(237,86,6,0.35)]"
            />
          </div>
        </div>
      </section>

      {/* Make the Story Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 bg-black">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 max-w-7xl mx-auto text-[#E5B992]">Make the Story Truly Yours</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* AI Video Playground Card */}
          <div className="bg-[#0C0500] rounded-lg overflow-hidden border border-[#1a1a1a] group hover:border-[#2a2a2a] transition-colors">
            <div className="p-4 sm:p-6">
              <div className="flex justify-center mb-3 sm:mb-4">
                <span className="bg-[#1A1207] text-[#ED5606] text-xs px-3 py-1 rounded-full">Playground</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">AI Video Playground</h3>
              <div className="text-xs text-center text-[#ED5606] mb-3 sm:mb-4">
                <span>Edit</span> • <span>Transform</span> • <span>Share Videos</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 text-center">
                Dive into a <span className="text-[#ED5606]">creative space</span> where you can craft videos, 
                add voice-overs using prompts, and change the vibe 
                of your content with AI-powered tools.
              </p>
            </div>
          </div>
          
          {/* Video Streaming Card */}
          <div className="bg-[#0C0500] rounded-lg overflow-hidden border border-[#1a1a1a] group hover:border-[#2a2a2a] transition-colors">
            <div className="p-4 sm:p-6">
              <div className="flex justify-center mb-3 sm:mb-4">
                <span className="bg-[#1A1207] text-[#ED5606] text-xs px-3 py-1 rounded-full">Studio</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">Video Streaming</h3>
              <div className="text-xs text-center text-[#ED5606] mb-3 sm:mb-4">
                <span>Watch</span> • <span>Engage</span> • <span>Interact</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 text-center">
                Stream AI-generated videos in real-time, interact with
                creators through in-video chat, and explore a world of
                innovative content.
              </p>
            </div>
          </div>
          
          {/* Creators Community Card */}
          <div className="bg-[#0C0500] rounded-lg overflow-hidden border border-[#1a1a1a] group hover:border-[#2a2a2a] transition-colors">
            <div className="p-4 sm:p-6">
              <div className="flex justify-center mb-3 sm:mb-4">
                <span className="bg-[#1A1207] text-[#ED5606] text-xs px-3 py-1 rounded-full">Community</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">Creators Community</h3>
              <div className="text-xs text-center text-[#ED5606] mb-3 sm:mb-4">
                <span>Connect</span> • <span>Collaborate</span> • <span>Grow</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 text-center">
                Join a vibrant <span className="text-[#ED5606]">community</span> of creators, share your
                work, get feedback, and explore endless possibilities
                with AI-driven video content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Styles Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 bg-black">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 max-w-7xl mx-auto text-[#E5B992]">
          <span className="inline-block text-left">Infinite Styles, <br className="sm:hidden" />Endless Creativity</span>
        </h2>
        
        {/* Desktop Layout - Grid */}
        <div className="hidden sm:grid grid-cols-3 max-w-6xl mx-auto gap-[2px] relative border-[1px] border-[#333]">
          {/* Top row */}
          <StyleTile 
            name="Animated" 
            imageSrc="/image 57.png" 
            large={false} 
          />
          <div className="bg-black flex items-center justify-center p-6 text-center text-xs text-gray-400">
            <p>Customize the look and feel of your videos with AI-powered styles.</p>
          </div>
          <StyleTile 
            name="Retro" 
            imageSrc="/image 59.png" 
            large={false} 
          />

          {/* Middle row */}
          <StyleTile 
            name="Cinematic" 
            imageSrc="/image 58.png" 
            large={false} 
          />
          <StyleTile 
            name="Sketch" 
            imageSrc="/image 60.png" 
            large={false} 
          />
          <StyleTile 
            name="Cyberpunk" 
            imageSrc="/image 61.png" 
            large={false} 
          />

          {/* Bottom row */}
          <div className="bg-black"></div>
          <StyleTile 
            name="Custom" 
            imageSrc="/style-custom.png" 
            large={false} 
          />
          <div className="bg-black"></div>

          {/* Corner dots - larger and positioned outside the grid */}
          <div className="absolute left-0 top-0 w-2 h-2 -translate-x-1 -translate-y-1 bg-[#E5B992] rounded-full"></div>
          <div className="absolute right-0 top-0 w-2 h-2 translate-x-1 -translate-y-1 bg-[#E5B992] rounded-full"></div>
          <div className="absolute left-0 bottom-0 w-2 h-2 -translate-x-1 translate-y-1 bg-[#E5B992] rounded-full"></div>
          <div className="absolute right-0 bottom-0 w-2 h-2 translate-x-1 translate-y-1 bg-[#E5B992] rounded-full"></div>
        </div>
        
        {/* Mobile Layout - Vertical Stack */}
        <div className="sm:hidden max-w-6xl mx-auto relative">
          <div className="flex flex-col gap-[2px]">
            {/* Mobile vertical sequence as per image */}
            <div className="aspect-[3/2] relative overflow-hidden group rounded-lg border border-[#333] mb-2">
              <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <img src="/image 57.png" alt="Animated" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 text-sm text-white font-medium">Animated</div>
            </div>
            
            <div className="aspect-[3/2] relative overflow-hidden group rounded-lg border border-[#333] mb-2">
              <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <img src="/image 59.png" alt="Retro" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 text-sm text-white font-medium">Retro</div>
            </div>
            
            <div className="aspect-[3/2] relative overflow-hidden group rounded-lg border border-[#333] mb-2">
              <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <img src="/image 61.png" alt="Cyberpunk" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 text-sm text-white font-medium">Cyberpunk</div>
            </div>
            
            <div className="aspect-[3/2] relative overflow-hidden group rounded-lg border border-[#333] mb-2">
              <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
              <img src="/image 58.png" alt="Cinematic" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 text-sm text-white font-medium">Cinematic</div>
            </div>
            
            {/* Custom style with mini gallery below */}
            <div className="relative">
              <div className="aspect-[3/2] relative overflow-hidden group rounded-lg border border-[#333] mb-1">
                <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
                <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
                <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
                <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-[#E5B992] rounded-full"></div>
                <img src="/style-custom.png" alt="Custom" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-4 left-4 text-sm text-white font-medium">Custom</div>
              </div>
              
              {/* Small gallery below Custom */}
              <div className="grid grid-cols-3 gap-1">
                <div className="aspect-square relative overflow-hidden rounded border border-[#333]">
                  <img src="/creator-thumb-1.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square relative overflow-hidden rounded border border-[#333]">
                  <img src="/creator-thumb-2.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square relative overflow-hidden rounded border border-[#333]">
                  <img src="/creator-thumb-3.png" alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            
            {/* Text explanation */}
            <div className="mt-4 text-center text-xs text-gray-400 py-2">
              <p>Customize the look and feel of your videos with AI-powered styles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Captions Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 relative">
        {/* Checkered background pattern */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <img 
            src="/Group 192 (1).png" 
            alt=""
            className="w-full h-full object-cover opacity-90"
          />
          {/* Subtle dark overlay to improve text readability */}
          <div className="absolute inset-0 bg-black opacity-70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="w-full md:w-[45%] text-center md:text-left pt-0 md:pt-8 mb-6 md:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-5 text-[#E5B992]">Smart Captions & <br className="hidden sm:inline" />Seamless Voice Integration</h2>
              <p className="text-sm text-gray-300 mb-6 sm:mb-8">Edit captions without affecting voice continuity.</p>
              
              <Link 
                to="/playground"
                style={{
                  ...gradientButtonStyle,
                  borderRadius: '4px',
                  display: 'inline-flex'
                }}
                className="items-center gap-2 text-white py-2 px-3 text-sm transition-colors font-medium"
              >
                Try the Playground
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="w-full md:w-[55%] md:pl-10">
              <img 
                src="/Frame 182.png" 
                alt="Live Caption Interface" 
                className="w-full h-auto max-w-md mx-auto md:ml-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Discover Content Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <img 
            src="/Group 193 (1).png" 
            alt=""
            className="w-full h-full object-cover opacity-90"
          />
          {/* Subtle dark overlay to improve text readability */}
          <div className="absolute inset-0 bg-black opacity-70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col-reverse md:flex-row items-center md:items-start md:justify-between">
            <div className="w-full md:w-[55%] mt-6 md:mt-0">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/91605 1.png" 
                  alt="Video Player Interface" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            <div className="w-full md:w-[40%] text-center md:text-left pt-0 md:pt-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-5 text-[#E5B992]">Discover & Watch<br />AI-Created Content</h2>
              <p className="text-sm text-gray-300 mb-6 sm:mb-8">Explore a library of AI-generated videos from the community.</p>
              
              <button 
                onClick={() => {
                  navigate('/home');
                  window.location.href = '/home';
                }}
                style={{
                  ...gradientButtonStyle,
                  borderRadius: '4px',
                  display: 'inline-flex'
                }}
                className="items-center gap-2 text-white py-2 px-3 text-sm transition-colors font-medium"
              >
                Stream Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <img 
            src="/Group 192 (1).png" 
            alt=""
            className="w-full h-full object-cover opacity-90"
          />
          {/* Subtle dark overlay to improve text readability */}
          <div className="absolute inset-0 bg-black opacity-70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="w-full md:w-[45%] text-center md:text-left mb-6 md:mb-0 pt-0 md:pt-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-5 text-[#E5B992]">Join a Thriving<br />Creator Community</h2>
              <p className="text-sm text-gray-300 mb-6 sm:mb-8">Create, share, and get feedback from like-minded creators.</p>
              
              <Link 
                to="/join"
                style={{
                  ...gradientButtonStyle,
                  borderRadius: '4px',
                  display: 'inline-flex'
                }}
                className="items-center gap-2 text-white py-2 px-3 text-sm transition-colors font-medium"
              >
                Join Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="w-full md:w-[55%] md:pl-10">
              <div className="bg-[#111] rounded-lg overflow-hidden shadow-xl border border-[#333]">
                <div className="p-3 sm:p-4 border-b border-[#333]">
                  <h3 className="text-lg sm:text-xl font-bold">Creator</h3>
                </div>
                
                <div className="bg-black p-3 sm:p-4">
                  <img 
                    src="/creator-preview.png" 
                    alt="Creator Preview" 
                    className="w-full rounded-md"
                  />
                </div>
                
                <div className="p-3 sm:p-4 grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-black h-12 sm:h-16 rounded-md overflow-hidden">
                      <img src={`/creator-thumb-${i}.png`} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 text-center border-t border-[#222] relative">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <img 
            src="/Group 193 (1).png" 
            alt=""
            className="w-full h-full object-cover opacity-90"
          />
          {/* Subtle dark overlay to improve text readability */}
          <div className="absolute inset-0 bg-black opacity-80"></div>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-[#E5B992]">Start Creating with <br className="sm:hidden" />Videora Today</h2>
          <p className="text-sm text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto">Experience the future of AI-powered video generation.</p>
          
          <Link 
            to="/create"
            style={{
              ...gradientButtonStyle,
              borderRadius: '4px',
              display: 'inline-flex'
            }}
            className="items-center gap-2 text-white py-2 px-4 text-sm font-medium mx-auto"
          >
            Generate Your First Video
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 px-4 sm:px-6 border-t border-[#222] text-center text-gray-500 text-xs sm:text-sm">
        <p>© 2024 Videora. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Style Tile Component
const StyleTile = ({ name, imageSrc, large, wide }) => {
  // Determine the appropriate CSS classes based on props
  const tileClassNames = `
    relative overflow-hidden group rounded-lg border border-[#333]
    ${large ? 'aspect-[1.5/1]' : 'aspect-square'} 
    ${wide ? 'col-span-3' : ''}
    transition-all duration-300 hover:border-[#E5B992] hover:shadow-[0_0_15px_rgba(229,185,146,0.3)]
  `;

  return (
    <div className={tileClassNames}>
      {/* Corner dots */}
      <div className="absolute top-1 sm:top-2 left-1 sm:left-2 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-[#E5B992] rounded-full"></div>
      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-[#E5B992] rounded-full"></div>
      <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-[#E5B992] rounded-full"></div>
      <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-[#E5B992] rounded-full"></div>
      
      <img src={imageSrc} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-xs sm:text-sm text-white font-medium">{name}</div>
    </div>
  );
};

export default LandingPage; 