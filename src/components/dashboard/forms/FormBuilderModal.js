import React from 'react';

const FormBuilderModal = ({ open, onClose, form }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-card rounded-2xl shadow-xl w-full max-w-2xl p-8 relative animate-scale-in">
        <button
          className="absolute top-4 right-4 glass-button rounded-lg p-2 text-gray-600 hover:text-gray-800 hover:neon-soft transition-all duration-300"
          onClick={onClose}
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {form ? `Edit Form: ${form.name}` : 'Create New Form'}
          </h2>
          <p className="text-gray-600">Design and configure your form with drag & drop interface</p>
        </div>
        
        {/* Placeholder for form builder UI */}
        <div className="glass-card border-2 border-dashed border-gray-300/50 rounded-xl p-8 text-center text-gray-500 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium mb-2">Form Builder Interface</p>
            <p className="text-sm">Drag & drop, field configuration, and form preview</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            className="glass-button px-6 py-3 rounded-xl font-medium text-gray-700 hover:text-gray-900 hover:neon-soft transition-all duration-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={onClose}
          >
            Save Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderModal; 