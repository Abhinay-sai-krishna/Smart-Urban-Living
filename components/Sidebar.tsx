
import React from 'react';
import { Module } from '../types';
import { MODULES } from '../constants';

interface SidebarProps {
  activeModule: Module;
  setActiveModule: (module: Module) => void;
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule, isSidebarOpen }) => {
  return (
    <aside className={`bg-slate-900/70 backdrop-blur-lg text-text-main transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'} lg:w-64 flex flex-col border-r border-border-color`}>
      <div className={`p-4 h-16 flex items-center border-b border-border-color ${isSidebarOpen ? 'justify-start' : 'justify-center'} lg:justify-start`}>
        <div className={`bg-accent rounded-full h-8 w-8 flex items-center justify-center`}>
            <span className="text-white font-bold">S</span>
        </div>
        <h1 className={`text-xl font-bold ml-3 text-text-main ${!isSidebarOpen && 'lg:inline hidden'}`}>
            Smart Urban Living
        </h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {MODULES.map(({ name, icon }) => (
          <button
            key={name}
            onClick={() => setActiveModule(name)}
            className={`flex items-center w-full p-3 text-base rounded-lg transition-all duration-200 transform hover:scale-105 ${
              activeModule === name
                ? 'bg-accent text-white font-semibold shadow-lg shadow-accent/20'
                : 'text-text-secondary hover:bg-slate-700/50 hover:text-text-main'
            }`}
          >
            {icon}
            <span className={`ml-4 ${!isSidebarOpen && 'lg:inline hidden'}`}>{name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;