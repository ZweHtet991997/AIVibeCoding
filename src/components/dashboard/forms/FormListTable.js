import React from 'react';

// Heroicons (outline)
const UserPlusIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0 align-middle">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72v-1.2A2.52 2.52 0 0015.48 15H8.52A2.52 2.52 0 006 17.52v1.2M15 7.5A3 3 0 119 7.5a3 3 0 016 0zM19.5 8.25v3m0 0v3m0-3h3m-3 0h-3" />
  </svg>
);

const PublishIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0 align-middle">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const FormListTable = ({ forms, onAssignUsers, onPublishForm, publishingForms = {} }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Form Name</th>
            <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Status</th>
            <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Total Submissions</th>
            <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Total Assigned Users</th>
            <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Created Date</th>
            <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {forms.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-8 px-4 text-center text-gray-500">
                No forms found.
              </td>
            </tr>
          ) : (
            forms.map((form) => (
              <tr key={form.formId} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-dashboard-bodyText font-medium">{form.formName}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    form.status === 'Active' ? 'bg-green-100 text-green-700' : 
                    form.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-gray-200 text-gray-700'
                  }`}>{form.status}</span>
                </td>
                <td className="py-4 px-4 text-dashboard-bodyText">{form.totalSubmissions}</td>
                <td className="py-4 px-4 text-dashboard-bodyText">{form.totalAssignedUsers || 0}</td>
                <td className="py-4 px-4 text-dashboard-bodyText">{new Date(form.createdDate).toLocaleDateString()}</td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    {/* Show Publish button only for Draft status */}
                    {form.status === 'Draft' && (
                      <button
                        className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium ${
                          publishingForms[form.formId] 
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                        }`}
                        onClick={() => !publishingForms[form.formId] && onPublishForm(form)}
                        disabled={publishingForms[form.formId]}
                      >
                        {publishingForms[form.formId] ? (
                          <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-gray-500"></div>
                        ) : (
                          PublishIcon
                        )}
                        {publishingForms[form.formId] ? 'Publishing...' : 'Publish'}
                      </button>
                    )}
                    
                    {/* Show Assign Users button only for Active status */}
                    {form.status === 'Active' && (
                      <button
                        className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded text-xs font-medium"
                        onClick={() => onAssignUsers(form)}
                      >
                        {UserPlusIcon}
                        Assign Users
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FormListTable; 