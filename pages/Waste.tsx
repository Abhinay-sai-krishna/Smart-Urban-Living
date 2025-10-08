

import React, { useState, useCallback, useMemo } from 'react';
import AIGenerationBlock from '../components/AIGenerationBlock';
import FilterBar from '../components/FilterBar'; // Import the new component
import { getWasteRoutes } from '../services/geminiService';
// FIX: Changed 'UserRole' from a type-only import to a value import to resolve usage error.
import { UserRole, type WasteData, type RouteInfo } from '../types';
import SkeletonLoader from '../components/SkeletonLoader';

const WasteLoadingSkeleton = () => (
    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-2 space-y-6">
            {/* Filter Bar Skeleton */}
            <div className="bg-bg-secondary backdrop-blur-md p-4 rounded-xl shadow-lg border border-border-color">
                <SkeletonLoader className="h-6 w-1/3 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SkeletonLoader className="h-10" />
                    <SkeletonLoader className="h-10" />
                    <SkeletonLoader className="h-10" />
                    <SkeletonLoader className="h-10" />
                </div>
            </div>

            {/* Bin List Skeleton */}
            <div className="bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg border border-border-color">
                <SkeletonLoader className="h-6 w-1/2 mb-4" />
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <SkeletonLoader key={i} className="h-20 w-full" />
                    ))}
                </div>
            </div>
        </div>

        {/* AI Block Skeleton */}
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

interface WasteProps {
  wasteData: WasteData[];
  userRole: UserRole;
  isLoading: boolean;
}

const getPriorityStyles = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high': return 'border-red-500/50 bg-red-500/20 text-red-400';
    case 'medium': return 'border-yellow-500/50 bg-yellow-500/20 text-yellow-400';
    case 'low': return 'border-slate-500/50 bg-slate-500/20 text-slate-400';
  }
};

const getStatusStyles = (status: 'pending' | 'completed') => {
  return status === 'completed' ? 'text-green-400' : 'text-text-secondary';
};

const getPriorityLeftBorderClass = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high': return 'border-l-red-500';
    case 'medium': return 'border-l-yellow-500';
    case 'low': return 'border-l-slate-600';
  }
};

const BinStatusVisual: React.FC<{ level: number; id: string }> = ({ level, id }) => {
  const color = level > 85 ? '#ef4444' : level > 60 ? '#facc15' : '#4ade80';
  const lidRotation = level > 95 ? -15 : 0;
  const clipPathId = `binClipPath-${id}`;

  // Using a style tag for dynamic, scoped styles to enable transitions.
  const styles = `
    .bin-fill-${id} {
      transform-origin: bottom;
      transition: transform 0.4s ease-out, fill 0.4s ease-out;
    }
    .bin-lid-${id} {
      transform-origin: 50px 15px;
      transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }
  `;

  return (
    <div className="flex items-center space-x-3 w-24">
      <style>{styles}</style>
      <svg width="40" height="40" viewBox="0 0 100 100" className="w-10 h-10 flex-shrink-0">
        <defs>
          <clipPath id={clipPathId}>
            <path d="M20,30 L25,90 H75 L80,30 H20 Z" />
          </clipPath>
        </defs>
        
        {/* Bin body */}
        <path d="M20,30 L25,90 H75 L80,30 H20 Z" fill="#334155" />
        
        {/* Bin fill level - animated with CSS transform */}
        <rect
          className={`bin-fill-${id}`}
          x="22"
          y="30"
          width="56"
          height="60"
          fill={color}
          clipPath={`url(#${clipPathId})`}
          style={{ transform: `scaleY(${level / 100})` }}
        />

        {/* Bin lid - animated with CSS transform */}
        <g style={{ transform: `rotate(${lidRotation}deg)` }} className={`bin-lid-${id}`}>
          <path d="M10,20 H90 L85,15 H15 Z" fill="#475569" />
          <rect x="45" y="5" width="10" height="10" rx="2" fill="#64748b" />
        </g>
      </svg>
      <span className="font-bold text-lg text-text-main">{level}%</span>
    </div>
  );
};


const Waste: React.FC<WasteProps> = ({ wasteData, userRole, isLoading: isDataLoading }) => {
  const [routes, setRoutes] = useState<RouteInfo | string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [optimization, setOptimization] = useState<'distance' | 'time'>('distance');
  
  // State for controls
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortOption, setSortOption] = useState('dueDate_desc'); // Default sort

  const handleGenerateRoutes = useCallback(async () => {
    setIsGenerating(true);
    const result = await getWasteRoutes(wasteData, optimization);
    setRoutes(result);
    setIsGenerating(false);
  }, [wasteData, optimization]);

  const processedWasteData = useMemo(() => {
    // 1. Filtering
    let data = wasteData.filter(bin => {
      // Status Filter
      if (statusFilter !== 'all' && bin.status !== statusFilter) return false;
      
      // Priority Filter
      if (priorityFilter !== 'all' && bin.priority !== priorityFilter) return false;

      // Date Filter
      if (dateFilter !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const binDueDate = new Date(bin.dueDate);
        binDueDate.setHours(0, 0, 0, 0);
        
        if (dateFilter === 'today' && binDueDate.getTime() !== today.getTime()) {
          return false;
        }
        if (dateFilter === 'overdue' && (binDueDate.getTime() >= today.getTime() || bin.status === 'completed')) {
          return false;
        }
        if (dateFilter === 'this_week') {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            if (binDueDate < startOfWeek || binDueDate > endOfWeek) return false;
        }
      }
      
      return true;
    });

    // 2. Sorting
    const [key, direction] = sortOption.split('_');
    const priorityMap = { high: 3, medium: 2, low: 1 };

    data.sort((a, b) => {
        let comparison = 0;
        switch(key) {
        case 'fillLevel':
            comparison = a.fillLevel - b.fillLevel;
            break;
        case 'dueDate':
            comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            break;
        case 'priority':
            comparison = (priorityMap[a.priority] || 0) - (priorityMap[b.priority] || 0);
            break;
        default:
            break;
        }
        return direction === 'desc' ? comparison * -1 : comparison;
    });


    return data;
  }, [wasteData, statusFilter, priorityFilter, dateFilter, sortOption]);

  if (isDataLoading) {
    return <WasteLoadingSkeleton />;
  }

  const routeContent = useMemo(() => {
    if (!routes) {
        return <p className="text-center mt-8">Click "Generate" to create an optimized collection route for high-fill bins.</p>;
    }
    if (typeof routes === 'string') {
        if (routes.startsWith('Error:')) {
            return <p className="text-red-400 p-2">{routes}</p>;
        }
        return <p>{routes}</p>;
    }
    return (
        <div>
            <div className="flex justify-around mb-4 text-center border-b border-border-color pb-3">
                <div>
                    <p className="text-sm text-text-secondary">Est. Distance</p>
                    <p className="text-lg font-bold text-accent">{routes.estimatedDistance}</p>
                </div>
                <div>
                    <p className="text-sm text-text-secondary">Est. Time</p>
                    <p className="text-lg font-bold text-accent">{routes.estimatedTime}</p>
                </div>
            </div>
            <ul className="list-decimal pl-5 space-y-2 mt-4">
                {routes.route.map((stop, index) => (
                    <li key={index} className="text-text-main">{stop}</li>
                ))}
            </ul>
        </div>
    );
  }, [routes]);


  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 space-y-6">
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <FilterBar 
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </div>
        <div className="bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg border border-border-color animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-xl font-semibold mb-4 text-text-main">Smart Bin Collection Tasks</h3>
          <div className="space-y-4">
            {processedWasteData.length > 0 ? (
                processedWasteData.map((bin, index) => (
                    <div 
                      key={bin.id} 
                      className={`p-4 rounded-lg border border-border-color border-l-4 ${getPriorityLeftBorderClass(bin.priority)} flex justify-between items-center transition-all duration-300 hover:border-accent hover:bg-slate-800/50 ${getStatusStyles(bin.status)} animate-fade-in-up`}
                      style={{ animationDelay: `${200 + index * 50}ms` }}
                    >
                        {/* Left side: Location, Status, Due Date */}
                        <div>
                            <p className={`font-bold text-lg text-text-main ${bin.status === 'completed' ? 'line-through text-text-secondary' : ''}`}>{bin.location}</p>
                            <div className="flex items-center mt-2 text-xs text-text-secondary space-x-4">
                            <p>Status: <span className="font-semibold capitalize">{bin.status}</span></p>
                            <p>Due: <span className="font-semibold">{new Date(bin.dueDate).toLocaleDateString()}</span></p>
                            </div>
                        </div>

                        {/* Right side: Visual, Priority */}
                        <div className="flex items-center space-x-4">
                            <BinStatusVisual level={bin.fillLevel} id={bin.id} />
                            <span className={`w-20 text-center px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityStyles(bin.priority)}`}>
                                {bin.priority.toUpperCase()}
                            </span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10">
                    <p className="text-text-secondary">No bins match the current filters.</p>
                </div>
            )}
          </div>
        </div>
      </div>
      <div className="lg:col-span-1 h-full animate-fade-in-up" style={{ animationDelay: '300ms' }}>
         <AIGenerationBlock
            title="AI Optimized Collection Route"
            content={routeContent}
            isLoading={isGenerating}
            onGenerate={handleGenerateRoutes}
            userRole={userRole}
            citizenInfo="Optimized collection routes are automatically sent to sanitation crews to ensure timely pickups and reduce emissions. Help by reporting overflowing bins via the city app."
            controls={
                userRole === UserRole.Admin && (
                    <div className="flex items-center text-sm">
                        <label htmlFor="optimization-select" className="text-text-secondary mr-2 whitespace-nowrap">Optimize for:</label>
                        <select
                            id="optimization-select"
                            value={optimization}
                            onChange={(e) => setOptimization(e.target.value as 'distance' | 'time')}
                            className="bg-slate-700 border border-border-color text-text-main text-sm rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                        >
                            <option value="distance">Shortest Distance</option>
                            <option value="time">Shortest Time</option>
                        </select>
                    </div>
                )
            }
        />
      </div>
    </div>
  );
};

export default Waste;