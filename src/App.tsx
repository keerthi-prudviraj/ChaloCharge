import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import TripPlannerPage from './pages/TripPlannerPage';
import InsightsPage from './pages/InsightsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import VehiclesPage from './pages/VehiclesPage';
import DashboardPage from './pages/DashboardPage';
import StationOwnerDashboard from './pages/StationOwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VoiceAssistant from './components/VoiceAssistant';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [voiceCommand, setVoiceCommand] = useState<string>('');

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    setVoiceCommand(command);
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/trip-planner" element={<TripPlannerPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/station-owner" element={<StationOwnerDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
            <VoiceAssistant onCommand={handleVoiceCommand} />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
