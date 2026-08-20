from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Vehicle, User
from app.schemas import VehicleCreate, VehicleOut
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])

# Standard pre-configured Indian EV Models
STANDARD_EV_MODELS = [
    {
        "brand": "Tata",
        "model": "Nexon EV Max",
        "battery_capacity_kwh": 40.5,
        "real_world_range_km": 260.0,
        "connector_type": "CCS2",
        "max_ac_kw": 7.2,
        "max_dc_kw": 50.0,
        "current_battery_pct": 80.0
    },
    {
        "brand": "Tata",
        "model": "Punch EV",
        "battery_capacity_kwh": 35.0,
        "real_world_range_km": 230.0,
        "connector_type": "CCS2",
        "max_ac_kw": 7.2,
        "max_dc_kw": 50.0,
        "current_battery_pct": 75.0
    },
    {
        "brand": "MG",
        "model": "ZS EV",
        "battery_capacity_kwh": 50.3,
        "real_world_range_km": 320.0,
        "connector_type": "CCS2",
        "max_ac_kw": 7.4,
        "max_dc_kw": 50.0,
        "current_battery_pct": 85.0
    },
    {
        "brand": "Hyundai",
        "model": "Ioniq 5",
        "battery_capacity_kwh": 72.6,
        "real_world_range_km": 420.0,
        "connector_type": "CCS2",
        "max_ac_kw": 11.0,
        "max_dc_kw": 150.0,
        "current_battery_pct": 90.0
    },
    {
        "brand": "Mahindra",
        "model": "XUV400 EV",
        "battery_capacity_kwh": 39.4,
        "real_world_range_km": 250.0,
        "connector_type": "CCS2",
        "max_ac_kw": 7.2,
        "max_dc_kw": 50.0,
        "current_battery_pct": 70.0
    }
]

@router.get("/standard", response_model=List[VehicleCreate])
def get_standard_ev_models():
    """Returns standard pre-configured EV models available in India."""
    return STANDARD_EV_MODELS

@router.get("", response_model=List[VehicleOut])
def get_user_vehicles(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Vehicle).filter(Vehicle.user_id == current_user.id).all()

@router.post("", response_model=VehicleOut)
def create_vehicle(vehicle_data: VehicleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vehicle = Vehicle(**vehicle_data.dict(), user_id=current_user.id)
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id, Vehicle.user_id == current_user.id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    db.delete(vehicle)
    db.commit()
    return {"message": "Vehicle deleted successfully"}
