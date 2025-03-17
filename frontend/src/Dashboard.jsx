import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UsersList from './UsersList'; // Import the new component

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // Track active tab
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('userInfo');
    
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userInfo));
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userInfo');
    
    // You may also want to call your logout API endpoint if you're using cookies
    // axios.post('http://localhost:5000/api/users/logout');
    
    // Redirect to login page
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap">
              User Dashboard
            </span>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Users List
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'profile' ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h2>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-medium mb-2">Your Profile</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">User ID:</span> {user._id}</p>
                  <p>
                    <span className="font-medium">Role:</span> 
                    {user.isAdmin ? ' Administrator' : ' Regular User'}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-medium mb-4">Dashboard Content</h3>
                <p className="text-gray-600">
                  This is your personalized dashboard. Content will be displayed here based on your user role and preferences.
                </p>
              </div>
            </>
          ) : (
            <UsersList />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;