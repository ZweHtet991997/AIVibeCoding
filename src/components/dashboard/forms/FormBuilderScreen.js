import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormBuilderToolbar from './components/FormBuilderToolbar';
import FormBuilderCanvas from './components/FormBuilderCanvas';
import FormPreview from './components/FormPreview';
import FieldConfigPanel from './components/FieldConfigPanel';
import ErrorModal from '../../common/ErrorModal';
import { formsAPI } from '../../../utils/api';
import apiConfig from '../../../config';

const FormBuilderScreen = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    fields: []
  });
  const [selectedField, setSelectedField] = useState(null);
  const [loading, setLoading] = useState(!!formId);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, error: '', title: 'Error' });

  useEffect(() => {
    if (formId) {
      loadForm();
    }
  }, [formId]);

  // Keep selectedField in sync with form data
  useEffect(() => {
    if (selectedField && form.fields) {
      const currentField = form.fields.find(field => field.id === selectedField.id);
      if (currentField && JSON.stringify(currentField) !== JSON.stringify(selectedField)) {
        setSelectedField(currentField);
      }
    }
  }, [form.fields, selectedField]);

  const loadForm = async () => {
    try {
      setLoading(true);
      // Generate unique form ID
      // const formData = await formsAPI.getFormById(formId);
      
      // For demo purposes, load sample form
      const sampleForm = {
        id: formId,
        name: 'Sample Form',
        description: 'This is a sample form for demonstration purposes.',
        fields: [
          {
            id: 'field_1',
            type: 'text',
            label: 'Full Name',
            placeholder: 'Enter your full name',
            required: true,
            helpText: 'Please enter your legal name'
          },
          {
            id: 'field_2',
            type: 'email',
            label: 'Email Address',
            placeholder: 'your.email@example.com',
            required: true
          }
        ]
      };
      
      setForm(sampleForm);
    } catch (error) {
      setErrorModal({
        open: true,
        error: error.message || 'Failed to load form',
        title: 'Load Error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin-dashboard', { state: { activeMenu: 'Forms' } });
  };

  const handleFormUpdate = (updates) => {
    setForm(prev => ({ ...prev, ...updates }));
    
    // Update selectedField if it exists in the updated form
    if (selectedField && updates.fields) {
      const updatedField = updates.fields.find(field => field.id === selectedField.id);
      if (updatedField) {
        setSelectedField(updatedField);
      }
    }
  };

  const handleAddField = (fieldType) => {
    const newField = {
      id: `field_${Date.now()}`,
      type: fieldType,
      label: fieldType === 'date' ? 'Date' : `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: fieldType === 'date' ? 'Select date' : '',
      required: false,
      helpText: ''
    };

    // Add field-specific properties
    switch (fieldType) {
      case 'select':
      case 'radio':
      case 'checkbox':
        newField.options = [
          { value: 'Option 1' },
          { value: 'Option 2' }
        ];
        break;
      case 'number':
        newField.min = 0;
        newField.max = 100;
        newField.step = 1;
        break;
      case 'date':
        newField.minDate = '';
        newField.maxDate = '';
        break;
      case 'file':
        newField.accept = '.pdf,.doc,.docx';
        newField.multiple = false;
        break;
    }

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedField(newField);
  };

  const handleUpdateField = (fieldId, updates) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
    
    // Update selectedField if it's the field being updated
    if (selectedField?.id === fieldId) {
      setSelectedField(prev => ({ ...prev, ...updates }));
    }
  };

  const handleDeleteField = (fieldId) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  const handleReorderFields = (fromIndex, toIndex) => {
    setForm(prev => {
      const newFields = [...prev.fields];
      const [movedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedField);
      return { ...prev, fields: newFields };
    });
  };

  const handleSaveForm = async () => {
    try {
      setSaving(true);
      
      // Validate form name
      if (!form.name || form.name.trim() === '') {
        setErrorModal({
          open: true,
          error: 'Please enter a Form Name before saving.',
          title: 'Form Name Required'
        });
        return;
      }
      
      // Generate formId: formName + currentDateTime(ddmmyyss) + milliseconds for uniqueness
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = String(now.getFullYear()).slice(-2);
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
      const formNameClean = (form.name).replace(/[^a-zA-Z0-9]/g, '');
      const formId = `${formNameClean}${day}${month}${year}${seconds}${milliseconds}`;
    
      // Generate formUrl: {{baseFrontendUrl}}/form/fill/{formId}
      const formUrl = `${apiConfig.frontendUrl}/form/fill-form/${formId}`;
      
      // Generate form schema with metadata
      const formSchema = {
        id: formId,
        name: form.name,
        description: form.description || '',
        fields: form.fields || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0',
        metadata: {
          totalFields: form.fields?.length || 0,
          requiredFields: form.fields?.filter(f => f.required)?.length || 0,
          fieldTypes: form.fields?.reduce((acc, field) => {
            acc[field.type] = (acc[field.type] || 0) + 1;
            return acc;
          }, {}) || {}
        }
      };

      // Prepare request body according to API requirements
      const requestBody = {
        formName: form.name,
        formSchema: JSON.stringify(formSchema),
        status: 'Draft',
        formUrl: formUrl
      };
      
      // Call the API to create the form
      const result = await formsAPI.createForm(requestBody);

      // Show success message and wait for user to close
      setErrorModal({
        open: true,
        error: 'Form saved successfully!',
        title: 'Success'
      });
    } catch (error) {
      console.error('Error saving form:', error);
      setErrorModal({
        open: true,
        error: error.message,
        title: 'Form Creation Error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="soft-bg min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse-slow"></div>
              <div className="absolute inset-2 bg-white rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Form Builder</h3>
            <p className="text-gray-600">Please wait while we prepare your form builder...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="soft-bg min-h-screen">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-24 h-24 bg-blue-200/30 rounded-full blur-xl animate-gentle-float"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-purple-200/30 rounded-full blur-xl animate-gentle-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-cyan-200/30 rounded-full blur-xl animate-gentle-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Fixed Header */}
      <div className="glass-soft border-b border-white/10 px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBack}
              className="glass-card neon-soft rounded-xl px-3 py-2 text-gray-600 hover:text-gray-800 hover:neon-soft transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {formId ? 'Edit Form' : 'Create New Form'}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`glass-card rounded-xl px-4 py-2 font-medium transition-all duration-300 text-gray-800 ${
                previewMode
                  ? 'neon-soft'
                  : 'hover:neon-soft'
              }`}
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {previewMode ? 'Exit Preview' : 'Preview'}
            </button>
            <button
              onClick={handleSaveForm}
              disabled={saving}
              className="glass-card rounded-xl px-6 py-2 font-medium text-gray-800 hover:neon-soft transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {saving ? 'Saving...' : 'Save Form'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-screen relative z-10 pt-20">
        {/* Left Sidebar - Field Library */}
        {!previewMode && (
          <div className="w-80 glass-soft border-r border-white/10 flex flex-col">
            <FormBuilderToolbar onAddField={handleAddField} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Form Builder Canvas */}
          <div className="flex-1 overflow-auto">
            {previewMode ? (
              <FormPreview form={form} />
            ) : (
              <FormBuilderCanvas
                form={form}
                onFormUpdate={handleFormUpdate}
                onFieldSelect={setSelectedField}
                onFieldUpdate={handleUpdateField}
                onFieldDelete={handleDeleteField}
                onFieldReorder={handleReorderFields}
                selectedField={selectedField}
              />
            )}
          </div>

          {/* Right Sidebar - Field Configuration */}
          {selectedField && !previewMode && (
            <div className="w-80 glass-soft border-l border-white/10">
              <FieldConfigPanel
                field={selectedField}
                onUpdate={(updates) => handleUpdateField(selectedField.id, updates)}
                onDelete={() => handleDeleteField(selectedField.id)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        open={errorModal.open}
        onClose={() => {
          setErrorModal({ open: false, error: '', title: 'Error' });
          if (errorModal.title === 'Success') {
            navigate('/admin-dashboard', { state: { activeMenu: 'Forms' } });
          }
        }}
        error={errorModal.error}
        title={errorModal.title}
        showRetry={errorModal.title === 'Form Creation Error'}
        onRetry={errorModal.title === 'Form Creation Error' ? handleSaveForm : undefined}
      />
    </div>
  );
};

export default FormBuilderScreen; 