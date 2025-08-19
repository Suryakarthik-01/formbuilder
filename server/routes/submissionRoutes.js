const express = require('express');
const {
  getSubmissions,
  getSubmission,
  createSubmission,
  updateSubmissionStatus,
  deleteSubmission,
  exportSubmissions
} = require('../controllers/submissionController');
const { uploadFields } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Submission routes for specific forms
router.get('/forms/:formId/submissions', getSubmissions);
router.post('/forms/:formId/submit', uploadFields, createSubmission);
router.get('/forms/:formId/submissions/export', exportSubmissions);

// Individual submission routes
router.route('/submissions/:id')
  .get(getSubmission)
  .delete(deleteSubmission);

router.put('/submissions/:id/status', updateSubmissionStatus);

module.exports = router;
