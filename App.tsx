import React, { useState, useEffect } from 'react';
import { Module, UserRole, TrafficData, EnergyData, WasteData, PollutionData, Alert, WeatherData } from './types';
import * as dataService from './services/dataService';

// Components
import Background from './components/Background';
import Header from './components/Header';
import AlertBanner from './components/AlertBanner';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transport from './pages/Transport';
import Energy from './pages/Energy';
import Waste from './pages/Waste';
import Pollution from './pages/Pollution';
import MapPage from './pages/Map';
import About from './pages/About';

const App: React.FC = () => {
  // State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'home' | 'login'>('home');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.Admin);
  const [activeModule, setActiveModule] = useState<Module>(Module.Dashboard);

  // Data State
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [wasteData, setWasteData] = useState<WasteData[]>([]);
  const [pollutionData, setPollutionData] = useState<PollutionData[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(true);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  
  const [alert, setAlert] = useState<Alert | null>(null);

  // Initial data load
  useEffect(() => {
    // Simulate API call for initial data
    const timer = setTimeout(() => {
      setTrafficData(dataService.generateInitialTrafficData());
      setEnergyData(dataService.generateInitialEnergyData());
      setWasteData(dataService.generateInitialWasteData());
      setPollutionData(dataService.generateInitialPollutionData());
      setIsDataLoading(false);
    }, 1500); // 1.5 second delay

    return () => clearTimeout(timer);
  }, []);

  // Data update intervals
  useEffect(() => {
    if (!isLoggedIn) return;

    const trafficInterval = setInterval(() => {
      setTrafficData(prevData => dataService.updateTrafficData(prevData));
    }, 5000); // every 5 seconds

    const energyInterval = setInterval(() => {
      setEnergyData(prevData => dataService.updateEnergyData(prevData));
    }, 30000); // every 30 seconds

    const wasteInterval = setInterval(() => {
      setWasteData(prevData => dataService.updateWasteData(prevData));
    }, 10000); // every 10 seconds

    const fetchAqi = async () => {
      const { aqi, error } = await dataService.fetchCurrentAQI();
      if (error) {
        setAlert({ message: `Could not fetch real-time AQI: ${error}`, type: 'warning' });
        return;
      }
      if (aqi !== null) {
        setPollutionData(prevData => {
            if (prevData.length === 0) {
              return prevData;
            }
            // Create a new array with all but the last element
            const allButLast = prevData.slice(0, prevData.length - 1);
            // Get the last element from the previous state
            const lastElement = prevData[prevData.length - 1];
            // Return a new array, spreading the initial elements and adding a new object for the last element with the updated AQI
            return [
              ...allButLast,
              { ...lastElement, aqi: aqi }
            ];
        });
      }
    };
    
    fetchAqi();
    const pollutionInterval = setInterval(fetchAqi, 60000 * 5); // every 5 minutes

    const loadWeatherData = async () => {
        setIsWeatherLoading(true);
        const { data, error } = await dataService.fetchWeatherData();
        if (error) {
            setAlert({ message: `Could not fetch weather data: ${error}`, type: 'warning' });
        } else {
            setWeatherData(data);
        }
        setIsWeatherLoading(false);
    };
    loadWeatherData();
    const weatherInterval = setInterval(loadWeatherData, 60000 * 30); // every 30 minutes


    return () => {
      clearInterval(trafficInterval);
      clearInterval(energyInterval);
      clearInterval(wasteInterval);
      clearInterval(pollutionInterval);
      clearInterval(weatherInterval);
    };
  }, [isLoggedIn]);
  
  // Handlers
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveModule(Module.Dashboard); // Reset to dashboard on logout
    setView('home'); // Reset to home page on logout
  };
  
  const renderContent = () => {
    switch (activeModule) {
      case Module.Dashboard:
        return <Dashboard 
                  trafficData={trafficData} 
                  energyData={energyData} 
                  wasteData={wasteData} 
                  pollutionData={pollutionData}
                  weatherData={weatherData}
                  isWeatherLoading={isWeatherLoading}
                />;
      case Module.Transport:
        return <Transport trafficData={trafficData} userRole={userRole} isLoading={isDataLoading} />;
      case Module.Energy:
        return <Energy energyData={energyData} userRole={userRole} isLoading={isDataLoading} />;
      case Module.Waste:
        return <Waste wasteData={wasteData} userRole={userRole} isLoading={isDataLoading} />;
      case Module.Pollution:
        return <Pollution pollutionData={pollutionData} userRole={userRole} isLoading={isDataLoading} />;
      case Module.Map:
        return <MapPage wasteData={wasteData} />;
      case Module.About:
        return <About />;
      default:
        return <Dashboard 
                  trafficData={trafficData} 
                  energyData={energyData} 
                  wasteData={wasteData} 
                  pollutionData={pollutionData} 
                  weatherData={weatherData}
                  isWeatherLoading={isWeatherLoading}
                />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="text-text-main font-sans min-h-screen">
        <Background />
        {view === 'home' && <Home onNavigateToLogin={() => setView('login')} />}
        {view === 'login' && <Login onLogin={handleLogin} />}
      </div>
    );
  }

  return (
    <div className="flex h-screen text-text-main font-sans overflow-hidden">
      <Background />
      <div className="flex flex-col flex-1 w-full h-full">
        <Header
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          userRole={userRole}
          setUserRole={setUserRole}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto">
          <div key={activeModule} className="animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
      <AlertBanner alert={alert} onDismiss={() => setAlert(null)} />
    </div>
  );
};

export default App;