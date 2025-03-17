import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DeleteUserById from './DeleteUserById';
import AddUser from './AddUser';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteStatus, setDeleteStatus] = useState({ message: '', isError: false });
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // For cookie-based authentication
      };

      const response = await axios.get('http://localhost:5000/api/users', config);
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        await axios.delete(`http://localhost:5000/api/users/${userId}`, config);

        // Refresh the users list
        fetchUsers();

        setDeleteStatus({ message: 'User deleted successfully', isError: false });
      } catch (err) {
        setDeleteStatus({ message: err.response?.data?.message || 'Failed to delete user', isError: true });
      } finally {
        setTimeout(() => setDeleteStatus({ message: '', isError: false }), 3000);
      }
    }
  };

  const handleUserCreated = () => {
    fetchUsers(); // Refresh users list after adding a new user
    setShowAddUserForm(false); // Hide the form after success
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-r-transparent"></div>
          <p className="mt-2">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Users</h3>
            <p className="mt-1 text-sm text-gray-500">List of all registered users</p>
          </div>
          <button
            onClick={() => setShowAddUserForm(!showAddUserForm)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            {showAddUserForm ? 'Hide Form' : 'Add User'}
          </button>
        </div>

        {showAddUserForm && <AddUser onSuccess={handleUserCreated} />}

        {deleteStatus.message && (
          <div className={`p-4 mt-2 ${deleteStatus.isError ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
            {deleteStatus.message}
          </div>
        )}

        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Link to={`/user/${user._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        View
                      </Link>
                      {!user.isAdmin && (
                        <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
