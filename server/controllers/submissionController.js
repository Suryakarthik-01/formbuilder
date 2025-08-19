const Submission = require('../models/Submission');
const Form = require('../models/Form');
const { validateSubmissionData } = require('../utils/validateFields');

// @desc    Get submissions for a form
// @route   GET /api/forms/:formId/submissions
// @access  Public
const getSubmissions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const { formId } = req.params;

    // Verify form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    const query = { formId };
    if (status) query.status = status;

    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('formId', 'title');

    const total = await Submission.countDocuments(query);

    res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single submission
// @route   GET /api/submissions/:id
// @access  Public
const getSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('formId', 'title fields');

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new submission
// @route   POST /api/forms/:formId/submit
// @access  Public
const createSubmission = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const submissionData = req.body;

    // Get form with fields
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    // Check if form is published
    if (form.status !== 'published') {
      return res.status(400).json({
        success: false,
        error: 'Form is not available for submissions'
      });
    }

    // Validate submission data against form fields
    const validation = validateSubmissionData(form.fields, submissionData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Create submission
    const submission = await Submission.create({
      formId,
      data: validation.validatedData,
      files: req.files || [],
      submitterInfo: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        submittedBy: req.body.submittedBy || 'anonymous'
      }
    });

    // Increment form submission count
    await Form.findByIdAndUpdate(formId, {
      $inc: { submissionCount: 1 }
    });

    res.status(201).json({
      success: true,
      message: form.settings.successMessage || 'Thank you for your submission!',
      data: {
        id: submission._id,
        submittedAt: submission.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update submission status
// @route   PUT /api/submissions/:id/status
// @access  Public
const updateSubmissionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'reviewed', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Public
const deleteSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    await submission.deleteOne();

    // Decrement form submission count
    await Form.findByIdAndUpdate(submission.formId, {
      $inc: { submissionCount: -1 }
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export submissions as CSV
// @route   GET /api/forms/:formId/submissions/export
// @access  Public
const exportSubmissions = async (req, res, next) => {
  try {
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    const submissions = await Submission.find({ formId }).sort({ createdAt: -1 });

    // Create CSV headers
    const headers = ['Submission ID', 'Submitted At', 'Status'];
    form.fields.forEach(field => {
      headers.push(field.label);
    });

    // Create CSV rows
    const rows = [headers];
    submissions.forEach(submission => {
      const row = [
        submission._id.toString(),
        submission.createdAt.toISOString(),
        submission.status
      ];
      
      form.fields.forEach(field => {
        const value = submission.data.get(field.id);
        row.push(value || '');
      });
      
      rows.push(row);
    });

    // Convert to CSV string
    const csvContent = rows.map(row => 
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${form.title}-submissions.csv"`);
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubmissions,
  getSubmission,
  createSubmission,
  updateSubmissionStatus,
  deleteSubmission,
  exportSubmissions
};
