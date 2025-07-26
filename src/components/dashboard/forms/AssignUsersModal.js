import React, { useState, useMemo, useEffect } from 'react';

const AssignUsersModal = ({ open, onClose, form, assignedUserIds = [], onSave }) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(assignedUserIds);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);



  // Load empty users
  useEffect(() => {
    if (open) {
      setUsers([]);
    }
  }, [open]);

  // Only active users
  const activeUsers = useMemo(() =>
    users.filter(u => u.status === 'Active'),
    [users]
  );

  // Filtered by search
  const filteredUsers = useMemo(() =>
    activeUsers.filter(u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    ),
    [activeUsers, search]
  );

  const handleToggle = (userId) => {
    setSelected(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSave = () => {
    if (onSave) onSave(selected);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Assign Users to Form</h2>
        <input
          type="text"
          placeholder="Search active users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <div className="max-h-60 overflow-y-auto mb-4">
          {filteredUsers.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No active users available</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <li key={user.id} className="flex items-center py-2 px-1">
                  <input
                    type="checkbox"
                    checked={selected.includes(user.id)}
                    onChange={() => handleToggle(user.id)}
                    className="mr-3 accent-primary-600"
                    id={`assign-user-${user.id}`}
                  />
                  <label htmlFor={`assign-user-${user.id}`} className="flex-1 cursor-pointer">
                    <span className="font-medium text-dashboard-bodyText">{user.username}</span>
                    <span className="ml-2 text-gray-500 text-sm">{user.email}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-60"
            onClick={handleSave}
            disabled={filteredUsers.length === 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignUsersModal; 