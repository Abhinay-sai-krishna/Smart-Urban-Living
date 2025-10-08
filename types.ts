

export enum UserRole {
  Admin = 'Admin',
  Citizen = 'Citizen',
}

export enum Module {
  Dashboard = 'Dashboard',
  Transport = 'Transport',
  Energy = 'Energy',
  Waste = 'Waste',
  Pollution = 'Pollution',
  Map = 'Map',
  About = 'About',
}

// FIX: Added Alert interface to resolve import error in AlertBanner.tsx
export interface Alert {
  message: string;
  type: 'info' | 'warning' | 'danger';
}

export interface TrafficData {
  hour: string;
  density: number;
}

export interface EnergyData {
  time: string;
  usage: number;
}

export interface WasteData {
  id: string;
  location: string;
  fillLevel: number;
  position: {
    lat: number;
    lng: number;
  };
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate: string; // ISO date string
}

export interface PollutionData {
  month: string;
  aqi: number;
}

export interface CurrentWeatherData {
  temperature: number;
  humidity: number;
  precipitationChance: number;
}

export interface DailyForecastData {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

export interface WeatherData {
  current: CurrentWeatherData;
  forecast: DailyForecastData[];
}

export interface RouteInfo {
    route: string[];
    estimatedDistance: string;
    estimatedTime: string;
}