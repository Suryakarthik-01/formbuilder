import { Search, Bell, HelpCircle } from 'lucide-react';

const DashboardHeader = ({ 
  title = "Form Management", 
  subtitle = "Create, manage and analyze your forms with ease",
  showSearch = true,
  children 
}) => {
  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-indigo-600">{title}</h1>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search forms..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}
          <Bell className="h-5 w-5 text-gray-400" />
          <HelpCircle className="h-5 w-5 text-gray-400" />
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
