import React, { useState } from 'react';
import FormFieldCard from './FormFieldCard';

const FormBuilderCanvas = ({
  form,
  onFormUpdate,
  onFieldSelect,
  onFieldUpdate,
  onFieldDelete,
  onFieldReorder,
  selectedField
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const fieldType = e.dataTransfer.getData('fieldType');
    if (fieldType) {
      // Add new field at the end
      const newField = {
        id: `field_${Date.now()}`,
        type: fieldType,
        label: `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
        placeholder: '',
        required: false,
        helpText: ''
      };

      // Add field-specific properties
      switch (fieldType) {
        case 'select':
        case 'radio':
        case 'checkbox':
          newField.options = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
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

      onFormUpdate({
        fields: [...form.fields, newField]
      });
      onFieldSelect(newField);
    }
  };

  const handleFieldReorder = (fromIndex, toIndex) => {
    onFieldReorder(fromIndex, toIndex);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Form Header Configuration */}
      <div className="glass-soft border-b border-white/10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => onFormUpdate({ name: e.target.value })}
                placeholder="Enter form name"
                className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => onFormUpdate({ description: e.target.value })}
                placeholder="Enter form description (optional)"
                rows={3}
                className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields Canvas */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Drop Zone */}
          <div
            className={`min-h-[200px] border-2 border-dashed rounded-2xl transition-all duration-300 ${
              dragOver
                ? 'border-blue-400 bg-blue-50/50 glass-card'
                : 'border-gray-300/50 glass-soft'
            } ${
              form.fields.length === 0 ? 'flex items-center justify-center' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {form.fields.length === 0 ? (
              <div className="text-center p-8">
                <div className="text-6xl mb-6 animate-bounce">📋</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Start Building Your Form
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Drag fields from the left sidebar or click on them to add
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <span className="mr-2">📝</span>
                    Text Input
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <span className="mr-2">📧</span>
                    Email
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <span className="mr-2">📋</span>
                    Dropdown
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <span className="mr-2">📅</span>
                    Date
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {form.fields.map((field, index) => (
                  <FormFieldCard
                    key={field.id}
                    field={field}
                    index={index}
                    isSelected={selectedField?.id === field.id}
                    onSelect={() => onFieldSelect(field)}
                    onUpdate={(updates) => onFieldUpdate(field.id, updates)}
                    onDelete={() => onFieldDelete(field.id)}
                    onReorder={handleFieldReorder}
                    totalFields={form.fields.length}
                  />
                ))}
                
                {/* Drop indicator */}
                {dragOver && (
                  <div className="glass-card border-2 border-dashed border-blue-400 rounded-xl p-4 text-center text-blue-600">
                    Drop field here
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Stats */}
          {form.fields.length > 0 && (
            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  📊 {form.fields.length} field{form.fields.length !== 1 ? 's' : ''} • 
                  {form.fields.filter(f => f.required).length} required
                </span>
                <span>
                  💾 Form will be saved as JSON
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilderCanvas; 