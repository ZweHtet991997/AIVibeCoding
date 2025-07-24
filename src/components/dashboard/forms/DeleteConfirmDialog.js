import React from 'react';

const DeleteConfirmDialog = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 relative transform transition-all duration-300 animate-slideUp flex flex-col items-center">
        {/* Warning Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Form</h2>
        <p className="text-gray-500 mb-6 text-center">Are you sure you want to delete this form? This action cannot be undone.</p>
        <div className="flex gap-3 w-full justify-center">
          <button
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 border border-gray-200"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { transform: translateY(40px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
          .animate-fadeIn { animation: fadeIn 0.2s ease; }
          .animate-slideUp { animation: slideUp 0.25s cubic-bezier(0.4,0,0.2,1); }
        `}</style>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog; 