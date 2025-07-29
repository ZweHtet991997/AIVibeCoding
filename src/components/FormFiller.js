import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userFormsAPI } from '../utils/api';

const FormFiller = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const formData = await userFormsAPI.getFormById(formId);
      setForm(formData);
      
      // Initialize form data with empty values
      const initialData = {};
      if (formData.fields) {
        formData.fields.forEach(field => {
          initialData[field.id] = '';
        });
      }
      setFormData(initialData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching form:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      await userFormsAPI.submitFormResponse(formId, formData);
      
      // Show success message and redirect
      alert('Form submitted successfully!');
      navigate('/user-home');
    } catch (err) {
      setError(err.message);
      console.error('Error submitting form:', err);
    } finally {
      setSubmitting(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Form</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/user-home')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Form not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Form Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{form.name}</h1>
              <button
                onClick={() => navigate('/user-home')}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {form.description && (
              <p className="text-gray-600 text-lg">{form.description}</p>
            )}
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields?.map((field, index) => (
              <div key={field.id || index} className="space-y-2">
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
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </span>
                ) : (
                  'Submit Form'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormFiller; 