const FormSettings = ({ form, onChange }) => {
  const handleChange = (key, value) => {
    onChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSettingsChange = (key, value) => {
    onChange(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  };

  return (
    <div className="flex-1 max-w-2xl mx-auto p-6">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Settings</h2>
          <p className="text-gray-600">Configure your form's behavior and appearance</p>
        </div>

        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Basic Information</h3>
            <p className="card-description">
              Set the title and description for your form
            </p>
          </div>
          <div className="card-content space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="input"
                placeholder="Enter form title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="textarea"
                rows={3}
                placeholder="Enter form description (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Status
              </label>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="select"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submission Settings */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Submission Settings</h3>
            <p className="card-description">
              Control how users can submit your form
            </p>
          </div>
          <div className="card-content space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Allow Multiple Submissions
                </label>
                <p className="text-xs text-gray-500">
                  Allow users to submit the form multiple times
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.settings.allowMultipleSubmissions}
                onChange={(e) => handleSettingsChange('allowMultipleSubmissions', e.target.checked)}
                className="text-primary-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Require Authentication
                </label>
                <p className="text-xs text-gray-500">
                  Users must be logged in to submit
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.settings.requireAuth}
                onChange={(e) => handleSettingsChange('requireAuth', e.target.checked)}
                className="text-primary-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Public Form
                </label>
                <p className="text-xs text-gray-500">
                  Form is publicly accessible
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.settings.isPublic}
                onChange={(e) => handleSettingsChange('isPublic', e.target.checked)}
                className="text-primary-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Limit
              </label>
              <input
                type="number"
                value={form.settings.submissionLimit || ''}
                onChange={(e) => handleSettingsChange('submissionLimit', parseInt(e.target.value) || null)}
                className="input"
                placeholder="No limit"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of submissions allowed (leave empty for no limit)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Deadline
              </label>
              <input
                type="datetime-local"
                value={form.settings.submissionDeadline || ''}
                onChange={(e) => handleSettingsChange('submissionDeadline', e.target.value)}
                className="input"
              />
              <p className="text-xs text-gray-500 mt-1">
                Form will stop accepting submissions after this date
              </p>
            </div>
          </div>
        </div>

        {/* Customization */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Customization</h3>
            <p className="card-description">
              Customize the form's appearance and messages
            </p>
          </div>
          <div className="card-content space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submit Button Text
              </label>
              <input
                type="text"
                value={form.settings.submitButtonText}
                onChange={(e) => handleSettingsChange('submitButtonText', e.target.value)}
                className="input"
                placeholder="Submit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Success Message
              </label>
              <textarea
                value={form.settings.successMessage}
                onChange={(e) => handleSettingsChange('successMessage', e.target.value)}
                className="textarea"
                rows={3}
                placeholder="Thank you for your submission!"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redirect URL (Optional)
              </label>
              <input
                type="url"
                value={form.settings.redirectUrl || ''}
                onChange={(e) => handleSettingsChange('redirectUrl', e.target.value)}
                className="input"
                placeholder="https://example.com/thank-you"
              />
              <p className="text-xs text-gray-500 mt-1">
                Redirect users to this URL after successful submission
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Theme Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={form.settings.themeColor || '#3b82f6'}
                  onChange={(e) => handleSettingsChange('themeColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={form.settings.themeColor || '#3b82f6'}
                  onChange={(e) => handleSettingsChange('themeColor', e.target.value)}
                  className="input flex-1"
                  placeholder="#3b82f6"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Email Notifications</h3>
            <p className="card-description">
              Configure email notifications for form submissions
            </p>
          </div>
          <div className="card-content space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Send Email Notifications
                </label>
                <p className="text-xs text-gray-500">
                  Receive email when someone submits the form
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.settings.emailNotifications || false}
                onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
                className="text-primary-600"
              />
            </div>

            {form.settings.emailNotifications && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Email
                </label>
                <input
                  type="email"
                  value={form.settings.notificationEmail || ''}
                  onChange={(e) => handleSettingsChange('notificationEmail', e.target.value)}
                  className="input"
                  placeholder="admin@example.com"
                />
              </div>
            )}
          </div>
        </div>

        {/* Form URL */}
        {form._id && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Form URL</h3>
              <p className="card-description">
                Share this URL to collect submissions
              </p>
            </div>
            <div className="card-content">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={`${window.location.origin}/forms/${form._id}/preview`}
                  className="input flex-1"
                  readOnly
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/forms/${form._id}/preview`);
                  }}
                  className="btn-outline"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormSettings;
