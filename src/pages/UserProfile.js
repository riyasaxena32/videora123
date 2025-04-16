import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { User, Bell, Plus } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
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

  // Gradient button style for header
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
      {/* Header with navigation */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] w-full bg-black">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold flex items-center">
            <img src="/Logo.png" alt="VIDEORA" className="h-8" />
            <span className="ml-2 text-orange-500">×</span>
            <span className="ml-2 text-orange-500">PLAYGROUND</span>
          </Link>
        </div>
        
        {/* Center the navigation items */}
        <div className="flex-1 flex justify-center">
          <nav className="flex">
            {['Generate Video', 'AI Video Edit', 'Video Narration'].map((tab) => (
              <button
                key={tab}
                className="px-4 py-2 text-sm transition-colors text-[#b0b0b0] hover:text-white"
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
            <Plus className="w-3.5 h-3.5 ml-0.5" />
          </button>
          <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#270E00] hover:border-[#ED5606] transition-colors focus:outline-none">
            <img
              src={userData.profilePic || "/user-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#0E0E0E] rounded-lg border border-[#ED5606]/40 shadow-lg p-8">
          <h1 className="text-xl font-bold text-center mb-8 text-[#ED5606]">User Profile</h1>
          
          <div className="grid md:grid-cols-[250px_1fr] gap-8">
            {/* Left column - Profile pic and username */}
            <div className="flex flex-col items-center">
              <div className="w-[200px] h-[200px] rounded-lg overflow-hidden mb-4 border border-[#333]">
                <img 
                  src={userData.profilePic || "/default-avatar.png"} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="w-full relative mt-2">
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] border border-[#333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#ED5606]"
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="w-full bg-[#0A0A0A] border border-[#333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#ED5606]"
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Email Id</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    className="w-full bg-[#0A0A0A] border border-[#333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#ED5606]"
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
                      className="w-full bg-[#0A0A0A] border border-[#333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#ED5606] appearance-none"
                      disabled={!isEditing}
                    >
                      <option value="India">🇮🇳 India</option>
                      <option value="USA">🇺🇸 USA</option>
                      <option value="UK">🇬🇧 UK</option>
                      <option value="Canada">🇨🇦 Canada</option>
                      <option value="Australia">🇦🇺 Australia</option>
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
                    <span className="inline-flex items-center px-3 text-sm text-gray-300 bg-[#0A0A0A] border border-r-0 border-[#333] rounded-l-md">
                      +91 🇮🇳
                    </span>
                    <input
                      type="text"
                      name="PhoneNumber"
                      value={userData.PhoneNumber?.replace('+91', '') || ''}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'PhoneNumber',
                          value: '+91' + e.target.value
                        }
                      })}
                      className="w-full bg-[#0A0A0A] border border-[#333] rounded-r-md py-2 px-3 text-white focus:outline-none focus:border-[#ED5606]"
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
                  value={userData.Address}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] border border-[#333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#ED5606]"
                  placeholder="Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore"
                  disabled={!isEditing}
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm py-2">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  disabled={loading}
                  className="bg-[#270E00] hover:bg-[#3A1500] text-white px-4 py-2 rounded-md border border-[#ED5606] flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
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