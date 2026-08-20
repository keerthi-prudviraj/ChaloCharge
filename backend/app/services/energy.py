import math

def calculate_battery_metrics(
    distance_km: float,
    battery_capacity_kwh: float,
    real_world_range_km: float,
    current_battery_pct: float
):
    """
    Calculates battery metrics based on vehicle specs and current state.
    """
    # kWh consumed per km
    energy_per_km = battery_capacity_kwh / max(1.0, real_world_range_km)
    
    # Current available energy in kWh
    usable_energy_kwh = (max(0.0, min(100.0, current_battery_pct)) / 100.0) * battery_capacity_kwh
    
    # Range with current charge in km
    current_range_km = usable_energy_kwh / energy_per_km
    
    # Total energy needed for trip in kWh
    energy_required_kwh = distance_km * energy_per_km
    
    # Can reach without recharging?
    can_reach_destination = current_range_km >= distance_km
    
    # Remaining battery % upon arrival if no charging stop
    remaining_kwh = usable_energy_kwh - energy_required_kwh
    battery_at_destination_pct = max(0.0, (remaining_kwh / battery_capacity_kwh) * 100.0) if remaining_kwh >= 0 else 0.0
    
    warning = None
    if not can_reach_destination:
        shortfall_km = distance_km - current_range_km
        warning = f"Warning: Current battery ({current_battery_pct:.0f}%, ~{current_range_km:.0f} km range) is insufficient for a {distance_km:.0f} km trip. You are {shortfall_km:.0f} km short and need a charging stop!"
    
    return {
        "energy_per_km": round(energy_per_km, 3),
        "usable_energy_kwh": round(usable_energy_kwh, 1),
        "current_range_km": round(current_range_km, 1),
        "energy_required_kwh": round(energy_required_kwh, 1),
        "can_reach_destination": can_reach_destination,
        "battery_at_destination_pct": round(battery_at_destination_pct, 1),
        "warning": warning
    }

def calculate_haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Great-circle distance between two points in km.
    """
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2.0)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c
