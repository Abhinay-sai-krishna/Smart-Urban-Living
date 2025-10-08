import React, { useState } from 'react';
import Logo from '../components/Logo';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto animate-fade-in-up">
        <form
          onSubmit={handleSubmit}
          className="bg-bg-secondary/90 backdrop-blur-xl p-10 rounded-2xl shadow-xl border border-border-color"
        >
          <div className="flex flex-col items-center mb-8">
            <Logo className="h-20 w-20 mb-4 text-accent" />
            <h1 className="text-2xl font-bold text-text-main text-center">Smart City Dashboard</h1>
            <p className="text-text-secondary mt-2 text-center">Please log in to continue</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter any username"
                className="w-full bg-slate-700/50 border border-border-color rounded-lg px-3 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter any password"
                className="w-full bg-slate-700/50 border border-border-color rounded-lg px-3 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-accent text-white px-4 py-3 rounded-xl font-semibold transform hover:scale-105 hover:shadow-lg hover:shadow-accent/30 focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;