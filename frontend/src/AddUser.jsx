import React, { useState } from 'react';
import axios from 'axios';

const AddUser = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', isError: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.username || !formData.email || !formData.password) {
      setStatus({ message: 'Please fill all the fields', isError: true });
      return;
    }

    try {
      setLoading(true);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      };

      const response = await axios.post(
        'http://localhost:5000/api/users/addUser',
        formData,
        config
      );

      setStatus({ message: 'User created successfully', isError: false });
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus({ message: '', isError: false });
      }, 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create user';
      setStatus({ message: errorMessage, isError: true });
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setStatus({ message: '', isError: false });
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Add New User</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Create a new user account</p>
      </div>
      
      {status.message && (
        <div className={`mx-6 px-4 py-3 rounded-md ${status.isError ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {status.message}
        </div>
      )}
      
      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="john_doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Add User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;