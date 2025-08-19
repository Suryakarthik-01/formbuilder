const path = require('path');
const fs = require('fs');

// @desc    Upload file
// @route   POST /api/upload
// @access  Public
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/api/uploads/${req.file.filename}`
    };

    res.status(200).json({
      success: true,
      data: fileInfo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Public
const uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    const filesInfo = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/api/uploads/${file.filename}`
    }));

    res.status(200).json({
      success: true,
      data: filesInfo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get uploaded file
// @route   GET /api/uploads/:filename
// @access  Public
const getFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const uploadDir = process.env.UPLOAD_PATH || './uploads';
    const filePath = path.join(uploadDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Set appropriate headers
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete uploaded file
// @route   DELETE /api/uploads/:filename
// @access  Public
const deleteFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const uploadDir = process.env.UPLOAD_PATH || './uploads';
    const filePath = path.join(uploadDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  getFile,
  deleteFile
};
