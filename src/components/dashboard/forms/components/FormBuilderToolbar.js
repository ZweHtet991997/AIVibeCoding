import React from 'react';

const FormBuilderToolbar = ({ onAddField }) => {
  const fieldTypes = [
    {
      type: 'text',
      label: 'Text Input',
      icon: '📝',
      description: 'Single line text input'
    },
    {
      type: 'email',
      label: 'Email Input',
      icon: '📧',
      description: 'Email address input with validation'
    },
    {
      type: 'number',
      label: 'Number Input',
      icon: '🔢',
      description: 'Numeric input with min/max values'
    },
    {
      type: 'textarea',
      label: 'Text Area',
      icon: '📄',
      description: 'Multi-line text input'
    },
    {
      type: 'select',
      label: 'Dropdown',
      icon: '📋',
      description: 'Select from predefined options'
    },
    {
      type: 'radio',
      label: 'Radio Buttons',
      icon: '🔘',
      description: 'Single choice from options'
    },
    {
      type: 'checkbox',
      label: 'Checkboxes',
      icon: '☑️',
      description: 'Multiple choice from options'
    },
    {
      type: 'date',
      label: 'Date Picker',
      icon: '📅',
      description: 'Date selection input'
    },
    {
      type: 'file',
      label: 'File Upload',
      icon: '📁',
      description: 'File upload with type restrictions'
    }
  ];

  const handleDragStart = (e, fieldType) => {
    e.dataTransfer.setData('fieldType', fieldType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClick = (fieldType) => {
    onAddField(fieldType);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Field Library</h2>
        <p className="text-gray-600">
          Drag fields to the canvas or click to add
        </p>
      </div>

      {/* Field Types */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {fieldTypes.map((field) => (
            <div
              key={field.type}
              draggable
              onDragStart={(e) => handleDragStart(e, field.type)}
              onClick={() => handleClick(field.type)}
              className="group cursor-pointer glass-card rounded-xl p-4 hover:neon-soft transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{field.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                    {field.label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {field.description}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 glass-soft">
        <div className="text-sm text-gray-600 text-center">
          <p>💡 Tip: Drag fields to reorder them</p>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderToolbar; 