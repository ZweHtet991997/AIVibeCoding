import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUserName } from '../utils/auth';

const UserHome = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">User Home</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            Welcome, {getUserName()}! This is where you can view assigned forms and track submissions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserHome; 