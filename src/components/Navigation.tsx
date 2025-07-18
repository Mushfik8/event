import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, MessageCircle, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  // Close mobile menu when navigating
  const handleLinkClick = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Top nav bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-light-bg dark:bg-dark-bg shadow-sm border-b border-light-border dark:border-dark-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-light-text dark:text-dark-text">Eventy</span>
            </Link>

            {/* Desktop nav items */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                        : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right: User menu & theme toggle */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />

              {/* Mobile hamburger menu button */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-2 rounded-md text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors duration-200"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* User avatar and name - hidden on very small screens to save space */}
              <div className="hidden sm:flex items-center space-x-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-light-border dark:border-dark-border"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-light-text dark:text-dark-text font-medium">{user?.name}</span>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary rounded-lg transition-all duration-200"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-light-bg dark:bg-dark-bg border-t border-light-border dark:border-dark-border shadow-md">
            <div className="flex flex-col space-y-1 px-4 py-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                        : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Padding to prevent content being hidden behind fixed nav */}
      <style>
        {`
          main, .page-content {
            padding-top: 4rem; /* nav height */
          }
        `}
      </style>
    </>
  );
};

export default Navigation;
