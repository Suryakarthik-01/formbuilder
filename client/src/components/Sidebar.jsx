import { useState } from 'react';
import { useDrag } from 'react-dnd';
import {
  Type,
  Mail,
  Hash,
  AlignLeft,
  List,
  CheckCircle,
  Upload,
  Calendar,
  Link as LinkIcon,
  Phone,
  ChevronDown,
  ChevronRight,
  Plus
} from 'lucide-react';

const fieldTypes = [
  {
    category: 'BASIC FIELDS',
    fields: [
      { type: 'text', label: 'Text Input', icon: Type, color: 'blue' },
      { type: 'email', label: 'Email', icon: Mail, color: 'green' },
      { type: 'number', label: 'Number', icon: Hash, color: 'purple' },
      { type: 'textarea', label: 'Textarea', icon: AlignLeft, color: 'yellow' },
      { type: 'select', label: 'Select Dropdown', icon: List, color: 'green' },
      { type: 'checkbox', label: 'Checkbox', icon: CheckCircle, color: 'red' },
    ]
  },
  {
    category: 'ADVANCED FIELDS',
    fields: [
      { type: 'file', label: 'File Upload', icon: Upload, color: 'blue' },
      { type: 'date', label: 'Date Picker', icon: Calendar, color: 'orange' },
      { type: 'radio', label: 'Radio Buttons', icon: CheckCircle, color: 'gray' },
      { type: 'tel', label: 'Phone', icon: Phone, color: 'purple' },
      { type: 'url', label: 'URL', icon: LinkIcon, color: 'blue' },
    ]
  }
];

const Sidebar = ({ onAddField }) => {
  const [expandedCategories, setExpandedCategories] = useState(
    fieldTypes.reduce((acc, category) => {
      acc[category.category] = true;
      return acc;
    }, {})
  );

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const DraggableField = ({ field }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'field',
      item: { type: field.type },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const IconComponent = field.icon;
    const colorClasses = getColorClasses(field.color);

    return (
      <div
        ref={drag}
        onClick={() => onAddField(field.type)}
        className={`flex items-center space-x-3 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all duration-200 group hover:shadow-sm ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses} group-hover:scale-105 transition-transform`}>
          <IconComponent className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{field.label}</span>
      </div>
    );
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600',
      orange: 'bg-orange-100 text-orange-600',
      gray: 'bg-gray-100 text-gray-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="w-80 bg-white border-r">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Form Elements</h2>
          <p className="text-sm text-gray-500">Drag elements to the canvas</p>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center justify-between mb-6 text-sm bg-gray-50 rounded-lg p-3">
          <span className="text-gray-700 font-medium">Page 1</span>
          <button className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Page
          </button>
        </div>

        <div className="space-y-6">
          {fieldTypes.map((category) => (
            <div key={category.category} className="space-y-3">
              <button
                onClick={() => toggleCategory(category.category)}
                className="flex items-center justify-between w-full text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
              >
                <span>{category.category}</span>
                {expandedCategories[category.category] ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>

              {expandedCategories[category.category] && (
                <div className="space-y-2">
                  {category.fields.map((field) => (
                    <DraggableField key={field.type} field={field} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
