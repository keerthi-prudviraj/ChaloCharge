import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, Mail, User, ShieldCheck, Building, Car } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const data = await api.login(email, password);
        login(data.access_token, data.user);
      } else {
        const data = await api.register(email, password, fullName, role);
        login(data.access_token, data.user);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoRole: 'user' | 'station_owner' | 'admin') => {
    setError(null);
    setLoading(true);
    let demoEmail = 'driver@chalocharge.com';
    let demoPass = 'Driver123!';
    let demoName = 'EV Driver Demo';

    if (demoRole === 'station_owner') {
      demoEmail = 'owner@chalocharge.com';
      demoPass = 'Owner123!';
      demoName = 'Station Owner Demo';
    } else if (demoRole === 'admin') {
      demoEmail = 'admin@chalocharge.com';
      demoPass = 'Admin123!';
      demoName = 'Platform Admin';
    }

    try {
      try {
        const data = await api.login(demoEmail, demoPass);
        login(data.access_token, data.user);
      } catch (err) {
        // Register demo user if not created
        const data = await api.register(demoEmail, demoPass, demoName, demoRole);
        login(data.access_token, data.user);
      }
      if (demoRole === 'station_owner') navigate('/station-owner');
      else if (demoRole === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        
        {/* Logo & Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-md">
            <Zap className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLogin ? 'Sign in to ChaloCharge' : 'Create ChaloCharge Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? 'Access your EV vehicles, trip history & bookings' : 'Join India’s smart EV charging optimization platform'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Quick Demo Login Shortcut */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5 text-center">
            Quick One-Click Demo Logins
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('user')}
              className="p-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-semibold rounded-lg hover:bg-green-200 transition-colors text-center flex flex-col items-center gap-1"
            >
              <Car className="h-4 w-4 text-green-600" />
              EV Driver
            </button>

            <button
              onClick={() => handleQuickDemoLogin('station_owner')}
              className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded-lg hover:bg-blue-200 transition-colors text-center flex flex-col items-center gap-1"
            >
              <Building className="h-4 w-4 text-blue-600" />
              Station Owner
            </button>

            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-semibold rounded-lg hover:bg-purple-200 transition-colors text-center flex flex-col items-center gap-1"
            >
              <ShieldCheck className="h-4 w-4 text-purple-600" />
              Admin
            </button>
          </div>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-gray-800 px-2 text-gray-400">Or use email</span></div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Select Account Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="user">EV Driver / User</option>
                <option value="station_owner">Charging Station Owner</option>
                <option value="admin">Platform Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-green-600 dark:text-green-400 font-semibold hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already registered? Sign In"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
