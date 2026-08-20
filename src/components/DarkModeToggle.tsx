import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label="Toggle dark mode"
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
          isDarkMode ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <Sun className="h-4 w-4 text-yellow-500" />
        <Moon className="h-4 w-4 text-blue-500" />
      </div>
    </button>
  );
};

export default DarkModeToggle; 