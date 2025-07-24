import React from 'react';

const FormBuilderModal = ({ open, onClose, form }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">
          {form ? `Edit Form: ${form.name}` : 'Create New Form'}
        </h2>
        {/* Placeholder for form builder UI */}
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
          Form Builder UI goes here (drag & drop, field config, etc.)
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderModal; 