import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Save } from 'lucide-react';

function ProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: 'India',
    phone: '',
    username: '',
    address: '',
    profilePic: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('https://videora-ai.onrender.com/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setFormData(prevData => ({
          ...prevData,
          name: data.user.name,
          email: data.user.email,
          profilePic: data.user.profilePic,
          username: data.user.email.split('@')[0] // Using email prefix as username
        }));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://videora-ai.onrender.com/user/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Show success message or redirect
      console.log('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      // Show error message
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#ED5606] text-white px-4 py-2 rounded"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with navigation */}
      <header className="px-6 py-4 border-b border-[#222] flex items-center justify-between">
        <Link to="/" className="text-xl font-bold flex items-center">
          <img src="/Logo.png" alt="VIDEORA" className="h-8" />
          <span className="mx-2 text-[#555]">×</span>
          <span className="text-[#ED5606]">PLAYGROUND</span>
        </Link>
        
        <div className="flex items-center gap-8">
          <Link to="/create" className="text-sm text-[#999] hover:text-white transition-colors">
            Generate Video
          </Link>
          <Link to="/create" className="text-sm text-[#999] hover:text-white transition-colors">
            AI Video Edit
          </Link>
          <Link to="/create" className="text-sm text-[#999] hover:text-white transition-colors">
            Video Narration
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center gap-2 bg-[#ED5606] text-white rounded-full px-4 py-1.5 text-sm"
            onClick={() => navigate('/create')}
          >
            Create
            <span className="text-lg leading-none">+</span>
          </button>
          <button className="bg-[#111] w-8 h-8 rounded-full flex items-center justify-center border border-[#333] overflow-hidden">
            <img 
              src={formData.profilePic || "/user-avatar.png"} 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto my-8 px-6">
        <h1 className="text-xl font-semibold text-center mb-8">User Profile</h1>
        
        <div className="bg-[#111] border border-[#333] rounded-lg p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile image (left side) */}
            <div className="col-span-1 flex justify-center">
              <div className="w-48 h-48 relative mb-4">
                <img 
                  src={formData.profilePic || "/user-avatar.png"}
                  alt="Profile" 
                  className="w-full h-full rounded-md object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-md opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-xs text-white/80 mb-1">Click to change</span>
                  <span className="text-xs text-white/80">profile photo</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Upload profile photo"
                />
              </div>
            </div>
            
            {/* Form fields (right side) */}
            <div className="col-span-1 space-y-4">
              {/* Name field */}
              <div>
                <label className="block text-xs text-[#777] mb-1">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full bg-[#151515] border border-[#333] rounded p-2 text-sm text-white focus:outline-none focus:border-[#ED5606]"
                />
              </div>
              
              {/* Email field */}
              <div>
                <label className="block text-xs text-[#777] mb-1">Email Id</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  readOnly 
                  className="w-full bg-[#151515] border border-[#333] rounded p-2 text-sm text-white focus:outline-none focus:border-[#ED5606] opacity-75"
                />
              </div>
              
              {/* Country field */}
              <div>
                <label className="block text-xs text-[#777] mb-1">Country</label>
                <div className="relative">
                  <select 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange} 
                    className="w-full appearance-none bg-[#151515] border border-[#333] rounded p-2 text-sm text-white pr-8 focus:outline-none focus:border-[#ED5606]"
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Phone number field */}
              <div>
                <label className="block text-xs text-[#777] mb-1">Phone Number</label>
                <div className="flex">
                  <div className="bg-[#151515] border border-[#333] rounded-l p-2 text-sm text-white">
                    +91
                  </div>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="flex-1 bg-[#151515] border border-[#333] border-l-0 rounded-r p-2 text-sm text-white focus:outline-none focus:border-[#ED5606]"
                  />
                </div>
              </div>
            </div>
            
            {/* Username field - full width */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex">
                <label className="block text-xs text-[#777] mb-1">Username</label>
                <button type="button" className="ml-2 text-xs text-[#666]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.9991 7L12.0077 7.00872" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <input 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                className="w-full bg-[#151515] border border-[#333] rounded p-2 text-sm text-white focus:outline-none focus:border-[#ED5606]"
              />
            </div>
            
            {/* Address field - full width */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs text-[#777] mb-1">Address</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                className="w-full bg-[#151515] border border-[#333] rounded p-2 text-sm text-white focus:outline-none focus:border-[#ED5606]"
              />
            </div>
            
            {/* Save button - right aligned */}
            <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
              <button 
                type="submit" 
                className="flex items-center gap-2 bg-[#ED5606] hover:bg-[#D04500] text-white px-4 py-2 rounded text-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage; 