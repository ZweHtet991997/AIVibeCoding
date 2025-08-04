import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { approvalsAPI } from '../../utils/api';
import apiConfig from '../../config';
import { getToken } from '../../utils/auth';
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
  const [parsedResponseData, setParsedResponseData] = useState([]);
  const [actionComment, setActionComment] = useState('');
     const [actionLoading, setActionLoading] = useState(false);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [notification, setNotification] = useState({ show: false, type: '', message: '', title: '' });
   const [previewFile, setPreviewFile] = useState(null);
   const [previewLoading, setPreviewLoading] = useState(false);

  // Parse response data from JSON string
  const parseResponseData = (responseDataString) => {
    try {
      if (!responseDataString) return [];
      const parsed = JSON.parse(responseDataString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing response data:', error);
      return [];
    }
  };

  // Load submission data
  const loadSubmissionData = async () => {
    setLoading(true);
    setError('');
    try {
      const responses = await approvalsAPI.getFormResponses();
      const targetSubmission = responses.find(resp => resp.responseId.toString() === submissionId);
      
      if (!targetSubmission) {
        throw new Error('Submission not found');
      }

      const parsedData = parseResponseData(targetSubmission.responseData);
      setParsedResponseData(parsedData);

             setSubmission({
         id: targetSubmission.responseId,
         formName: targetSubmission.formName,
         submittedBy: targetSubmission.userName,
         userEmail: targetSubmission.userEmail,
         submissionDate: targetSubmission.responseDate,
         status: targetSubmission.status,
         comment: targetSubmission.comment,
         decisionDate: targetSubmission.decisionDate,
         filePath: targetSubmission.filePath
       });

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

   // Cleanup preview URL on unmount
   useEffect(() => {
     return () => {
       if (previewFile?.url) {
         window.URL.revokeObjectURL(previewFile.url);
       }
     };
   }, [previewFile]);

       // Preview file function
    const handlePreviewFile = async (filePath) => {
      try {
        setPreviewLoading(true);
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Convert Windows path separators to URL format
        const normalizedPath = filePath.replace(/\\/g, '/');
        
        const response = await fetch(`${apiConfig.baseUrl}/${normalizedPath}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized access. Please log in again.');
          } else if (response.status === 404) {
            throw new Error('File not found.');
          } else {
            throw new Error(`Failed to load file: ${response.status}`);
          }
        }

        // Get the filename and determine file type
        const filename = filePath.split(/[\\/]/).pop();
        const fileExtension = filename.split('.').pop()?.toLowerCase();
        
        // Create a blob from the response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        setPreviewFile({
          url,
          filename,
          fileExtension,
          blob
        });

      } catch (error) {
        console.error('Preview error:', error);
        setNotification({
          show: true,
          type: 'error',
          title: 'Preview Failed',
          message: error.message || 'Failed to preview the file.'
        });
      } finally {
        setPreviewLoading(false);
      }
    };

    // Close preview
    const closePreview = () => {
      if (previewFile?.url) {
        window.URL.revokeObjectURL(previewFile.url);
      }
      setPreviewFile(null);
    };

    // Download file function
    const handleDownloadFile = async (filePath) => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Convert Windows path separators to URL format
        const normalizedPath = filePath.replace(/\\/g, '/');
        
        const response = await fetch(`${apiConfig.baseUrl}/${normalizedPath}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized access. Please log in again.');
          } else if (response.status === 404) {
            throw new Error('File not found.');
          } else {
            throw new Error(`Failed to download file: ${response.status}`);
          }
        }

        // Get the filename from the path
        const filename = filePath.split(/[\\/]/).pop();
        
        // Create a blob from the response
        const blob = await response.blob();
        
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setNotification({
          show: true,
          type: 'success',
          title: 'Download Successful',
          message: 'File downloaded successfully.'
        });
      } catch (error) {
        console.error('Download error:', error);
        setNotification({
          show: true,
          type: 'error',
          title: 'Download Failed',
          message: error.message || 'Failed to download the file.'
        });
      }
    };

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

  // Render field value
  const renderFieldValue = (value, fieldType) => {
    if (!value || value === 'N/A') {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <span className="text-gray-800">N/A</span>
        </div>
      );
    }

                   // Handle file type fields
      if (fieldType === 'file') {
        // Extract filename from path (e.g., /assets/uploads/7_2_1754279183110.jpg -> 7_2_1754279183110.jpg)
        const filename = value.split('/').pop();
        
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">{filename}</span>
              {submission?.filePath && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreviewFile(submission.filePath)}
                    disabled={previewLoading}
                    className="inline-flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {previewLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.639 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.639 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {previewLoading ? 'Loading...' : 'Preview'}
                  </button>
                  <button
                    onClick={() => handleDownloadFile(submission.filePath)}
                    className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      }

    // Handle other field types
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <span className="text-gray-800 whitespace-pre-wrap">{value}</span>
      </div>
    );
  };

  // Render response data
  const renderResponseData = () => {
    if (!parsedResponseData || parsedResponseData.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No form data available
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {parsedResponseData.map((field, index) => (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.field || field.Field}
            </label>
            {renderFieldValue(field.value || field.Value, field.type || field.Type)}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-4 text-primary-600 font-medium">Loading submission...</span>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-4">{error || 'Submission not found'}</div>
        <button
          onClick={() => navigate('/admin-dashboard', { state: { activeMenu: 'Approvals' }})}
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/admin-dashboard', { state: { activeMenu: 'Approvals' }})}
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
        </div>

        {/* Form Data */}
        <div className="bg-white/50 glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800">Submitted Form Data</h2>
          </div>
          
          {renderResponseData()}
        </div>

        {/* Admin Comment */}
        <div className="bg-white/50 glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800">Admin Comment</h2>
          </div>
          
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
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <span className="text-gray-800">
                {submission.comment || <span className="text-gray-400">No comment provided</span>}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {submission.status === 'Pending' && (
          <div className="flex gap-4 justify-center">
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 transform hover:scale-105"
              onClick={() => handleAction('Approved')}
              disabled={actionLoading}
            >
              {CheckIcon}
              {actionLoading ? 'Approving...' : 'Approve'}
            </button>
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 transform hover:scale-105"
              onClick={() => handleAction('Rejected')}
              disabled={actionLoading}
            >
              {XIcon}
              {actionLoading ? 'Rejecting...' : 'Reject'}
            </button>
          </div>
        )}

                 {/* File Preview Modal */}
         {previewFile && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden">
               {/* Header */}
               <div className="flex items-center justify-between p-4 border-b border-gray-200">
                 <h3 className="text-lg font-semibold text-gray-800">{previewFile.filename}</h3>
                 <div className="flex gap-2">
                   <button
                     onClick={closePreview}
                     className="inline-flex items-center px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors duration-200"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                     </svg>
                     Close
                   </button>
                 </div>
               </div>
               
               {/* Content */}
               <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
                 {/* Image Preview */}
                 {['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(previewFile.fileExtension) && (
                   <div className="flex justify-center">
                     <img 
                       src={previewFile.url} 
                       alt={previewFile.filename}
                       className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                     />
                   </div>
                 )}
                 
                 {/* PDF Preview */}
                 {previewFile.fileExtension === 'pdf' && (
                   <div className="w-full h-[70vh]">
                     <iframe
                       src={previewFile.url}
                       className="w-full h-full border-0 rounded-lg"
                       title={previewFile.filename}
                     />
                   </div>
                 )}
                 
                 {/* Text Preview */}
                 {['txt', 'md', 'json', 'xml', 'csv', 'log'].includes(previewFile.fileExtension) && (
                   <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-[70vh] overflow-auto">
                     <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                       {/* We'll load the text content here */}
                       <div className="text-center text-gray-500">Loading text content...</div>
                     </pre>
                   </div>
                 )}
                 
                 {/* Unsupported File Type */}
                 {!['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'pdf', 'txt', 'md', 'json', 'xml', 'csv', 'log'].includes(previewFile.fileExtension) && (
                   <div className="flex flex-col items-center justify-center py-12">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mb-4">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                     </svg>
                     <h3 className="text-lg font-medium text-gray-800 mb-2">Preview Not Available</h3>
                     <p className="text-gray-500 text-center max-w-md">
                       This file type ({previewFile.fileExtension.toUpperCase()}) cannot be previewed. 
                       Please download the file to view it.
                     </p>
                   </div>
                 )}
               </div>
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