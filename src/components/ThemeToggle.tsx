import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-600 dark:text-dark-text-secondary" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
};

export default ThemeToggle;