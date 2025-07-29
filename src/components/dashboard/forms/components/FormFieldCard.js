import React, { useState } from 'react';

const FormFieldCard = ({
  field,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onReorder,
  totalFields
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('fieldIndex', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('fieldIndex'));
    const toIndex = index;
    
    if (fromIndex !== toIndex) {
      onReorder(fromIndex, toIndex);
    }
  };

  const getFieldIcon = (type) => {
    const icons = {
      text: '📝',
      email: '📧',
      number: '🔢',
      textarea: '📄',
      select: '📋',
      radio: '🔘',
      checkbox: '☑️',
      date: '📅',
      file: '📁'
    };
    return icons[type] || '📝';
  };

  const renderFieldPreview = () => {
    const commonProps = {
      className: "w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm",
      disabled: true
    };

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            {...commonProps}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            placeholder={field.placeholder || "Enter number"}
            min={field.min}
            max={field.max}
            step={field.step}
            {...commonProps}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            rows={field.rows || 3}
            className={`${commonProps.className} resize-none`}
            disabled={true}
          />
        );
      
      case 'select':
        return (
          <select {...commonProps}>
            <option>Select an option</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.slice(0, 2).map((option, idx) => (
              <label key={idx} className="flex items-center text-sm text-gray-500">
                <input
                  type="radio"
                  disabled={true}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
            {field.options?.length > 2 && (
              <span className="text-xs text-gray-400">
                +{field.options.length - 2} more options
              </span>
            )}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.slice(0, 2).map((option, idx) => (
              <label key={idx} className="flex items-center text-sm text-gray-500">
                <input
                  type="checkbox"
                  disabled={true}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
            {field.options?.length > 2 && (
              <span className="text-xs text-gray-400">
                +{field.options.length - 2} more options
              </span>
            )}
          </div>
        );
      
      case 'date':
        return (
          <input
            type="date"
            placeholder="Select date"
            className={commonProps.className}
            disabled={true}
          />
        );
      
      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <div className="text-gray-400 text-sm">
              📁 Click to upload files
            </div>
          </div>
        );
      
      default:
        return (
          <input
            type="text"
            placeholder="Field preview"
            {...commonProps}
          />
        );
    }
  };

  return (
    <div
      className={`group relative glass-card border-2 rounded-xl p-6 transition-all duration-300 ${
        isSelected
          ? 'border-blue-500 neon-soft'
          : 'border-gray-200/50 hover:border-gray-300 hover:neon-soft'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={onSelect}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag Handle */}
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 glass-soft rounded-lg flex items-center justify-center cursor-move">
          <div className="w-4 h-4 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-gray-400 rounded"></div>
            <div className="w-full h-0.5 bg-gray-400 rounded"></div>
            <div className="w-full h-0.5 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>

      {/* Field Header */}
      <div className="flex items-center justify-between mb-4 pl-12">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getFieldIcon(field.type)}</span>
          <div>
            <h3 className="font-semibold text-gray-800">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {field.type} field
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="glass-button rounded-lg p-2 text-red-500 hover:text-red-700 hover:neon-soft transition-all duration-300"
            title="Delete field"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Field Preview */}
      <div className="pl-12">
        {renderFieldPreview()}
        
        {/* Help Text */}
        {field.helpText && (
          <p className="text-sm text-gray-600 mt-3 italic">
            💡 {field.helpText}
          </p>
        )}
      </div>

      {/* Field Properties Summary */}
      <div className="mt-4 pl-12">
        <div className="flex flex-wrap gap-2 text-xs">
          {field.required && (
            <span className="glass-soft text-red-600 px-3 py-1 rounded-full">
              Required
            </span>
          )}
          {field.placeholder && (
            <span className="glass-soft text-blue-600 px-3 py-1 rounded-full">
              Has placeholder
            </span>
          )}
          {field.helpText && (
            <span className="glass-soft text-green-600 px-3 py-1 rounded-full">
              Has help text
            </span>
          )}
          {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && field.options && (
            <span className="glass-soft text-purple-600 px-3 py-1 rounded-full">
              {field.options.length} options
            </span>
          )}
          {field.type === 'number' && (field.min !== undefined || field.max !== undefined) && (
            <span className="glass-soft text-orange-600 px-3 py-1 rounded-full">
              Min: {field.min || 'none'}, Max: {field.max || 'none'}
            </span>
          )}
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[24px] border-l-transparent border-t-[24px] border-t-blue-500"></div>
      )}
    </div>
  );
};

export default FormFieldCard; 