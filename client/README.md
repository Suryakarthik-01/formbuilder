# Form Builder Frontend

React 18 frontend application for the Form Builder project, built with Vite and Tailwind CSS.

## Features

### Form Builder
- **Drag & Drop Interface**: Intuitive form building experience
- **Field Types**: Support for 11+ field types including text, email, select, file upload, etc.
- **Real-time Preview**: See your form as you build it
- **Field Validation**: Configure validation rules for each field
- **Form Settings**: Customize form behavior and appearance

### Dashboard
- **Form Management**: Create, edit, delete, and duplicate forms
- **Search & Filter**: Find forms quickly with search and status filters
- **Statistics**: Overview of forms and submissions

### Analytics
- **Submission Tracking**: Monitor form submissions over time
- **Status Distribution**: Visualize submission status breakdown
- **Export Data**: Download submissions as CSV

### Submission Management
- **View Submissions**: Browse and search through form submissions
- **Status Management**: Update submission status (pending, reviewed, approved, rejected)
- **Detailed View**: View complete submission data including files

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form handling and validation
- **React DnD** - Drag and drop functionality
- **Axios** - HTTP client
- **Recharts** - Charts and data visualization
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **Date-fns** - Date manipulation

## Project Structure

```
client/
├── public/
│   ├── index.html
│   └── vite.svg
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── FormCard.jsx
│   │   ├── FormCanvas.jsx
│   │   ├── FieldEditor.jsx
│   │   ├── FormSettings.jsx
│   │   └── TableRow.jsx
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   ├── FormBuilder.jsx
│   │   ├── FormPreview.jsx
│   │   ├── Analytics.jsx
│   │   └── SubmissionView.jsx
│   ├── services/         # API services
│   │   ├── api.js
│   │   └── formService.js
│   ├── assets/           # Static assets
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server at http://localhost:3000

### Build
```bash
npm run build
```
Builds the app for production to the `dist` folder

### Preview
```bash
npm run preview
```
Preview the production build locally

### Lint
```bash
npm run lint
```
Run ESLint to check for code issues

## Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Form Builder
VITE_APP_VERSION=1.0.0
```

## Component Overview

### Pages

#### Dashboard
- Main landing page showing all forms
- Search and filter functionality
- Form statistics and quick actions

#### FormBuilder
- Drag-and-drop form builder interface
- Field configuration and validation
- Form settings management
- Real-time preview

#### FormPreview
- Public form submission interface
- Form validation and submission
- Success/error handling

#### Analytics
- Form submission analytics
- Charts and statistics
- Data export functionality

#### SubmissionView
- Submission management interface
- Status updates and filtering
- Detailed submission viewing

### Components

#### Navbar
- Main navigation component
- Responsive design with mobile support

#### Sidebar
- Field palette for form builder
- Categorized field types
- Drag-and-drop source

#### FormCanvas
- Main form building area
- Drop zone for fields
- Field selection and editing

#### FieldEditor
- Field configuration panel
- Validation rules setup
- Options management for select/radio/checkbox fields

#### FormSettings
- Form-level configuration
- Submission settings
- Customization options

## Styling

The application uses Tailwind CSS with a custom design system:

### Color Palette
- **Primary**: Blue shades for main actions and branding
- **Gray**: Various gray shades for text and backgrounds
- **Success**: Green for positive actions
- **Warning**: Yellow for warnings
- **Error**: Red for errors and destructive actions

### Components
Custom component classes are defined in `index.css`:
- `.btn` - Base button styles
- `.btn-primary`, `.btn-secondary`, etc. - Button variants
- `.input`, `.textarea`, `.select` - Form input styles
- `.card` - Card component styles

## API Integration

The frontend communicates with the backend API through the `formService`:

### Key Functions
- `getForms()` - Fetch all forms
- `getForm(id)` - Fetch single form
- `createForm(data)` - Create new form
- `updateForm(id, data)` - Update form
- `submitForm(formId, data)` - Submit form data
- `getSubmissions(formId)` - Fetch submissions
- `exportSubmissions(formId)` - Export as CSV

### Error Handling
- Axios interceptors for consistent error handling
- Toast notifications for user feedback
- Loading states for better UX

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use TypeScript-style prop validation where needed
- Keep components small and focused

### State Management
- Use React's built-in state management (useState, useEffect)
- Lift state up when needed
- Consider context for global state if the app grows

### Performance
- Use React.memo for expensive components
- Implement proper key props for lists
- Lazy load routes and components when needed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in the `dist` folder can be deployed to any static hosting service like:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
