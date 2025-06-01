import React from 'react';

interface StatBlockProps {
  label: string;
  value: string;
  icon: string;
}

const StatBlock: React.FC<StatBlockProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-[#5B3DF4]/20">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">{icon}</span>
        <h3 className="text-lg font-medium text-gray-600">{label}</h3>
      </div>
      <p className="text-3xl font-heading font-bold">
        {value}
      </p>
    </div>
  );
};

export default StatBlock;