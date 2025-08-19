const express = require('express');
const {
  getForms,
  getForm,
  createForm,
  updateForm,
  deleteForm,
  duplicateForm,
  getFormAnalytics
} = require('../controllers/formController');

const router = express.Router();

// Form CRUD routes
router.route('/')
  .get(getForms)
  .post(createForm);

router.route('/:id')
  .get(getForm)
  .put(updateForm)
  .delete(deleteForm);

// Additional form routes
router.post('/:id/duplicate', duplicateForm);
router.get('/:id/analytics', getFormAnalytics);

module.exports = router;
