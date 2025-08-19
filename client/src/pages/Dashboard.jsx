import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Filter, FileText, Users, TrendingUp, ChevronDown, User, HelpCircle, Edit, Copy, Share, Trash2, MoreHorizontal, Eye, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { ConsoleClearButton } from '../components/ConsoleClear';
import { formService } from '../services/formService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalForms: 0,
    totalSubmissions: 0,
    completionRate: 0,
    activeForms: 0
  });

  // Mock data for charts (will be replaced with real data later)
  const submissionData = [
    { date: 'Aug 1', submissions: 15 },
    { date: 'Aug 5', submissions: 18 },
    { date: 'Aug 10', submissions: 16 },
    { date: 'Aug 15', submissions: 22 },
    { date: 'Aug 20', submissions: 28 },
    { date: 'Aug 25', submissions: 25 },
    { date: 'Aug 30', submissions: 32 }
  ];

  const formTypesData = [
    { name: 'Surveys', value: 35, color: '#3b82f6' },
    { name: 'Contact Forms', value: 25, color: '#10b981' },
    { name: 'Registrations', value: 20, color: '#8b5cf6' },
    { name: 'Applications', value: 20, color: '#f59e0b' }
  ];

  // Fetch forms data
  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await formService.getForms();
      const formsData = response.data || [];
      setForms(formsData);

      // Calculate stats
      const totalForms = formsData.length;
      const totalSubmissions = formsData.reduce((sum, form) => sum + (form.submissionCount || 0), 0);
      const activeForms = formsData.filter(form => form.status === 'published').length;
      const completionRate = totalForms > 0 ? Math.round((activeForms / totalForms) * 100) : 0;

      setStats({
        totalForms,
        totalSubmissions,
        completionRate,
        activeForms
      });
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const handleEditForm = (formId) => {
    navigate(`/forms/${formId}/edit`);
  };

  const handleDuplicateForm = async (formId) => {
    try {
      await formService.duplicateForm(formId);
      toast.success('Form duplicated successfully');
      fetchForms(); // Refresh the list
    } catch (error) {
      console.error('Error duplicating form:', error);
      toast.error('Failed to duplicate form');
    }
  };

  const handleDeleteForm = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      try {
        await formService.deleteForm(formId);
        toast.success('Form deleted successfully');
        fetchForms(); // Refresh the list
      } catch (error) {
        console.error('Error deleting form:', error);
        toast.error('Failed to delete form');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  const getFormIcon = (index) => {
    const colors = ['blue', 'purple', 'green', 'yellow', 'red', 'indigo', 'pink', 'gray'];
    return colors[index % colors.length];
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">My Forms</h2>
          <p className="text-gray-600 text-sm">Manage all your forms in one beautiful place</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>Sort: Date Created</option>
          </select>
          <Link to="/forms/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create New Form</span>
          </Link>
          {import.meta.env.DEV && <ConsoleClearButton />}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Forms */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Forms</p>
              <p className="text-3xl font-bold">{stats.totalForms}</p>
              <p className="text-blue-100 text-sm mt-1">↑ 2 more than last month</p>
            </div>
            <FileText className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        {/* Total Submissions */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Submissions</p>
              <p className="text-3xl font-bold">{stats.totalSubmissions}</p>
              <p className="text-green-100 text-sm mt-1">↑ 14% increase</p>
            </div>
            <Users className="h-8 w-8 text-green-200" />
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Completion Rate</p>
              <p className="text-3xl font-bold">{stats.completionRate}%</p>
              <p className="text-purple-100 text-sm mt-1">↑ 3% improvement</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        {/* Active Forms */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Active Forms</p>
              <p className="text-3xl font-bold">{stats.activeForms}</p>
              <p className="text-orange-100 text-sm mt-1">4 drafts</p>
            </div>
            <FileText className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Submission Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Submission Activity</h3>
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={submissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="submissions"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Form Types Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Form Types</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formTypesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {formTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {formTypesData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Forms Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">All Forms</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <span className="ml-2 text-gray-500">Loading forms...</span>
                    </div>
                  </td>
                </tr>
              ) : forms.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
                      <p className="text-gray-500 mb-4">Get started by creating your first form</p>
                      <Link
                        to="/forms/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Form
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                forms.map((form, index) => (
                  <tr key={form._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-${getFormIcon(index)}-100`}>
                          <FileText className={`h-4 w-4 text-${getFormIcon(index)}-600`} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{form.title}</div>
                          <div className="text-sm text-gray-500">
                            {form.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(form.status)}`}>
                        {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {form.submissionCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(form.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(form.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEditForm(form._id)}
                          className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit form"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <Link
                          to={`/forms/${form._id}/preview`}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Preview form"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/forms/${form._id}/submissions`}
                          className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors relative"
                          title={`View submissions (${form.submissionCount || 0})`}
                        >
                          <FileText className="h-4 w-4" />
                          {(form.submissionCount || 0) > 0 && (
                            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {form.submissionCount > 99 ? '99+' : form.submissionCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          to={`/forms/${form._id}/analytics`}
                          className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View analytics"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicateForm(form._id)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Duplicate form"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/forms/${form._id}/preview`);
                            toast.success('Form link copied to clipboard!');
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Copy form link"
                        >
                          <Share className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteForm(form._id)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete form"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && forms.length > 0 && (
          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing {forms.length} of {stats.totalForms} forms
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchForms}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Help Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700">
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
