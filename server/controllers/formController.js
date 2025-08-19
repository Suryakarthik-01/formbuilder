const Form = require('../models/Form');
const Submission = require('../models/Submission');
const { validateFormData } = require('../utils/validateFields');



// @desc    Get all forms
// @route   GET /api/forms
// @access  Public
const getForms = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const forms = await Form.find(query)
      .select('-fields') // Exclude fields for list view
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Form.countDocuments(query);

    res.status(200).json({
      success: true,
      data: forms,
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

// @desc    Get single form
// @route   GET /api/forms/:id
// @access  Public
const getForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    res.status(200).json({
      success: true,
      data: form
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new form
// @route   POST /api/forms
// @access  Public
const createForm = async (req, res, next) => {
  try {
    // Validate form data
    const { error, value } = validateFormData(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const form = await Form.create(value);

    res.status(201).json({
      success: true,
      data: form
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update form
// @route   PUT /api/forms/:id
// @access  Public
const updateForm = async (req, res, next) => {
  try {
    // Validate form data
    const { error, value } = validateFormData(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const form = await Form.findByIdAndUpdate(
      req.params.id,
      value,
      {
        new: true,
        runValidators: true
      }
    );

    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    res.status(200).json({
      success: true,
      data: form
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete form
// @route   DELETE /api/forms/:id
// @access  Public
const deleteForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    await form.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate form
// @route   POST /api/forms/:id/duplicate
// @access  Public
const duplicateForm = async (req, res, next) => {
  try {
    const originalForm = await Form.findById(req.params.id);

    if (!originalForm) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    const duplicatedForm = new Form({
      ...originalForm.toObject(),
      _id: undefined,
      title: `${originalForm.title} (Copy)`,
      status: 'draft',
      submissionCount: 0,
      createdAt: undefined,
      updatedAt: undefined
    });

    await duplicatedForm.save();

    res.status(201).json({
      success: true,
      data: duplicatedForm
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get form analytics
// @route   GET /api/forms/:id/analytics
// @access  Public
const getFormAnalytics = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    // Get submission statistics
    const submissions = await Submission.find({ formId: req.params.id });
    const totalSubmissions = submissions.length;

    // Calculate submission trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSubmissions = submissions.filter(
      submission => new Date(submission.createdAt) >= thirtyDaysAgo
    );

    // Group submissions by date for chart data
    const submissionsByDate = {};
    recentSubmissions.forEach(submission => {
      const date = new Date(submission.createdAt).toISOString().split('T')[0];
      submissionsByDate[date] = (submissionsByDate[date] || 0) + 1;
    });

    // Calculate completion rate (assuming all submissions are complete for now)
    const completionRate = totalSubmissions > 0 ? 100 : 0;

    // Field response statistics
    const fieldStats = {};
    if (form.fields && form.fields.length > 0) {
      form.fields.forEach(field => {
        fieldStats[field.id] = {
          label: field.label,
          type: field.type,
          responses: 0,
          responseRate: 0
        };
      });

      // Count responses for each field
      submissions.forEach(submission => {
        if (submission.data) {
          Object.keys(submission.data).forEach(fieldId => {
            if (fieldStats[fieldId] && submission.data[fieldId]) {
              fieldStats[fieldId].responses++;
            }
          });
        }
      });

      // Calculate response rates
      Object.keys(fieldStats).forEach(fieldId => {
        if (totalSubmissions > 0) {
          fieldStats[fieldId].responseRate = Math.round(
            (fieldStats[fieldId].responses / totalSubmissions) * 100
          );
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalSubmissions,
        recentSubmissions: recentSubmissions.length,
        completionRate,
        submissionsByDate,
        fieldStats,
        form: {
          id: form._id,
          title: form.title,
          status: form.status,
          createdAt: form.createdAt,
          updatedAt: form.updatedAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getForms,
  getForm,
  createForm,
  updateForm,
  deleteForm,
  duplicateForm,
  getFormAnalytics
};
