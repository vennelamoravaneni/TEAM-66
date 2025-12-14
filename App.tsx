import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { PolicyWallet } from './pages/PolicyWallet';
import { LandingPage } from './pages/LandingPage';
import { ReadinessModal } from './components/ReadinessModal';
import { ProcessedHospital, UserContextType, AppContext } from './types';

const App: React.FC = () => {
  // Theme State - Initialize from LocalStorage or Default to TRUE (Dark Mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('velix-theme');
      return savedTheme ? JSON.parse(savedTheme) : true;
    } catch (e) {
      return true;
    }
  });

  // Navigation State - Explicitly start at 'landing'
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'wallet'>('landing');

  // Business Logic State
  const [userPolicy, setUserPolicy] = useState('Not Configured'); 
  const [requiredSpecialty, setRequiredSpecialty] = useState('Orthopedics');
  const [selectedHospital, setSelectedHospital] = useState<ProcessedHospital | null>(null);
  const [hoveredHospitalId, setHoveredHospitalId] = useState<string | null>(null);

  // Apply dark mode class to HTML element and save to local storage
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('velix-theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleNavigate = (view: 'dashboard' | 'wallet') => {
      setCurrentView(view);
  };

  return (
    <AppContext.Provider value={{
      userPolicy, setUserPolicy,
      requiredSpecialty, setRequiredSpecialty,
      selectedHospital, setSelectedHospital,
      hoveredHospitalId, setHoveredHospitalId,
      isDarkMode, toggleTheme
    }}>
      <div className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden font-sans">
        
        {/* Navbar - Only visible when NOT on landing page */}
        {currentView !== 'landing' && (
             <Navbar 
                currentView={currentView} 
                onNavigate={handleNavigate}
                userPolicy={userPolicy}
            />
        )}
       
        {/* View Switcher */}
        <main className="flex-1 relative overflow-hidden">
          {currentView === 'landing' && (
              <LandingPage onGetStarted={() => setCurrentView('wallet')} />
          )}

          {currentView === 'dashboard' && (
             <Dashboard />
          )}

          {currentView === 'wallet' && (
            <div className="h-full pt-16">
              <PolicyWallet 
                userPolicy={userPolicy}
                setUserPolicy={setUserPolicy}
                requiredSpecialty={requiredSpecialty}
                setRequiredSpecialty={setRequiredSpecialty}
                onComplete={() => setCurrentView('dashboard')}
              />
            </div>
          )}
        </main>

        {/* Global Modal (Available in Dashboard) */}
        {selectedHospital && (
          <ReadinessModal 
            hospital={selectedHospital}
            onClose={() => setSelectedHospital(null)}
            userPolicy={userPolicy}
            specialty={requiredSpecialty}
          />
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;