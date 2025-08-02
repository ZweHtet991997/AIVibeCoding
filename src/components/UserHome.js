import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUserName } from '../utils/auth';
import { userFormsAPI } from '../utils/api';

const UserHome = () => {
  const navigate = useNavigate();
  const [assignedForms, setAssignedForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  useEffect(() => {
    fetchAssignedForms();
  }, []);

  const fetchAssignedForms = async () => {
    try {
      setLoading(true);
      const forms = await userFormsAPI.getAssignedForms();
      setAssignedForms(forms);
    } catch (err) {
      setError('Failed to load assigned forms');
      console.error('Error fetching assigned forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFillForm = (formId) => {
    navigate(`/fill-form/${formId}`);
  };

  // Filter forms based on search term and status
  const filteredForms = assignedForms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

        {/* Compact Filter Section */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="backdrop-blur-sm border border-white/50 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                {/* Compact Search Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search forms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-card w-full pl-10 pr-4 py-2.5 bg-white/70 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 placeholder-slate-400 text-sm"
                  />
                </div>
                
                {/* Compact Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="glass-card appearance-none w-full sm:w-40 px-3 py-2.5 bg-white/70 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-slate-700 text-sm"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Compact Results Counter */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-slate-700">
                  <span className="text-blue-600 font-bold">{filteredForms.length}</span> of {assignedForms.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Content Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse-slow"></div>
                    <div className="absolute inset-1.5 bg-white rounded-full animate-spin"></div>
                  </div>
                </div>
                <p className="text-slate-600 font-medium text-sm">Loading your forms...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/50 rounded-2xl p-6 text-center shadow-soft">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Forms</h3>
              <p className="text-red-600 mb-4 text-sm">{error}</p>
              <button
                onClick={fetchAssignedForms}
                className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          ) : assignedForms.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center animate-gentle-float">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Forms Assigned</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                You don't have any forms assigned to you at the moment.
              </p>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Forms Found</h3>
              <p className="text-slate-500 text-sm">
                No forms match your current filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4">
                {filteredForms.map((form, index) => (
                  <div 
                    key={form.id} 
                    className="group bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-5 shadow-soft hover:shadow-card-hover transition-all duration-300 animate-scale-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Compact Form Icon */}
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        
                        {/* Compact Form Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors duration-300 truncate">
                            {form.name}
                          </h3>
                          {form.description && (
                            <p className="text-slate-600 text-sm mb-2 line-clamp-2">{form.description}</p>
                          )}
                          
                          {/* Compact Form Details */}
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>{form.fields?.length || 0} fields</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{new Date(form.assignedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Compact Action Button */}
                      <div className="flex-shrink-0">
                        {form.status === 'completed' ? (
                          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-xl">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-medium text-green-700 text-sm">Done</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleFillForm(form.id)}
                            className="group/btn relative px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></div>
                            <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span className="relative z-10">Fill</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  };
  
  export default UserHome; 