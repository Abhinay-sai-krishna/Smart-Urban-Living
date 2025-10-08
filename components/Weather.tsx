import React from 'react';
import type { WeatherData } from '../types';
import { WeatherIcon } from './Icons';

interface WeatherProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
}

const Weather: React.FC<WeatherProps> = ({ weatherData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg border border-border-color flex items-center justify-center h-48 animate-subtle-pulse">
        <p className="text-text-secondary">Loading Weather Forecast...</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
        <div className="bg-red-500/20 p-6 rounded-xl shadow-lg border border-red-500/50 flex items-center justify-center h-48">
            <p className="text-red-300">Could not load weather data.</p>
        </div>
    );
  }

  const { current, forecast } = weatherData;

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="bg-bg-secondary backdrop-blur-md p-6 rounded-xl shadow-lg border border-border-color animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        {/* Current Weather */}
        <div className="flex items-center space-x-6">
          <WeatherIcon code={forecast[0].weatherCode} className="h-20 w-20 text-accent" />
          <div>
            <p className="text-5xl font-bold text-text-main">{current.temperature}°C</p>
            <p className="text-text-secondary">Hyderabad, India</p>
          </div>
          <div className="pl-6 border-l border-border-color">
            <p className="text-text-secondary">Humidity: <span className="font-bold text-text-main">{current.humidity}%</span></p>
            <p className="text-text-secondary">Precipitation: <span className="font-bold text-text-main">{current.precipitationChance}%</span></p>
          </div>
        </div>
        
        {/* 3-Day Forecast */}
        <div className="flex space-x-4 sm:space-x-6 mt-6 sm:mt-0 w-full sm:w-auto overflow-x-auto pb-2">
          {forecast.map((day) => (
            <div key={day.date} className="flex flex-col items-center bg-slate-800/50 p-3 rounded-lg flex-shrink-0 w-24 border border-border-color">
              <p className="font-bold text-text-main">{getDayOfWeek(day.date)}</p>
              <WeatherIcon code={day.weatherCode} className="h-10 w-10 text-accent my-1" />
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-text-main">{day.maxTemp}°</span> / {day.minTemp}°
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;