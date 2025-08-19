import { useState } from 'react';
import { Eye, Trash2, MoreHorizontal, Download } from 'lucide-react';
import { format } from 'date-fns';

const TableRow = ({ submission, onDelete, onStatusChange, onView }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(submission._id, newStatus);
    setShowActions(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      onDelete(submission._id);
    }
    setShowActions(false);
  };

  const formatSubmissionData = (data) => {
    if (!data || typeof data !== 'object') return '';
    
    const entries = Object.entries(data);
    if (entries.length === 0) return 'No data';
    
    // Show first few fields as preview
    const preview = entries.slice(0, 2).map(([key, value]) => {
      if (typeof value === 'string' && value.length > 30) {
        return `${value.substring(0, 30)}...`;
      }
      return value;
    }).join(', ');
    
    return preview + (entries.length > 2 ? '...' : '');
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {submission._id.slice(-8)}
      </td>
      
      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
        <div className="truncate" title={formatSubmissionData(submission.data)}>
          {formatSubmissionData(submission.data)}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
          {submission.status}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(submission.createdAt), 'MMM d, yyyy HH:mm')}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {submission.submitterInfo?.submittedBy || 'Anonymous'}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onView(submission)}
            className="text-primary-600 hover:text-primary-900"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="text-gray-400 hover:text-gray-600"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Change Status
                  </div>
                  {['pending', 'reviewed', 'approved', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
                    >
                      {status}
                    </button>
                  ))}
                  
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleDelete}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 inline mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
