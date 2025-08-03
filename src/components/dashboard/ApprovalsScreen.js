import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { approvalsAPI } from '../../utils/api';
import ErrorModal from '../common/ErrorModal';

// Heroicons (outline)
const EyeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 -ml-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);





const statusOptions = ['Pending', 'Approved', 'Rejected'];

const ApprovalsScreen = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [filters, setFilters] = useState({ formName: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ show: false, type: '', message: '', title: '' });
  const tableRef = useRef(null);

  // Load form responses from API
  const loadFormResponses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await approvalsAPI.getFormResponses();
      
      console.log('Raw API Response:', response);
      
      // Transform API response to match table structure
      const transformedData = response
        .filter(item => item && item.responseId) // Filter out invalid items
        .map((item, index) => ({
          id: item.responseId,
          formName: item.formName,
          submittedBy: item.userName,
          submissionDate: item.responseDate,
          status: item.status,
          comment: item.comment,
          data: {
            [item.fieldKey]: item.responseValue
          },
          // Store original API data for reference
          originalData: item,
          // Add unique identifier in case of duplicate responseIds
          uniqueKey: `${item.responseId}-${index}`
        }));
      
      console.log('Transformed Data:', transformedData);
      setSubmissions(transformedData);
    } catch (error) {
      console.error('Error loading form responses:', error);
      setError(error.message || 'Failed to load form responses');
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    loadFormResponses();
  }, []);



  // Filter submissions based on form name and status
  const filteredSubmissions = submissions.filter(submission => {
    const matchesFormName = !filters.formName || 
      submission.formName.toLowerCase().includes(filters.formName.toLowerCase());
    const matchesStatus = !filters.status || submission.status === filters.status;
    return matchesFormName && matchesStatus;
  });

  // Navigate to submission view
  const handleView = (submission) => {
    navigate(`/submission/${submission.id}`);
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row mb-6 gap-4 items-center bg-white/60 p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Filter by form name..."
          value={filters.formName}
          onChange={e => setFilters(f => ({ ...f, formName: e.target.value }))}
          className="w-full md:w-1/3 px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <select
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          className="w-full md:w-1/4 px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>



      {/* Table */}
      <div ref={tableRef} className="bg-white/60 rounded-lg shadow p-4 overflow-x-auto max-h-[60vh]">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-4 text-primary-600 font-medium">
              Loading approvals...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">{error}</div>
            <button
              onClick={loadFormResponses}
              className="text-sm text-red-600 hover:text-red-500 font-medium"
            >
              Retry
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Submission ID</th>
                <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Form Name</th>
                <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Submitted By</th>
                <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Submission Date</th>
                <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Status</th>
                <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-8">
                    {submissions.length === 0 ? 'No submissions found.' : 'No submissions match the current filters.'}
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.uniqueKey || sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-dashboard-bodyText font-medium">{sub.id}</td>
                    <td className="py-4 px-4 text-dashboard-bodyText">{sub.formName}</td>
                    <td className="py-4 px-4 text-dashboard-bodyText">{sub.submittedBy}</td>
                    <td className="py-4 px-4 text-dashboard-bodyText">{new Date(sub.submissionDate).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sub.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : sub.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        className="flex items-center gap-1 bg-blue-100 hover:bg-blue-300 text-blue-800 px-4 py-1.5 rounded text-xs font-medium shadow transition-colors duration-150"
                        onClick={() => handleView(sub)}
                      >
                        {EyeIcon}
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Notification Modal */}
      <ErrorModal
        open={notification.show}
        onClose={() => setNotification({ show: false, type: '', message: '', title: '' })}
        error={notification.message}
        title={notification.title}
      />
    </div>
  );
};

export default ApprovalsScreen; 