import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../utils/api';

const RecentSubmissionsTable = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const dashboardData = await dashboardAPI.getDashboardData();
        setSubmissions(dashboardData.topFormResponses || []);
      } catch (err) {
        setError(err.message || 'Failed to load recent submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'Approved':
        return `${baseClasses} bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-md shadow-green-500/20`;
      case 'Rejected':
        return `${baseClasses} bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-md shadow-red-500/20`;
      case 'Pending':
        return `${baseClasses} bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md shadow-yellow-500/20`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-400 to-gray-600 text-white`;
    }
  };

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
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white/60 glass-card rounded-2xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Recent Submissions
            </h3>
            <p className="text-gray-600 text-sm">
              Latest form submissions and their current status
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-purple-400/30 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-purple-400 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
          </div>
          <span className="ml-4 text-gray-700 font-medium">Loading submissions...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="glass-button rounded-xl p-4">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium mb-2">No recent submissions</p>
          <p className="text-gray-400 text-sm">Submissions will appear here once users start filling out forms.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <div className="glass-button rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200/30">
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">
                      User Name
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">
                      Form Name
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">
                      Response Date
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-gray-100/30 hover:bg-gray-50/30 transition-all duration-300 group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td className="py-4 px-6 text-gray-800 font-medium group-hover:text-purple-600 transition-colors duration-300">
                        {submission.userName}
                      </td>
                      <td className="py-4 px-6 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        {submission.formName}
                      </td>
                      <td className="py-4 px-6 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        {formatDate(submission.responseDate)}
                      </td>
                      <td className="py-4 px-6">
                        <span className={getStatusBadge(submission.approvalStatus)}>
                          {submission.approvalStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500 font-medium">
              Showing {submissions.length} of {submissions.length} recent submissions
            </div>
            <button className="glass-button px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:neon-soft transition-all duration-300 font-medium">
              View All Submissions →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentSubmissionsTable; 