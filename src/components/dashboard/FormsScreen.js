import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormListTable from './forms/FormListTable';
import AssignUsersModal from './forms/AssignUsersModal';
import DeleteConfirmDialog from './forms/DeleteConfirmDialog';

// Placeholder/mock data for forms
const mockForms = [
  {
    id: 1,
    name: 'Employee Onboarding',
    status: 'Active',
    totalSubmissions: 45,
    createdDate: '2024-01-10',
  },
  {
    id: 2,
    name: 'Leave Request',
    status: 'Inactive',
    totalSubmissions: 32,
    createdDate: '2024-01-12',
  },
  {
    id: 3,
    name: 'Expense Report',
    status: 'Active',
    totalSubmissions: 28,
    createdDate: '2024-01-15',
  },
];

const FormsScreen = () => {
  const [forms, setForms] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAssignUsersOpen, setIsAssignUsersOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [deleteFormId, setDeleteFormId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Simulate data fetching
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setForms(mockForms);
      setLoading(false);
    }, 800);
  }, []);

  // Filtered forms
  const filteredForms = forms.filter(form => {
    const matchesName = form.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? form.status === statusFilter : true;
    return matchesName && matchesStatus;
  });

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
  const handleConfirmDelete = () => {
    setForms(prev => prev.filter(f => f.id !== deleteFormId));
    setDeleteFormId(null);
    // Prepare for backend API integration here
  };

  return (
    <div className="space-y-6">
      {/* Header and Create Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dashboard-bodyText">Forms Management</h2>
          <p className="text-gray-600 mt-1">Create, assign, and manage forms for your organization.</p>
        </div>
        <button
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium shadow"
          onClick={handleCreateNewForm}
        >
          + Create New Form
        </button>
      </div>

      {/* Filter/Search Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-dashboard-cardBg p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search by form name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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