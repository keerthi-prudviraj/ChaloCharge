from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserOut"

class UserOut(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    role: str
    chalo_points: int
    created_at: datetime

    class Config:
        from_attributes = True

# Vehicle Schemas
class VehicleCreate(BaseModel):
    brand: str
    model: str
    battery_capacity_kwh: float
    real_world_range_km: float
    connector_type: str = "CCS2"
    max_ac_kw: float = 7.2
    max_dc_kw: float = 50.0
    current_battery_pct: float = 80.0

class VehicleOut(VehicleCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Charger Schemas
class ChargerOut(BaseModel):
    id: int
    station_id: int
    charger_number: Optional[str] = None
    connector_type: str
    charging_type: str
    power_kw: float
    quantity: int
    availability_status: str
    price_per_kwh: Optional[float] = None
    price_per_session: Optional[float] = None
    pricing_notes: Optional[str] = None

    class Config:
        from_attributes = True

# Station Schemas
class StationOut(BaseModel):
    id: int
    canonical_station_id: Optional[str] = None
    name: str
    operator: str
    address: str
    locality: Optional[str] = None
    city: str
    state: str
    pincode: Optional[str] = None
    lat: float
    lng: float
    phone: Optional[str] = None
    website: Optional[str] = None
    status: str
    opening_time: Optional[str] = "00:00"
    closing_time: Optional[str] = "23:59"
    is_24_hours: bool
    rating: float
    review_count: int
    amenities: Optional[str] = None
    total_chargers: int
    available_chargers: int
    price_per_kwh: Optional[float] = None
    predicted_price: Optional[float] = None
    wait_time_mins: int
    renewable_pct: float
    max_charging_speed_kw: float
    source: Optional[str] = None
    source_url: Optional[str] = None
    last_verified_at: datetime
    updated_at: datetime
    chargers: List[ChargerOut] = []
    score: Optional[float] = None
    reasons: Optional[List[str]] = []

    class Config:
        from_attributes = True

class StationUpdate(BaseModel):
    available_chargers: Optional[int] = None
    price_per_kwh: Optional[float] = None
    wait_time_mins: Optional[int] = None
    status: Optional[str] = None

class StationReportCreate(BaseModel):
    station_id: int
    issue_type: str # DOES_NOT_EXIST, CHARGER_UNAVAILABLE, WRONG_LOCATION, WRONG_PRICE, PERMANENTLY_CLOSED
    comments: Optional[str] = None

class StationReportOut(StationReportCreate):
    id: int
    user_id: Optional[int] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class RecommendationRequest(BaseModel):
    user_lat: float
    user_lng: float
    preference: str = "balanced"
    current_battery_pct: float = 50.0
    battery_capacity_kwh: float = 40.5

# Trip & Route Planning Schemas
class TripPlanRequest(BaseModel):
    source_name: str
    dest_name: str
    source_lat: Optional[float] = None
    source_lng: Optional[float] = None
    dest_lat: Optional[float] = None
    dest_lng: Optional[float] = None
    vehicle_id: Optional[int] = None
    vehicle_model: str = "Tata Nexon EV Max"
    battery_capacity_kwh: float = 40.5
    real_world_range_km: float = 260.0
    current_battery_pct: float = 50.0
    preference: str = "balanced"

class RouteSummary(BaseModel):
    distance_km: float
    duration_hrs: float
    energy_required_kwh: float
    usable_energy_kwh: float
    current_range_km: float
    can_reach_destination: bool
    battery_at_destination_pct: float
    warning: Optional[str] = None

class TripPlanOut(BaseModel):
    route: RouteSummary
    best_station: Optional[StationOut] = None
    nearby_stations: List[StationOut] = []
    estimated_charging_cost: float
    estimated_charging_time_mins: float
    recommendation_reasons: List[str] = []

# Booking Schemas
class BookingCreate(BaseModel):
    station_id: int
    charger_id: Optional[int] = None
    start_time: datetime
    duration_mins: int = 30
    estimated_cost: float

class BookingOut(BaseModel):
    id: int
    user_id: int
    station_id: int
    charger_id: Optional[int]
    start_time: datetime
    duration_mins: int
    estimated_cost: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
