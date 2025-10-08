
import React, { useState } from 'react';
import { Module, UserRole } from '../types';
import { MODULES } from '../constants';
import Logo from './Logo'; // Import the new Logo component

interface HeaderProps {
  activeModule: Module;
  setActiveModule: (module: Module) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeModule, setActiveModule, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = MODULES.map(({ name }) => (
    <button
      key={name}
      onClick={() => {
        setActiveModule(name);
        setIsMobileMenuOpen(false); // Close menu on selection
      }}
      className={`px-3 py-2 text-sm font-medium rounded-md relative transition-colors duration-300 w-full text-left md:w-auto md:h-full md:flex md:items-center ${
        activeModule === name
          ? 'text-text-main'
          : 'text-text-secondary hover:text-text-main'
      }`}
    >
      {name}
      {activeModule === name && (
        <span className="hidden md:block absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full"></span>
      )}
    </button>
  ));

  return (
    <header className="bg-bg-secondary/80 backdrop-blur-md text-text-main border-b border-border-color relative z-20">
      <div className="p-4 flex items-center justify-between h-16">
        {/* Left side: Logo and App Name */}
        <div className="flex items-center">
          <Logo className="h-8 w-8 text-accent" />
          <h1 className="text-xl font-bold ml-3 hidden sm:block text-text-main">
              Smart City Dashboard
          </h1>
        </div>

        {/* Middle: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 h-full">
          {navLinks}
        </nav>

        {/* Right side: User Role Switcher & Mobile Menu Button */}
        <div className="flex items-center space-x-4">
           <div className="hidden md:flex w-10 h-10 bg-slate-700 rounded-full items-center justify-center font-bold text-text-secondary cursor-pointer hover:bg-slate-600 transition-colors" onClick={onLogout} title="Logout">
            SC
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-md text-text-secondary hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-accent">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-bg-secondary border-t border-border-color">
          <nav className="flex flex-col p-2 space-y-1">
            {navLinks}
             <div className="pt-2 px-2">
                <button 
                    onClick={onLogout}
                    className="w-full text-left bg-slate-700 text-text-secondary px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-600"
                >
                    Logout
                </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;