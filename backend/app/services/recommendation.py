from typing import List, Dict, Any
from app.services.energy import calculate_haversine_distance

def get_weights_for_preference(preference: str) -> Dict[str, float]:
    pref = preference.lower()
    if pref == "cheapest":
        return {"price": 0.50, "availability": 0.20, "wait_time": 0.15, "speed": 0.10, "detour": 0.05}
    elif pref == "fastest":
        return {"speed": 0.40, "wait_time": 0.30, "availability": 0.15, "detour": 0.10, "price": 0.05}
    elif pref == "renewable":
        return {"renewable": 0.40, "availability": 0.20, "price": 0.15, "speed": 0.15, "wait_time": 0.10}
    elif pref == "minimum_detour":
        return {"detour": 0.50, "availability": 0.20, "price": 0.15, "speed": 0.10, "wait_time": 0.05}
    else: # balanced default
        return {"availability": 0.30, "detour": 0.25, "price": 0.20, "wait_time": 0.15, "speed": 0.10}

def score_charging_station(
    station: Any,
    user_lat: float,
    user_lng: float,
    preference: str = "balanced"
) -> Dict[str, Any]:
    """
    Computes a 0-100 score for a station based on user preference and station specs.
    """
    weights = get_weights_for_preference(preference)
    
    # 1. Availability Score (0.0 to 1.0)
    avail_ratio = (station.available_chargers / max(1, station.total_chargers)) if station.status == "Available" else 0.0
    availability_score = avail_ratio * (1.0 if station.available_chargers > 0 else 0.0)
    
    # 2. Detour / Distance Score (0.0 to 1.0)
    distance_km = calculate_haversine_distance(user_lat, user_lng, station.lat, station.lng)
    # 0km -> 1.0, 50km -> 0.0
    detour_score = max(0.0, 1.0 - (distance_km / 50.0))
    
    # 3. Price Score (0.0 to 1.0) - assume range ₹8 to ₹25 per kWh
    price = station.price_per_kwh
    price_score = max(0.0, min(1.0, 1.0 - ((price - 8.0) / 20.0)))
    
    # 4. Wait Time Score (0.0 to 1.0) - assume range 0 to 30 mins
    wait = station.wait_time_mins
    wait_score = max(0.0, min(1.0, 1.0 - (wait / 30.0)))
    
    # 5. Charging Speed Score (0.0 to 1.0) - assume range 7kW to 150kW
    speed = station.max_charging_speed_kw
    speed_score = min(1.0, speed / 150.0)
    
    # 6. Renewable Energy Score (0.0 to 1.0)
    renewable_score = (station.renewable_pct or 0.0) / 100.0
    
    # Calculate composite weighted score
    raw_score = 0.0
    for factor, weight in weights.items():
        if factor == "availability":
            raw_score += availability_score * weight
        elif factor == "detour":
            raw_score += detour_score * weight
        elif factor == "price":
            raw_score += price_score * weight
        elif factor == "wait_time":
            raw_score += wait_score * weight
        elif factor == "speed":
            raw_score += speed_score * weight
        elif factor == "renewable":
            raw_score += renewable_score * weight
            
    final_score = round(raw_score * 100.0, 1)
    
    # Generate human-readable reasons
    reasons = []
    if station.available_chargers > 0:
        reasons.append(f"{station.available_chargers}/{station.total_chargers} Chargers Available")
    else:
        reasons.append("Currently Busy (0 chargers available)")
        
    if distance_km < 5.0:
        reasons.append(f"Near Route ({distance_km:.1f} km)")
    elif distance_km < 15.0:
        reasons.append(f"Short Detour ({distance_km:.1f} km)")
        
    if price <= 12.0:
        reasons.append(f"Low Price (₹{price}/kWh)")
        
    if wait <= 5:
        reasons.append(f"Low Wait Time ({wait} mins)")
        
    if speed >= 50.0:
        reasons.append(f"Fast DC Charger ({speed:.0f} kW)")
        
    if station.renewable_pct >= 50.0:
        reasons.append(f"{station.renewable_pct:.0f}% Clean/Renewable Energy")
        
    return {
        "score": final_score,
        "distance_km": round(distance_km, 1),
        "reasons": reasons
    }
