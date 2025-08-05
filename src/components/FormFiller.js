import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserId } from '../utils/auth';
import { userFormsAPI } from '../utils/api';
import ErrorModal from './common/ErrorModal';



const FormFiller = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formSchema, setFormSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');

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
          
          // Clear any existing errors
          setErrors({});
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
      const userId = getUserId();
      
      // Check if form has file upload fields
      const hasFileFields = formSchema.fields.some(field => field.type === 'file');
      
      // Prepare response data array
      const responseDataArray = [];
      let fileToUpload = null;
      
      for (const fieldId of Object.keys(formData)) {
        const field = formSchema.fields.find(f => f.id === fieldId);
        const value = formData[fieldId];
        
        if (field) {
          let processedValue = value;
          
          // Handle file uploads
          if ((field.type === 'file' ) && value) {
            if (Array.isArray(value) && value.length > 0) {
              // For multiple files, use the first one for upload and store all filenames
              const fileNames = value.map(file => file.name);
              processedValue = fileNames.join(', ');
              fileToUpload = value[0]; // Use first file for upload
            } else if (value instanceof File) {
              processedValue = value.name;
              fileToUpload = value;
            }
          }
          
          // Handle checkbox arrays
          if (field.type === 'checkbox' && Array.isArray(value)) {
            processedValue = value.join(', ');
          }
          
          responseDataArray.push({
            field: field.label,
            value: processedValue,
            type: field.type
          });
        }
      }
      
      // Convert response data to JSON string
      const responseDataString = JSON.stringify(responseDataArray);
      
      // Submit to API with conditional file upload
      const result = await userFormsAPI.submitFormResponse(
        parseInt(formId), 
        userId, 
        responseDataString, 
        fileToUpload // Always pass the file if we have one, regardless of hasFileFields
      );
      
      // Show success message
      setSubmissionMessage('Your form has been submitted successfully.');
      setShowSuccessModal(true);

    } catch (err) {
      
      // Check if it's a network error or API error
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setSubmissionMessage('Network error. Please check your connection and try again.');
      } else {
        setSubmissionMessage(`Failed to submit form: ${err.message}`);
      }
      setShowErrorModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/user-home');
  };

  const renderField = (field) => {
    const fieldError = errors[field.id];
    let value = formData[field.id] || '';

    // Ensure value is not accidentally treated as file data for non-file fields
    // But preserve array values for checkbox fields
    if (field.type !== 'file' && field.type !== 'fileupload' && field.type !== 'checkbox' && Array.isArray(value)) {
      value = value.join(', ');
    }

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
      case 'dropdown':
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
      case 'radiobutton':
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
      case 'fileupload':
        return (
          <div className="space-y-2">
            <input 
              type="file" 
              id={field.id}
              accept={field.accept || "image/*,.pdf,.doc,.docx"}
              multiple={field.multiple}
              onChange={(e) => {
                const files = Array.from(e.target.files);
                handleInputChange(field.id, files);
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                fieldError ? 'border-red-500' : 'border-gray-300'
              }`}
              required={field.required}
            />
            {value && Array.isArray(value) && value.length > 0 && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">Selected files:</p>
                <ul className="space-y-1">
                  {value.map((file, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  const getFieldIcon = (type) => {
    const icons = {
      text: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      email: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      number: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
      textarea: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      select: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
      ),
      dropdown: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
      ),
      radio: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      radiobutton: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      checkbox: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      date: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      file: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
      fileupload: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      )
    };
    return icons[type] || icons.text;
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
                  <div className="flex items-center gap-3">
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 flex-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  </div>
                  
                  {renderField(field)}
                  
                  {errors[field.id] && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors[field.id]}
                    </p>
                  )}
                  
                  {field.helpText && (
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {field.helpText}
                    </p>
                  )}
                </div>
              ))}

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200/50">
                <button
                  type="submit"
                  disabled={submitting}
                  className="neon-soft w-full py-4 px-6 rounded-xl font-medium text-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span>Submitting Form...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Submit Form</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <ErrorModal
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/user-home');
        }}
        error={submissionMessage}
        title="Form Submitted Successfully!"
      />

      {/* Error Modal */}
      <ErrorModal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={submissionMessage}
        title="Submission Failed"
        showRetry={true}
        onRetry={() => {
          setShowErrorModal(false);
          handleSubmit({ preventDefault: () => {} });
        }}
      />
    </div>
  );
};

export default FormFiller; 