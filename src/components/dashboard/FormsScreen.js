import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormListTable from './forms/FormListTable';
import AssignUsersModal from './forms/AssignUsersModal';
import DeleteConfirmDialog from './forms/DeleteConfirmDialog';



const FormsScreen = () => {
  const [forms, setForms] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAssignUsersOpen, setIsAssignUsersOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [deleteFormId, setDeleteFormId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load empty forms
  useEffect(() => {
    setForms([]);
  }, []);

  // Forms are already filtered by the API, so we use them directly
  const filteredForms = forms;

  // Handlers
  const handleCreateNewForm = () => {
    navigate('/form-builder');
  };
  const handleEditForm = (form) => {
    navigate(`/form-builder/${form.id}`);
  };
  const handleOpenAssignUsers = (form) => {
    setSelectedForm(form);
    setIsAssignUsersOpen(true);
  };
  const handleCloseAssignUsers = () => {
    setSelectedForm(null);
    setIsAssignUsersOpen(false);
  };
  const handleRequestDeleteForm = (formId) => {
    setDeleteFormId(formId);
  };
  const handleCancelDelete = () => {
    setDeleteFormId(null);
  };
  const handleConfirmDelete = async () => {
    try {
      // Simulate API call delay
      setTimeout(() => {
        setForms(prev => prev.filter(f => f.id !== deleteFormId));
        setDeleteFormId(null);
      }, 1000);
    } catch (error) {
      console.error('Delete form error:', error);
    }
  };

  return (
    <div className="space-y-6">

      {/* Filter/Search Section */}
      <div className="flex flex-col md:flex-row md:items-center bg-dashboard-cardBg p-4 rounded-lg shadow justify-between gap-4">
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
      <div className="bg-dashboard-cardBg rounded-lg shadow p-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-4 text-primary-600 font-medium">Loading forms...</span>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-8">{error}</div>
        ) : filteredForms.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No forms found.</div>
        ) : (
          <FormListTable
            forms={filteredForms}
            onEdit={handleEditForm}
            onAssignUsers={handleOpenAssignUsers}
            onDelete={handleRequestDeleteForm}
          />
        )}
      </div>

      {/* Modals */}
      <AssignUsersModal
        open={isAssignUsersOpen}
        onClose={handleCloseAssignUsers}
        form={selectedForm}
      />
      <DeleteConfirmDialog
        open={!!deleteFormId}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default FormsScreen; 