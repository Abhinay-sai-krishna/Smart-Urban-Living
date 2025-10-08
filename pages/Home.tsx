import React from 'react';
import Logo from '../components/Logo';
import { TransportIcon, EnergyIcon, WasteIcon, PollutionIcon } from '../components/Icons';

interface HomeProps {
  onNavigateToLogin: () => void;
}

const Feature: React.FC<{ icon: React.ReactNode; title: string; delay: string }> = ({ icon, title, delay }) => (
  <div className="flex flex-col items-center space-y-2 animate-fade-in-up" style={{ animationDelay: delay }}>
    <div className="bg-slate-800/50 p-4 rounded-full border border-border-color">
      {icon}
    </div>
    <span className="text-sm text-text-secondary">{title}</span>
  </div>
);

const Home: React.FC<HomeProps> = ({ onNavigateToLogin }) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center text-text-main p-4">
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex justify-center mb-6 animate-fade-in-down">
            <Logo className="h-24 w-24 text-accent" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Smart Urban Living Dashboard
        </h1>

        <p className="mt-4 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '250ms' }}>
          Harnessing data to build a sustainable, efficient, and responsive city of tomorrow.
        </p>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            <Feature icon={<TransportIcon />} title="Live Traffic" delay="400ms" />
            <Feature icon={<EnergyIcon />} title="Energy Grid" delay="500ms" />
            <Feature icon={<WasteIcon />} title="Waste Management" delay="600ms" />
            <Feature icon={<PollutionIcon />} title="Air Quality" delay="700ms" />
        </div>

        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '850ms' }}>
            <button
                onClick={onNavigateToLogin}
                className="bg-accent text-white font-bold text-lg px-10 py-4 rounded-lg shadow-lg shadow-accent/20 hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-accent/50"
            >
                Enter Dashboard
            </button>
        </div>
      </div>
    </div>
  );
};

export default Home;