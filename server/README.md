# Form Builder Backend

Node.js/Express backend API for the Form Builder application.

## Features

- RESTful API for form management
- MongoDB integration with Mongoose
- File upload handling with Multer
- Input validation with Joi
- Security middleware (Helmet, CORS, Rate Limiting)
- Error handling and logging

## API Endpoints

### Health Check
- `GET /api/health` - API health status

### Forms
- `GET /api/forms` - Get all forms (with pagination and filtering)
- `POST /api/forms` - Create a new form
- `GET /api/forms/:id` - Get a specific form
- `PUT /api/forms/:id` - Update a form
- `DELETE /api/forms/:id` - Delete a form
- `POST /api/forms/:id/duplicate` - Duplicate a form

### Submissions
- `GET /api/forms/:formId/submissions` - Get submissions for a form
- `POST /api/forms/:formId/submit` - Submit a form (with file uploads)
- `GET /api/submissions/:id` - Get a specific submission
- `PUT /api/submissions/:id/status` - Update submission status
- `DELETE /api/submissions/:id` - Delete a submission
- `GET /api/forms/:formId/submissions/export` - Export submissions as CSV

### File Uploads
- `POST /api/uploads` - Upload a single file
- `POST /api/uploads/multiple` - Upload multiple files
- `GET /api/uploads/:filename` - Download/serve a file
- `DELETE /api/uploads/:filename` - Delete a file

## Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/form-builder
DB_NAME=form-builder

# JWT Configuration (for future authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_PATH=./uploads

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100    # 100 requests per window
```

## Database Models

### Form Model
```javascript
{
  title: String,           // Form title
  description: String,     // Form description
  fields: [FieldSchema],   // Array of form fields
  settings: {              // Form settings
    allowMultipleSubmissions: Boolean,
    requireAuth: Boolean,
    isPublic: Boolean,
    submitButtonText: String,
    successMessage: String
  },
  status: String,          // draft, published, archived
  submissionCount: Number, // Total submissions
  createdBy: String,       // Creator identifier
  timestamps: true         // createdAt, updatedAt
}
```

### Submission Model
```javascript
{
  formId: ObjectId,        // Reference to Form
  data: Map,               // Submission data (key-value pairs)
  files: [FileSchema],     // Uploaded files
  submitterInfo: {         // Submitter information
    ipAddress: String,
    userAgent: String,
    submittedBy: String
  },
  status: String,          // pending, reviewed, approved, rejected
  timestamps: true         // createdAt, updatedAt
}
```

## Development

### Start Development Server
```bash
npm run dev
```

### Start Production Server
```bash
npm start
```

### Run Tests
```bash
npm test
```

## File Upload Configuration

- **Allowed file types**: Images (jpg, jpeg, png, gif), Documents (pdf, doc, docx, txt, csv, xlsx, xls)
- **Maximum file size**: 5MB (configurable via MAX_FILE_SIZE)
- **Maximum files per request**: 10
- **Storage**: Local filesystem (development), can be configured for cloud storage

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: API request rate limiting
- **Input Validation**: Joi schema validation
- **File Upload Security**: File type and size validation
- **Error Handling**: Comprehensive error handling and logging

## Error Handling

The API uses consistent error response format:

```javascript
{
  success: false,
  error: "Error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error
