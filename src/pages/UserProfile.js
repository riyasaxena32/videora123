import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { User, Plus, Save } from 'lucide-react';

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

  // Custom input styles to match the image
  const inputStyle = {
    backgroundColor: 'rgba(15, 7, 0, 0.5)',
    border: '1px solid #843D0C',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '4px',
    width: '100%',
    outline: 'none',
    height: '48px',
    fontSize: '16px'
  };
  
  // Save Profile button style
  const saveButtonStyle = {
    backgroundColor: '#6B2E0A',
    border: '1px solid #843D0C',
    color: 'white',
    borderRadius: '4px',
    padding: '10px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    fontSize: '14px'
  };

  // Main container background style
  const containerStyle = {
    background: 'linear-gradient(180deg, #0C0500 0%, #000000 100%)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    
  };

  // Profile box style
  const profileBoxStyle = {
    backgroundColor: 'rgba(10, 5, 0, 0.95)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    border: '1px solid #843D0C',
    borderRadius: '12px',
    padding: '30px'
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
    <div className="min-h-screen text-white py-10" style={containerStyle}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] mb-10 bg-black fixed top-0 w-full z-10">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <img src="/Play.png" alt="VIDEORA x PLAYGROUND" className="h-12" />
          </Link>
        </div>
        
        {/* Center the navigation items */}
        <div className="flex-1 flex justify-center">
          <nav className="flex">
            {['Generate Video', 'AI Video Edit', 'Video Narration'].map((tab) => (
              <Link
                key={tab}
                to="#"
                className="px-4 py-2 text-sm transition-colors text-[#b0b0b0] hover:text-white"
              >
                {tab}
              </Link>
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
          <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#270E00] hover:border-[#ED5606] transition-colors">
            <img
              src={userData.profilePic || '/user-avatar.png'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-20">
        <div style={profileBoxStyle}>
          <h1 className="text-3xl font-medium text-center mb-10" style={{ color: '#C6935C', fontFamily: 'serif' }}>User Profile</h1>
          
          <div className="grid md:grid-cols-[250px_1fr] gap-10">
            {/* Left column - Profile pic and username */}
            <div className="flex flex-col items-center">
              <div className="w-[200px] h-[200px] rounded overflow-hidden mb-6" style={{ border: '1px solid #843D0C' }}>
                <img 
                  src={userData.profilePic || '/user-avatar.png'} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="w-full relative mt-2">
                <input
                  type="text"
                  name="username"
                  value={userData.username || 'username'}
                  onChange={handleInputChange}
                  style={inputStyle}
                  disabled={!isEditing}
                />
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  style={{ color: '#C6935C' }}
                  onClick={() => setIsEditing(true)}
                >
                  ✏️
                </button>
              </div>
            </div>
            
            {/* Right column - User details */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name || 'name'}
                    onChange={handleInputChange}
                    style={inputStyle}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email Id</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email || 'email@gmail.com'}
                    style={inputStyle}
                    disabled={true} // Email can't be edited
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Country</label>
                  <div className="relative">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      style={{...inputStyle, appearance: 'none'}}
                      disabled={!isEditing}
                    >
                      {countries.map(country => (
                        <option key={country} value={country}>
                          {country === 'India' ? '🇮🇳' : ''} {country}
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
                  <label className="block text-gray-400 text-sm mb-2">Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-300 bg-[rgba(15,7,0,0.5)] border border-r-0 border-[#843D0C] rounded-l-md" style={{height: '48px'}}>
                      +91 🇮🇳
                    </span>
                    <input
                      type="text"
                      name="PhoneNumber"
                      value={(userData.PhoneNumber?.replace('+91', '') || '8880009991')}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'PhoneNumber',
                          value: '+91' + e.target.value
                        }
                      })}
                      style={{...inputStyle, borderRadius: '0 4px 4px 0'}}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Address</label>
                <input
                  type="text"
                  name="Address"
                  value={userData.Address || 'Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore'}
                  onChange={handleInputChange}
                  style={inputStyle}
                  disabled={!isEditing}
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm py-2">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  style={saveButtonStyle}
                >
                  {loading ? (
                    <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Profile
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