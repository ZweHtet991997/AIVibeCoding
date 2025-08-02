import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserId } from '../utils/auth';
import { userFormsAPI } from '../utils/api';

const FormFiller = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formSchema, setFormSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch form schema from API
  useEffect(() => {
    const fetchFormSchema = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userId = getUserId();
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const data = await userFormsAPI.getFormDetails(userId, parseInt(formId));
        
        // Parse the formSchema string to JSON
        if (data.formSchema) {
          const parsedSchema = JSON.parse(data.formSchema);
          setFormSchema(parsedSchema);
          
          // Initialize form data with empty values
          const initialData = {};
          if (parsedSchema.fields) {
            parsedSchema.fields.forEach(field => {
              if (field.type === 'checkbox') {
                initialData[field.id] = [];
              } else {
                initialData[field.id] = '';
              }
            });
          }
          setFormData(initialData);
        } else {
          throw new Error('Invalid form schema received');
        }
      } catch (err) {
        console.error('Error fetching form schema:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFormSchema();
  }, [formId]);

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
    
    if (!formSchema?.fields) return newErrors;

    formSchema.fields.forEach(field => {
      const value = formData[field.id];
      
      // Required field validation
      if (field.required) {
        if (field.type === 'checkbox') {
          if (!Array.isArray(value) || value.length === 0) {
            newErrors[field.id] = `${field.label} is required`;
          }
        } else if (field.type === 'file') {
          if (!value || (Array.isArray(value) && value.length === 0)) {
            newErrors[field.id] = `${field.label} is required`;
          }
        } else {
          if (!value || value.trim() === '') {
            newErrors[field.id] = `${field.label} is required`;
          }
        }
      }
      
      // Field-specific validation
      if (value && (typeof value === 'string' ? value.trim() !== '' : true)) {
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
          case 'file':
            if (Array.isArray(value)) {
              value.forEach((file, index) => {
                if (file.size > 2 * 1024 * 1024) { // 2MB limit
                  newErrors[field.id] = `File ${file.name} exceeds 2MB limit`;
                }
              });
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

    setSubmitting(true);
    
    try {
      // Prepare form data for submission
      const submissionData = {
        formId: parseInt(formId),
        userId: getUserId(),
        responses: Object.keys(formData).map(fieldId => {
          const field = formSchema.fields.find(f => f.id === fieldId);
          const value = formData[fieldId];
          
          return {
            fieldId: fieldId,
            fieldName: field.label,
            fieldType: field.type,
            value: field.type === 'file' ? (Array.isArray(value) ? value.map(f => f.name) : []) : value,
            required: field.required || false
          };
        })
      };

      console.log('Form submission data:', submissionData);
      
      // For now, just display the data (actual API integration can be added later)
      alert('Form submitted successfully! Check console for data.');
      
      // Navigate back to user home
      navigate('/user-home');
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/user-home');
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
                {option.label || option.value || option}
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
                <span>{option.label || option.value || option}</span>
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
                <span>{option.label || option.value || option}</span>
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
            accept={field.accept || "image/*,.pdf,.doc,.docx"}
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl font-medium text-slate-700 hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Error Loading Form
                </h1>
              </div>
            </div>
          </div>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Unable to Load Form</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">{error}</p>
            <button
              onClick={handleBack}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Forms
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!formSchema) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl font-medium text-slate-700 hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Form Not Available
                </h1>
                <p className="text-slate-600 text-sm">Form ID: {formId}</p>
              </div>
            </div>
          </div>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Form Not Found</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
              The form you're looking for is not available or has not been assigned to you.
            </p>
            <button
              onClick={handleBack}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Forms
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-20 h-20 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-2xl animate-gentle-float"></div>
        <div className="absolute top-32 right-24 w-16 h-16 bg-gradient-to-br from-cyan-400/15 to-blue-400/15 rounded-full blur-xl animate-gentle-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-24 left-1/3 w-24 h-24 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl animate-gentle-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl font-medium text-slate-700 hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  {formSchema.title || formSchema.name || 'Form'}
                </h1>
                <p className="text-slate-600 text-sm">
                  {formSchema.description || 'Please fill out the form below'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {formSchema.fields?.map((field, index) => (
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
                  disabled={submitting}
                  className="neon-soft w-full py-4 px-6 rounded-xl font-medium text-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mr-2 inline"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit Form
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormFiller; 