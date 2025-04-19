import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

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
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            <img src="/Play.png" alt="VIDEORA" className="h-8" />
          </Link>
        </div>
        
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
        
        <div>
          <Link 
            to="/create"
            style={gradientButtonStyle}
            className="flex items-center gap-2 text-white px-4 py-2 text-sm transition-colors font-medium"
          >
            Get Started
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 text-center py-10 md:py-16">
        {/* Background - blurred and dimmed version of the image */}
        <div className="absolute inset-0 overflow-hidden bg-black z-0">
          <div className="absolute inset-0 bg-black opacity-80"></div>
          <img 
            src="/Group-191.png" 
            alt=""
            className="w-full h-full object-cover opacity-20 scale-110 blur-sm"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto pt-6 md:pt-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-0 text-white tracking-wider uppercase">VIDEORA</h1>
          <p className="text-sm text-gray-400 mb-4 md:mb-6 tracking-wide">Where AI Meets Creativity</p>
          
          {/* Anime girl image - clear and focused */}
          <div className="relative mx-auto h-60 sm:h-72 md:h-80 flex items-center justify-center">
            <img 
              src="/Group-191.png" 
              alt="AI Creator" 
              className="h-full object-contain drop-shadow-[0_0_15px_rgba(237,86,6,0.25)]"
            />
          </div>
        </div>
      </section>

      {/* Make the Story Section */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold mb-16 max-w-7xl mx-auto">Make the Story Truly Yours</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* AI Video Playground Card */}
          <div className="bg-[#0C0500] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-[#222] group">
            <div className="h-40 bg-[#161616] relative">
              <img src="/playground-card.png" alt="AI Video Playground" className="absolute inset-0 w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0C0500] opacity-60"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-lg font-bold">AI Video Playground</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-400 mb-6">
                Turn your creative ideas into stunning videos with our AI tools. 
                Get started in minutes without any prior experience.
              </p>
              <Link to="/playground" className="text-[#ED5606] text-sm font-medium flex items-center gap-1 hover:underline">
                Try it now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Video Streaming Card */}
          <div className="bg-[#0C0500] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-[#222] group">
            <div className="h-40 bg-[#161616] relative">
              <img src="/streaming-card.png" alt="Video Streaming" className="absolute inset-0 w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0C0500] opacity-60"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-lg font-bold">Video Streaming</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-400 mb-6">
                Watch and share AI-generated videos. Discover new content
                creators and innovative ways to tell your story.
              </p>
              <Link to="/streaming" className="text-[#ED5606] text-sm font-medium flex items-center gap-1 hover:underline">
                Start watching <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Creators Community Card */}
          <div className="bg-[#0C0500] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-[#222] group">
            <div className="h-40 bg-[#161616] relative">
              <img src="/community-card.png" alt="Creators Community" className="absolute inset-0 w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0C0500] opacity-60"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-lg font-bold">Creators Community</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-400 mb-6">
                Join a thriving community of AI video creators. Share your work,
                get feedback, and collaborate on exciting projects.
              </p>
              <Link to="/community" className="text-[#ED5606] text-sm font-medium flex items-center gap-1 hover:underline">
                Join community <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Styles Section */}
      <section className="py-20 px-6 bg-[#0A0500]">
        <h2 className="text-3xl font-bold mb-16 max-w-7xl mx-auto">Infinite Styles, Endless Creativity</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {/* Style tiles */}
          <StyleTile name="Animated" imageSrc="/style-animated.png" />
          <StyleTile name="Retro" imageSrc="/style-retro.png" />
          <StyleTile name="Cinematic" imageSrc="/style-cinematic.png" />
          <StyleTile name="Surreal" imageSrc="/style-surreal.png" />
          <StyleTile name="Cyberpunk" imageSrc="/style-cyberpunk.png" />
          <StyleTile name="Custom" imageSrc="/style-custom.png" />
        </div>
      </section>

      {/* Smart Captions Section */}
      <section className="py-20 px-6 flex flex-col md:flex-row max-w-7xl mx-auto">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-3xl font-bold mb-4">Smart Captions & Seamless Voice Integration</h2>
          <p className="text-gray-400 mb-6">Edit captions without affecting voice continuity.</p>
          
          <Link 
            to="/playground"
            className="inline-block px-5 py-2 border border-[#6B2E0A] bg-[#270E00] rounded-md text-sm text-white hover:bg-[#3A1500] transition-colors"
          >
            Try the Playground
          </Link>
        </div>
        
        <div className="md:w-1/2 bg-[#111] rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="text-xs text-gray-500 mb-2">Live Caption</div>
            
            <div className="h-80 bg-black rounded border border-[#333] p-4 flex flex-col justify-end">
              <div className="mb-2 text-sm">The protagonist ventures into the mysterious forest, searching for answers.</div>
              
              <div className="flex items-center gap-4 mt-10">
                <div className="w-full bg-[#111] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#ED5606] h-full" style={{ width: '70%' }}></div>
                </div>
                
                <svg viewBox="0 0 100 30" width="100" height="30">
                  <path d="M 0,15 Q 10,5 20,15 Q 30,25 40,15 Q 50,5 60,15 Q 70,25 80,15 Q 90,5 100,15" stroke="#ED5606" fill="none" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Content Section */}
      <section className="py-20 px-6 flex flex-col md:flex-row-reverse max-w-7xl mx-auto">
        <div className="md:w-1/2 mb-10 md:mb-0 md:pl-10">
          <h2 className="text-3xl font-bold mb-4">Discover & Watch AI-Created Content</h2>
          <p className="text-gray-400 mb-6">Explore a library of AI-generated videos from the community.</p>
          
          <Link 
            to="/videos"
            className="inline-block px-5 py-2 border border-[#6B2E0A] bg-[#270E00] rounded-md text-sm text-white hover:bg-[#3A1500] transition-colors"
          >
            Stream Now
          </Link>
        </div>
        
        <div className="md:w-1/2">
          <div className="bg-[#111] rounded-lg overflow-hidden shadow-lg border border-[#333]">
            <img 
              src="/discover-content.png" 
              alt="Video Player Interface" 
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="py-20 px-6 flex flex-col md:flex-row max-w-7xl mx-auto">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-3xl font-bold mb-4">Join a Thriving Creator Community</h2>
          <p className="text-gray-400 mb-6">Create, share, and get feedback from like-minded creators.</p>
          
          <Link 
            to="/join"
            className="inline-block px-5 py-2 border border-[#6B2E0A] bg-[#270E00] rounded-md text-sm text-white hover:bg-[#3A1500] transition-colors"
          >
            Join Now
          </Link>
        </div>
        
        <div className="md:w-1/2 md:pl-10">
          <div className="bg-[#111] rounded-lg overflow-hidden shadow-lg border border-[#333]">
            <div className="p-4 border-b border-[#333]">
              <h3 className="text-xl font-bold">Sparsh</h3>
            </div>
            
            <div className="bg-black p-4">
              <img 
                src="/creator-preview.png" 
                alt="Creator Preview" 
                className="w-full rounded-md"
              />
            </div>
            
            <div className="p-4 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-black h-16 rounded-md overflow-hidden">
                  <img src={`/creator-thumb-${i}.png`} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center border-t border-[#222]">
        <h2 className="text-3xl font-bold mb-2">Start Creating with Videora Today</h2>
        <p className="text-gray-400 mb-10 max-w-2xl mx-auto">Experience the future of AI-powered video generation.</p>
        
        <Link 
          to="/create"
          style={gradientButtonStyle}
          className="inline-flex items-center gap-2 text-white px-6 py-3 text-sm font-medium"
        >
          Generate Your First Video
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-[#222] text-center text-gray-500 text-sm">
        <p>© 2024 Videora. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Style Tile Component
const StyleTile = ({ name, imageSrc }) => {
  return (
    <div className="aspect-square bg-[#111] rounded-lg overflow-hidden relative group">
      <img src={imageSrc} alt={name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      <div className="absolute bottom-4 left-4 font-medium">{name}</div>
    </div>
  );
};

export default LandingPage; 