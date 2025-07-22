import React from 'react';

const RecentSubmissionsTable = () => {
  const submissions = [
    {
      id: 1,
      formName: 'Employee Onboarding Form',
      createdBy: 'John Smith',
      submissionCount: 45,
      status: 'Approved',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      formName: 'Leave Request Form',
      createdBy: 'Sarah Johnson',
      submissionCount: 32,
      status: 'Pending',
      lastUpdated: '2024-01-14'
    },
    {
      id: 3,
      formName: 'Expense Report Form',
      createdBy: 'Mike Davis',
      submissionCount: 28,
      status: 'Rejected',
      lastUpdated: '2024-01-13'
    },
    {
      id: 4,
      formName: 'IT Support Request',
      createdBy: 'Lisa Wilson',
      submissionCount: 67,
      status: 'Approved',
      lastUpdated: '2024-01-12'
    },
    {
      id: 5,
      formName: 'Training Registration',
      createdBy: 'David Brown',
      submissionCount: 23,
      status: 'Pending',
      lastUpdated: '2024-01-11'
    }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'Approved':
        return `${baseClasses} bg-dashboard-approved text-white`;
      case 'Rejected':
        return `${baseClasses} bg-dashboard-rejected text-white`;
      case 'Pending':
        return `${baseClasses} bg-dashboard-pending text-gray-800`;
      default:
        return `${baseClasses} bg-gray-200 text-gray-800`;
    }
  };

  return (
    <div className="bg-dashboard-cardBg rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dashboard-bodyText mb-2">
          Recent Submissions
        </h3>
        <p className="text-sm text-gray-600">
          Latest form submissions and their current status
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">
                Form Name
              </th>
              <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">
                Created By
              </th>
              <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">
                Submission Count
              </th>
              <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">
                Status
              </th>
              <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-dashboard-bodyText font-medium">
                  {submission.formName}
                </td>
                <td className="py-4 px-4 text-dashboard-bodyText">
                  {submission.createdBy}
                </td>
                <td className="py-4 px-4 text-dashboard-bodyText">
                  {submission.submissionCount}
                </td>
                <td className="py-4 px-4">
                  <span className={getStatusBadge(submission.status)}>
                    {submission.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-dashboard-bodyText">
                  {new Date(submission.lastUpdated).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-dashboard-headerText">
          Showing {submissions.length} of {submissions.length} submissions
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Submissions →
        </button>
      </div>
    </div>
  );
};

export default RecentSubmissionsTable; 