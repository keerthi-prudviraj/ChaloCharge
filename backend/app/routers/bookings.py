from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Booking, ChargingStation, User
from app.schemas import BookingCreate, BookingOut
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

@router.post("", response_model=BookingOut)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    station = db.query(ChargingStation).filter(ChargingStation.id == booking_data.station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Charging station not found")
        
    if station.available_chargers <= 0:
        raise HTTPException(status_code=400, detail="No available chargers at this station")
        
    booking = Booking(
        user_id=current_user.id,
        station_id=booking_data.station_id,
        charger_id=booking_data.charger_id,
        start_time=booking_data.start_time,
        duration_mins=booking_data.duration_mins,
        estimated_cost=booking_data.estimated_cost,
        status="Confirmed"
    )
    
    # Award ChaloPoints for booking!
    current_user.chalo_points += 50
    
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

@router.get("", response_model=List[BookingOut])
def get_user_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Booking).filter(Booking.user_id == current_user.id).order_by(Booking.start_time.desc()).all()
