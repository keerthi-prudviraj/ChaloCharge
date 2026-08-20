import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { MapMouseEvent } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Use environment variable for Mapbox token
const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
if (!mapboxToken || mapboxToken === "your_mapbox_access_token_here") {
  console.warn("Please set your Mapbox access token in .env.local file");
}
mapboxgl.accessToken = mapboxToken || "";

type Station = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: number;
  available: boolean;
  predicted_price: number;
  wait_time: number;
};

type Route = {
  geometry: any;
};

// Sample EV stations data
const sampleStations: Station[] = [
  {
    id: '1',
    name: 'BVRIT Food Court EV',
    lat: 17.7250,
    lng: 78.2565,
    price: 14,
    available: true,
    predicted_price: 15,
    wait_time: 5
  },
  {
    id: '2',
    name: 'Tuljarampet Road Charging',
    lat: 17.7235,
    lng: 78.2580,
    price: 11,
    available: true,
    predicted_price: 12,
    wait_time: 2
  },
  {
    id: '3',
    name: 'Narsapur Solar Hub',
    lat: 17.9140,
    lng: 78.0000,
    price: 12,
    available: true,
    predicted_price: 13,
    wait_time: 8
  },
  {
    id: '4',
    name: 'BVRIT Main Gate Charging',
    lat: 17.7262,
    lng: 78.2557,
    price: 13,
    available: true,
    predicted_price: 14,
    wait_time: 3
  },
  {
    id: '5',
    name: 'SR Convention EV Point',
    lat: 17.7280,
    lng: 78.2530,
    price: 12,
    available: false,
    predicted_price: 13,
    wait_time: 15
  },
  {
    id: '6',
    name: 'VIPER Hostel Charging',
    lat: 17.7295,
    lng: 78.2570,
    price: 15,
    available: true,
    predicted_price: 16,
    wait_time: 1
  },
  {
    id: '7',
    name: 'Medak Central Station',
    lat: 18.0456,
    lng: 78.2600,
    price: 18,
    available: false,
    predicted_price: 19,
    wait_time: 20
  },
  {
    id: '8',
    name: 'SitaramPur Green Energy',
    lat: 17.9000,
    lng: 78.1000,
    price: 8,
    available: true,
    predicted_price: 9,
    wait_time: 4
  },
  {
    id: '9',
    name: 'Moosapet Express Charging',
    lat: 17.4500,
    lng: 78.4500,
    price: 22,
    available: false,
    predicted_price: 23,
    wait_time: 25
  },
  {
    id: '10',
    name: 'Chandapur Eco Station',
    lat: 17.8000,
    lng: 78.2000,
    price: 15,
    available: true,
    predicted_price: 16,
    wait_time: 6
  },
  {
    id: '11',
    name: 'Cyber City Charging Hub',
    lat: 17.4401,
    lng: 78.3489,
    price: 16,
    available: true,
    predicted_price: 17,
    wait_time: 2
  },
  {
    id: '12',
    name: 'Komapally EV Point',
    lat: 17.5700,
    lng: 78.4800,
    price: 13,
    available: true,
    predicted_price: 14,
    wait_time: 3
  },
  {
    id: '13',
    name: 'Suchitra Charging Hub',
    lat: 17.5000,
    lng: 78.4800,
    price: 17,
    available: false,
    predicted_price: 18,
    wait_time: 18
  },
  {
    id: '14',
    name: 'Bowenpally Charge Zone',
    lat: 17.4600,
    lng: 78.4800,
    price: 11,
    available: true,
    predicted_price: 12,
    wait_time: 4
  },
  {
    id: '15',
    name: 'Shamshabad Supercharge',
    lat: 17.2500,
    lng: 78.4300,
    price: 20,
    available: false,
    predicted_price: 21,
    wait_time: 30
  },
  {
    id: '16',
    name: 'Tank Bund EV Station',
    lat: 17.4239,
    lng: 78.4746,
    price: 14,
    available: true,
    predicted_price: 15,
    wait_time: 7
  },
  // New EV Stations
  {
    id: '17',
    name: 'Gummadidala EV Station',
    lat: 17.6500,
    lng: 78.3500,
    price: 13,
    available: true,
    predicted_price: 14,
    wait_time: 4
  },
  {
    id: '18',
    name: 'Gandimaisamma Charging Hub',
    lat: 17.6800,
    lng: 78.3800,
    price: 12,
    available: true,
    predicted_price: 13,
    wait_time: 3
  },
  {
    id: '19',
    name: 'Maisammaguda Solar Station',
    lat: 17.7200,
    lng: 78.4200,
    price: 11,
    available: true,
    predicted_price: 12,
    wait_time: 5
  },
  {
    id: '20',
    name: 'Muneerabad EV Point',
    lat: 17.7500,
    lng: 78.4500,
    price: 14,
    available: false,
    predicted_price: 15,
    wait_time: 12
  },
  {
    id: '21',
    name: 'Gagillaput Charging Zone',
    lat: 17.7800,
    lng: 78.4800,
    price: 13,
    available: true,
    predicted_price: 14,
    wait_time: 6
  },
  {
    id: '22',
    name: 'Bolarum EV Station',
    lat: 17.8100,
    lng: 78.5100,
    price: 15,
    available: true,
    predicted_price: 16,
    wait_time: 2
  },
  {
    id: '23',
    name: 'Ayodhya X Roads Charging',
    lat: 17.8400,
    lng: 78.5400,
    price: 12,
    available: true,
    predicted_price: 13,
    wait_time: 8
  },
  {
    id: '24',
    name: 'Medchal Check Post EV',
    lat: 17.8700,
    lng: 78.5700,
    price: 16,
    available: true,
    predicted_price: 17,
    wait_time: 1
  },
  {
    id: '25',
    name: 'Shamirpet Charging Hub',
    lat: 17.9000,
    lng: 78.6000,
    price: 14,
    available: false,
    predicted_price: 15,
    wait_time: 15
  }
];

import { api } from "../services/api";

export default function EVMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [route, setRoute] = useState<Route | null>(null);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [sourceCoord, setSourceCoord] = useState<[number, number] | null>(null);
  const [destCoord, setDestCoord] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const sourceMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const routeSourceRef = useRef<string | null>(null);

  // Fetch stations from backend API
  useEffect(() => {
    async function loadStations() {
      try {
        const data = await api.getStations();
        if (data && data.length > 0) {
          const mapped: Station[] = data.map(st => ({
            id: String(st.id),
            name: st.name,
            lat: st.lat,
            lng: st.lng,
            price: st.price_per_kwh,
            available: st.available_chargers > 0,
            predicted_price: st.predicted_price,
            wait_time: st.wait_time_mins
          }));
          setStations(mapped);
        } else {
          setStations(sampleStations);
        }
      } catch (err) {
        setStations(sampleStations);
      }
    }
    loadStations();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [78.4867, 17.3850], // Hyderabad area
        zoom: 10,
      });
    }
    const map = mapRef.current;

    // Map click handler
    const handleMapClick = (e: MapMouseEvent) => {
      if (!sourceCoord) {
        setSourceCoord([e.lngLat.lng, e.lngLat.lat]);
        // Reverse geocode to get address
        reverseGeocode(e.lngLat.lng, e.lngLat.lat, true);
      } else if (!destCoord) {
        setDestCoord([e.lngLat.lng, e.lngLat.lat]);
        // Reverse geocode to get address
        reverseGeocode(e.lngLat.lng, e.lngLat.lat, false);
      }
    };
    map.on("click", handleMapClick);
    return () => {
      map.off("click", handleMapClick);
    };
    // eslint-disable-next-line
  }, [sourceCoord, destCoord]);

  // Reverse geocoding function
  const reverseGeocode = async (lng: number, lat: number, isSource: boolean) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const address = data.features[0].place_name;
        if (isSource) {
          setSource(address);
        } else {
          setDestination(address);
        }
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  // Draggable markers for source/destination
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    
    // Source marker
    if (sourceCoord) {
      if (sourceMarkerRef.current) {
        sourceMarkerRef.current.setLngLat(sourceCoord);
      } else {
        sourceMarkerRef.current = new mapboxgl.Marker({ 
          color: "#3b82f6", 
          draggable: true,
          element: createMarkerElement("S", "#3b82f6")
        })
          .setLngLat(sourceCoord)
          .addTo(map)
          .on("dragend", () => {
            const lngLat = sourceMarkerRef.current!.getLngLat();
            setSourceCoord([lngLat.lng, lngLat.lat]);
            reverseGeocode(lngLat.lng, lngLat.lat, true);
          });
      }
    } else if (sourceMarkerRef.current) {
      sourceMarkerRef.current.remove();
      sourceMarkerRef.current = null;
    }
    
    // Destination marker
    if (destCoord) {
      if (destMarkerRef.current) {
        destMarkerRef.current.setLngLat(destCoord);
      } else {
        destMarkerRef.current = new mapboxgl.Marker({ 
          color: "#ef4444", 
          draggable: true,
          element: createMarkerElement("D", "#ef4444")
        })
          .setLngLat(destCoord)
          .addTo(map)
          .on("dragend", () => {
            const lngLat = destMarkerRef.current!.getLngLat();
            setDestCoord([lngLat.lng, lngLat.lat]);
            reverseGeocode(lngLat.lng, lngLat.lat, false);
          });
      }
    } else if (destMarkerRef.current) {
      destMarkerRef.current.remove();
      destMarkerRef.current = null;
    }
  }, [sourceCoord, destCoord]);

  // Create custom marker element
  const createMarkerElement = (text: string, color: string) => {
    const el = document.createElement("div");
    el.className = "custom-marker";
    el.style.backgroundColor = color;
    el.style.color = "white";
    el.style.width = "30px";
    el.style.height = "30px";
    el.style.borderRadius = "50%";
    el.style.border = "3px solid white";
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.fontWeight = "bold";
    el.style.fontSize = "12px";
    el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
    el.textContent = text;
    return el;
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Find stations near the route
  const findStationsNearRoute = (sourceLat: number, sourceLng: number, destLat: number, destLng: number) => {
    const routeStations: Station[] = [];
    const maxDistance = 5; // 5km from route

    sampleStations.forEach(station => {
      // Calculate distance from station to route line
      const distance = calculateDistance(station.lat, station.lng, sourceLat, sourceLng);
      const distanceToDest = calculateDistance(station.lat, station.lng, destLat, destLng);
      
      // Check if station is within reasonable distance from route
      if (distance <= maxDistance || distanceToDest <= maxDistance) {
        routeStations.push(station);
      }
    });

    return routeStations;
  };

  // Fetch route and stations when both coords are set
  useEffect(() => {
    if (!sourceCoord || !destCoord) {
      // Clear route and stations when coordinates are reset
      setRoute(null);
      setStations([]);
      setDistance(null);
      setDuration(null);
      return;
    }
    
    setIsLoading(true);
    console.log("Fetching route for:", sourceCoord, "to", destCoord);
    
    // Get route from Mapbox Directions API
    const fetchRoute = async () => {
      try {
        const [sourceLng, sourceLat] = sourceCoord;
        const [destLng, destLat] = destCoord;
        
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${sourceLng},${sourceLat};${destLng},${destLat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
        console.log("Fetching route from:", url);
        
        const response = await fetch(url);
        const data = await response.json();
        console.log("Route API response:", data);
        
        if (data.routes && data.routes.length > 0) {
          const routeGeometry = data.routes[0].geometry;
          const routeDistance = data.routes[0].distance; // in meters
          const routeDuration = data.routes[0].duration; // in seconds
          
          console.log("Setting route geometry:", routeGeometry);
          setRoute({ geometry: routeGeometry });
          
          // Convert distance to kilometers and duration to hours
          const distanceKm = (routeDistance / 1000).toFixed(1);
          const durationHours = (routeDuration / 3600).toFixed(1);
          
          setDistance(parseFloat(distanceKm));
          setDuration(`${durationHours} hours`);
          
          // Find stations near the route
          const routeStations = findStationsNearRoute(sourceLat, sourceLng, destLat, destLng);
          console.log("Found stations near route:", routeStations);
          setStations(routeStations);
        } else {
          console.error("No routes found in response");
          // Fallback to mock route
          createMockRoute();
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
        // Fallback to mock route
        createMockRoute();
      }
      
      setIsLoading(false);
    };
    
    const createMockRoute = () => {
      const mockRoute = {
        geometry: {
          type: "LineString",
          coordinates: [
            sourceCoord,
            [sourceCoord[0] + (destCoord[0] - sourceCoord[0]) * 0.3, sourceCoord[1] + (destCoord[1] - sourceCoord[1]) * 0.3],
            [sourceCoord[0] + (destCoord[0] - sourceCoord[0]) * 0.7, sourceCoord[1] + (destCoord[1] - sourceCoord[1]) * 0.7],
            destCoord
          ]
        }
      };
      console.log("Using mock route:", mockRoute);
      setRoute(mockRoute);
      
      // Calculate approximate distance for mock route
      const [sourceLng, sourceLat] = sourceCoord;
      const [destLng, destLat] = destCoord;
      const mockDistance = calculateDistance(sourceLat, sourceLng, destLat, destLng);
      setDistance(mockDistance);
      setDuration(`${(mockDistance / 50).toFixed(1)} hours`); // Assuming 50 km/h average speed
      
      const routeStations = findStationsNearRoute(sourceLat, sourceLng, destLat, destLng);
      setStations(routeStations);
    };
    
    fetchRoute();
  }, [sourceCoord, destCoord]);

  // Render route and station markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    
    const renderMap = () => {
      // Remove existing layers
      if (map.getLayer("route")) map.removeLayer("route");
      if (map.getSource("route")) map.removeSource("route");
      
      // Add route
      if (route) {
        map.addSource("route", {
          type: "geojson",
          data: route.geometry,
        });
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { 
            "line-color": "#10b981", 
            "line-width": 6,
            "line-opacity": 0.8
          },
        });
      }
      
      // Remove existing station markers
      const existingMarkers = document.querySelectorAll('.station-marker');
      existingMarkers.forEach(marker => marker.remove());
      
      // Add station markers
      stations.forEach(station => {
        const el = document.createElement("div");
        el.className = "station-marker";
        let markerColor = "#10b981"; // green
        if (!station.available) {
          markerColor = "#ef4444"; // red
        } else if (station.price > 15 || station.wait_time > 10) {
          markerColor = "#f59e0b"; // orange
        }
        el.style.backgroundColor = markerColor;
        el.style.width = "16px";
        el.style.height = "16px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
        el.title = `${station.name}\n₹${station.price}/kWh\nPredicted: ₹${station.predicted_price}/kWh\nWait: ${station.wait_time} min`;
        
        new mapboxgl.Marker(el)
          .setLngLat([station.lng, station.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div class="p-2">
                <strong class="text-sm">${station.name}</strong><br/>
                <span class="text-xs text-gray-600">₹${station.price}/kWh</span><br/>
                <span class="text-xs text-gray-500">Predicted: ₹${station.predicted_price}/kWh</span><br/>
                <span class="text-xs text-gray-500">Wait: ${station.wait_time} min</span>
              </div>`
            )
          )
          .addTo(map);
      });
    };

    if (map.isStyleLoaded()) {
      renderMap();
    } else {
      map.on('load', renderMap);
    }
  }, [stations, route]);

  // Update text fields when coordinates change
  useEffect(() => {
    if (sourceCoord) {
      const [lng, lat] = sourceCoord;
      setSource(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
    if (destCoord) {
      const [lng, lat] = destCoord;
      setDestination(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  }, [sourceCoord, destCoord]);

  const handlePlanRoute = () => {
    // If source and destination are place names, geocode them first
    if (source && destination && !source.includes(',') && !destination.includes(',')) {
      geocodeAndPlanRoute(source, destination);
    } else {
      // Parse coordinates from text fields if user enters them
      const src = source.split(",").map(Number);
      const dst = destination.split(",").map(Number);
      if (src.length === 2 && !isNaN(src[0]) && !isNaN(src[1])) {
        setSourceCoord([src[1], src[0]]); // Note: lat,lng format
      }
      if (dst.length === 2 && !isNaN(dst[0]) && !isNaN(dst[1])) {
        setDestCoord([dst[1], dst[0]]); // Note: lat,lng format
      }
    }
  };

  // Geocode place names to coordinates
  const geocodeAndPlanRoute = async (sourceName: string, destName: string) => {
    setIsLoading(true);
    
    try {
      // Geocode source
      const sourceResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(sourceName)}.json?access_token=${mapboxgl.accessToken}&country=in`
      );
      const sourceData = await sourceResponse.json();
      
      // Geocode destination
      const destResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destName)}.json?access_token=${mapboxgl.accessToken}&country=in`
      );
      const destData = await destResponse.json();
      
      if (sourceData.features && sourceData.features.length > 0 && 
          destData.features && destData.features.length > 0) {
        
        const sourceCoords = sourceData.features[0].center;
        const destCoords = destData.features[0].center;
        
        setSourceCoord([sourceCoords[0], sourceCoords[1]]);
        setDestCoord([destCoords[0], destCoords[1]]);
        
        // Update the input fields with the found addresses
        setSource(sourceData.features[0].place_name);
        setDestination(destData.features[0].place_name);
      } else {
        alert("Could not find coordinates for one or both locations. Please try different place names or enter coordinates manually.");
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      alert("Failed to geocode locations. Please enter coordinates manually.");
    }
    
    setIsLoading(false);
  };

  const handleReset = () => {
    setSourceCoord(null);
    setDestCoord(null);
    setSource("");
    setDestination("");
    setStations([]);
    setRoute(null);
    setDistance(null);
    setDuration(null);
  };

  return (
    <div>
      {/* Input Fields */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Source
            </label>
            <input
              type="text"
              placeholder="Click map or enter coordinates"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Destination
            </label>
            <input
              type="text"
              placeholder="Click map or enter coordinates"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handlePlanRoute}
            className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors flex items-center"
          >
            Plan Route
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Calculating route...</span>
        </div>
      )}

      {/* Route Information Display */}
      {(distance || duration) && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-400 mb-2">Route Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {distance && (
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div>
                  <div className="text-sm text-green-700 dark:text-green-300">Distance</div>
                  <div className="font-semibold text-green-900 dark:text-green-100">{distance} km</div>
                </div>
              </div>
            )}
            {duration && (
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-sm text-green-700 dark:text-green-300">Estimated Time</div>
                  <div className="font-semibold text-green-900 dark:text-green-100">{duration}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full rounded-lg overflow-hidden shadow-sm" style={{ height: "500px", border: "1px solid #e5e7eb" }} />
      
      {/* Charging Stations on Route */}
      {stations.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-400 mb-2">Charging Stations on Route</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stations.map((station) => (
              <div key={station.id} className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-700">
                <div className="font-semibold text-blue-900 dark:text-blue-100">{station.name}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">₹{station.price}/kWh</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">{station.available ? 'Available' : 'Busy'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}