import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUserName, getUserId } from '../utils/auth';
import { userFormsAPI } from '../utils/api';

const UserHome = () => {
  const navigate = useNavigate();
  const [assignedForms, setAssignedForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchAssignedForms();
  }, []);

  const fetchAssignedForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();
      const forms = await userFormsAPI.getAssignedForms(userId);
      setAssignedForms(forms);
    } catch (err) {
      setError(err.message || 'Failed to fetch assigned forms');
    } finally {
      setLoading(false);
    }
  };

  // Filter forms based on search term and status filter
  const filteredForms = assignedForms.filter((form) => {
    // Defensive programming: ensure form has required properties
    if (!form || typeof form !== 'object') return false;
    
    const formName = form.formName || '';
    const submissionStatus = form.submissionStatus || '';
    
    const matchesSearch = formName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || submissionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFillForm = (formId) => {
    // Find the form to get the assignedBy information
    const form = assignedForms.find(f => f.formId === formId);
    const assignedBy = form?.assignedBy;
    
    navigate(`/fill-form/${formId}`, { 
      state: { assignedBy: assignedBy }
    });
  };

  // Check if form is fillable (only Pending status)
  const isFormFillable = (status) => {
    return status === 'Pending';
  };

  // Format date to a readable format
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      'Complete': 'bg-green-100 text-green-800 border-green-200',
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600">Loading your assigned forms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Error Loading Forms</h3>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchAssignedForms}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Compact Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-20 h-20 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-2xl animate-gentle-float"></div>
        <div className="absolute top-32 right-24 w-16 h-16 bg-gradient-to-br from-cyan-400/15 to-blue-400/15 rounded-full blur-xl animate-gentle-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-24 left-1/3 w-24 h-24 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl animate-gentle-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Header Section */}
        <div className="mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  My Forms
                </h1>
                <p className="text-slate-600 text-md">
                  Welcome back, <span className="font-semibold text-slate-800">{getUserName()}</span>
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="group px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl font-medium text-slate-700 hover:bg-white hover:shadow-md transition-all duration-300 flex items-center gap-2 self-start text-sm"
            >
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* Filter/Search Section */}
        {assignedForms.length > 0 && (
          <div className="flex flex-col mb-6 md:flex-row md:items-center bg-white/60 p-4 rounded-lg shadow justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <input
                type="text"
                placeholder="Search by form name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full md:w-64 px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full md:w-1/4 px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
            <div className="flex-shrink-0">
              <div className="text-sm text-gray-600">
                Showing {filteredForms.length} of {assignedForms.length} forms
              </div>
            </div>
          </div>
        )}

        {/* Compact Content Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {assignedForms.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center animate-gentle-float">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Forms Available</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Forms will appear here when they are assigned to you.
              </p>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Forms Found</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                No forms match your current search and filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredForms
                .filter(form => form && form.formId) // Filter out invalid forms before mapping
                .map((form, index) => {
                  const formName = form.formName || 'Unnamed Form';
                  const description = form.description || 'No description available';
                  const submissionStatus = form.submissionStatus || 'Unknown';
                  const assignedDate = form.assignedDate || new Date().toISOString();
                  
                  const fillable = isFormFillable(submissionStatus);
                  return (
                    <div
                      key={`${form.formId}-${index}`} // Use combination of formId and index for unique keys
                      className={`group backdrop-blur-sm border border-white/50 rounded-2xl p-6 transition-all duration-300 ${
                        fillable 
                          ? 'bg-white/70 hover:bg-white/90 hover:shadow-lg cursor-pointer' 
                          : 'bg-white/50 cursor-not-allowed opacity-75 cursor-default'
                      }`}
                      onClick={() => fillable && handleFillForm(form.formId)}
                    >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-2 transition-colors ${
                          fillable 
                            ? 'text-slate-800 group-hover:text-blue-600' 
                            : 'text-slate-600'
                        }`}>
                          {formName}
                        </h3>
                        <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                          {description}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(submissionStatus)}`}>
                        {submissionStatus}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Assigned: {formatDate(assignedDate)}</span>
                      {fillable ? (
                        <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700">
                          <span className="font-medium">Fill Form</span>
                          <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHome; 