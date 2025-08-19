const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'email', 'number', 'textarea', 'select', 'radio', 'checkbox', 'file', 'date', 'url', 'tel']
  },
  label: {
    type: String,
    required: true
  },
  placeholder: String,
  required: {
    type: Boolean,
    default: false
  },
  options: [{
    label: String,
    value: String
  }],
  validation: {
    minLength: Number,
    maxLength: Number,
    min: Number,
    max: Number,
    pattern: String
  },
  order: {
    type: Number,
    required: true
  }
});

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  fields: [fieldSchema],
  settings: {
    allowMultipleSubmissions: {
      type: Boolean,
      default: true
    },
    requireAuth: {
      type: Boolean,
      default: false
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    submitButtonText: {
      type: String,
      default: 'Submit'
    },
    successMessage: {
      type: String,
      default: 'Thank you for your submission!'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  submissionCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    default: 'anonymous'
  }
}, {
  timestamps: true
});

// Index for better query performance
formSchema.index({ status: 1, createdAt: -1 });
formSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Form', formSchema);
