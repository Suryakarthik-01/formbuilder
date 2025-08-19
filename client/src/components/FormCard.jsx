import { Link } from 'react-router-dom';
import { Calendar, Users, Eye, Edit, Trash2, Copy, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

const FormCard = ({ form, onDelete, onDuplicate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this form?')) {
      onDelete(form._id);
    }
  };

  const handleDuplicate = (e) => {
    e.preventDefault();
    onDuplicate(form._id);
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="card-header">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="card-title text-lg">{form.title}</h3>
            {form.description && (
              <p className="card-description mt-1">{form.description}</p>
            )}
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(form.status)}`}>
            {form.status}
          </span>
        </div>
      </div>

      <div className="card-content">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(form.createdAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{form.submissionCount} submissions</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link
              to={`/forms/${form._id}/preview`}
              className="btn-ghost btn-sm"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </Link>
            
            <Link
              to={`/forms/${form._id}/edit`}
              className="btn-ghost btn-sm"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Link>

            <Link
              to={`/forms/${form._id}/analytics`}
              className="btn-ghost btn-sm"
              title="Analytics"
            >
              <BarChart3 className="h-4 w-4" />
            </Link>

            <button
              onClick={handleDuplicate}
              className="btn-ghost btn-sm"
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </button>

            <button
              onClick={handleDelete}
              className="btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <Link
            to={`/forms/${form._id}/submissions`}
            className="btn-outline btn-sm"
          >
            View Submissions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FormCard;
