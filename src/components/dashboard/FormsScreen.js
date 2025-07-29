import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormListTable from './forms/FormListTable';
import AssignUsersModal from './forms/AssignUsersModal';

import { isAdmin } from '../../utils/auth';
import { formsAPI } from '../../utils/api';



const FormsScreen = () => {
  const [forms, setForms] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAssignUsersOpen, setIsAssignUsersOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch forms with assigned user counts
  const fetchForms = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Verify admin access
      if (!isAdmin()) {
        setError('Admin privileges required to view forms data.');
        setLoading(false);
        return;
      }

      // Fetch forms from API
      const formsData = await formsAPI.getFormsList();
      
      // Enhance forms data with assigned user counts
      const formsWithUserCounts = await Promise.all(
        formsData.map(async (form) => {
          try {
            const assignments = await formsAPI.getFormAssignments(form.formId);
            return {
              ...form,
              totalAssignedUsers: assignments.length
            };
          } catch (error) {
            console.error(`Error fetching assignments for form ${form.formId}:`, error);
            return {
              ...form,
              totalAssignedUsers: 0
            };
          }
        })
      );
      
      setForms(formsWithUserCounts);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setError(error.message || 'Failed to load forms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize forms screen
  useEffect(() => {
    fetchForms();
  }, []);

  // Filter forms based on search and status
  const filteredForms = forms.filter(form => {
    const matchesSearch = form.formName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handlers
  const handleCreateNewForm = () => {
    navigate('/form-builder');
  };

  const handleOpenAssignUsers = (form) => {
    setSelectedForm(form);
    setIsAssignUsersOpen(true);
  };
  const handleCloseAssignUsers = () => {
    setSelectedForm(null);
    setIsAssignUsersOpen(false);
  };


  return (
    <div>

      {/* Filter/Search Section */}
      <div className="flex flex-col mb-6 md:flex-row md:items-center glass-card p-4 rounded-lg shadow justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <input
            type="text"
            placeholder="Search by form name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="flex-shrink-0">
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium shadow w-full md:w-auto"
            onClick={handleCreateNewForm}
          >
            + Create New Form
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card rounded-lg shadow p-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-4 text-primary-600 font-medium">Loading forms...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">{error}</div>
          </div>
        ) : (
          <FormListTable
            forms={filteredForms}
            onAssignUsers={handleOpenAssignUsers}
          />
        )}
      </div>

      {/* Modals */}
      <AssignUsersModal
        open={isAssignUsersOpen}
        onClose={handleCloseAssignUsers}
        form={selectedForm}
        onSaveSuccess={fetchForms}
      />

    </div>
  );
};

export default FormsScreen; 