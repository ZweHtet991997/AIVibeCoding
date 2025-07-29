import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUserName } from '../utils/auth';
import { userFormsAPI } from '../utils/api';

const UserHome = () => {
  const navigate = useNavigate();
  const [assignedForms, setAssignedForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            Welcome, {getUserName()}! Here are your assigned forms to complete.
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-blue-600 font-medium">Loading assigned forms...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : assignedForms.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Forms Assigned</h3>
              <p className="text-gray-500">You don't have any forms assigned to you at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Assigned Forms</h2>
              {assignedForms.map((form) => (
                <div key={form.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{form.name}</h3>
                      {form.description && (
                        <p className="text-gray-600 mt-1">{form.description}</p>
                      )}
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                        <span>📝 {form.fields?.length || 0} fields</span>
                        <span>📅 Assigned: {new Date(form.assignedAt).toLocaleDateString()}</span>
                        {form.dueDate && (
                          <span>⏰ Due: {new Date(form.dueDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {form.status === 'completed' ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          ✓ Completed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleFillForm(form.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                        >
                          Fill Form
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHome; 