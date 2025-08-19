const express = require('express');
const {
  uploadFile,
  uploadMultipleFiles,
  getFile,
  deleteFile
} = require('../controllers/uploadController');
const { uploadSingle, uploadMultiple } = require('../middleware/uploadMiddleware');

const router = express.Router();

// File upload routes
router.post('/', uploadSingle, uploadFile);
router.post('/multiple', uploadMultiple, uploadMultipleFiles);

// File access routes
router.route('/:filename')
  .get(getFile)
  .delete(deleteFile);

module.exports = router;
