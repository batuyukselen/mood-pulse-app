import React from 'react';
import { BarChart2, Award, Clock } from 'lucide-react';

interface StatBlockProps {
  title: string;
  value: string | number;
  icon?: string;
  color?: string;
}

const StatBlock: React.FC<StatBlockProps> = ({ 
  title, 
  value, 
  icon = "Chart",
  color = "purple" 
}) => {
  // Render the appropriate icon
  const renderIcon = () => {
    switch (icon) {
      case 'Chart':
        return <BarChart2 className={`w-6 h-6 text-${color}-500`} />;
      case 'Award':
        return <Award className={`w-6 h-6 text-${color}-500`} />;
      case 'Clock':
        return <Clock className={`w-6 h-6 text-${color}-500`} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
      <div className={`w-12 h-12 rounded-full bg-${color}-100 flex items-center justify-center mr-4`}>
        {renderIcon()}
      </div>
      <div>
        <h4 className="text-sm text-gray-500 font-medium">{title}</h4>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatBlock;