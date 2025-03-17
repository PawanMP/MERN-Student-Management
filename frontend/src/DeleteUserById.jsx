import React, { useState } from 'react';
import axios from 'axios';

const DeleteUserById = ({ onSuccess, onError }) => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', isError: false });

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      setStatus({ message: 'Please enter a user ID', isError: true });
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        };

        await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
        
        setStatus({ message: 'User deleted successfully', isError: false });
        setUserId('');
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(userId);
        }
        
        // Clear status message after 3 seconds
        setTimeout(() => {
          setStatus({ message: '', isError: false });
        }, 3000);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete user';
        setStatus({ message: errorMessage, isError: true });
        
        // Call error callback if provided
        if (onError) {
          onError(errorMessage);
        }
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          setStatus({ message: '', isError: false });
        }, 5000);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-md">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Delete User by ID</h3>
      
      {status.message && (
        <div className={`px-4 py-3 mb-4 rounded ${status.isError ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {status.message}
        </div>
      )}
      
      <form onSubmit={handleDeleteUser} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 text-white font-medium rounded-md ${loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-red-500`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deleting...
            </span>
          ) : (
            'Delete User'
          )}
        </button>
      </form>
    </div>
  );
};

export default DeleteUserById;