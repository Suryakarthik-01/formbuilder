import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  BarChart3, 
  Users, 
  Settings as SettingsIcon, 
  User, 
  HelpCircle 
} from 'lucide-react';

const DashboardSidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: FileText
    },
    {
      name: 'Create New',
      path: '/forms/new',
      icon: Plus
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3
    },
    {
      name: 'Submissions',
      path: '/submissions',
      icon: Users
    },
    {
      name: 'Integrations',
      path: '/integrations',
      icon: SettingsIcon
    }
  ];

  const settingsItems = [
    {
      name: 'Account',
      path: '/account',
      icon: User
    },
    {
      name: 'Preferences',
      path: '/preferences',
      icon: SettingsIcon
    }
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r flex flex-col fixed h-full z-10">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SF</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">SmartForm</h2>
            <p className="text-sm text-gray-500">Studio</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className={active ? 'font-medium' : ''}>{item.name}</span>
            </Link>
          );
        })}
        
        <div className="pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Settings</p>
          {settingsItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className={active ? 'font-medium' : ''}>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">AM</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Alex Morgan</p>
            <p className="text-xs text-gray-500">Pro Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
