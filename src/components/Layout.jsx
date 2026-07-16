import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Moon, Sun } from 'lucide-react';

const Layout = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check initial theme
    if (document.documentElement.classList.contains('light')) {
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background text-text transition-colors duration-500">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />
      
      <header className="glass-panel sticky top-0 z-50 border-b border-surface-light bg-surface/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-text tracking-tight">Quiz<span className="text-primary">Master</span></span>
          </Link>

          <button 
            onClick={toggleTheme}
            className="p-2 bg-surface hover:bg-surface-hover rounded-full shadow-sm transition-colors border border-surface-light"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
          </button>
        </div>
      </header>
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-0">
        {children}
      </main>
      
      <footer className="border-t border-white/10 py-6 text-center text-sm text-text-muted z-0">
        &copy; {new Date().getFullYear()} QuizMaster App. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
