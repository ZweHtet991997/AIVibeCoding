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
      <div className="border-b border-white/10 py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div>
            <div>
              <input
                type="text"
                value={form.name}
                onChange={(e) => onFormUpdate({ name: e.target.value })}
                placeholder="Form Name"
                className="bg-transparent w-full px-4 py-1 text-2xl font-semibold text-gray-800 placeholder-gray-400 rounded-xl focus:outline-none focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <input
                value={form.description}
                onChange={(e) => onFormUpdate({ description: e.target.value })}
                placeholder="Description"
                rows={2}
                className="bg-transparent w-full px-4 py-1 text-md text-gray-600 placeholder-gray-400 rounded-xl focus:outline-none focus:border-transparent resize-none transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields Canvas */}
      <div className="flex-1 overflow-y-auto px-6 py-1">
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
                    <span className="mr-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </span>
                    Text Input
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <span className="mr-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </span>
                    Email
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <span className="mr-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                     </svg>
                    </span>
                    Dropdown
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <span className="mr-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                     </svg>
                    </span>
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
        </div>
      </div>
    </div>
  );
};

export default FormBuilderCanvas; 