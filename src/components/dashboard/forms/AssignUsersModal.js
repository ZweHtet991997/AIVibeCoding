import React, { useState, useMemo, useEffect } from 'react';
import { userAPI, formsAPI } from '../../../utils/api';

const AssignUsersModal = ({ open, onClose, form, onSaveSuccess }) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load users and assignments when modal opens
  useEffect(() => {
    if (open && form) {
      loadUsersAndAssignments();
    }
  }, [open, form]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSearch('');
      setSelected([]);
      setUsers([]);
      setAssignedUsers([]);
      setError('');
    }
  }, [open]);

  const loadUsersAndAssignments = async () => {
    if (!form?.formId) return;

    try {
      setLoading(true);
      setError('');

      // Fetch active users and form assignments in parallel
      const [usersData, assignmentsData] = await Promise.all([
        userAPI.getUserList(),
        formsAPI.getFormAssignments(form.formId)
      ]);

      // Filter active users
      const activeUsers = usersData.filter(user => user.status === 'Active');
      setUsers(activeUsers);

      // Extract assigned user IDs
      const assignedUserIds = assignmentsData.map(assignment => assignment.userId);
      setAssignedUsers(assignedUserIds);
      setSelected(assignedUserIds);

    } catch (error) {
      console.error('Error loading users and assignments:', error);
      setError(error.message || 'Failed to load users and assignments');
    } finally {
      setLoading(false);
    }
  };

  // Only active users
  const activeUsers = useMemo(() =>
    users.filter(u => u.status === 'Active'),
    [users]
  );

  // Filtered by search
  const filteredUsers = useMemo(() =>
    activeUsers.filter(u =>
      u.userName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
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

  const handleSave = async () => {
    if (!form?.formId) return;

    try {
      setSaving(true);
      setError('');

      // Get newly selected users (excluding those already assigned)
      const newlySelected = selected.filter(userId => !assignedUsers.includes(userId));
      
      // Get users to unassign (previously assigned but now deselected)
      const usersToUnassign = assignedUsers.filter(userId => !selected.includes(userId));

      console.log('Newly selected users:', newlySelected);
      console.log('Users to unassign:', usersToUnassign);

      // Create promises for both assignment and unassignment operations
      const assignmentPromises = newlySelected.map(userId =>
        formsAPI.assignUserToForm(form.formId, userId)
      );
      
      const unassignmentPromises = usersToUnassign.map(userId =>
        formsAPI.removeUserFromForm(form.formId, userId)
      );

      // Execute all operations in parallel
      await Promise.all([...assignmentPromises, ...unassignmentPromises]);

      // Call success callback if provided
      if (onSaveSuccess) {
        onSaveSuccess();
      }

      // Close modal on success
      onClose();

    } catch (error) {
      console.error('Error saving assignments:', error);
      // Provide more specific error messages
      if (error.message.includes('JSON')) {
        setError('Server response error. Please try again or contact support.');
      } else if (error.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(error.message || 'Failed to save assignments');
      }
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="soft-bg backdrop-blur-md border border-white/20 rounded-2xl shadow-xl w-full max-w-lg p-8 relative animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-4 right-4 glass-input rounded-lg p-2 text-gray-600 hover:text-gray-800 hover:neon-soft transition-all duration-300"
          onClick={onClose}
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Manage Form Users
          </h2>
          <p className="text-gray-600">Assign or unassign users to: <span className="font-semibold text-gray-800">{form?.formName || 'Unknown Form'}</span></p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 glass-card border border-red-200/50 text-red-700 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full glass-input px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-32 mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-4 text-primary-600 font-medium">Loading users...</span>
          </div>
        ) : (
          /* User List */
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Users</label>
            <div className="max-h-60 overflow-y-auto bg-white/90 backdrop-blur-md border border-white/20 rounded-xl p-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">
                    {users.length === 0 ? 'No active users available' : 'No users match your search'}
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {filteredUsers.map(user => (
                    <li key={user.userId} className="flex items-center p-3 rounded-lg hover:bg-white/50 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={selected.includes(user.userId)}
                        onChange={() => handleToggle(user.userId)}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        id={`assign-user-${user.userId}`}
                      />
                      <label htmlFor={`assign-user-${user.userId}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-medium">
                              {user.userName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">{user.userName}</span>
                            <span className="block text-gray-500 text-sm">{user.email}</span>
                          </div>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            className="glass-button px-4 py-2 rounded-xl font-medium text-gray-700 hover:text-gray-900 hover:neon-soft transition-all duration-300"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 flex items-center"
            onClick={handleSave}
            disabled={loading || saving || filteredUsers.length === 0}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignUsersModal; 