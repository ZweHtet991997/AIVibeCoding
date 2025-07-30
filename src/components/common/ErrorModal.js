import React from 'react';

const ErrorModal = ({ open, onClose, error, title = 'Error', showRetry = false, onRetry }) => {
  if (!open) return null;

  // Parse error message to make it more user-friendly
  const getHumanReadableError = (errorMessage) => {
    if (!errorMessage) return 'An unexpected error occurred.';
    
    // Handle common error patterns
    if (errorMessage.includes('409')) {
      return 'A form with this name already exists. Please choose a different name.';
    }
    if (errorMessage.includes('401')) {
      return 'Your session has expired. Please log in again.';
    }
    if (errorMessage.includes('403')) {
      return 'You don\'t have permission to perform this action.';
    }
    if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
      return 'Network connection error. Please check your internet connection and try again.';
    }
    if (errorMessage.includes('JSON')) {
      return 'Server response error. Please try again or contact support.';
    }
    if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
      return 'This item already exists. Please use a different name or identifier.';
    }
    if (errorMessage.includes('validation') || errorMessage.includes('Invalid')) {
      return 'Please check your input and try again.';
    }
    
    // Return the original message if no pattern matches
    return errorMessage;
  };

  const humanReadableError = getHumanReadableError(error);
  const isSuccess = title.toLowerCase().includes('success');

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="soft-bg backdrop-blur-md border border-white/20 rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 glass-input rounded-lg p-2 text-gray-600 hover:text-gray-800 hover:neon-soft transition-all duration-300"
          onClick={onClose}
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isSuccess 
              ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
              : 'bg-gradient-to-r from-red-400 to-pink-400'
          }`}>
            {isSuccess ? (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>
        
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {title}
          </h2>
        </div>
        
        {/* Error Message */}
        <div className="text-center mb-6">
          <p className="text-gray-600 leading-relaxed">
            {humanReadableError}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="glass-card rounded-xl px-6 py-3 font-medium text-gray-800 hover:neon-soft transition-all duration-300"
            >
              Try Again
            </button>
          )}
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 ${
              isSuccess
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
            }`}
          >
            {showRetry ? 'Cancel' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal; 