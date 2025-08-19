import { useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import FieldEditor from './FieldEditor';

const FormCanvas = ({ form, onUpdateField, onDeleteField, onReorderFields, onAddField, onClearFields }) => {
  const [selectedField, setSelectedField] = useState(null);

  const [{ isOver }, drop] = useDrop({
    accept: ['field', 'formField'],
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        if (item.type) {
          // New field from sidebar
          onAddField(item.type);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleFieldClick = (field) => {
    setSelectedField(field);
  };

  const handleFieldUpdate = (updates) => {
    if (selectedField) {
      onUpdateField(selectedField.id, updates);
      setSelectedField({ ...selectedField, ...updates });
    }
  };

  const DraggableFormField = ({ field, index }) => {
    const isSelected = selectedField?.id === field.id;

    const [{ isDragging }, drag] = useDrag({
      type: 'formField',
      item: { id: field.id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: 'formField',
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          onReorderFields(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });

    return (
      <div
        ref={(node) => drag(drop(node))}
        onClick={() => handleFieldClick(field)}
        className={`group relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
          isSelected
            ? 'border-indigo-500 bg-indigo-50 shadow-md'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
        } ${isDragging ? 'opacity-50' : ''}`}
      >
        {/* Drag Handle */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>

        {/* Delete Button */}
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteField(field.id);
              if (selectedField?.id === field.id) {
                setSelectedField(null);
              }
            }}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2 ml-6 mr-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </span>
            <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">{field.type}</span>
          </div>
          
          {field.type === 'text' && (
            <input
              type="text"
              placeholder={field.placeholder}
              className="input"
              disabled
            />
          )}
          
          {field.type === 'email' && (
            <input
              type="email"
              placeholder={field.placeholder}
              className="input"
              disabled
            />
          )}
          
          {field.type === 'number' && (
            <input
              type="number"
              placeholder={field.placeholder}
              className="input"
              disabled
            />
          )}
          
          {field.type === 'tel' && (
            <input
              type="tel"
              placeholder={field.placeholder}
              className="input"
              disabled
            />
          )}
          
          {field.type === 'url' && (
            <input
              type="url"
              placeholder={field.placeholder}
              className="input"
              disabled
            />
          )}
          
          {field.type === 'textarea' && (
            <textarea
              placeholder={field.placeholder}
              className="textarea"
              rows={3}
              disabled
            />
          )}
          
          {field.type === 'select' && (
            <select className="select" disabled>
              <option>{field.placeholder || 'Select an option'}</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          
          {field.type === 'radio' && (
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={field.id}
                    value={option.value}
                    className="text-primary-600"
                    disabled
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}
          
          {field.type === 'checkbox' && (
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={option.value}
                    className="text-primary-600"
                    disabled
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}
          
          {field.type === 'file' && (
            <input
              type="file"
              className="input"
              disabled
            />
          )}
          
          {field.type === 'date' && (
            <input
              type="date"
              className="input"
              disabled
            />
          )}

          {/* Field Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <span>{field.required ? 'Required' : 'Optional'}</span>
            {field.validation && (
              <span>
                {field.validation.minLength && `Min: ${field.validation.minLength}`}
                {field.validation.maxLength && ` Max: ${field.validation.maxLength}`}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DropZone = ({ index, isLast = false }) => {
    const [{ isOver }, drop] = useDrop({
      accept: 'field',
      drop: (item) => {
        if (item.type) {
          onAddField(item.type, index);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <div
        ref={drop}
        className={`h-2 transition-all duration-200 ${
          isOver ? 'h-8 bg-indigo-100 border-2 border-dashed border-indigo-400 rounded-lg' : ''
        } ${isLast ? 'h-4' : ''}`}
      >
        {isOver && (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-indigo-600 font-medium">Drop field here</span>
          </div>
        )}
      </div>
    );
  };

  const renderField = (field, index) => {
    return (
      <div key={field.id}>
        <DropZone index={index} />
        <DraggableFormField field={field} index={index} />
        {index === form.fields.length - 1 && <DropZone index={index + 1} isLast />}
      </div>
    );
  };

  return (
    <div className="flex-1 flex">
      {/* Form Canvas */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white border rounded-lg shadow-sm">
            {/* Form Header */}
            <div className="px-6 py-4 border-b bg-gray-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-600">Form Preview</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Page 1</span>
                  <button
                    onClick={onClearFields}
                    className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-100"
                  >
                    Clear All Fields
                  </button>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div
              ref={drop}
              className={`p-6 min-h-96 ${
                isOver ? 'bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-b-lg' : ''
              }`}
            >
              {/* Form Fields */}
              {form.fields.length === 0 ? (
                <div className={`text-center py-20 border-2 border-dashed rounded-xl transition-all duration-200 ${
                  isOver
                    ? 'border-indigo-400 bg-indigo-50'
                    : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100'
                }`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-200 ${
                    isOver ? 'bg-indigo-200' : 'bg-indigo-100'
                  }`}>
                    <Plus className={`h-8 w-8 transition-all duration-200 ${
                      isOver ? 'text-indigo-700' : 'text-indigo-600'
                    }`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {isOver ? 'Drop field here' : 'Start building your form'}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Drag and drop form elements from the left sidebar to get started building your custom form
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {form.fields
                    .sort((a, b) => a.order - b.order)
                    .map((field, index) => renderField(field, index))}
                </div>
              )}

              {/* Submit Button Preview */}
              {form.fields.length > 0 && (
                <div className="pt-8 border-t border-gray-200 mt-8">
                  <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 font-medium shadow-sm" disabled>
                    {form.settings.submitButtonText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Field Settings Sidebar */}
      <div className="w-80 bg-white border-l overflow-y-auto">
        {selectedField ? (
          <FieldEditor
            field={selectedField}
            onUpdate={handleFieldUpdate}
            onDelete={() => {
              onDeleteField(selectedField.id);
              setSelectedField(null);
            }}
            onClose={() => setSelectedField(null)}
          />
        ) : (
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Field Settings</h3>
                <p className="text-sm text-gray-500">Configure the selected field</p>
              </div>
            </div>

            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No field selected</h4>
              <p className="text-gray-600 text-sm">
                Select a field from the canvas to configure its settings and properties
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCanvas;
