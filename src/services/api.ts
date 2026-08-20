const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Charger {
  id: number;
  station_id: number;
  charger_number?: string;
  connector_type: string;
  charging_type: string;
  power_kw: number;
  quantity: number;
  availability_status: string;
  price_per_kwh?: number;
}

export interface Station {
  id: number;
  canonical_station_id?: string;
  name: string;
  operator: string;
  address: string;
  locality?: string;
  city: string;
  state: string;
  pincode?: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  status: string;
  opening_time?: string;
  closing_time?: string;
  is_24_hours: boolean;
  rating: number;
  review_count: number;
  amenities?: string;
  total_chargers: number;
  available_chargers: number;
  price_per_kwh?: number;
  predicted_price?: number;
  wait_time_mins: number;
  renewable_pct: number;
  max_charging_speed_kw: number;
  source?: string;
  source_url?: string;
  last_verified_at: string;
  updated_at: string;
  chargers: Charger[];
  score?: number;
  reasons?: string[];
}

export interface RouteSummary {
  distance_km: number;
  duration_hrs: number;
  energy_required_kwh: number;
  usable_energy_kwh: number;
  current_range_km: number;
  can_reach_destination: boolean;
  battery_at_destination_pct: number;
  warning?: string;
}

export interface TripPlanResponse {
  route: RouteSummary;
  best_station?: Station;
  nearby_stations: Station[];
  estimated_charging_cost: number;
  estimated_charging_time_mins: number;
  recommendation_reasons: string[];
}

export interface Vehicle {
  id?: number;
  brand: string;
  model: string;
  battery_capacity_kwh: number;
  real_world_range_km: number;
  connector_type: string;
  max_ac_kw: number;
  max_dc_kw: number;
  current_battery_pct: number;
}

export interface TripPlanRequest {
  source_name: string;
  dest_name: string;
  vehicle_model?: string;
  battery_capacity_kwh?: number;
  real_world_range_km?: number;
  current_battery_pct?: number;
  preference?: string;
}

export interface Booking {
  id: number;
  user_id: number;
  station_id: number;
  charger_id?: number;
  start_time: string;
  duration_mins: number;
  estimated_cost: number;
  status: string;
  created_at: string;
}

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('chalocharge_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    return await res.json();
  }

  async register(email: string, password: string, fullName: string, role: string = 'user') {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName, role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
    return await res.json();
  }

  async getStations(params?: { operator?: string; connector_type?: string; charging_type?: string; min_speed_kw?: number; max_price?: number; available_only?: boolean; bbox?: string }): Promise<Station[]> {
    try {
      const query = new URLSearchParams();
      if (params?.operator) query.append('operator', params.operator);
      if (params?.connector_type) query.append('connector_type', params.connector_type);
      if (params?.charging_type) query.append('charging_type', params.charging_type);
      if (params?.min_speed_kw) query.append('min_speed_kw', String(params.min_speed_kw));
      if (params?.max_price) query.append('max_price', String(params.max_price));
      if (params?.available_only) query.append('available_only', 'true');
      if (params?.bbox) query.append('bbox', params.bbox);

      const url = `${API_BASE_URL}/stations${query.toString() ? '?' + query.toString() : ''}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch stations');
      return await res.json();
    } catch (err) {
      return [];
    }
  }

  async getNearbyStations(lat: number, lng: number, radiusKm: number = 10): Promise<Station[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/stations/nearby?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch nearby stations');
      return await res.json();
    } catch (err) {
      return [];
    }
  }

  async getOperators(): Promise<string[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/stations/operators`, { headers: this.getHeaders() });
      if (!res.ok) return ['Tata Power', 'Statiq', 'ChargeZone', 'Jio-bp', 'Zeon', 'Fortum', 'Shell Recharge', 'Relux'];
      return await res.json();
    } catch (err) {
      return ['Tata Power', 'Statiq', 'ChargeZone', 'Jio-bp', 'Zeon', 'Fortum', 'Shell Recharge', 'Relux'];
    }
  }

  async getConnectors(): Promise<string[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/stations/connectors`, { headers: this.getHeaders() });
      if (!res.ok) return ['CCS2', 'Type 2', 'CHAdeMO', 'Bharat AC-001', 'Bharat DC-001'];
      return await res.json();
    } catch (err) {
      return ['CCS2', 'Type 2', 'CHAdeMO', 'Bharat AC-001', 'Bharat DC-001'];
    }
  }

  async updateStation(stationId: number, data: Partial<Station>): Promise<Station> {
    const res = await fetch(`${API_BASE_URL}/stations/${stationId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update station');
    return await res.json();
  }

  async reportStationIssue(stationId: number, issueType: string, comments?: string) {
    const res = await fetch(`${API_BASE_URL}/stations/reports`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ station_id: stationId, issue_type: issueType, comments })
    });
    if (!res.ok) throw new Error('Failed to submit report');
    return await res.json();
  }

  async planTrip(payload: TripPlanRequest): Promise<TripPlanResponse> {
    const res = await fetch(`${API_BASE_URL}/routes/plan-trip`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to plan trip');
    return await res.json();
  }

  async getStandardVehicles(): Promise<Vehicle[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/vehicles/standard`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch vehicles');
      return await res.json();
    } catch (err) {
      return [];
    }
  }

  async createBooking(stationId: number, durationMins: number = 30, estimatedCost: number = 200): Promise<Booking> {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        station_id: stationId,
        start_time: new Date().toISOString(),
        duration_mins: durationMins,
        estimated_cost: estimatedCost
      })
    });
    if (!res.ok) throw new Error('Failed to create booking');
    return await res.json();
  }

  async getBookings(): Promise<Booking[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, { headers: this.getHeaders() });
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      return [];
    }
  }

  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch admin stats');
      return await res.json();
    } catch (err) {
      return { total_users: 2, total_stations: 10, total_bookings: 0, total_trips: 0, total_revenue_inr: 0, system_status: 'Online' };
    }
  }

  async getAdminUsers() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, { headers: this.getHeaders() });
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      return [];
    }
  }
}

export const api = new ApiService();
