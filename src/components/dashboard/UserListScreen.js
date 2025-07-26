import React, { useState, useEffect } from 'react';

const statusColors = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-100 text-gray-600',
};



export default function UserListScreen() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load empty users
  useEffect(() => {
    setUsers([]);
  }, []);

  const filteredUsers = users; // Users are already filtered by the API

  return (
    <div className="space-y-6">
      {/* Filter/Search Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-dashboard-cardBg p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-dashboard-cardBg rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-dashboard-headerText uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dashboard-headerText uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dashboard-headerText uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dashboard-headerText uppercase tracking-wider">Total Assigned Forms</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dashboard-headerText uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">No users found.</td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-dashboard-bodyText">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-dashboard-bodyText">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-dashboard-bodyText">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-dashboard-bodyText">{user.forms}</td>
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