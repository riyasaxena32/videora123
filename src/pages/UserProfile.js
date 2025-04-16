import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Plus, LogOut, Bell } from 'lucide-react';
import axios from 'axios';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profilePic: '',
    PhoneNumber: '',
    Address: '',
    username: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countries] = useState(['India', 'USA', 'UK', 'Canada', 'Australia']);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

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

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = user?.tokenType === 'jwt' ? 
        localStorage.getItem('access_token') : 
        localStorage.getItem('token');
      
      const response = await axios.get('https://videora-ai.onrender.com/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const profileData = response.data.user;
      setUserData({
        name: profileData.name || '',
        email: profileData.email || '',
        profilePic: profileData.profilePic || '',
        PhoneNumber: profileData.PhoneNumber || '',
        Address: profileData.Address || '',
        username: profileData.username || ''
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = user?.tokenType === 'jwt' ? 
        localStorage.getItem('access_token') : 
        localStorage.getItem('token');
      
      const response = await axios.put('https://videora-ai.onrender.com/user/profile/edit', 
        {
          name: userData.name,
          PhoneNumber: userData.PhoneNumber,
          Address: userData.Address
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setUserData({
        ...userData,
        ...response.data.user
      });
      
      setLoading(false);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  if (loading && !userData.name) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header - Same as in VideoPage and CreatePage */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] w-full bg-black">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold flex items-center">
            <img src="/Logo.png" alt="VIDEORA" className="h-8" />
            <span className="ml-2 text-[#ED5606]">x PLAYGROUND</span>
          </Link>
        </div>
        
        <div className="flex-1 flex justify-center">
          <nav className="flex">
            {['Generate Video', 'AI Video Edit', 'Video Narration'].map((tab) => (
              <Link
                key={tab}
                to={tab === 'Generate Video' ? '/create' : '/create'}
                className="px-4 py-2 text-sm transition-colors text-[#b0b0b0] hover:text-white"
              >
                {tab}
              </Link>
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
                src={userData.profilePic || user?.picture || user?.profilePic || "/user-avatar.png"}
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

      {/* Main Content - Profile Form */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-[#0e0e0e] border border-[#1A1A1A] rounded-lg p-8">
          <h1 className="text-2xl font-semibold text-center mb-10 text-[#ED5606]">User Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
            {/* Left column - Profile pic and username */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[220px] h-[220px] rounded-lg overflow-hidden mb-4 bg-[#1A1A1A] border border-[#333]">
                <img 
                  src={userData.profilePic || user?.picture || "/user-avatar.png"} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="w-full max-w-[220px] relative">
                <input
                  type="text"
                  name="username"
                  value={userData.username || ''}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-[#333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#ED5606]"
                  placeholder="Username"
                  disabled={!isEditing}
                />
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#ED5606]"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️
                </button>
              </div>
            </div>
            
            {/* Right column - User details */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name || ''}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-[#333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#ED5606]"
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Email Id</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email || ''}
                    className="w-full bg-black border border-[#333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#ED5606]"
                    disabled={true} // Email can't be edited
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Country</label>
                  <div className="relative">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full bg-black border border-[#333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#ED5606] appearance-none"
                      disabled={!isEditing}
                    >
                      <option value="India">🇮🇳 India</option>
                      {countries.filter(c => c !== 'India').map(country => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-300 bg-black border border-r-0 border-[#333] rounded-l-md">
                      +91 🇮🇳
                    </span>
                    <input
                      type="text"
                      name="PhoneNumber"
                      value={(userData.PhoneNumber || '').replace('+91', '')}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'PhoneNumber',
                          value: '+91' + e.target.value
                        }
                      })}
                      className="w-full bg-black border border-[#333] rounded-r-md py-2 px-3 text-white focus:outline-none focus:border-[#ED5606]"
                      placeholder="8880009991"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Address</label>
                <input
                  type="text"
                  name="Address"
                  value={userData.Address || ''}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-[#333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#ED5606]"
                  placeholder="Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore"
                  disabled={!isEditing}
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm py-2">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  disabled={loading}
                  className="bg-[#270E00] hover:bg-[#3A1500] text-white px-4 py-2 rounded-md border border-[#ED5606] flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      {isEditing ? 'Save Profile' : 'Edit Profile'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 