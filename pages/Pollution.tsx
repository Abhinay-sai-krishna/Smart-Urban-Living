

import React, { useState, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPollutionAlerts } from '../services/geminiService';
import AIGenerationBlock from '../components/AIGenerationBlock';
import type { PollutionData, UserRole } from '../types';
import SkeletonLoader from '../components/SkeletonLoader';

const PollutionLoadingSkeleton = () => (
    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-2 bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg h-[400px] lg:h-auto border border-border-color">
            <div className="flex justify-between items-baseline">
                <SkeletonLoader className="h-6 w-1/2" />
                <SkeletonLoader className="h-8 w-1/4" />
            </div>
            <SkeletonLoader className="h-full w-full mt-4" style={{ height: 'calc(100% - 3.5rem)'}} />
        </div>
        <div className="lg:col-span-1 h-full">
            <div className="bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg h-full border border-border-color">
                <SkeletonLoader className="h-6 w-2/3 mb-4" />
                <SkeletonLoader className="h-4 w-full mb-2" />
                <SkeletonLoader className="h-4 w-full mb-2" />
                <SkeletonLoader className="h-4 w-5/6" />
            </div>
        </div>
    </div>
);

interface PollutionProps {
  pollutionData: PollutionData[];
  userRole: UserRole;
  isLoading: boolean;
}

const Pollution: React.FC<PollutionProps> = ({ pollutionData, userRole, isLoading: isDataLoading }) => {
  const [alerts, setAlerts] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAlerts = useCallback(async () => {
    setIsGenerating(true);
    const result = await getPollutionAlerts(pollutionData);
    setAlerts(result);
    setIsGenerating(false);
  }, [pollutionData]);
  
  if (isDataLoading || pollutionData.length === 0) {
    return <PollutionLoadingSkeleton />;
  }

  const latestAqi = pollutionData[pollutionData.length-1].aqi;
  const aqiColor = latestAqi > 150 ? 'text-red-400' : latestAqi > 100 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg flex flex-col h-[400px] lg:h-auto border border-border-color animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <div className='flex justify-between items-baseline'>
          <h3 className="text-xl font-semibold text-text-main">Air Quality Index (AQI) Trend</h3>
          <p className='text-text-secondary'>Current AQI: <span className={`font-bold text-2xl ${aqiColor}`}>{latestAqi}</span></p>
        </div>
        <ResponsiveContainer width="100%" height="90%" className="mt-4">
          <AreaChart data={pollutionData}>
            <defs>
              <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
                contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(100, 116, 139, 0.5)', 
                color: '#f1f5f9' 
                }}
            />
            <Legend wrapperStyle={{color: '#f1f5f9'}}/>
            <Area type="monotone" dataKey="aqi" stroke="#818cf8" fillOpacity={1} fill="url(#colorAqi)" name="AQI" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="lg:col-span-1 h-full animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <AIGenerationBlock
          title="AI Predictive Alerts"
          content={alerts}
          isLoading={isGenerating}
          onGenerate={handleGenerateAlerts}
          userRole={userRole}
          citizenInfo="Air quality alerts are issued when the AQI is expected to reach unhealthy levels. Check local health advisories and consider limiting outdoor activities during high-pollution events."
        />
      </div>
    </div>
  );
};

export default Pollution;