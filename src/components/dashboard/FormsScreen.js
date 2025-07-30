import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormListTable from './forms/FormListTable';
import AssignUsersModal from './forms/AssignUsersModal';
import ErrorModal from '../common/ErrorModal';

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
  const [publishingForms, setPublishingForms] = useState({});
  const [publishConfirmModal, setPublishConfirmModal] = useState({ open: false, form: null });
  const [errorModal, setErrorModal] = useState({ open: false, error: '', title: 'Error' });
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

  const handlePublishForm = (form) => {
    // Show confirmation modal first
    setPublishConfirmModal({ open: true, form });
  };

  const handleConfirmPublish = async () => {
    const form = publishConfirmModal.form;
    if (!form) return;

    try {
      // Close confirmation modal
      setPublishConfirmModal({ open: false, form: null });
      
      // Set loading state for this specific form
      setPublishingForms(prev => ({ ...prev, [form.formId]: true }));
      
      // Call the API to activate the form
      await formsAPI.activateForm(form.formId);
      
      // Update the form status in the local state immediately for real-time UI update
      setForms(prevForms => 
        prevForms.map(f => 
          f.formId === form.formId 
            ? { ...f, status: 'Active' }
            : f
        )
      );
      
      // Show success message
      setErrorModal({
        open: true,
        error: `Form "${form.formName}" published successfully!`,
        title: 'Success'
      });
      
    } catch (error) {
      console.error('Error publishing form:', error);
      setErrorModal({
        open: true,
        error: error.message,
        title: 'Publish Error'
      });
    } finally {
      // Clear loading state for this form
      setPublishingForms(prev => ({ ...prev, [form.formId]: false }));
    }
  };


  return (
    <div>

      {/* Filter/Search Section */}
      <div className="flex flex-col mb-6 md:flex-row md:items-center bg-white/60 p-4 rounded-lg shadow justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <input
            type="text"
            placeholder="Search by form name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-64 px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
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
      <div className="bg-white/60 rounded-lg shadow p-4">
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
            onPublishForm={handlePublishForm}
            publishingForms={publishingForms}
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

      {/* Error/Success Modal */}
      <ErrorModal
        open={errorModal.open}
        onClose={() => {
          setErrorModal({ open: false, error: '', title: 'Error' });
          // Navigate to form builder on success
          if (errorModal.title === 'Success') {
            // Stay on current page, just close the modal
          }
        }}
        error={errorModal.error}
        title={errorModal.title}
        showRetry={errorModal.title === 'Publish Error'}
        onRetry={errorModal.title === 'Publish Error' ? handleConfirmPublish : undefined}
      />

      {/* Publish Confirmation Modal */}
      {publishConfirmModal.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="soft-bg backdrop-blur-md border border-white/20 rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-scale-in">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Publish Form
              </h2>
              <p className="text-gray-600">
                Are you sure you want to publish "{publishConfirmModal.form?.formName}"? 
                This will make the form available for users to fill out.
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setPublishConfirmModal({ open: false, form: null })}
                className="glass-card rounded-xl px-4 py-2 font-medium text-gray-800 hover:neon-soft transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Publish Form
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FormsScreen; 