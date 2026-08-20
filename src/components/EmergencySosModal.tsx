import React, { useState } from 'react';
import { AlertOctagon, X, Zap, ShieldAlert, CheckCircle, Navigation } from 'lucide-react';
import { api, Station } from '../services/api';

interface EmergencySosProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySosModal: React.FC<EmergencySosProps> = ({ isOpen, onClose }) => {
  const [currentBatteryPct, setCurrentBatteryPct] = useState('15');
  const [searching, setSearching] = useState(false);
  const [nearestStation, setNearestStation] = useState<Station | null>(null);

  if (!isOpen) return null;

  const handleSearchEmergencyStation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setNearestStation(null);

    try {
      const stations = await api.getStations();
      // Find nearest available station
      const available = stations.filter(s => s.available_chargers > 0);
      if (available.length > 0) {
        setNearestStation(available[0]);
      } else if (stations.length > 0) {
        setNearestStation(stations[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-red-500 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl animate-pulse">
            <AlertOctagon className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-red-600 dark:text-red-400">Emergency "I'm Running Low" SOS</h2>
            <p className="text-xs text-gray-600 dark:text-gray-300">Find the nearest reachable charging station immediately.</p>
          </div>
        </div>

        <form onSubmit={handleSearchEmergencyStation} className="space-y-4 my-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Current Remaining Battery Level (%)
            </label>
            <input
              type="number"
              value={currentBatteryPct}
              onChange={(e) => setCurrentBatteryPct(e.target.value)}
              min="1"
              max="30"
              className="w-full border-2 border-red-300 dark:border-red-800 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={searching}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-extrabold hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center text-sm"
          >
            {searching ? 'Locating Nearest Emergency Station...' : '🚨 Find Nearest Emergency Charger Now'}
          </button>
        </form>

        {nearestStation && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 font-bold px-2 py-0.5 rounded uppercase">
                  ✓ Nearest Reachable Charger Found
                </span>
                <h3 className="font-bold text-base text-gray-900 dark:text-white mt-1">{nearestStation.name}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">{nearestStation.address}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">₹{nearestStation.price_per_kwh}</span>
                <span className="text-[10px] text-gray-500 block">/ kWh</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-green-200 dark:border-green-800">
              <div>
                <span className="text-gray-500 block">Chargers Free</span>
                <span className="font-bold text-green-700 dark:text-green-300">{nearestStation.available_chargers} / {nearestStation.total_chargers}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Charging Speed</span>
                <span className="font-bold text-green-700 dark:text-green-300">{nearestStation.max_charging_speed_kw} kW Fast DC</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
