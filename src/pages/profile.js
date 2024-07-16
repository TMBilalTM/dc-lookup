import { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User is not authenticated');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get('/api/profile', config);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Profile</h2>
        {loading ? (
          <p className="text-center">Loading user data...</p>
        ) : userData ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <div className="mt-1 text-gray-600">{userData.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <div className="mt-1 text-gray-600">{userData.email}</div>
            </div>
            {/* Add other user information here */}
          </div>
        ) : (
          <div className="text-red-600 text-center">User data not found. Please log in first.</div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
