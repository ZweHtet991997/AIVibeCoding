import React, { useState } from 'react';

const FieldConfigPanel = ({ field, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState('basic');

  // Add debugging
  console.log('FieldConfigPanel received field:', field);

  const handleInputChange = (key, value) => {
    console.log('FieldConfigPanel updating:', key, value);
    onUpdate({ [key]: value });
  };

  const handleOptionChange = (index, key, value) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = { ...newOptions[index], [key]: value };
    console.log('Updating options:', newOptions);
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(field.options || []), { value: '' }];
    console.log('Adding option:', newOptions);
    onUpdate({ options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = (field.options || []).filter((_, i) => i !== index);
    console.log('Removing option:', newOptions);
    onUpdate({ options: newOptions });
  };

  const renderBasicSettings = () => (
    <div className="space-y-4">
      {/* Field Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Field Label *
        </label>
        <input
          type="text"
          value={field.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
          placeholder="Enter field label"
        />
      </div>

      {/* Field Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Field Type
        </label>
        <div className="text-sm text-gray-600  px-4 py-3 rounded-xl">
          {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
        </div>
      </div>

      {/* Required Field */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="required"
          checked={field.required || false}
          onChange={(e) => handleInputChange('required', e.target.checked)}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-300"
        />
        <label htmlFor="required" className="ml-3 block text-sm text-gray-700">
          Required field
        </label>
      </div>

      {/* Placeholder Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Placeholder Text
        </label>
        <input
          type="text"
          value={field.placeholder || ''}
          onChange={(e) => handleInputChange('placeholder', e.target.value)}
          className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
          placeholder="Enter placeholder text"
        />
      </div>

      {/* Help Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Help Text
        </label>
        <textarea
          value={field.helpText || ''}
          onChange={(e) => handleInputChange('helpText', e.target.value)}
          rows={3}
          className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 resize-vertical transition-all duration-300"
          placeholder="Enter help text for users"
        />
      </div>
    </div>
  );

  const renderValidationSettings = () => {
    switch (field.type) {
      case 'number':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Value
                </label>
                <input
                  type="number"
                  value={field.min !== undefined ? field.min : ''}
                  onChange={(e) => handleInputChange('min', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Value
                </label>
                <input
                  type="number"
                  value={field.max !== undefined ? field.max : ''}
                  onChange={(e) => handleInputChange('max', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max value"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Step Value
              </label>
              <input
                type="number"
                value={field.step !== undefined ? field.step : 1}
                onChange={(e) => handleInputChange('step', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0.1"
                step="0.1"
              />
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Date
              </label>
              <input
                type="date"
                value={field.minDate || ''}
                onChange={(e) => handleInputChange('minDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Date
              </label>
              <input
                type="date"
                value={field.maxDate || ''}
                onChange={(e) => handleInputChange('maxDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accepted File Types
              </label>
              <input
                type="text"
                value={field.accept || ''}
                onChange={(e) => handleInputChange('accept', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=".pdf,.doc,.docx"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: .pdf,.doc,.docx,.jpg,.png
              </p>
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Rows
            </label>
                          <input
                type="number"
                value={field.rows !== undefined ? field.rows : 3}
                onChange={(e) => handleInputChange('rows', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="20"
              />
          </div>
        );

      default:
        return (
          <div className="text-gray-500 text-sm">
            No additional validation settings for this field type.
          </div>
        );
    }
  };

  const renderOptionsSettings = () => {
    if (!['select', 'radio', 'checkbox'].includes(field.type)) {
      return (
        <div className="text-gray-500 text-sm">
          This field type doesn't support options.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">Options</h4>
          <button
            onClick={addOption}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Option
          </button>
        </div>
        
        <div className="space-y-3">
          {(field.options || []).map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={option.value || ''}
                  onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                  placeholder="Enter option value"
                  className="glass-input w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
              </div>
              <button
                onClick={() => removeOption(index)}
                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-300"
                title="Remove option"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        {(!field.options || field.options.length === 0) && (
          <div className="text-gray-400 text-sm italic">
            No options added yet. Click "Add Option" to get started.
          </div>
        )}
      </div>
    );
  };

  // Safety check
  if (!field) {
    return (
      <div className="h-full flex flex-col">
        <div className="glass-soft border-b border-white/10 p-6">
          <h2 className="text-xl font-semibold text-gray-800">Field Settings</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">No field selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className=" px-6 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Field Settings</h2>
          <button
            onClick={onDelete}
            className="glass-button rounded-lg p-2 text-red-500 hover:text-red-700 hover:neon-soft transition-all duration-300"
            title="Delete field"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 mt-2">
          Configure {field.label || 'this field'}
        </p>
      </div>

      {/* Tabs */}
      <div>
        <nav className="flex space-x-8 px-6">
          {['basic', 'validation', 'options'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'basic' && renderBasicSettings()}
        {activeTab === 'validation' && renderValidationSettings()}
        {activeTab === 'options' && renderOptionsSettings()}
      </div>
    </div>
  );
};

export default FieldConfigPanel; 