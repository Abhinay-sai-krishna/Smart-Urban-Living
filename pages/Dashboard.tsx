import React from 'react';
import StatCard from '../components/StatCard';
import { TrafficData, EnergyData, WasteData, PollutionData, WeatherData } from '../types';
import { TransportIcon, EnergyIcon, WasteIcon, PollutionIcon } from '../components/Icons';
import Weather from '../components/Weather';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  trafficData: TrafficData[];
  energyData: EnergyData[];
  wasteData: WasteData[];
  pollutionData: PollutionData[];
  weatherData: WeatherData | null;
  isWeatherLoading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ trafficData, energyData, wasteData, pollutionData, weatherData, isWeatherLoading }) => {
  // Calculate stats from data
  const latestTrafficDensity = trafficData.length > 0 ? trafficData[trafficData.length - 1].density : 0;
  const avgEnergyUsage = energyData.length > 0 ? energyData.reduce((acc, cur) => acc + cur.usage, 0) / energyData.length : 0;
  const highFillBins = wasteData.filter(bin => bin.fillLevel > 80).length;
  const latestAqi = pollutionData.length > 0 ? pollutionData[pollutionData.length - 1].aqi : 0;

  const getAqiColor = (aqi: number) => {
    if (aqi > 150) return 'text-red-400';
    if (aqi > 100) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex-shrink-0 mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-text-main">City-Wide Dashboard</h1>
        <p className="text-text-secondary mt-1">Real-time overview of urban metrics.</p>
      </div>

      <Weather weatherData={weatherData} isLoading={isWeatherLoading} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <StatCard
            title="Traffic Density"
            value={latestTrafficDensity}
            unit="%"
            description="Latest city-wide average"
          >
            <TransportIcon />
          </StatCard>
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <StatCard
            title="Energy Consumption"
            value={avgEnergyUsage.toFixed(0)}
            unit="MWh"
            description="24-hour average"
          >
            <EnergyIcon />
          </StatCard>
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <StatCard
            title="High-Fill Bins"
            value={highFillBins}
            unit="bins"
            description="Needing immediate attention (>80%)"
          >
            <WasteIcon />
          </StatCard>
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <StatCard
            title="Air Quality Index (AQI)"
            value={<span className={getAqiColor(latestAqi)}>{latestAqi}</span>}
            description="Current U-AQI reading"
          >
            <PollutionIcon />
          </StatCard>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart Card */}
        <div className="bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg border border-border-color animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <h3 className="text-lg font-semibold mb-4 text-text-main">Traffic Density Trend</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(100, 116, 139, 0.5)', 
                    color: '#f1f5f9' 
                  }}
                />
                <Area type="monotone" dataKey="density" stroke="#818cf8" fill="url(#trafficGradient)" name="Density (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pollution Chart Card */}
        <div className="bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg border border-border-color animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <h3 className="text-lg font-semibold mb-4 text-text-main">Air Quality Index (AQI) Trend</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pollutionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="pollutionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                 <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(100, 116, 139, 0.5)', 
                    color: '#f1f5f9' 
                  }}
                />
                <Area type="monotone" dataKey="aqi" stroke="#818cf8" fill="url(#pollutionGradient)" name="AQI" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;