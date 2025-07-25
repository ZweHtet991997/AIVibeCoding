import React from 'react';

// Heroicons (outline)
const UserPlusIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0 align-middle">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72v-1.2A2.52 2.52 0 0015.48 15H8.52A2.52 2.52 0 006 17.52v1.2M15 7.5A3 3 0 119 7.5a3 3 0 016 0zM19.5 8.25v3m0 0v3m0-3h3m-3 0h-3" />
  </svg>
);
const PencilSquareIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0 align-middle">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.182 3 21l.818-4.5L16.862 4.487z" />
  </svg>
);
const TrashIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0 align-middle">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18.75A2.25 2.25 0 008.25 21h7.5A2.25 2.25 0 0018 18.75V7.5H6v11.25zM9.75 3v1.5h4.5V3m-7.5 1.5h12" />
  </svg>
);

const FormListTable = ({ forms, onEdit, onAssignUsers, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Form Name</th>
            <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Status</th>
            <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Total Submissions</th>
            <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Created Date</th>
            <th className="text-left py-3 px-4 text-dashboard-headerText font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={form.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-4 text-dashboard-bodyText font-medium">{form.name}</td>
              <td className="py-4 px-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${form.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{form.status}</span>
              </td>
              <td className="py-4 px-4 text-dashboard-bodyText">{form.totalSubmissions}</td>
              <td className="py-4 px-4 text-dashboard-bodyText">{new Date(form.createdDate).toLocaleDateString()}</td>
              <td className="py-4 px-4">
                <div className="flex gap-2">
                  <button
                    className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded text-xs font-medium"
                    onClick={() => onAssignUsers(form)}
                  >
                    {UserPlusIcon}
                    Assign Users
                  </button>
                  <button
                    className="flex items-center gap-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded text-xs font-medium"
                    onClick={() => onEdit(form)}
                  >
                    {PencilSquareIcon}
                    Edit
                  </button>
                  <button
                    className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded text-xs font-medium"
                    onClick={() => onDelete(form.id)}
                  >
                    {TrashIcon}
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormListTable; 