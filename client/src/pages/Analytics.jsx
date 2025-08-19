import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Users, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import toast from 'react-hot-toast';
import { formService } from '../services/formService';

const Analytics = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalSubmissions: 0,
    submissionsToday: 0,
    submissionsThisWeek: 0,
    averagePerDay: 0,
    statusDistribution: [],
    dailySubmissions: []
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [formResponse, submissionsResponse] = await Promise.all([
        formService.getForm(id),
        formService.getSubmissions(id, { limit: 1000 }) // Get all submissions for analytics
      ]);

      setForm(formResponse.data);
      setSubmissions(submissionsResponse.data);
      calculateAnalytics(submissionsResponse.data);
    } catch (error) {
      toast.error('Failed to load analytics data');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (submissionsData) => {
    const now = new Date();
    const today = startOfDay(now);
    const weekAgo = subDays(today, 7);

    // Basic counts
    const totalSubmissions = submissionsData.length;
    const submissionsToday = submissionsData.filter(
      sub => startOfDay(new Date(sub.createdAt)).getTime() === today.getTime()
    ).length;
    const submissionsThisWeek = submissionsData.filter(
      sub => new Date(sub.createdAt) >= weekAgo
    ).length;

    // Average per day (last 7 days)
    const averagePerDay = Math.round(submissionsThisWeek / 7 * 10) / 10;

    // Status distribution
    const statusCounts = submissionsData.reduce((acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1;
      return acc;
    }, {});

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      percentage: Math.round((count / totalSubmissions) * 100)
    }));

    // Daily submissions (last 7 days)
    const dailySubmissions = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const count = submissionsData.filter(
        sub => startOfDay(new Date(sub.createdAt)).getTime() === date.getTime()
      ).length;
      
      dailySubmissions.push({
        date: format(date, 'MMM dd'),
        submissions: count
      });
    }

    setAnalytics({
      totalSubmissions,
      submissionsToday,
      submissionsThisWeek,
      averagePerDay,
      statusDistribution,
      dailySubmissions
    });
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

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => (
    <div className="card">
      <div className="card-content">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        </div>
      </div>
    </div>
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="btn-ghost btn-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
            <p className="text-gray-600">Analytics & Insights</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link to={`/forms/${id}/submissions`} className="btn-outline">
            View Submissions
          </Link>
          <button onClick={handleExport} className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Submissions"
          value={analytics.totalSubmissions}
          color="primary"
        />
        <StatCard
          icon={TrendingUp}
          title="Today"
          value={analytics.submissionsToday}
          color="green"
        />
        <StatCard
          icon={Calendar}
          title="This Week"
          value={analytics.submissionsThisWeek}
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          title="Daily Average"
          value={analytics.averagePerDay}
          subtitle="Last 7 days"
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Submissions Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Daily Submissions</h3>
            <p className="card-description">Submissions over the last 7 days</p>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.dailySubmissions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="submissions" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Submission Status</h3>
            <p className="card-description">Distribution of submission statuses</p>
          </div>
          <div className="card-content">
            {analytics.statusDistribution.length > 0 ? (
              <div className="flex items-center">
                <ResponsiveContainer width="60%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.statusDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ percentage }) => `${percentage}%`}
                    >
                      {analytics.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {analytics.statusDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-gray-700">
                        {item.name}: {item.value} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No submissions yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Submissions</h3>
          <p className="card-description">Latest form submissions</p>
        </div>
        <div className="card-content">
          {submissions.length > 0 ? (
            <div className="space-y-3">
              {submissions.slice(0, 5).map((submission) => (
                <div key={submission._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Submission #{submission._id.slice(-8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(submission.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                    submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    submission.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {submission.status}
                  </span>
                </div>
              ))}
              {submissions.length > 5 && (
                <Link
                  to={`/forms/${id}/submissions`}
                  className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-4"
                >
                  View all {submissions.length} submissions →
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No submissions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
