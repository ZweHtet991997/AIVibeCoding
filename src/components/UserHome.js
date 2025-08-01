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
    <div className="soft-bg min-h-screen">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-24 h-24 bg-blue-200/30 rounded-full blur-xl animate-gentle-float"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-purple-200/30 rounded-full blur-xl animate-gentle-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-cyan-200/30 rounded-full blur-xl animate-gentle-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="px-6 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-primary-600 bg-clip-text text-transparent">
                User Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, <span className="font-semibold text-gray-800">{getUserName()}</span>! 
                Here are your assigned forms to complete.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="glass-card hover:neon-soft text-gray-800 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="px-6 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by form name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/70 w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                />
              </div>
                             <select
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value)}
                 className="bg-white/70 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 min-w-[200px]"
               >
                 <option value="">All Statuses</option>
                 <option value="pending">Pending</option>
                 <option value="completed">Completed</option>
               </select>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="hidden sm:inline">Showing</span>
              <span className="font-semibold text-primary-600">{filteredForms.length}</span>
              <span className="hidden sm:inline">of {assignedForms.length} forms</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="relative">
                <div className="w-12 h-12 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-400 rounded-full animate-pulse-slow"></div>
                  <div className="absolute inset-2 bg-white rounded-full animate-spin"></div>
                </div>
                <p className="text-primary-600 font-medium text-center">Loading your forms...</p>
              </div>
            </div>
          ) : error ? (
            <div className="glass-card bg-red-50/50 border border-red-200 rounded-xl p-6 text-center">
              <div className="text-red-600 text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Forms</h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchAssignedForms}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : assignedForms.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-8xl mb-6 animate-gentle-float">📋</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Forms Assigned</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You don't have any forms assigned to you at the moment. 
                Check back later or contact your administrator.
              </p>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Forms Found</h3>
              <p className="text-gray-500">
                No forms match your current filters. Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-6">              
              <div className="grid gap-6">
                                 {filteredForms.map((form) => {
                  
                  return (
                    <div 
                      key={form.id} 
                      className="glass-card hover:shadow-card-hover transition-all duration-300 rounded-xl p-6 border border-white/20"
                    >
                                             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                         <div className="flex-1">
                           <div className="mb-3">
                             <h3 className="text-xl font-semibold text-gray-900 mb-2">{form.name}</h3>
                           </div>
                          
                          {form.description && (
                            <p className="text-gray-600 mb-4 leading-relaxed">{form.description}</p>
                          )}
                          
                                                     <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                             <div className="flex items-center gap-1">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                               </svg>
                               <span>{form.fields?.length || 0} fields</span>
                             </div>
                             <div className="flex items-center gap-1">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                               </svg>
                               <span>Assigned: {new Date(form.assignedAt).toLocaleDateString()}</span>
                             </div>
                           </div>
                        </div>
                        
                        <div className="flex-shrink-0">
                          {form.status === 'completed' ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-medium">Completed</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleFillForm(form.id)}
                              className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Fill Form
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHome; 