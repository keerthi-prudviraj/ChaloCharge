import React, { useState } from 'react';
import { 
  Navigation, 
  Clock, 
  DollarSign, 
  Zap,
  Leaf,
  AlertTriangle,
  Award,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';
import { api, TripPlanResponse } from '../services/api';

const TripPlannerPage = () => {
  const [formData, setFormData] = useState({
    from: 'Hyderabad',
    to: 'Narsapur',
    vehicleModel: 'Tata Nexon EV Max',
    batteryCapacity: '40.5',
    realWorldRange: '260',
    currentCharge: '40',
    preference: 'balanced'
  });

  const [tripPlan, setTripPlan] = useState<TripPlanResponse | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVehicleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value;
    let cap = '40.5';
    let range = '260';
    
    if (model === 'MG ZS EV') {
      cap = '50.3';
      range = '320';
    } else if (model === 'Hyundai Ioniq 5') {
      cap = '72.6';
      range = '420';
    } else if (model === 'Tata Punch EV') {
      cap = '35.0';
      range = '230';
    } else if (model === 'Mahindra XUV400 EV') {
      cap = '39.4';
      range = '250';
    }

    setFormData(prev => ({
      ...prev,
      vehicleModel: model,
      batteryCapacity: cap,
      realWorldRange: range
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlanning(true);
    setBookingSuccess(null);

    try {
      const result = await api.planTrip({
        source_name: formData.from,
        dest_name: formData.to,
        vehicle_model: formData.vehicleModel,
        battery_capacity_kwh: parseFloat(formData.batteryCapacity) || 40.5,
        real_world_range_km: parseFloat(formData.realWorldRange) || 260.0,
        current_battery_pct: parseFloat(formData.currentCharge) || 50.0,
        preference: formData.preference
      });
      setTripPlan(result);
    } catch (error) {
      console.error('Failed to plan trip:', error);
    } finally {
      setIsPlanning(false);
    }
  };

  const handleBookSlot = async (stationId: number, stationName: string) => {
    try {
      await api.createBooking(stationId, 30, tripPlan?.estimated_charging_cost || 200);
      setBookingSuccess(`Successfully reserved a charging slot at ${stationName}! +50 ChaloPoints earned.`);
    } catch (err) {
      setBookingSuccess(`Slot reserved at ${stationName}! (Demo Mode)`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Battery-Aware EV Trip Planner
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Calculate your energy consumption, verify reachable range, and discover the best charging stops ranked by your preferences.
          </p>
        </div>

        {bookingSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-800 dark:bg-green-900/40 dark:border-green-700 dark:text-green-200 rounded-lg flex items-center">
            <CheckCircle className="h-6 w-6 mr-3 text-green-600 flex-shrink-0" />
            <span>{bookingSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Trip Details Form */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Navigation className="h-5 w-5 mr-2 text-green-500" />
                Journey Details
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      From (Current Location)
                    </label>
                    <input
                      type="text"
                      name="from"
                      value={formData.from}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Hyderabad"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      To (Destination)
                    </label>
                    <input
                      type="text"
                      name="to"
                      value={formData.to}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Narsapur or Medak"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Vehicle Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Your EV Vehicle
                  </label>
                  <select
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleVehicleSelect}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Tata Nexon EV Max">Tata Nexon EV Max (40.5 kWh, 260 km)</option>
                    <option value="MG ZS EV">MG ZS EV (50.3 kWh, 320 km)</option>
                    <option value="Hyundai Ioniq 5">Hyundai Ioniq 5 (72.6 kWh, 420 km)</option>
                    <option value="Tata Punch EV">Tata Punch EV (35.0 kWh, 230 km)</option>
                    <option value="Mahindra XUV400 EV">Mahindra XUV400 EV (39.4 kWh, 250 km)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Battery Capacity (kWh)
                    </label>
                    <input
                      type="number"
                      name="batteryCapacity"
                      value={formData.batteryCapacity}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Battery (%)
                    </label>
                    <input
                      type="number"
                      name="currentCharge"
                      value={formData.currentCharge}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* User Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Optimization Priority (What matters most?)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'balanced', label: '⚡ Balanced' },
                      { id: 'cheapest', label: '💰 Cheapest' },
                      { id: 'fastest', label: '⏱️ Fastest Charging' },
                      { id: 'renewable', label: '🌱 Green / Renewable' }
                    ].map(p => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setFormData(prev => ({ ...prev, preference: p.id }))}
                        className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                          formData.preference === p.id 
                            ? 'bg-green-600 text-white border-green-600' 
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPlanning}
                  className="w-full bg-green-600 text-white py-3.5 px-6 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition-colors shadow-md flex items-center justify-center"
                >
                  {isPlanning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculating Battery Route...
                    </>
                  ) : 'Calculate Trip & Charging Stops'}
                </button>
              </form>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 space-y-6">
            
            {tripPlan ? (
              <>
                {/* Warning Banner if insufficient battery */}
                {tripPlan.route.warning && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-lg text-red-900 dark:text-red-200 flex items-start shadow-sm">
                    <ShieldAlert className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Battery Range Warning</h4>
                      <p className="text-sm mt-1">{tripPlan.route.warning}</p>
                    </div>
                  </div>
                )}

                {/* Trip & Route Metrics Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Zap className="h-5 w-5 text-green-500 mr-2" />
                    Energy & Route Overview
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Distance</div>
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{tripPlan.route.distance_km} km</div>
                    </div>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Est. Range</div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">{tripPlan.route.current_range_km} km</div>
                    </div>

                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Energy Required</div>
                      <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{tripPlan.route.energy_required_kwh} kWh</div>
                    </div>

                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Est. Charging Cost</div>
                      <div className="text-xl font-bold text-orange-600 dark:text-orange-400">₹{tripPlan.estimated_charging_cost}</div>
                    </div>
                  </div>

                  {/* Smart Recommendations Bullets */}
                  <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {tripPlan.recommendation_reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start text-xs text-gray-700 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Recommended Station */}
                {tripPlan.best_station && (
                  <div className="bg-gradient-to-br from-green-500 to-emerald-700 text-white rounded-xl p-6 shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                          🏆 Top Recommended Stop ({tripPlan.best_station.score || 85} Score)
                        </span>
                        <h3 className="text-2xl font-bold mt-2">{tripPlan.best_station.name}</h3>
                        <p className="text-xs text-green-100">{tripPlan.best_station.address}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black">₹{tripPlan.best_station.price_per_kwh}</span>
                        <span className="text-xs block text-green-100">/ kWh</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 my-4 bg-white/10 p-3 rounded-lg text-xs">
                      <div>
                        <span className="opacity-80 block">Chargers Available</span>
                        <span className="font-bold text-sm">{tripPlan.best_station.available_chargers} / {tripPlan.best_station.total_chargers}</span>
                      </div>
                      <div>
                        <span className="opacity-80 block">Max Speed</span>
                        <span className="font-bold text-sm">{tripPlan.best_station.max_charging_speed_kw} kW</span>
                      </div>
                      <div>
                        <span className="opacity-80 block">Est. Wait Time</span>
                        <span className="font-bold text-sm">{tripPlan.best_station.wait_time_mins} mins</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tripPlan.best_station.reasons?.map((reason, idx) => (
                        <span key={idx} className="bg-white/20 text-white text-xs px-2 py-0.5 rounded">
                          ✓ {reason}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleBookSlot(tripPlan.best_station!.id, tripPlan.best_station!.name)}
                      className="w-full bg-white text-green-800 py-2.5 rounded-lg font-bold hover:bg-green-50 transition-colors shadow"
                    >
                      Reserve Charging Slot Now
                    </button>
                  </div>
                )}

                {/* Nearby Stations List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                    Other Reachable Charging Stations
                  </h3>

                  <div className="space-y-3">
                    {tripPlan.nearby_stations.map((st) => (
                      <div key={st.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">{st.name}</h4>
                          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>₹{st.price_per_kwh}/kWh</span>
                            <span>•</span>
                            <span>{st.max_charging_speed_kw} kW</span>
                            <span>•</span>
                            <span>{st.available_chargers} available</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleBookSlot(st.id, st.name)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors"
                        >
                          Book Slot
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors">
                <Navigation className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to Plan Your Trip</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Select your EV model, current battery %, and preferred optimization strategy to view recommended charging stops.
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default TripPlannerPage;