import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DeleteUserById from './DeleteUserById';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteStatus, setDeleteStatus] = useState({ message: '', isError: false });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Get user info from localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if you're using token-based auth
          // Authorization: `Bearer ${userInfo.token}`,
        },
        withCredentials: true // For cookie-based auth
      };

      const response = await axios.get('http://localhost:5000/api/users', config);
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        };

        await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
        
        // Update the users list after deletion
        setUsers(users.filter(user => user._id !== userId));
        setDeleteStatus({ message: 'User deleted successfully', isError: false });
        
        // Clear status message after 3 seconds
        setTimeout(() => {
          setDeleteStatus({ message: '', isError: false });
        }, 3000);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete user';
        setDeleteStatus({ message: errorMessage, isError: true });
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          setDeleteStatus({ message: '', isError: false });
        }, 5000);
      }
    }
  };

  // Handler for successful deletion from DeleteUserById component
  const handleDeleteSuccess = (deletedUserId) => {
    setUsers(users.filter(user => user._id !== deletedUserId));
    fetchUsers(); // Refresh the list to ensure it's up to date
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Users</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">List of all registered users</p>
        </div>
        
        {deleteStatus.message && (
          <div className={`px-4 py-3 mb-4 ${deleteStatus.isError ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
            {deleteStatus.message}
          </div>
        )}
        
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          to={`/user/${user._id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          View
                        </Link>
                        {!user.isAdmin && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add the DeleteUserById component */}
      <DeleteUserById 
        onSuccess={handleDeleteSuccess}
        onError={(errorMsg) => setDeleteStatus({ message: errorMsg, isError: true })}
      />
    </div>
  );
};

export default UsersList;