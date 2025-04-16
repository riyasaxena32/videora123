import React, { useState, useEffect, useRef } from 'react';
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
  // For file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

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
  
  // Save and Edit Profile button styles
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
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // First try to load from localStorage for immediate display
        const cachedData = localStorage.getItem('userProfileData');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          console.log("Loaded from localStorage:", parsedData);
          
          // Debug username specifically
          console.log("Username from localStorage:", parsedData.username);
          
          // Use cached data while waiting for API response
          setUserData(parsedData);
        }
        
        // Then fetch fresh data from API
        const token = localStorage.getItem('token');
        const response = await axios.get('https://videora-ai.onrender.com/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log("API profile response:", response.data);
        
        if (response.data && response.data.user) {
          const apiUserData = response.data.user;
          console.log("Username from API:", apiUserData.username);
          
          // Create a complete user data object combining API response with any cached data
          const completeUserData = {
            name: apiUserData.name || '',
            email: apiUserData.email || '',
            profilePic: apiUserData.profilePic || '',
            PhoneNumber: apiUserData.PhoneNumber || '',
            Address: apiUserData.Address || '',
            username: apiUserData.username || '',
            bio: apiUserData.bio || '',
            // Add any other fields that might be in the API response
          };
          
          setUserData(completeUserData);
          
          // Update localStorage with fresh data
          localStorage.setItem('userProfileData', JSON.stringify(completeUserData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Function to update and verify the username field
  const updateUsernameDebug = () => {
    console.log("Current username state:", userData.username);
    console.log("Current localStorage data:", localStorage.getItem('userProfileData'));
    
    // Check if username is in localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('userProfileData'));
      console.log("Parsed localStorage username:", stored?.username);
    } catch (e) {
      console.error("Failed to parse localStorage:", e);
    }
  };

  // Enhanced save function with better debugging
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = user?.tokenType === 'jwt' ? 
        localStorage.getItem('access_token') : 
        localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Log current username before saving
      console.log("Username before saving:", userData.username);
      
      // Create a FormData object if we have a file to upload
      let updatedData;
      let formData = null;
      
      if (selectedFile) {
        formData = new FormData();
        formData.append('profilePic', selectedFile);
        formData.append('name', userData.name || '');
        formData.append('PhoneNumber', userData.PhoneNumber || '');
        formData.append('Address', userData.Address || '');
        formData.append('username', userData.username || '');
        updatedData = formData;
        
        // Log FormData entries for debugging
        console.log("FormData entries:");
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }
      } else {
        // Regular JSON data without file
        updatedData = {
          name: userData.name || '',
          PhoneNumber: userData.PhoneNumber || '',
          Address: userData.Address || '',
          username: userData.username || ''
        };
        console.log("JSON data being sent:", updatedData);
      }
      
      // Set headers based on whether we're uploading a file
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      if (!formData) {
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await axios.put(
        'https://videora-ai.onrender.com/user/profile/edit', 
        updatedData,
        { headers }
      );
      
      console.log("API response received:", response.data);
      
      if (response.data && response.data.user) {
        // Clear selected file after successful upload
        setSelectedFile(null);

        // Extract all fields from API response, using current values as fallback
        const apiResponse = response.data.user;
        
        // Validate and debug the username in the response
        console.log("API returned username:", apiResponse.username);
        
        // Ensure we use all fields from the server response with proper fallbacks
        const updatedUserData = {
          name: apiResponse.name || userData.name || '',
          email: apiResponse.email || userData.email || '',
          profilePic: apiResponse.profilePic || userData.profilePic || '',
          PhoneNumber: apiResponse.PhoneNumber || userData.PhoneNumber || '',
          Address: apiResponse.Address || userData.Address || '',
          username: apiResponse.username || userData.username || ''
        };
        
        console.log("Final userData to be stored:", updatedUserData);
        
        // Update the user data with the complete response from the server
        setUserData(updatedUserData);
        
        // Store in localStorage for persistence, ensuring we include username
        localStorage.setItem('userProfileData', JSON.stringify(updatedUserData));
        
        // Verify the localStorage was updated correctly
        try {
          const storedData = JSON.parse(localStorage.getItem('userProfileData'));
          console.log("Verification - stored username in localStorage:", storedData.username);
        } catch (e) {
          console.error("Failed to verify localStorage:", e);
        }
        
        // Update the auth context to reflect changes across the app
        if (typeof user.fetchUserProfile === 'function') {
          try {
            await user.fetchUserProfile();
          } catch (err) {
            console.error("Failed to update auth context:", err);
          }
        }
        
        // Immediate success notification
        setError(null);
        alert("Profile updated successfully!");
      } else {
        throw new Error("Invalid response data");
      }
      
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} field to: ${value}`);
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If already editing, save changes
      handleSaveProfile();
    } else {
      // If not editing, enter edit mode
      setIsEditing(true);
    }
  };

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("File selected:", file.name, file.type, file.size);
      
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file (JPG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image too large. Please select an image less than 5MB.');
        return;
      }
      
      setSelectedFile(file);
      
      // Create a preview URL and update state immediately for user feedback
      const previewUrl = URL.createObjectURL(file);
      setUserData(prev => ({
        ...prev,
        profilePic: previewUrl // Show preview immediately
      }));
      
      console.log("Profile picture preview created:", previewUrl);
    }
  };
  
  // Function to trigger file input click
  const handleProfilePicClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  // Username specific handler for better UX
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    console.log(`Updating username to: ${value}`);
    
    // Remove spaces and special characters
    const sanitizedValue = value.replace(/[^a-zA-Z0-9_]/g, '');
    
    setUserData(prev => ({
      ...prev,
      username: sanitizedValue
    }));
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
            <img src="/VIDEORA.svg" alt="VIDEORA" className="h-6" />
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
              <div 
                className={`w-[200px] h-[200px] rounded overflow-hidden mb-6 relative ${isEditing ? 'cursor-pointer' : ''}`}
                style={{ border: '1px solid #843D0C' }}
                onClick={handleProfilePicClick}
              >
                <img 
                  src={userData.profilePic || '/user-avatar.png'} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white">Change Photo</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              
              <div className="w-full relative mt-2">
                <input
                  type="text"
                  name="username"
                  value={userData.username || ''}
                  onChange={handleUsernameChange}
                  style={inputStyle}
                  disabled={!isEditing}
                />
                {!isEditing && (
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    style={{ color: '#C6935C' }}
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️
                  </button>
                )}
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
                    value={userData.name || ''}
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
                    value={userData.email || ''}
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
                      value={(userData.PhoneNumber || '').replace(/^\+91/, '')}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'PhoneNumber',
                          value: e.target.value.startsWith('+91') ? e.target.value : '+91' + e.target.value
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
                  value={userData.Address || ''}
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
                  onClick={handleEditToggle}
                  style={saveButtonStyle}
                >
                  {loading ? (
                    <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Save size={16} />
                      {isEditing ? "Save Profile" : "Edit Profile"}
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