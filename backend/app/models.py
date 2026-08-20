import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="user") # user, station_owner, admin
    chalo_points = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    vehicles = relationship("Vehicle", back_populates="owner", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")
    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")
    stations = relationship("ChargingStation", back_populates="owner")
    reports = relationship("StationReport", back_populates="user")

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    battery_capacity_kwh = Column(Float, nullable=False)
    real_world_range_km = Column(Float, nullable=False)
    connector_type = Column(String, default="CCS2") # CCS2, Type 2, CHAdeMO, Bharat AC-001, Bharat DC-001, UNKNOWN
    max_ac_kw = Column(Float, default=7.2)
    max_dc_kw = Column(Float, default=50.0)
    current_battery_pct = Column(Float, default=80.0)

    owner = relationship("User", back_populates="vehicles")
    trips = relationship("Trip", back_populates="vehicle")

class ChargingStation(Base):
    __tablename__ = "charging_stations"

    id = Column(Integer, primary_key=True, index=True)
    canonical_station_id = Column(String, unique=True, index=True, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String, index=True, nullable=False)
    operator = Column(String, index=True, nullable=False) # e.g. Tata Power, Statiq, ChargeZone, Jio-bp, Zeon, Fortum
    address = Column(Text, nullable=False)
    locality = Column(String, index=True, nullable=True) # e.g. Gachibowli, Madhapur, Hitech City, Kondapur, Begumpet
    city = Column(String, default="Hyderabad", index=True)
    state = Column(String, default="Telangana")
    pincode = Column(String, nullable=True)
    lat = Column(Float, nullable=False, index=True)
    lng = Column(Float, nullable=False, index=True)
    phone = Column(String, nullable=True)
    website = Column(String, nullable=True)
    status = Column(String, default="ACTIVE") # ACTIVE, INACTIVE, TEMPORARILY_UNAVAILABLE, PERMANENTLY_CLOSED
    opening_time = Column(String, default="00:00")
    closing_time = Column(String, default="23:59")
    is_24_hours = Column(Boolean, default=True)
    rating = Column(Float, default=4.5)
    review_count = Column(Integer, default=0)
    amenities = Column(Text, nullable=True) # JSON list e.g. ["Cafe", "Restroom", "Parking", "Wi-Fi"]
    total_chargers = Column(Integer, default=2)
    available_chargers = Column(Integer, default=2)
    price_per_kwh = Column(Float, nullable=True) # NULL if unverified
    predicted_price = Column(Float, nullable=True)
    wait_time_mins = Column(Integer, default=0)
    renewable_pct = Column(Float, default=0.0)
    max_charging_speed_kw = Column(Float, default=50.0)
    source = Column(String, nullable=True)
    source_url = Column(Text, nullable=True)
    last_verified_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="stations")
    chargers = relationship("Charger", back_populates="station", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="station")
    sources = relationship("StationSource", back_populates="station", cascade="all, delete-orphan")
    reports = relationship("StationReport", back_populates="station", cascade="all, delete-orphan")

class Charger(Base):
    __tablename__ = "chargers"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("charging_stations.id"), nullable=False)
    charger_number = Column(String, nullable=True)
    connector_type = Column(String, nullable=False, default="CCS2") # CCS2, Type 2, CHAdeMO, Bharat AC-001, Bharat DC-001, UNKNOWN
    charging_type = Column(String, nullable=False, default="DC") # AC, DC
    power_kw = Column(Float, nullable=False, default=50.0) # e.g. 7.2, 30.0, 60.0, 120.0, 150.0
    quantity = Column(Integer, default=1)
    availability_status = Column(String, default="UNKNOWN") # AVAILABLE, BUSY, OFFLINE, UNKNOWN
    price_per_kwh = Column(Float, nullable=True)
    price_per_session = Column(Float, nullable=True)
    pricing_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    station = relationship("ChargingStation", back_populates="chargers")

class StationAvailability(Base):
    __tablename__ = "station_availability"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("charging_stations.id"), nullable=False)
    charger_id = Column(Integer, ForeignKey("chargers.id"), nullable=True)
    status = Column(String, nullable=False)
    available_count = Column(Integer, nullable=True)
    total_count = Column(Integer, nullable=True)
    queue_length = Column(Integer, default=0)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)
    source = Column(String, nullable=True)

class StationSource(Base):
    __tablename__ = "station_sources"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("charging_stations.id"), nullable=False)
    source_name = Column(String, nullable=False)
    source_url = Column(Text, nullable=True)
    source_station_id = Column(String, nullable=True)
    retrieved_at = Column(DateTime, default=datetime.datetime.utcnow)
    verified_at = Column(DateTime, default=datetime.datetime.utcnow)

    station = relationship("ChargingStation", back_populates="sources")

class StationReport(Base):
    __tablename__ = "station_reports"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("charging_stations.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    issue_type = Column(String, nullable=False) # DOES_NOT_EXIST, CHARGER_UNAVAILABLE, WRONG_LOCATION, WRONG_PRICE, PERMANENTLY_CLOSED
    comments = Column(Text, nullable=True)
    status = Column(String, default="PENDING") # PENDING, RESOLVED, REJECTED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    station = relationship("ChargingStation", back_populates="reports")
    user = relationship("User", back_populates="reports")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    station_id = Column(Integer, ForeignKey("charging_stations.id"), nullable=False)
    charger_id = Column(Integer, ForeignKey("chargers.id"), nullable=True)
    start_time = Column(DateTime, nullable=False)
    duration_mins = Column(Integer, default=30)
    estimated_cost = Column(Float, nullable=False)
    status = Column(String, default="Confirmed") # Confirmed, Completed, Cancelled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="bookings")
    station = relationship("ChargingStation", back_populates="bookings")

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    source_address = Column(String, nullable=False)
    source_lat = Column(Float, nullable=False)
    source_lng = Column(Float, nullable=False)
    dest_address = Column(String, nullable=False)
    dest_lat = Column(Float, nullable=False)
    dest_lng = Column(Float, nullable=False)
    distance_km = Column(Float, nullable=False)
    estimated_duration_hrs = Column(Float, nullable=False)
    energy_required_kwh = Column(Float, nullable=False)
    total_cost = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="trips")
    vehicle = relationship("Vehicle", back_populates="trips")
