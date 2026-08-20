from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import ChargingStation
from app.schemas import TripPlanRequest, TripPlanOut, RouteSummary, StationOut
from app.services.energy import calculate_battery_metrics, calculate_haversine_distance
from app.services.recommendation import score_charging_station

router = APIRouter(prefix="/api/routes", tags=["routes"])

# Known coordinate dictionary for common locations in Hyderabad/Telangana area
CITY_COORDINATES = {
    "hyderabad": (17.3850, 78.4867),
    "secunderabad": (17.4399, 78.4983),
    "medchal": (17.6294, 78.4812),
    "narsapur": (17.8170, 78.2830),
    "medak": (18.0456, 78.2600),
    "komapally": (17.5312, 78.4735),
    "shamshabad": (17.2543, 78.4312),
    "gachibowli": (17.4401, 78.3489),
    "hitex": (17.4719, 78.3744),
    "vijayawada": (16.5062, 80.6480),
    "warangal": (17.9784, 79.5941),
    "suryapet": (17.1439, 79.6239)
}

def resolve_coordinates(location_name: str):
    name_lower = location_name.strip().lower()
    for city_key, coords in CITY_COORDINATES.items():
        if city_key in name_lower:
            return coords
    # Default fallback: random offset around Hyderabad center
    return (17.3850 + (len(name_lower) % 5) * 0.05, 78.4867 + (len(name_lower) % 7) * 0.05)

@router.post("/plan-trip", response_model=TripPlanOut)
def plan_trip(payload: TripPlanRequest, db: Session = Depends(get_db)):
    # 1. Resolve source and destination coordinates
    if payload.source_lat and payload.source_lng:
        src_lat, src_lng = payload.source_lat, payload.source_lng
    else:
        src_lat, src_lng = resolve_coordinates(payload.source_name)
        
    if payload.dest_lat and payload.dest_lng:
        dst_lat, dst_lng = payload.dest_lat, payload.dest_lng
    else:
        dst_lat, dst_lng = resolve_coordinates(payload.dest_name)
        
    # 2. Distance & Duration calculation
    distance_km = round(calculate_haversine_distance(src_lat, src_lng, dst_lat, dst_lng), 1)
    if distance_km < 1.0:
        distance_km = 15.0 # fallback minimum
    duration_hrs = round(distance_km / 45.0, 1) # assuming 45 km/h average speed
    
    # 3. Energy & Battery Metrics
    battery_metrics = calculate_battery_metrics(
        distance_km=distance_km,
        battery_capacity_kwh=payload.battery_capacity_kwh,
        real_world_range_km=payload.real_world_range_km,
        current_battery_pct=payload.current_battery_pct
    )
    
    route_summary = RouteSummary(
        distance_km=distance_km,
        duration_hrs=duration_hrs,
        energy_required_kwh=battery_metrics["energy_required_kwh"],
        usable_energy_kwh=battery_metrics["usable_energy_kwh"],
        current_range_km=battery_metrics["current_range_km"],
        can_reach_destination=battery_metrics["can_reach_destination"],
        battery_at_destination_pct=battery_metrics["battery_at_destination_pct"],
        warning=battery_metrics["warning"]
    )
    
    # 4. Find & Rank Charging Stations
    all_stations = db.query(ChargingStation).all()
    scored_list = []
    
    for station in all_stations:
        # Score relative to mid-point or source
        mid_lat = (src_lat + dst_lat) / 2.0
        mid_lng = (src_lng + dst_lng) / 2.0
        
        score_res = score_charging_station(
            station=station,
            user_lat=mid_lat,
            user_lng=mid_lng,
            preference=payload.preference
        )
        
        st_out = StationOut.from_orm(station)
        st_out.score = score_res["score"]
        st_out.reasons = score_res["reasons"]
        scored_list.append(st_out)
        
    scored_list.sort(key=lambda s: s.score or 0.0, reverse=True)
    best_station = scored_list[0] if scored_list else None
    
    # 5. Estimate Charging Time & Cost
    needed_kwh = max(0.0, battery_metrics["energy_required_kwh"] - battery_metrics["usable_energy_kwh"] + 10.0) # buffer
    station_price = best_station.price_per_kwh if best_station else 14.0
    station_speed = best_station.max_charging_speed_kw if best_station else 50.0
    
    charging_cost = round(needed_kwh * station_price, 0)
    charging_time_mins = round((needed_kwh / max(10.0, station_speed)) * 60.0, 0)
    
    # 6. Generate Recommendations
    reasons = [
        f"Trip Distance: {distance_km} km requiring ~{battery_metrics['energy_required_kwh']} kWh of energy.",
        f"Current Battery: {payload.current_battery_pct}% (~{battery_metrics['current_range_km']} km range)."
    ]
    
    if not battery_metrics["can_reach_destination"]:
        reasons.append(f"CRITICAL: Stop at {best_station.name if best_station else 'nearest charger'} for ~{charging_time_mins:.0f} mins to recharge.")
    else:
        reasons.append(f"Destination reachable with {battery_metrics['battery_at_destination_pct']}% battery remaining.")
        
    if payload.preference == "cheapest":
        reasons.append("Prioritized lowest ₹/kWh stations along your route.")
    elif payload.preference == "fastest":
        reasons.append("Prioritized high-power DC fast chargers with zero wait time.")
    elif payload.preference == "renewable":
        reasons.append("Prioritized stations powered by green/renewable energy.")
        
    return TripPlanOut(
        route=route_summary,
        best_station=best_station,
        nearby_stations=scored_list[:5],
        estimated_charging_cost=charging_cost,
        estimated_charging_time_mins=charging_time_mins,
        recommendation_reasons=reasons
    )
