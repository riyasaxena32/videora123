import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, User, Bell, ChevronRight, Menu } from 'lucide-react';

function CreatorPage() {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  useEffect(() => {
    // Simulate fetching creator data
    // In a real app, you would fetch from an API based on creatorId
    const fetchCreator = () => {
      setLoading(true);
      
      // Find creator in our mock data
      const foundCreator = creatorsData.find(c => c.id === creatorId) || 
                          creatorsData.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === creatorId);
      
      if (foundCreator) {
        setCreator(foundCreator);
      } else {
        // If no ID match, just use the first creator for demo
        setCreator({
          id: "sparsh",
          name: "Sparsh", 
          image: "/user-avatar.png", 
          subscribers: "1.2M", 
          videos: 100, 
          bio: "A breathtaking cinematic anime scene set in a futuristic cyberpunk city at night. Neon lights reflect off the rain-soaked streets as a lone warrior in a sleek black trench coat and a glowing cybernetic eye walks forward, katana in hand."
        });
      }
      
      setLoading(false);
    };
    
    fetchCreator();
  }, [creatorId]);

  // Set up scroll button visibility and behavior
  useEffect(() => {
    const handleScrollButtonVisibility = (scrollId, leftBtnId, rightBtnId) => {
      const scrollContainer = document.getElementById(scrollId);
      const leftBtn = document.getElementById(leftBtnId);
      const rightBtn = document.getElementById(rightBtnId);
      
      if (!scrollContainer || !leftBtn || !rightBtn) return;
      
      // Initially hide left button as we're at the start
      leftBtn.style.display = scrollContainer.scrollLeft <= 10 ? 'none' : 'flex';
      
      // Check if we're at the end already
      rightBtn.style.display = 
        Math.ceil(scrollContainer.scrollLeft + scrollContainer.clientWidth) >= scrollContainer.scrollWidth - 10 
          ? 'none' : 'flex';
      
      // Add scroll event listener
      const handleScroll = () => {
        // Hide/show left button based on scroll position
        leftBtn.style.display = scrollContainer.scrollLeft <= 10 ? 'none' : 'flex';
        
        // Hide/show right button based on if we reached the end
        rightBtn.style.display = 
          Math.ceil(scrollContainer.scrollLeft + scrollContainer.clientWidth) >= scrollContainer.scrollWidth - 10
            ? 'none' : 'flex';
      };
      
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    };
    
    // Set up scroll button visibility for each section
    const sections = [
      { scrollId: 'featuredVideosScroll', leftBtnId: 'featuredVideosLeftBtn', rightBtnId: 'featuredVideosRightBtn' },
      { scrollId: 'recentUploadsScroll', leftBtnId: 'recentUploadsLeftBtn', rightBtnId: 'recentUploadsRightBtn' }
    ];
    
    // Set up listeners for each section
    const cleanupFunctions = sections.map(({ scrollId, leftBtnId, rightBtnId }) => 
      handleScrollButtonVisibility(scrollId, leftBtnId, rightBtnId)
    ).filter(Boolean);
    
    // Clean up all event listeners
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup && cleanup());
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Creator not found</h1>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#2f2f2f] hover:bg-[#414141] px-6 py-2 rounded-full"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Featured videos data
  const featuredVideos = [
    { title: "S Charming", image: "/image 28.png", theme: "City Vibes" },
    { title: "Theory of everything", image: "/image 28.png", theme: "Retro Themed" },
    { title: "Openhiemer", image: "/image 28.png", theme: "Retro Themed" },
    { title: "New Delhi", image: "/image 28.png", theme: "Retro Themed" },
    { title: "Bumblebee", image: "/image 28.png", theme: "Sci-Fi" },
    { title: "Avatar", image: "/image 28.png", theme: "Fantasy" },
    { title: "Matrix", image: "/image 28.png", theme: "Sci-Fi" },
    { title: "Interstellar", image: "/image 28.png", theme: "Space" }
  ];
  
  // Recent uploads data
  const recentUploads = [
    { title: "Openhiemer", image: "/image 28.png", theme: "Retro Themed" },
    { title: "New Delhi", image: "/image 28.png", theme: "Retro Themed" },
    { title: "S Charming", image: "/image 28.png", theme: "City Vibes" },
    { title: "Theory of everything", image: "/image 28.png", theme: "Retro Themed" },
    { title: "John Wick", image: "/image 28.png", theme: "Action" },
    { title: "Inception", image: "/image 28.png", theme: "Mind-bending" },
    { title: "The Batman", image: "/image 28.png", theme: "Dark" },
    { title: "Dune", image: "/image 28.png", theme: "Sci-Fi" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] w-full bg-black">
        <div className="flex items-center gap-8">
          <button 
            className="p-1 hover:bg-[#1a1a1a] rounded-md transition-colors" 
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="text-xl font-bold flex items-center">
            <img src="/Logo.png" alt="VIDEORA" className="h-8" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {["Home", "Trending", "Genre", "Browse"].map((item) => (
              <a
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={`text-sm font-medium transition-colors ${
                  item === "Home" ? "text-white" : "text-[#b0b0b0] hover:text-white"
                }`}
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
          >
            Create <Plus className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-[#270E00] hover:bg-[#3a1500] rounded-full transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-[#270E00] hover:bg-[#3a1500] rounded-full transition-colors">
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Creator Cover Image - Full width cinematic photo */}
      <div className="relative w-full h-[100vh] overflow-hidden">
        <img 
          src="/image 28.png" 
          alt={`${creator.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        {/* Minimalist Creator Info Overlay */}
        <div className="absolute bottom-20 left-12 w-full">
          <h1 className="text-6xl font-bold mb-4">{creator.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#ED5606] px-4 py-1 rounded text-sm font-medium">
              Total Videos <span className="font-bold">{creator.videos}</span>
            </div>
          </div>
          
          <p className="text-lg max-w-2xl mb-8 text-gray-200">
            {creator.bio}
          </p>
          
          <div className="flex gap-4">
            <button className="w-10 h-10 flex items-center justify-center bg-[#222] rounded-full text-white hover:bg-[#333] transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="bg-transparent hover:bg-white/10 border border-white text-white px-6 py-2 rounded-full transition-colors flex items-center gap-2">
              <span className="text-sm font-medium">Follow</span>
            </button>
            <button className="bg-transparent hover:bg-white/10 border border-white text-white px-6 py-2 rounded-full transition-colors flex items-center gap-2">
              <span className="text-sm font-medium">About</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-8 py-12">
        {/* Featured Videos Section */}
        <div className="py-6 relative">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold">Featured Video</h2>
            <ChevronRight className="w-5 h-5 ml-2" />
            <div className="ml-auto flex gap-2">
              <button 
                id="featuredVideosLeftBtn"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm"
                onClick={() => document.getElementById('featuredVideosScroll').scrollBy({left: -500, behavior: 'smooth'})}>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button 
                id="featuredVideosRightBtn"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm"
                onClick={() => document.getElementById('featuredVideosScroll').scrollBy({left: 500, behavior: 'smooth'})}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto pb-4 hide-scrollbar scroll-smooth px-2" id="featuredVideosScroll">
            <div className="flex gap-6 snap-x" style={{ minWidth: 'max-content' }}>
              {featuredVideos.map((video, index) => (
                <Link key={index} to={`/video/${index + 1}`} className="snap-start" style={{ width: '340px', flexShrink: 0 }}>
                  <VideoCard {...video} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Recent Uploads Section */}
        <div className="py-6 relative">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold">Recent Uploads</h2>
            <ChevronRight className="w-5 h-5 ml-2" />
            <div className="ml-auto flex gap-2">
              <button 
                id="recentUploadsLeftBtn"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm"
                onClick={() => document.getElementById('recentUploadsScroll').scrollBy({left: -500, behavior: 'smooth'})}>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button 
                id="recentUploadsRightBtn"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm"
                onClick={() => document.getElementById('recentUploadsScroll').scrollBy({left: 500, behavior: 'smooth'})}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto pb-4 hide-scrollbar scroll-smooth px-2" id="recentUploadsScroll">
            <div className="flex gap-6 snap-x" style={{ minWidth: 'max-content' }}>
              {recentUploads.map((video, index) => (
                <Link key={index} to={`/video/${index + 10}`} className="snap-start" style={{ width: '340px', flexShrink: 0 }}>
                  <VideoCard {...video} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add CSS for hiding scrollbars while maintaining functionality
const hideScrollbarStyles = `
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
`;

// Insert the styles into the document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = hideScrollbarStyles;
  document.head.appendChild(styleSheet);
}

function VideoCard({ title, image, theme }) {
  return (
    <div className="relative group cursor-pointer">
      <div className="overflow-hidden rounded-md aspect-video bg-[#1a1a1a]">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105" 
        />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="bg-black/70 px-2 py-0.5 rounded text-[10px] text-white inline-block mb-1">
            {theme}
          </div>
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      </div>
    </div>
  );
}

// Sample creator data
const creatorsData = [
  { id: "sparsh", name: "Sparsh", image: "/user-avatar.png", subscribers: "1.2M", videos: 100, bio: "A breathtaking cinematic anime scene set in a futuristic cyberpunk city at night. Neon lights reflect off the rain-soaked streets as a lone warrior in a sleek black trench coat and a glowing cybernetic eye walks forward, katana in hand." },
  { id: "mrwhostheboss", name: "MrWhosTheBoss", image: "/user-avatar.png", subscribers: "12.5M", videos: 524, bio: "Tech reviewer and creator focusing on the latest smartphone and gadget reviews. Join me for honest, in-depth analysis of the newest technology." },
  { id: "mkbhd", name: "MKBHD", image: "/user-avatar.png", subscribers: "18.2M", videos: 810, bio: "Quality Tech Videos | YouTuber | Geek | Consumer Electronics | MKBHD" },
  { id: "t-series", name: "T-SERIES", image: "/user-avatar.png", subscribers: "245M", videos: 1432, bio: "Music can change the world. T-Series is India's largest Music Label & Movie Studio." },
  { id: "casey-neistat", name: "Casey Neistat", image: "/user-avatar.png", subscribers: "10.1M", videos: 682, bio: "Filmmaker, entrepreneur, and vlogger known for daily vlogs and innovative storytelling techniques." },
  { id: "pewdiepie", name: "PewDiePie", image: "/user-avatar.png", subscribers: "111M", videos: 2840, bio: "I make videos." },
  { id: "linus-tech-tips", name: "Linus Tech Tips", image: "/user-avatar.png", subscribers: "15.3M", videos: 1215, bio: "Tech reviews, news, and tutorials with a comedic twist. Hardware enthusiasts welcome!" },
];

export default CreatorPage; 