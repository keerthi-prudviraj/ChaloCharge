from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any

from app.database import get_db
from app.models import User, ChargingStation, Booking, Trip
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_stations = db.query(func.count(ChargingStation.id)).scalar() or 0
    total_bookings = db.query(func.count(Booking.id)).scalar() or 0
    total_trips = db.query(func.count(Trip.id)).scalar() or 0
    
    total_revenue = db.query(func.sum(Booking.estimated_cost)).scalar() or 0.0
    
    return {
        "total_users": total_users,
        "total_stations": total_stations,
        "total_bookings": total_bookings,
        "total_trips": total_trips,
        "total_revenue_inr": round(total_revenue, 2),
        "system_status": "Healthy (PostgreSQL/FastAPI)"
    }

@router.get("/users")
def get_admin_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    users = db.query(User).all()
    return [{
        "id": u.id,
        "email": u.email,
        "full_name": u.full_name,
        "role": u.role,
        "chalo_points": u.chalo_points,
        "created_at": u.created_at
    } for u in users]
