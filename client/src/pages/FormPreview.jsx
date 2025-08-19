import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { formService } from '../services/formService';

const FormPreview = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const response = await formService.getForm(id);
      setForm(response.data);
    } catch (error) {
      toast.error('Failed to load form');
      console.error('Error fetching form:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      // Create FormData for file uploads
      const formData = new FormData();

      // Add regular form data
      Object.keys(data).forEach(key => {
        const value = data[key];
        if (value instanceof FileList) {
          // Handle file inputs
          Array.from(value).forEach(file => {
            formData.append('files', file);
          });
        } else if (Array.isArray(value)) {
          // Handle checkbox arrays
          value.forEach(item => {
            formData.append(key, item);
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await formService.submitForm(id, formData);

      // Show success modal
      setShowSuccessModal(true);
      setSubmitted(true);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit form');
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field) => {
    const fieldProps = {
      ...register(field.id, {
        required: field.required ? `${field.label} is required` : false,
        minLength: field.validation?.minLength ? {
          value: field.validation.minLength,
          message: `Minimum length is ${field.validation.minLength}`
        } : undefined,
        maxLength: field.validation?.maxLength ? {
          value: field.validation.maxLength,
          message: `Maximum length is ${field.validation.maxLength}`
        } : undefined,
        min: field.validation?.min ? {
          value: field.validation.min,
          message: `Minimum value is ${field.validation.min}`
        } : undefined,
        max: field.validation?.max ? {
          value: field.validation.max,
          message: `Maximum value is ${field.validation.max}`
        } : undefined,
        pattern: field.validation?.pattern ? {
          value: new RegExp(field.validation.pattern),
          message: 'Invalid format'
        } : undefined
      })
    };

    return (
      <div key={field.id} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {field.type === 'text' && (
          <input
            type="text"
            placeholder={field.placeholder}
            className={`input ${errors[field.id] ? 'border-red-500' : ''}`}
            {...fieldProps}
          />
        )}
        
        {field.type === 'email' && (
          <input
            type="email"
            placeholder={field.placeholder}
            className={`input ${errors[field.id] ? 'border-red-500' : ''}`}
            {...fieldProps}
          />
        )}
        
        {field.type === 'number' && (
          <input
            type="number"
            placeholder={field.placeholder}
            className={`input ${errors[field.id] ? 'border-red-500' : ''}`}
            {...fieldProps}
          />
        )}
        
        {field.type === 'tel' && (
          <input
            type="tel"
            placeholder={field.placeholder}
            className={`input ${errors[field.id] ? 'border-red-500' : ''}`}
            {...fieldProps}
          />
        )}
        
        {field.type === 'url' && (
          <input
            type="url"
            placeholder={field.placeholder}
            className={`input ${errors[field.id] ? 'border-red-500' : ''}`}
            {...fieldProps}
          />
        )}
        
        {field.type === 'textarea' && (
          <textarea
            placeholder={field.placeholder}
            className={`textarea ${errors[field.id] ? 'border-red-500' : ''}`}
            rows={3}
            {...fieldProps}
          />
        )}
        
        {field.type === 'select' && (
          <select
            className={`select ${errors[field.id] ? 'border-red-500' : ''}`}
            {...fieldProps}
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
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
                  value={option.value}
                  className="text-primary-600"
                  {...fieldProps}
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
                  {...register(field.id)}
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
        
        {field.type === 'file' && (
          <div>
            <input
              type="file"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm ${errors[field.id] ? 'border-red-500' : ''}`}
              multiple={field.validation?.allowMultiple}
              accept={field.validation?.allowedTypes}
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false,
                validate: (files) => {
                  if (!files || files.length === 0) return true;

                  const fileArray = Array.from(files);

                  // Check file size
                  if (field.validation?.maxFileSize) {
                    const maxSize = field.validation.maxFileSize * 1024 * 1024; // Convert MB to bytes
                    for (let file of fileArray) {
                      if (file.size > maxSize) {
                        return `File size must be less than ${field.validation.maxFileSize}MB`;
                      }
                    }
                  }

                  // Check file types
                  if (field.validation?.allowedTypes) {
                    const allowedTypes = field.validation.allowedTypes.split(',').map(type => type.trim());
                    for (let file of fileArray) {
                      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                      if (!allowedTypes.includes(fileExtension)) {
                        return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
                      }
                    }
                  }

                  return true;
                }
              })}
            />
            {field.validation?.allowedTypes && (
              <p className="text-xs text-gray-500 mt-1">
                Allowed types: {field.validation.allowedTypes}
              </p>
            )}
            {field.validation?.maxFileSize && (
              <p className="text-xs text-gray-500 mt-1">
                Maximum file size: {field.validation.maxFileSize}MB
              </p>
            )}
          </div>
        )}
        
        {field.type === 'date' && (
          <input
            type="date"
            className={`input ${errors[field.id] ? 'border-red-500' : ''}`}
            {...fieldProps}
          />
        )}
        
        {errors[field.id] && (
          <p className="text-sm text-red-600">{errors[field.id].message}</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Form not found</h2>
        <p className="text-gray-600">The form you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  if (form.status !== 'published') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Form not available</h2>
        <p className="text-gray-600">This form is not currently accepting submissions.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
          <p className="text-gray-600">{form.settings.successMessage}</p>
          {form.settings.allowMultipleSubmissions && (
            <button
              onClick={() => setSubmitted(false)}
              className="btn-primary mt-6"
            >
              Submit Another Response
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">{form.title}</h1>
          {form.description && (
            <p className="card-description">{form.description}</p>
          )}
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="card-content space-y-6">
          {form.fields
            .sort((a, b) => a.order - b.order)
            .map(renderField)}
          
          <div className="pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[120px]"
              style={{ backgroundColor: form.settings?.themeColor || '#3b82f6' }}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                form.settings?.submitButtonText || 'Submit'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
              <p className="text-gray-600 mb-6">
                {form.settings?.successMessage || 'Your form has been submitted successfully.'}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setSubmitted(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Submit Another
                </button>
                <button
                  onClick={() => {
                    window.location.href = '/';
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPreview;
