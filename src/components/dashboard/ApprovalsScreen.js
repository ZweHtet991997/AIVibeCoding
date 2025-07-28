import React, { useState, useEffect, useRef } from 'react';
import { approvalsAPI } from '../../utils/api';

// Heroicons (outline)
const EyeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 -ml-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const CheckIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 -ml-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);
const XIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 -ml-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);





const statusOptions = ['Pending', 'Approved', 'Rejected'];

const ApprovalsScreen = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filters, setFilters] = useState({ formName: '', status: '' });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionComment, setActionComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const tableRef = useRef(null);

  // Load form responses from API
  const loadFormResponses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await approvalsAPI.getFormResponses();
      
      // Transform API response to match table structure
      const transformedData = response.map(item => ({
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
        originalData: item
      }));
      
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

  // Maintain scroll position after modal close
  useEffect(() => {
    if (!modalOpen && tableRef.current) {
      tableRef.current.scrollTop = scrollPosition;
    }
  }, [modalOpen, scrollPosition]);

  // Filter submissions based on form name and status
  const filteredSubmissions = submissions.filter(submission => {
    const matchesFormName = !filters.formName || 
      submission.formName.toLowerCase().includes(filters.formName.toLowerCase());
    const matchesStatus = !filters.status || submission.status === filters.status;
    return matchesFormName && matchesStatus;
  });

  // Open detail modal
  const handleView = (submission) => {
    setScrollPosition(tableRef.current ? tableRef.current.scrollTop : 0);
    setSelectedSubmission(submission);
    setActionComment('');
    setModalOpen(true);
  };

  // Approve/Reject action
  const handleAction = async (status) => {
    setActionLoading(true);
    try {
      // Simulate API call delay
      setTimeout(() => {
        // Update the submission in the list
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === selectedSubmission.id
              ? { ...sub, status, comment: actionComment }
              : sub
          )
        );
        setModalOpen(false);
        setActionLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Action error:', error);
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-dashboard-cardBg p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Filter by form name..."
          value={filters.formName}
          onChange={e => setFilters(f => ({ ...f, formName: e.target.value }))}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <select
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>



      {/* Table */}
      <div ref={tableRef} className="bg-dashboard-cardBg rounded-lg shadow p-4 overflow-x-auto max-h-[60vh]">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-4 text-primary-600 font-medium">Loading approvals...</span>
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
                  <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
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

      {/* Detail Modal */}
      {modalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl w-full max-w-2xl h-[600px] p-8 relative animate-scale-in flex flex-col" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 glass-button rounded-lg p-2 text-gray-600 hover:text-gray-800 hover:neon-soft transition-all duration-300"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Submission Details</h2>
              <p className="text-gray-600">Review and manage submission information</p>
            </div>
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Form Name</div>
                  <div className="font-semibold text-gray-800">{selectedSubmission.formName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Submitted By</div>
                  <div className="font-semibold text-gray-800">{selectedSubmission.submittedBy}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Submission Date</div>
                  <div className="font-semibold text-gray-800">{new Date(selectedSubmission.submissionDate).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
            <div className="mb-6 flex-1 overflow-hidden">
              <div className="text-lg font-semibold text-gray-800 mb-3">Form Data</div>
              <div className="bg-white/90 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-lg h-full overflow-y-auto">
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-600">Field:</span>
                  <div className="font-semibold text-gray-800 mt-1">{selectedSubmission.originalData?.fieldKey || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Response:</span>
                  <div className="font-semibold text-gray-800 mt-1">{selectedSubmission.originalData?.responseValue || 'N/A'}</div>
                </div>
              </div>
            </div>
            {/* Only show comment and action buttons if status is Pending */}
            {selectedSubmission.status === 'Pending' ? (
              <>
                <div className="mb-6">
                  <div className="text-lg font-semibold text-gray-800 mb-3">Admin Comment</div>
                  <textarea
                    className="w-full glass-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    rows={3}
                    placeholder="Add a comment (optional)"
                    value={actionComment}
                    onChange={e => setActionComment(e.target.value)}
                    disabled={actionLoading}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60"
                    onClick={() => handleAction('Approved')}
                    disabled={actionLoading}
                  >
                    {CheckIcon}
                    {actionLoading ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    className="flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60"
                    onClick={() => handleAction('Rejected')}
                    disabled={actionLoading}
                  >
                    {XIcon}
                    {actionLoading ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-6">
                <div className="text-lg font-semibold text-gray-800 mb-3">Admin Comment</div>
                <div className="bg-white/90 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-lg text-sm text-gray-700 min-h-[3rem]">
                  {selectedSubmission.comment || <span className="text-gray-400">No comment provided</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalsScreen; 