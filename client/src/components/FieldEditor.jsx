import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const FieldEditor = ({ field, onUpdate, onDelete, onClose }) => {
  const [localField, setLocalField] = useState(field);

  const handleChange = (key, value) => {
    const updated = { ...localField, [key]: value };
    setLocalField(updated);
    onUpdate({ [key]: value });
  };

  const handleValidationChange = (key, value) => {
    const validation = { ...localField.validation, [key]: value };
    const updated = { ...localField, validation };
    setLocalField(updated);
    onUpdate({ validation });
  };

  const handleOptionChange = (index, key, value) => {
    const options = [...(localField.options || [])];
    options[index] = { ...options[index], [key]: value };
    const updated = { ...localField, options };
    setLocalField(updated);
    onUpdate({ options });
  };

  const addOption = () => {
    const options = [...(localField.options || [])];
    options.push({ label: `Option ${options.length + 1}`, value: `option${options.length + 1}` });
    const updated = { ...localField, options };
    setLocalField(updated);
    onUpdate({ options });
  };

  const removeOption = (index) => {
    const options = [...(localField.options || [])];
    options.splice(index, 1);
    const updated = { ...localField, options };
    setLocalField(updated);
    onUpdate({ options });
  };

  const hasOptions = ['select', 'radio', 'checkbox'].includes(localField.type);
  const hasValidation = ['text', 'textarea', 'number', 'email', 'url', 'tel'].includes(localField.type);
  const hasMinMax = ['number', 'date'].includes(localField.type);
  const hasFileValidation = localField.type === 'file';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Field Settings</h3>
            <p className="text-sm text-gray-500">Configure field properties</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="h-4 w-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            General Settings
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field Label
              </label>
              <input
                type="text"
                value={localField.label}
                onChange={(e) => handleChange('label', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                placeholder="Full Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Placeholder Text
              </label>
              <input
                type="text"
                value={localField.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Help Text
              </label>
              <textarea
                value={localField.helpText || ''}
                onChange={(e) => handleChange('helpText', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white resize-none"
                rows={3}
                placeholder="Add a help text for this field"
              />
            </div>

            <div className="flex items-center bg-white p-3 rounded-xl border border-gray-300">
              <input
                type="checkbox"
                id="required"
                checked={localField.required}
                onChange={(e) => handleChange('required', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="required" className="ml-3 text-sm font-medium text-gray-700">
                Required field
              </label>
            </div>
          </div>
        </div>

        {/* Options for select, radio, checkbox */}
        {hasOptions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {(localField.options || []).map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                    className="input flex-1"
                    placeholder="Option label"
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                    className="input flex-1"
                    placeholder="Option value"
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="btn-ghost btn-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addOption}
                className="btn-outline btn-sm w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </button>
            </div>
          </div>
        )}

        {/* Validation */}
        {hasValidation && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="h-4 w-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Validation
            </h4>

            <div className="space-y-4">
              <div className="flex items-center bg-white p-3 rounded-xl border border-gray-300">
                <input
                  type="checkbox"
                  id="required-email"
                  checked={localField.validation?.required || false}
                  onChange={(e) => handleValidationChange('required', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="required-email" className="ml-3 text-sm font-medium text-gray-700">
                  Required field
                </label>
              </div>

              {(localField.type === 'text' || localField.type === 'textarea' || localField.type === 'email' || localField.type === 'url' || localField.type === 'tel') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Length
                    </label>
                    <input
                      type="number"
                      value={localField.validation?.minLength || ''}
                      onChange={(e) => handleValidationChange('minLength', parseInt(e.target.value) || undefined)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Length
                    </label>
                    <input
                      type="number"
                      value={localField.validation?.maxLength || ''}
                      onChange={(e) => handleValidationChange('maxLength', parseInt(e.target.value) || undefined)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                      placeholder="100"
                      min="0"
                    />
                  </div>
                </>
              )}

              {hasMinMax && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {localField.type === 'number' ? 'Minimum Value' : 'Minimum Date'}
                    </label>
                    <input
                      type={localField.type === 'number' ? 'number' : 'date'}
                      value={localField.validation?.min || ''}
                      onChange={(e) => handleValidationChange('min', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {localField.type === 'number' ? 'Maximum Value' : 'Maximum Date'}
                    </label>
                    <input
                      type={localField.type === 'number' ? 'number' : 'date'}
                      value={localField.validation?.max || ''}
                      onChange={(e) => handleValidationChange('max', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    />
                  </div>
                </>
              )}

              {localField.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pattern (Regular Expression)
                  </label>
                  <input
                    type="text"
                    value={localField.validation?.pattern || ''}
                    onChange={(e) => handleValidationChange('pattern', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    placeholder="^[A-Za-z]+$"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use regular expressions to validate input format
                  </p>
                </div>
              )}

              {hasMinMax && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {localField.type === 'number' ? 'Minimum Value' : 'Minimum Date'}
                    </label>
                    <input
                      type={localField.type === 'number' ? 'number' : 'date'}
                      value={localField.validation?.min || ''}
                      onChange={(e) => handleValidationChange('min', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {localField.type === 'number' ? 'Maximum Value' : 'Maximum Date'}
                    </label>
                    <input
                      type={localField.type === 'number' ? 'number' : 'date'}
                      value={localField.validation?.max || ''}
                      onChange={(e) => handleValidationChange('max', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    />
                  </div>
                </>
              )}

              {hasFileValidation && (
                <>
                  <div className="flex items-center bg-white p-3 rounded-xl border border-gray-300">
                    <input
                      type="checkbox"
                      id="allowMultiple"
                      checked={localField.validation?.allowMultiple || false}
                      onChange={(e) => handleValidationChange('allowMultiple', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allowMultiple" className="ml-3 text-sm font-medium text-gray-700">
                      Allow multiple files
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allowed File Types
                    </label>
                    <input
                      type="text"
                      value={localField.validation?.allowedTypes || ''}
                      onChange={(e) => handleValidationChange('allowedTypes', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                      placeholder=".pdf,.doc,.docx,.jpg,.png"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Comma-separated file extensions (e.g., .pdf,.doc,.jpg)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum File Size (MB)
                    </label>
                    <input
                      type="number"
                      value={localField.validation?.maxFileSize || ''}
                      onChange={(e) => handleValidationChange('maxFileSize', parseInt(e.target.value) || undefined)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                      placeholder="10"
                      min="1"
                      max="100"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="h-4 w-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Advanced Settings
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field ID
              </label>
              <input
                type="text"
                value={localField.id || ''}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-500"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CSS Classes
              </label>
              <input
                type="text"
                value={localField.cssClasses || ''}
                onChange={(e) => handleChange('cssClasses', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                placeholder="Add custom CSS classes"
              />
            </div>

            <div className="flex items-center bg-white p-3 rounded-xl border border-gray-300">
              <input
                type="checkbox"
                id="visible"
                checked={localField.visible !== false}
                onChange={(e) => handleChange('visible', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="visible" className="ml-3 text-sm font-medium text-gray-700">
                Visible
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-200 space-y-4">
          <div className="flex space-x-3">
            <button className="flex-1 px-4 py-3 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="flex-1 px-4 py-3 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
              Save Form
            </button>
          </div>

          <button
            onClick={onDelete}
            className="w-full px-4 py-3 text-sm font-medium text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Field
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldEditor;
