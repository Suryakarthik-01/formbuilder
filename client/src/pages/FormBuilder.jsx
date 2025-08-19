import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import Sidebar from '../components/Sidebar';
import FormCanvas from '../components/FormCanvas';
import FormSettings from '../components/FormSettings';
import FormPreviewComponent from '../components/FormPreviewComponent';
import { formService } from '../services/formService';

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: 'Untitled Form',
    description: '',
    fields: [],
    settings: {
      allowMultipleSubmissions: true,
      requireAuth: false,
      isPublic: true,
      submitButtonText: 'Submit',
      successMessage: 'Thank you for your submission!'
    },
    status: 'draft'
  });

  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchForm();
    }
  }, [id, isEditing]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveForm();
            break;
          case 'p':
            e.preventDefault();
            setShowPreview(true);
            break;
          case ',':
            e.preventDefault();
            setShowSettings(true);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const response = await formService.getForm(id);
      setForm(response.data);
    } catch (error) {
      toast.error('Failed to load form');
      console.error('Error fetching form:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const generateFieldId = () => {
    return `field_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  };

  const addField = (fieldType, insertIndex = null) => {
    const newField = {
      id: generateFieldId(),
      type: fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: '',
      required: false,
      options: fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox'
        ? [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' }
          ]
        : undefined,
      validation: {},
      order: insertIndex !== null ? insertIndex : form.fields.length
    };

    setForm(prev => {
      const newFields = [...prev.fields];

      if (insertIndex !== null && insertIndex < newFields.length) {
        // Insert at specific position
        newFields.splice(insertIndex, 0, newField);
        // Update order for all fields after insertion point
        newFields.forEach((field, index) => {
          field.order = index;
        });
      } else {
        // Add to end
        newFields.push(newField);
      }

      return {
        ...prev,
        fields: newFields
      };
    });
  };

  const updateField = (fieldId, updates) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const deleteField = (fieldId) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const reorderFields = (dragIndex, hoverIndex) => {
    const draggedField = form.fields[dragIndex];
    const newFields = [...form.fields];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, draggedField);

    // Update order property
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      order: index
    }));

    setForm(prev => ({
      ...prev,
      fields: updatedFields
    }));
  };

  const clearAllFields = () => {
    if (form.fields.length > 0 && window.confirm('Are you sure you want to clear all fields? This action cannot be undone.')) {
      setForm(prev => ({
        ...prev,
        fields: []
      }));
      toast.success('All fields cleared');
    }
  };



  const saveForm = async () => {
    try {
      if (isEditing) {
        await formService.updateForm(id, form);
        toast.success('Form saved successfully');
      } else {
        const response = await formService.createForm(form);
        navigate(`/forms/${response.data._id}/edit`);
        toast.success('Form saved as draft');
      }
    } catch (error) {
      toast.error('Failed to save form');
      console.error('Error saving form:', error);
    }
  };

  const publishForm = async () => {
    try {
      const updatedForm = { ...form, status: 'published' };

      if (isEditing) {
        await formService.updateForm(id, updatedForm);
      } else {
        const response = await formService.createForm(updatedForm);
        navigate(`/forms/${response.data._id}/edit`);
      }

      setForm(updatedForm);
      toast.success('Form published successfully');
    } catch (error) {
      toast.error('Failed to publish form');
      console.error('Error publishing form:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 ml-64">
          {/* Top Header Bar */}
          <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">FB</span>
                </div>
                <span className="font-medium text-gray-900">Form Builder</span>
              </div>

              <nav className="flex items-center space-x-2 text-sm text-gray-500">
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-gray-700"
                >
                  Dashboard
                </button>
                <span>/</span>
                <span>Forms</span>
                <span>/</span>
                <span>Create New</span>
                <span>/</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-transparent border-none focus:outline-none text-gray-900 font-medium p-0 min-w-0 text-lg"
                  placeholder="Untitled Form"
                />
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(true)}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
                title="Preview form (Ctrl+P)"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
                title="Form settings (Ctrl+,)"
              >
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </button>
              <button
                onClick={saveForm}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
                title="Save form (Ctrl+S)"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Save Draft
              </button>
              <button
                onClick={publishForm}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm flex items-center"
              >
                Publish Form
              </button>
            </div>
          </div>

          {/* Form Builder Content */}
          <div className="flex h-[calc(100vh-80px)]">
            <Sidebar onAddField={addField} />
            <FormCanvas
              form={form}
              onUpdateField={updateField}
              onDeleteField={deleteField}
              onReorderFields={reorderFields}
              onAddField={addField}
              onClearFields={clearAllFields}
            />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Form Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FormSettings form={form} onChange={setForm} />
            <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSettings(false);
                  saveForm();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-50 rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b bg-white">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Form Preview</h2>
                <p className="text-sm text-gray-500">This is how your form will look to users</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <FormPreviewComponent form={form} isPreviewMode={true} />
            </div>
          </div>
        </div>
      )}
    </DndProvider>
  );
};

export default FormBuilder;
