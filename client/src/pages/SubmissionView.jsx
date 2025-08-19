import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Filter, Search, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import TableRow from '../components/TableRow';
import { formService } from '../services/formService';

const SubmissionView = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [formResponse, submissionsResponse] = await Promise.all([
        formService.getForm(id),
        formService.getSubmissions(id, { 
          status: statusFilter !== 'all' ? statusFilter : undefined,
          limit: 100 
        })
      ]);

      setForm(formResponse.data);
      setSubmissions(submissionsResponse.data);
    } catch (error) {
      toast.error('Failed to load submissions');
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (submissionId, newStatus) => {
    try {
      await formService.updateSubmissionStatus(submissionId, newStatus);
      toast.success('Status updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (submissionId) => {
    try {
      await formService.deleteSubmission(submissionId);
      toast.success('Submission deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete submission');
      console.error('Error deleting submission:', error);
    }
  };

  const handleView = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const handleExport = async () => {
    try {
      const response = await formService.exportSubmissions(id);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${form.title}-submissions.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Submissions exported successfully');
    } catch (error) {
      toast.error('Failed to export submissions');
      console.error('Error exporting submissions:', error);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const submissionData = Object.values(submission.data || {}).join(' ').toLowerCase();
    const submissionId = submission._id.toLowerCase();
    
    return submissionData.includes(searchLower) || submissionId.includes(searchLower);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Form not found</h2>
        <p className="text-gray-600">The form you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="btn-ghost btn-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
            <p className="text-gray-600">Form Submissions ({submissions.length})</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link to={`/forms/${id}/analytics`} className="btn-outline">
            View Analytics
          </Link>
          <button onClick={handleExport} className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitter
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {submissions.length === 0 ? 'No submissions yet' : 'No submissions match your search'}
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission) => (
                  <TableRow
                    key={submission._id}
                    submission={submission}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                    onView={handleView}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Detail Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Submission Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-ghost btn-sm"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Submission Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Submission ID:</span>
                    <p className="text-gray-900">{selectedSubmission._id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <p className="text-gray-900 capitalize">{selectedSubmission.status}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Submitted:</span>
                    <p className="text-gray-900">
                      {new Date(selectedSubmission.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Submitter:</span>
                    <p className="text-gray-900">
                      {selectedSubmission.submitterInfo?.submittedBy || 'Anonymous'}
                    </p>
                  </div>
                </div>

                {/* Form Data */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Form Data</h4>
                  <div className="space-y-4">
                    {form.fields.map((field) => {
                      const value = selectedSubmission.data?.[field.id];
                      return (
                        <div key={field.id} className="border-b border-gray-100 pb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                          </label>
                          <div className="text-sm text-gray-900">
                            {value !== undefined && value !== null && value !== '' 
                              ? String(value) 
                              : <span className="text-gray-400 italic">No response</span>
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Files */}
                {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Uploaded Files</h4>
                    <div className="space-y-2">
                      {selectedSubmission.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{file.originalName}</span>
                          <span className="text-xs text-gray-500">{file.size} bytes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionView;
