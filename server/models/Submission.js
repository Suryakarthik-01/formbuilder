const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  files: [{
    fieldId: String,
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String
  }],
  submitterInfo: {
    ipAddress: String,
    userAgent: String,
    submittedBy: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for better query performance
submissionSchema.index({ formId: 1, createdAt: -1 });
submissionSchema.index({ status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
