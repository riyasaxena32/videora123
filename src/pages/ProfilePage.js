import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Edit2 } from 'lucide-react';

function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = user?.tokenType === 'jwt' ? 
          localStorage.getItem('access_token') : 
          localStorage.getItem('token');

        const response = await fetch('http://videora-ai.onrender/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfileData(data.user);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED5606]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#ED5606] text-xl mb-2">Error loading profile</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-[#1A0D00] rounded-lg p-8">
          <h1 className="text-2xl font-semibold mb-8 text-center">User Profile</h1>

          <div className="space-y-6">
            {/* Profile Picture and Username */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <img 
                  src={profileData?.profilePic || '/default-avatar.png'} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-lg object-cover mb-4"
                />
                <button className="absolute bottom-4 right-0 bg-[#ED5606] p-2 rounded-full">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#ED5606]">@</span>
                <input 
                  type="text"
                  value={profileData?.name?.toLowerCase().replace(/\s+/g, '') || ''}
                  className="bg-transparent border-none text-white focus:outline-none text-center"
                  readOnly
                />
                <button>
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={profileData?.name || ''}
                  className="w-full bg-[#270E00] border border-[#ED5606] rounded-lg px-4 py-3 text-white"
                  readOnly
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email Id</label>
                <input
                  type="email"
                  value={profileData?.email || ''}
                  className="w-full bg-[#270E00] border border-[#ED5606] rounded-lg px-4 py-3 text-white"
                  readOnly
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Country</label>
                <div className="relative">
                  <select
                    className="w-full bg-[#270E00] border border-[#ED5606] rounded-lg px-4 py-3 text-white appearance-none"
                    defaultValue="IN"
                  >
                    <option value="IN">🇮🇳 India</option>
                    {/* Add more countries as needed */}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                <div className="flex">
                  <div className="w-20 mr-2">
                    <select
                      className="w-full bg-[#270E00] border border-[#ED5606] rounded-lg px-2 py-3 text-white appearance-none"
                      defaultValue="+91"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      {/* Add more country codes as needed */}
                    </select>
                  </div>
                  <input
                    type="tel"
                    placeholder="8880009991"
                    className="flex-1 bg-[#270E00] border border-[#ED5606] rounded-lg px-4 py-3 text-white"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Address</label>
                <input
                  type="text"
                  placeholder="Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore"
                  className="w-full bg-[#270E00] border border-[#ED5606] rounded-lg px-4 py-3 text-white"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-8">
              <button className="bg-[#ED5606] text-white px-6 py-2 rounded-lg hover:bg-[#D64D05] transition-colors">
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage; 