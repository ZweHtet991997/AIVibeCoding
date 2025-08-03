import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { approvalsAPI, formsAPI } from '../../utils/api';
import ErrorModal from '../common/ErrorModal';

// Heroicons (outline)
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

const ArrowLeftIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const SubmissionViewScreen = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState(null);
  const [formData, setFormData] = useState(null);
  const [actionComment, setActionComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ show: false, type: '', message: '', title: '' });

  // Load submission and form data
  const loadSubmissionData = async () => {
    setLoading(true);
    setError('');
    try {
      // First, get all form responses to find the specific submission
      const responses = await approvalsAPI.getFormResponses();
      const targetSubmission = responses.find(resp => resp.responseId.toString() === submissionId);
      
      if (!targetSubmission) {
        throw new Error('Submission not found');
      }

      setSubmission({
        id: targetSubmission.responseId,
        formName: targetSubmission.formName,
        submittedBy: targetSubmission.userName,
        submissionDate: targetSubmission.responseDate,
        status: targetSubmission.status,
        comment: targetSubmission.comment,
        data: {
          [targetSubmission.fieldKey]: targetSubmission.responseValue
        },
        originalData: targetSubmission
      });

      // Get the form structure to render it properly
      try {
        const formDetails = await formsAPI.getFormById(targetSubmission.formId);
        setFormData(formDetails);
      } catch (formError) {
        console.warn('Could not load form details:', formError);
        // Continue without form structure - we'll show the raw data
      }

    } catch (error) {
      console.error('Error loading submission data:', error);
      setError(error.message || 'Failed to load submission data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submissionId) {
      loadSubmissionData();
    }
  }, [submissionId]);

  // Approve/Reject action
  const handleAction = async (status) => {
    if (!submission) {
      setNotification({
        show: true,
        type: 'error',
        title: 'Action Failed',
        message: 'No submission selected for action.'
      });
      return;
    }

    setActionLoading(true);
    try {
      await approvalsAPI.approveRejectForm(submission.id, status, actionComment.trim());
      
      setNotification({
        show: true,
        type: 'success',
        title: `${status} Successfully`,
        message: `The form response has been ${status.toLowerCase()} successfully.`
      });
      
      setActionComment('');
      
      // Refresh the data to get the latest status
      await loadSubmissionData();
    } catch (error) {
      console.error('Action error:', error);
      setNotification({
        show: true,
        type: 'error',
        title: `${status} Failed`,
        message: error.message || `Failed to ${status.toLowerCase()} the form response.`
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Render form field in read-only mode
  const renderReadOnlyField = (field, value) => {
    const displayValue = value || 'N/A';
    
    switch (field?.type) {
      case 'textarea':
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[4rem]">
            <p className="text-gray-800 whitespace-pre-wrap">{displayValue}</p>
          </div>
        );
      
      case 'select':
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-gray-800">{displayValue}</span>
          </div>
        );
      
      case 'radio':
      case 'checkbox':
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-gray-800">{displayValue}</span>
          </div>
        );
      
      case 'date':
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-gray-800">
              {displayValue !== 'N/A' ? new Date(displayValue).toLocaleDateString() : displayValue}
            </span>
          </div>
        );
      
      case 'number':
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-gray-800">{displayValue}</span>
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-gray-800">{displayValue}</span>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-4 text-primary-600 font-medium">Loading submission...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={
            () => navigate('/admin-dashboard', { state: { activeMenu: 'Approvals' }} )
        }
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          Back
        </button>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-4">Submission not found</div>
        <button
          onClick={
            () => navigate('/admin-dashboard', { state: { activeMenu: 'Approvals' }} )
          }
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          Back  
        </button>
      </div>
    );
  }

  return (
    <div className="soft-bg min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        {/* Compact Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={
                  () => navigate('/admin-dashboard', { state: { activeMenu: 'Approvals' }} )
              }
              className="glass-input hover:neon-soft px-3 py-2 rounded-xl flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 group"
            >
              <div className="rounded-full group-hover:bg-gray-100 transition-colors duration-200">
                {ArrowLeftIcon}
              </div>
              Back
            </button>
            
            <h1 className="text-3xl font-bold text-gray-800">{submission.formName}</h1>

            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                submission.status === 'Approved'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : submission.status === 'Rejected'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
              }`}>
                {submission.status}
              </span>
          </div>

          {/* Submission Info Cards */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Submitted By</div>
              <div className="text-lg font-semibold text-gray-800">{submission.submittedBy}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Submission Date</div>
              <div className="text-lg font-semibold text-gray-800">
                {new Date(submission.submissionDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Form Data Section */}
        <div className="bg-white/50 glass-card rounded-2xl p-6 mb-6">
          {formData && formData.fields ? (
            // Render with form structure
            <div className="space-y-6">
              {formData.fields.map((field, index) => (
                <div key={field.id || index} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {renderReadOnlyField(field, submission.data[field.id])}
                  
                  {field.helpText && (
                    <p className="text-gray-500 text-sm">{field.helpText}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Fallback to raw data display
            <div className="space-y-4">
              {Object.entries(submission.data).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {submission.originalData?.fieldKey || key}
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <span className="text-gray-800">{value || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Comment Section */}
        <div className="bg-white/50 glass-card rounded-2xl p-6 mb-6">
        <div className='text-xl font-semibold text-gray-800 mb-2'>Admin Comment</div>
          {submission.status === 'Pending' ? (
            <textarea
              className="w-full glass-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
              rows={3}
              placeholder="Add a comment (optional)"
              value={actionComment}
              onChange={e => setActionComment(e.target.value)}
              disabled={actionLoading}
            />
          ) : (
            <div>
              {submission.comment || <span className="text-gray-400">No comment provided</span>}
            </div>
          )}
        </div>

        {/* Action Buttons - Only show for Pending submissions */}
        {submission.status === 'Pending' && (
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
              Actions
            </h2>
            <div className="flex gap-4 justify-end">
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 transform hover:scale-105"
                onClick={() => handleAction('Approved')}
                disabled={actionLoading}
              >
                {CheckIcon}
                {actionLoading ? 'Approving...' : 'Approve'}
              </button>
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 transform hover:scale-105"
                onClick={() => handleAction('Rejected')}
                disabled={actionLoading}
              >
                {XIcon}
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        )}

        {/* Notification Modal */}
        <ErrorModal
          open={notification.show}
          onClose={() => setNotification({ show: false, type: '', message: '', title: '' })}
          error={notification.message}
          title={notification.title}
        />
      </div>
    </div>
  );
};

export default SubmissionViewScreen; 