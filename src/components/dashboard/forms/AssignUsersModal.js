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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        
        <h2 className="text-xl font-bold mb-4">
          Manage Form Users: {form?.formName || 'Unknown Form'}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search users to assign/unassign..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-4 text-primary-600 font-medium">Loading users...</span>
          </div>
        ) : (
          /* User List */
          <div className="max-h-60 overflow-y-auto mb-4">
            {filteredUsers.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                {users.length === 0 ? 'No active users available' : 'No users match your search'}
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filteredUsers.map(user => (
                  <li key={user.userId} className="flex items-center py-2 px-1">
                    <input
                      type="checkbox"
                      checked={selected.includes(user.userId)}
                      onChange={() => handleToggle(user.userId)}
                      className="mr-3 accent-primary-600"
                      id={`assign-user-${user.userId}`}
                    />
                    <label htmlFor={`assign-user-${user.userId}`} className="flex-1 cursor-pointer">
                      <span className="font-medium text-dashboard-bodyText">{user.userName}</span>
                      <span className="ml-2 text-gray-500 text-sm">{user.email}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-medium"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-60 flex items-center"
            onClick={handleSave}
            disabled={loading || saving || filteredUsers.length === 0}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignUsersModal; 