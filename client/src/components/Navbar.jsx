import { Link, useLocation } from 'react-router-dom';
import { FileText, Plus, BarChart3, Settings } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Form Builder</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/forms/new"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/forms/new') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>New Form</span>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/forms/new"
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Form
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
