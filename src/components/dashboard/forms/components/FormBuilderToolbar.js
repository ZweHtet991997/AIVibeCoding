import React from 'react';

const FormBuilderToolbar = ({ onAddField }) => {
  const fieldTypes = [
    {
      type: 'text',
      label: 'Text Input',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      description: 'Single line text input'
    },
    {
      type: 'email',
      label: 'Email Input',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      description: 'Email address input with validation'
    },
    {
      type: 'number',
      label: 'Number Input',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
      description: 'Numeric input with min/max values'
    },
    {
      type: 'textarea',
      label: 'Text Area',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      description: 'Multi-line text input'
    },
    {
      type: 'select',
      label: 'Dropdown',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
      ),
      description: 'Select from predefined options'
    },
    {
      type: 'radio',
      label: 'Radio Buttons',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Single choice from options'
    },
    {
      type: 'checkbox',
      label: 'Checkboxes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Multiple choice from options'
    },
    {
      type: 'date',
      label: 'Date Picker',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      description: 'Date selection input'
    },
    {
      type: 'file',
      label: 'File Upload',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
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
      <div className="px-6 py-3 border-b border-white/10">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Field Library</h2>
        <p className="text-gray-600 text-sm">
          Drag fields to the canvas or click to add
        </p>
      </div>

      {/* Field Types */}
      <div className="flex-1 overflow-y-auto px-6 py-3">
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
    </div>
  );
};

export default FormBuilderToolbar; 