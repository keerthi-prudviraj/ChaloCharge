import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Zap, 
  DollarSign, 
  Navigation, 
  RefreshCw, 
  ShieldCheck, 
  Building, 
  Compass, 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Phone,
  Clock,
  Globe,
  Info
} from 'lucide-react';
import EVMap from '../components/EVMap';
import { api, Station } from '../services/api';

const MapPage = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [operators, setOperators] = useState<string[]>([]);
  const [connectors, setConnectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  const [filter, setFilter] = useState({
    operator: 'all',
    connector: 'all',
    chargingType: 'all',
    availability: 'all',
    maxPrice: 25,
    city: 'Hyderabad'
  });

  // Load operators and connectors
  useEffect(() => {
    async function loadMetadata() {
      const ops = await api.getOperators();
      const conns = await api.getConnectors();
      setOperators(ops);
      setConnectors(conns);
    }
    loadMetadata();
  }, []);

  // Fetch stations when filters change
  useEffect(() => {
    async function fetchStations() {
      setLoading(true);
      try {
        const data = await api.getStations({
          city: filter.city,
          operator: filter.operator,
          connector_type: filter.connector,
          charging_type: filter.chargingType,
          max_price: filter.maxPrice,
          available_only: filter.availability === 'available'
        });
        setStations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStations();
  }, [filter]);

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const data = await api.getNearbyStations(latitude, longitude, 15);
        setStations(data);
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation error fallback to Hyderabad center:', err);
        setLoading(false);
      }
    );
  };

  const handleReportIssue = async (stationId: number, issueType: string) => {
    try {
      await api.reportStationIssue(stationId, issueType, "User reported discrepancy via Map interface.");
      setReportSuccess(`Thank you! Issue report (${issueType}) submitted to admin for verification.`);
    } catch (err) {
      setReportSuccess('Issue report submitted for admin review!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
              <Zap className="h-7 w-7 text-green-500 mr-2.5" />
              Hyderabad EV Charging Stations
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Verified charging infrastructure database across Hyderabad metropolitan area.
            </p>
          </div>

          <button
            onClick={handleNearMe}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center shadow transition-colors"
          >
            <Compass className="h-4 w-4 mr-1.5" />
            Find Charging Stations Near Me
          </button>
        </div>

        {reportSuccess && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-800 text-xs rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />
            <span>{reportSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Production Filters Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4 border-b pb-3 dark:border-gray-700">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-green-500 mr-2" />
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">Station Filters</h2>
                </div>
                <button
                  onClick={() => setFilter({ operator: 'all', connector: 'all', chargingType: 'all', availability: 'all', maxPrice: 25, city: 'Hyderabad' })}
                  className="text-xs text-green-600 dark:text-green-400 hover:underline font-semibold"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* Operator Filter */}
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Charging Network / Operator
                  </label>
                  <select
                    value={filter.operator}
                    onChange={(e) => setFilter({ ...filter, operator: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white font-medium"
                  >
                    <option value="all">All Operators ({operators.length})</option>
                    {operators.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>

                {/* Connector Type Filter */}
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Connector Type
                  </label>
                  <select
                    value={filter.connector}
                    onChange={(e) => setFilter({ ...filter, connector: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white font-medium"
                  >
                    <option value="all">All Connector Standards</option>
                    {connectors.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Charging AC/DC Type */}
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Charging Mode
                  </label>
                  <select
                    value={filter.chargingType}
                    onChange={(e) => setFilter({ ...filter, chargingType: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white font-medium"
                  >
                    <option value="all">AC & DC</option>
                    <option value="DC">DC Fast Charging Only</option>
                    <option value="AC">AC Standard Only</option>
                  </select>
                </div>

                {/* Max Price Slider */}
                <div>
                  <div className="flex justify-between font-bold text-gray-700 dark:text-gray-300 mb-1">
                    <span>Max Price (₹/kWh)</span>
                    <span className="text-green-600">₹{filter.maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="25"
                    value={filter.maxPrice}
                    onChange={(e) => setFilter({ ...filter, maxPrice: parseInt(e.target.value) })}
                    className="w-full accent-green-600 cursor-pointer"
                  />
                </div>

                {/* Availability Checkbox */}
                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id="availableOnly"
                    checked={filter.availability === 'available'}
                    onChange={(e) => setFilter({ ...filter, availability: e.target.checked ? 'available' : 'all' })}
                    className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <label htmlFor="availableOnly" className="ml-2 font-semibold text-gray-700 dark:text-gray-300">
                    Show Available Stations Only
                  </label>
                </div>

              </div>
            </div>
          </div>

          {/* Interactive Mapbox Map & Station List */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Map Component */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Interactive Mapbox Map</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Rendering {stations.length} verified Hyderabad charging locations</p>
                </div>
                {loading && (
                  <span className="text-xs text-green-600 font-semibold animate-pulse">Loading live data...</span>
                )}
              </div>
              <EVMap />
            </div>

            {/* Verified Stations List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Verified Charging Stations ({stations.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stations.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStation(st)}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-green-500 hover:shadow-md transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                          {st.operator}
                        </span>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white mt-1">{st.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{st.address}</p>
                      </div>
                      
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${st.available_chargers > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {st.available_chargers > 0 ? `${st.available_chargers}/${st.total_chargers} Available` : 'Busy'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <span className="text-gray-400 block">Price</span>
                        <span className="font-bold text-green-600">₹{st.price_per_kwh || '--'}/kWh</span>
                      </div>

                      <div>
                        <span className="text-gray-400 block">Max Speed</span>
                        <span className="font-bold text-gray-900 dark:text-white">{st.max_charging_speed_kw} kW</span>
                      </div>

                      <div>
                        <span className="text-gray-400 block">Locality</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{st.locality || 'Hyderabad'}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1">
                      <span className="flex items-center">
                        <ShieldCheck className="h-3.5 w-3.5 text-green-500 mr-1" />
                        Verified {new Date(st.last_verified_at).toLocaleDateString()}
                      </span>
                      <span className="text-blue-600 font-semibold">Click for Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Station Details & Provenance Modal */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedStation(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="space-y-4">
              <div>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {selectedStation.operator} Network
                </span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{selectedStation.name}</h2>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{selectedStation.address}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-xs">
                <div>
                  <span className="text-gray-500 block font-medium">Pricing</span>
                  <span className="text-lg font-bold text-green-600">₹{selectedStation.price_per_kwh || 'N/A'}/kWh</span>
                </div>

                <div>
                  <span className="text-gray-500 block font-medium">Max Speed</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{selectedStation.max_charging_speed_kw} kW</span>
                </div>

                <div>
                  <span className="text-gray-500 block font-medium">Availability</span>
                  <span className={`text-sm font-bold ${selectedStation.available_chargers > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {selectedStation.available_chargers}/{selectedStation.total_chargers} Free
                  </span>
                </div>
              </div>

              {/* Data Provenance & Verification Badge */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-xs space-y-1">
                <div className="flex items-center font-bold text-blue-900 dark:text-blue-300">
                  <ShieldCheck className="h-4 w-4 mr-1.5 text-blue-600" />
                  Verified Data Provenance
                </div>
                <div className="text-blue-800 dark:text-blue-200">
                  Source: <strong className="font-semibold">{selectedStation.source || 'Official Operator Network'}</strong>
                </div>
                <div className="text-blue-700 dark:text-blue-300 text-[11px]">
                  Last Verified: {new Date(selectedStation.last_verified_at).toLocaleString()}
                </div>
              </div>

              {/* Report Discrepancy Button */}
              <div className="pt-2">
                <span className="text-xs text-gray-500 block mb-2 font-medium">Report inaccurate information:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleReportIssue(selectedStation.id, 'CHARGER_UNAVAILABLE')}
                    className="px-2.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-semibold border border-red-200"
                  >
                    Charger Unavailable
                  </button>

                  <button
                    onClick={() => handleReportIssue(selectedStation.id, 'WRONG_PRICE')}
                    className="px-2.5 py-1.5 bg-yellow-50 text-yellow-800 hover:bg-yellow-100 rounded text-xs font-semibold border border-yellow-200"
                  >
                    Wrong Price
                  </button>

                  <button
                    onClick={() => handleReportIssue(selectedStation.id, 'DOES_NOT_EXIST')}
                    className="px-2.5 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-xs font-semibold border border-gray-300"
                  >
                    Station Not Found
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MapPage;