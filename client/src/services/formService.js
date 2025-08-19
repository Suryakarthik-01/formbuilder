import api from './api';

export const formService = {
  // Get all forms
  getForms: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/forms${queryString ? `?${queryString}` : ''}`);
  },

  // Get single form
  getForm: async (id) => {
    return api.get(`/forms/${id}`);
  },

  // Create new form
  createForm: async (formData) => {
    return api.post('/forms', formData);
  },

  // Update form
  updateForm: async (id, formData) => {
    return api.put(`/forms/${id}`, formData);
  },

  // Delete form
  deleteForm: async (id) => {
    return api.delete(`/forms/${id}`);
  },

  // Duplicate form
  duplicateForm: async (id) => {
    return api.post(`/forms/${id}/duplicate`);
  },

  // Submit form
  submitForm: async (formId, submissionData, files = null) => {
    const formData = new FormData();
    
    // Add submission data
    Object.keys(submissionData).forEach(key => {
      formData.append(key, submissionData[key]);
    });
    
    // Add files if any
    if (files) {
      files.forEach((file, index) => {
        formData.append('files', file);
      });
    }

    return api.post(`/forms/${formId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get form submissions
  getSubmissions: async (formId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/forms/${formId}/submissions${queryString ? `?${queryString}` : ''}`);
  },

  // Get single submission
  getSubmission: async (id) => {
    return api.get(`/submissions/${id}`);
  },

  // Update submission status
  updateSubmissionStatus: async (id, status) => {
    return api.put(`/submissions/${id}/status`, { status });
  },

  // Delete submission
  deleteSubmission: async (id) => {
    return api.delete(`/submissions/${id}`);
  },

  // Export submissions
  exportSubmissions: async (formId) => {
    const response = await api.get(`/forms/${formId}/submissions/export`, {
      responseType: 'blob',
    });
    return response;
  },

  // Upload file
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Upload multiple files
  uploadMultipleFiles: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    return api.post('/uploads/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
