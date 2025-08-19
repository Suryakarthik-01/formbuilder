import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = ({ 
  title,
  subtitle,
  showSearch = true,
  headerActions,
  children 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto ml-64">
        <DashboardHeader 
          title={title}
          subtitle={subtitle}
          showSearch={showSearch}
        >
          {headerActions}
        </DashboardHeader>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
