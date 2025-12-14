import React, { useContext } from 'react';
import { ShieldCheck, User, LayoutDashboard, FileText, Sun, Moon } from 'lucide-react';
import { AppContext } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'wallet';
  onNavigate: (view: 'dashboard' | 'wallet') => void;
  userPolicy: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, userPolicy }) => {
  const context = useContext(AppContext);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav h-16 px-6 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="bg-medical-500 text-white p-1.5 rounded-lg shadow-md shadow-medical-200">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Velix<span className="text-medical-500">Health</span>
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onNavigate('wallet')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              currentView === 'wallet' 
                ? 'bg-white dark:bg-slate-700 text-medical-700 dark:text-medical-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <FileText size={16} />
            My Shield (AI Scanner)
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              currentView === 'dashboard' 
                ? 'bg-white dark:bg-slate-700 text-medical-700 dark:text-medical-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <LayoutDashboard size={16} />
            Find Care
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={context?.toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          aria-label="Toggle Theme"
        >
          {context?.isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
          <span className={`w-2 h-2 rounded-full animate-pulse ${userPolicy !== 'Not Configured' ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
          Policy: <span className="font-semibold">{userPolicy}</span>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
          <User size={20} className="text-slate-600 dark:text-slate-400" />
        </button>
      </div>
    </nav>
  );
};