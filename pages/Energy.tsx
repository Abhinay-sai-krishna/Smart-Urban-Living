

import React, { useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getEnergyTips } from '../services/geminiService';
import AIGenerationBlock from '../components/AIGenerationBlock';
import type { EnergyData, UserRole } from '../types';
import SkeletonLoader from '../components/SkeletonLoader';

const EnergyLoadingSkeleton = () => (
    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-2 bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg h-[400px] lg:h-auto border border-border-color">
            <SkeletonLoader className="h-6 w-1/2 mb-4" />
            <SkeletonLoader className="h-full w-full" style={{ height: 'calc(100% - 2.5rem)'}} />
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

interface EnergyProps {
  energyData: EnergyData[];
  userRole: UserRole;
  isLoading: boolean;
}

const Energy: React.FC<EnergyProps> = ({ energyData, userRole, isLoading }) => {
  const [tips, setTips] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTips = useCallback(async () => {
    setIsGenerating(true);
    const result = await getEnergyTips(energyData);
    setTips(result);
    setIsGenerating(false);
  }, [energyData]);

  if (isLoading) {
    return <EnergyLoadingSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg h-[400px] lg:h-auto border border-border-color animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <h3 className="text-xl font-semibold mb-4 text-text-main">Real-Time Energy Consumption (MWh)</h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={energyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
            <XAxis dataKey="time" stroke="#94a3b8" />
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
            <Line type="monotone" dataKey="usage" stroke="#818cf8" name="Usage (MWh)" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
       <div className="lg:col-span-1 h-full animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <AIGenerationBlock
          title="AI Energy Efficiency Tips"
          content={tips}
          isLoading={isGenerating}
          onGenerate={handleGenerateTips}
          userRole={userRole}
          citizenInfo="Energy-saving tips for citizens: 1. Unplug electronics when not in use. 2. Switch to LED lighting. 3. Use smart thermostats to optimize heating and cooling."
        />
      </div>
    </div>
  );
};

export default Energy;