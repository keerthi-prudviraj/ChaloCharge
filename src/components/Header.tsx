import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Car, AlertOctagon, User, LogOut, ShieldCheck, Building } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '../contexts/AuthContext';
import { EmergencySosModal } from './EmergencySosModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Map', href: '/map' },
    { name: 'Trip Planner', href: '/trip-planner' },
    { name: 'My Vehicles', href: '/vehicles' },
    { name: 'Insights', href: '/insights' },
    { name: 'About', href: '/about' },
  ];

  if (isAuthenticated) {
    navigation.push({ name: 'My Dashboard', href: '/dashboard' });
    if (user?.role === 'station_owner' || user?.role === 'admin') {
      navigation.push({ name: 'Station Portal', href: '/station-owner' });
    }
    if (user?.role === 'admin') {
      navigation.push({ name: 'Admin Portal', href: '/admin' });
    }
  }

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-green-500 p-2 rounded-lg text-white shadow-sm">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">ChaloCharge</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                    isActive(item.href)
                      ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Emergency SOS & User Controls */}
            <div className="flex items-center space-x-3">
              
              {/* Emergency SOS Button */}
              <button
                onClick={() => setIsSosOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center shadow animate-pulse"
              >
                <AlertOctagon className="h-4 w-4 mr-1" />
                SOS Low Battery
              </button>

              <DarkModeToggle />

              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/dashboard"
                    className="p-2 text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                  >
                    <User className="h-4 w-4 mr-1 text-green-500" />
                    {user?.full_name?.split(' ')[0] || 'Dashboard'}
                  </Link>

                  <button
                    onClick={logout}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow"
                >
                  Sign In
                </Link>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}

        </div>
      </header>

      <EmergencySosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </>
  );
};

export default Header;