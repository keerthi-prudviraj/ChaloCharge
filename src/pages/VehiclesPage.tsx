import React, { useState } from 'react';
import { Car, Plus, Trash2, Zap, Battery, ShieldCheck } from 'lucide-react';

interface EVVehicle {
  id: string;
  brand: string;
  model: string;
  batteryCapacity: number;
  realWorldRange: number;
  connectorType: string;
  maxAcSpeed: number;
  maxDcSpeed: number;
  currentBattery: number;
}

const DEFAULT_VEHICLES: EVVehicle[] = [
  {
    id: '1',
    brand: 'Tata',
    model: 'Nexon EV Max',
    batteryCapacity: 40.5,
    realWorldRange: 260,
    connectorType: 'CCS2',
    maxAcSpeed: 7.2,
    maxDcSpeed: 50.0,
    currentBattery: 75
  },
  {
    id: '2',
    brand: 'MG',
    model: 'ZS EV',
    batteryCapacity: 50.3,
    realWorldRange: 320,
    connectorType: 'CCS2',
    maxAcSpeed: 7.4,
    maxDcSpeed: 50.0,
    currentBattery: 85
  }
];

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState<EVVehicle[]>(DEFAULT_VEHICLES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: 'Tata',
    model: 'Punch EV',
    batteryCapacity: '35',
    realWorldRange: '230',
    connectorType: 'CCS2',
    maxAcSpeed: '7.2',
    maxDcSpeed: '50',
    currentBattery: '80'
  });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const created: EVVehicle = {
      id: String(Date.now()),
      brand: newVehicle.brand,
      model: newVehicle.model,
      batteryCapacity: parseFloat(newVehicle.batteryCapacity) || 40,
      realWorldRange: parseFloat(newVehicle.realWorldRange) || 250,
      connectorType: newVehicle.connectorType,
      maxAcSpeed: parseFloat(newVehicle.maxAcSpeed) || 7.2,
      maxDcSpeed: parseFloat(newVehicle.maxDcSpeed) || 50.0,
      currentBattery: parseFloat(newVehicle.currentBattery) || 80
    };
    setVehicles(prev => [...prev, created]);
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Car className="h-8 w-8 text-green-500 mr-3" />
              My EV Vehicles
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your saved EV models for battery-aware route calculations and charging recommendations.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors flex items-center shadow"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add New Vehicle
          </button>
        </div>

        {/* Add Form Modal/Card */}
        {showAddForm && (
          <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add EV Profile</h2>
            <form onSubmit={handleAddVehicle} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
                <input
                  type="text"
                  required
                  value={newVehicle.brand}
                  onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Battery Capacity (kWh)</label>
                <input
                  type="number"
                  required
                  value={newVehicle.batteryCapacity}
                  onChange={(e) => setNewVehicle({ ...newVehicle, batteryCapacity: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Real-World Range (km)</label>
                <input
                  type="number"
                  required
                  value={newVehicle.realWorldRange}
                  onChange={(e) => setNewVehicle({ ...newVehicle, realWorldRange: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Connector Type</label>
                <select
                  value={newVehicle.connectorType}
                  onChange={(e) => setNewVehicle({ ...newVehicle, connectorType: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="CCS2">CCS2 (Fast DC)</option>
                  <option value="Type 2">Type 2 (AC)</option>
                  <option value="GB/T">GB/T</option>
                  <option value="CHAdeMO">CHAdeMO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Max DC Speed (kW)</label>
                <input
                  type="number"
                  value={newVehicle.maxDcSpeed}
                  onChange={(e) => setNewVehicle({ ...newVehicle, maxDcSpeed: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700"
                >
                  Save Vehicle Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm relative group hover:shadow-md transition-shadow">
              
              <button
                onClick={() => handleDelete(v.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete Vehicle"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{v.brand} {v.model}</h3>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-mono">
                    {v.connectorType}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs border-t border-gray-100 dark:border-gray-700 pt-4">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block">Battery Capacity</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">{v.batteryCapacity} kWh</span>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-gray-400 block">Real-World Range</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">{v.realWorldRange} km</span>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-gray-400 block">Max Charging Speed</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">{v.maxDcSpeed} kW DC</span>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-gray-400 block">Current Battery %</span>
                  <span className="font-bold text-green-600 dark:text-green-400 text-sm">{v.currentBattery}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default VehiclesPage;
