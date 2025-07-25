import React, { useState, useEffect, useRef } from 'react';

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

// Mock data for submissions
const mockSubmissions = [
  {
    id: 'SUB-001',
    formName: 'Employee Onboarding',
    submittedBy: 'John Smith',
    submissionDate: '2024-01-15',
    status: 'Pending',
    data: { Name: 'John Smith', Department: 'HR', StartDate: '2024-02-01' },
    comment: '',
  },
  {
    id: 'SUB-002',
    formName: 'Leave Request',
    submittedBy: 'Sarah Johnson',
    submissionDate: '2024-01-14',
    status: 'Approved',
    data: { Name: 'Sarah Johnson', LeaveType: 'Sick', Days: 2 },
    comment: 'Approved. Get well soon!',
  },
  {
    id: 'SUB-003',
    formName: 'Expense Report',
    submittedBy: 'Mike Davis',
    submissionDate: '2024-01-13',
    status: 'Rejected',
    data: { Name: 'Mike Davis', Amount: 120, Reason: 'Travel' },
    comment: 'Missing receipt.',
  },
  {
    id: 'SUB-004',
    formName: 'IT Support Request',
    submittedBy: 'Lisa Wilson',
    submissionDate: '2024-01-12',
    status: 'Pending',
    data: { Name: 'Lisa Wilson', Issue: 'Laptop not booting' },
    comment: '',
  },
];

const statusOptions = ['Pending', 'Approved', 'Rejected'];

const ApprovalsScreen = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filters, setFilters] = useState({ formName: '', status: '' });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionComment, setActionComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const tableRef = useRef(null);

  // Simulate fetching data
  useEffect(() => {
    setSubmissions(mockSubmissions);
  }, []);

  // Maintain scroll position after modal close
  useEffect(() => {
    if (!modalOpen && tableRef.current) {
      tableRef.current.scrollTop = scrollPosition;
    }
  }, [modalOpen, scrollPosition]);

  // Filtered submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesForm = sub.formName.toLowerCase().includes(filters.formName.toLowerCase());
    const matchesStatus = filters.status ? sub.status === filters.status : true;
    return matchesForm && matchesStatus;
  });

  // Open detail modal
  const handleView = (submission) => {
    setScrollPosition(tableRef.current ? tableRef.current.scrollTop : 0);
    setSelectedSubmission(submission);
    setActionComment('');
    setModalOpen(true);
  };

  // Approve/Reject action
  const handleAction = (status) => {
    setActionLoading(true);
    setTimeout(() => {
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubmission.id
            ? { ...sub, status, comment: actionComment }
            : sub
        )
      );
      setModalOpen(false);
      setActionLoading(false);
    }, 800); // Simulate API call
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
                <td colSpan={6} className="text-center text-gray-500 py-8">No submissions found.</td>
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
      </div>

      {/* Detail Modal */}
      {modalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">Submission Details</h2>
            <div className="mb-4 text-sm text-gray-500">ID: {selectedSubmission.id}</div>
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold">Form Name:</div>
                  <div>{selectedSubmission.formName}</div>
                </div>
                <div>
                  <div className="font-semibold">Submitted By:</div>
                  <div>{selectedSubmission.submittedBy}</div>
                </div>
                <div>
                  <div className="font-semibold">Submission Date:</div>
                  <div>{new Date(selectedSubmission.submissionDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="font-semibold">Status:</div>
                  <div>{selectedSubmission.status}</div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-2">Form Data:</div>
              <div className="bg-gray-50 border border-gray-200 rounded p-4 text-sm">
                <ul>
                  {Object.entries(selectedSubmission.data).map(([key, value]) => (
                    <li key={key} className="mb-1">
                      <span className="font-medium text-gray-700">{key}:</span> {value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Only show comment and action buttons if status is Pending */}
            {selectedSubmission.status === 'Pending' ? (
              <>
                <div className="mb-4">
                  <div className="font-semibold mb-2">Admin Comment:</div>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    rows={2}
                    placeholder="Add a comment (optional)"
                    value={actionComment}
                    onChange={e => setActionComment(e.target.value)}
                    disabled={actionLoading}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-60 transition-colors duration-150"
                    onClick={() => handleAction('Approved')}
                    disabled={actionLoading}
                  >
                    {CheckIcon}
                    {actionLoading ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-60 transition-colors duration-150"
                    onClick={() => handleAction('Rejected')}
                    disabled={actionLoading}
                  >
                    {XIcon}
                    {actionLoading ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-4">
                <div className="font-semibold mb-2">Admin Comment:</div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-700 min-h-[2.5rem]">
                  {selectedSubmission.comment || <span className="text-gray-400">No comment</span>}
                </div>
              </div>
            )}
            <style>{`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              .animate-fadeIn { animation: fadeIn 0.2s ease; }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalsScreen; 