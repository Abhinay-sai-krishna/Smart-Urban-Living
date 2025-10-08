import React from 'react';

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  unit?: string;
  description: string;
  children?: React.ReactNode;
  trend?: { value: string; color: string; };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, description, children, trend }) => {
  return (
    <div className="bg-bg-secondary backdrop-blur-md p-5 rounded-xl shadow-lg flex flex-col justify-between border border-border-color transition-all duration-300 hover:border-accent hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-text-secondary text-sm">{title}</h4>
        <div className="text-accent">
          {children}
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-text-main mt-2">
          {value}
          {unit && <span className="text-xl font-medium text-text-secondary ml-1">{unit}</span>}
        </p>
        <div className="flex items-center mt-1">
          <p className="text-sm text-text-secondary">{description}</p>
          {trend && <p className={`text-sm font-semibold ml-2 ${trend.color}`}>{trend.value}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;