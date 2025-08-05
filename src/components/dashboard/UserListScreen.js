import React, { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api';
import { exportUserListToExcel } from '../../utils/excelExport';

const statusColors = {
  Active: 'bg-green-100 text-green-800',
  InActive: 'bg-red-100 text-red-800',
};

export default function UserListScreen() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const userData = await userAPI.getUserList();
      setUsers(userData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = search === '' || 
      user.userName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === '' || user.status === status;
    return matchesSearch && matchesStatus;
  });

  // Export filtered users to Excel
  const exportToExcel = () => {
    try {
      exportUserListToExcel(filteredUsers, 'users_export');
    } catch (error) {
      alert('Failed to export data. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Filter/Search Section - Show even during loading */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white/60 p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Search by username or email..."
            disabled
            className="w-full md:w-1/3 px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-100"
          />
          <select
            disabled
            className="w-full md:w-1/4 px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-100"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </select>
          <button
            disabled
            className="w-full md:w-auto px-6 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to Excel
          </button>
        </div>

        {/* Table Section with Loading */}
        <div className="bg-white/60 rounded-lg shadow p-4">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-4 text-primary-600 font-medium">Loading users...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Filter/Search Section - Show even during error */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white/60 p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Search by username or email..."
            disabled
            className="w-full md:w-1/3 px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-100"
          />
          <select
            disabled
            className="w-full md:w-1/4 px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-100"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </select>
          <button
            disabled
            className="w-full md:w-auto px-6 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to Excel
          </button>
        </div>

        {/* Table Section with Error */}
        <div className="bg-white/60 rounded-lg shadow p-4">
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">{error}</div>
            <button 
              onClick={fetchUsers} 
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter/Search Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white/60 p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="InActive">InActive</option>
        </select>
        <button
          onClick={exportToExcel}
          disabled={filteredUsers.length === 0}
          className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to Excel
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white/60 rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-dashboard-headerText uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dashboard-headerText uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dashboard-headerText uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dashboard-headerText uppercase tracking-wider">Total Assigned Forms</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dashboard-headerText uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                  {users.length === 0 ? 'No users found.' : 'No users match your search criteria.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.userId} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-dashboard-bodyText">{user.userName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-dashboard-bodyText">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-dashboard-bodyText">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-dashboard-bodyText">{user.totalAssignedForms}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[user.status] || 'bg-red-100 text-red-800'}`}>{user.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 