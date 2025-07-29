import React, { useState } from 'react';

const FormPreview = ({ form }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form?.fields) return newErrors;

    form.fields.forEach(field => {
      const value = formData[field.id];
      
      // Required field validation
      if (field.required && (!value || value.trim() === '')) {
        newErrors[field.id] = `${field.label} is required`;
      }
      
      // Field-specific validation
      if (value && value.trim() !== '') {
        switch (field.type) {
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              newErrors[field.id] = 'Please enter a valid email address';
            }
            break;
          case 'number':
            if (field.min !== undefined && Number(value) < field.min) {
              newErrors[field.id] = `Value must be at least ${field.min}`;
            }
            if (field.max !== undefined && Number(value) > field.max) {
              newErrors[field.id] = `Value must be at most ${field.max}`;
            }
            break;
          case 'date':
            if (field.minDate && new Date(value) < new Date(field.minDate)) {
              newErrors[field.id] = `Date must be after ${new Date(field.minDate).toLocaleDateString()}`;
            }
            if (field.maxDate && new Date(value) > new Date(field.maxDate)) {
              newErrors[field.id] = `Date must be before ${new Date(field.maxDate).toLocaleDateString()}`;
            }
            break;
        }
      }
    });

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // In preview mode, just show the data
    console.log('Form data:', formData);
    alert('Form submitted successfully! (Preview mode)');
  };

  const renderField = (field) => {
    const fieldError = errors[field.id];
    const value = formData[field.id] || '';

    const commonProps = {
      id: field.id,
      value: value,
      onChange: (e) => handleInputChange(field.id, e.target.value),
      className: `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        fieldError ? 'border-red-500' : 'border-gray-300'
      }`,
      placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
      required: field.required
    };

    switch (field.type) {
      case 'text':
        return <input type="text" {...commonProps} />;
      
      case 'email':
        return <input type="email" {...commonProps} />;
      
      case 'number':
        return (
          <input 
            type="number" 
            {...commonProps}
            min={field.min}
            max={field.max}
            step={field.step || 1}
          />
        );
      
      case 'textarea':
        return (
          <textarea 
            {...commonProps}
            rows={field.rows || 4}
            className={`${commonProps.className} resize-vertical`}
          />
        );
      
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value || option}
                  checked={value === (option.value || option)}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="mr-2"
                  required={field.required}
                />
                <span>{option.label || option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option.value || option}
                  checked={Array.isArray(value) ? value.includes(option.value || option) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value || option]
                      : currentValues.filter(v => v !== (option.value || option));
                    handleInputChange(field.id, newValues);
                  }}
                  className="mr-2"
                />
                <span>{option.label || option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'date':
        return (
          <input 
            type="date" 
            id={field.id}
            value={value || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Select date"
            min={field.minDate}
            max={field.maxDate}
            required={field.required}
          />
        );
      
      case 'file':
        return (
          <input 
            type="file" 
            {...commonProps}
            accept={field.accept}
            multiple={field.multiple}
            onChange={(e) => {
              const files = Array.from(e.target.files);
              handleInputChange(field.id, files);
            }}
          />
        );
      
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        {/* Form Preview */}
        <div className="glass-card rounded-2xl p-8">
          {/* Compact Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {form.name || 'Form Preview'}
              </h1>
              {form.description && (
                <p className="text-gray-600 mt-1">{form.description}</p>
              )}
            </div>
            <span className="glass-button rounded-full px-3 py-1 text-sm font-medium text-gray-600">
              <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview Mode
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields?.map((field, index) => (
              <div key={field.id || index} className="space-y-3">
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {renderField(field)}
                
                {errors[field.id] && (
                  <p className="text-red-500 text-sm">{errors[field.id]}</p>
                )}
                
                {field.helpText && (
                  <p className="text-gray-500 text-sm">{field.helpText}</p>
                )}
              </div>
            ))}

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200/50">
              <button
                type="submit"
                className="glass-card w-full py-4 px-6 rounded-xl font-medium text-gray-800 hover:neon-soft transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit Form (Preview)
              </button>
            </div>
          </form>
        </div>

        {/* Preview Info */}
        <div className="mt-8 glass-card rounded-2xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview Mode</h3>
              <p className="text-gray-600">
                This is exactly how your form will appear to end users. 
                You can test the form functionality, but submissions are not saved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreview; 