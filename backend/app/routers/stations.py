from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import ChargingStation, Charger, StationReport, User
from app.schemas import StationOut, StationUpdate, RecommendationRequest, StationReportCreate, StationReportOut
from app.services.recommendation import score_charging_station
from app.services.energy import calculate_haversine_distance
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/stations", tags=["stations"])

@router.get("", response_model=List[StationOut])
def get_stations(
    city: Optional[str] = Query(None),
    operator: Optional[str] = Query(None),
    connector_type: Optional[str] = Query(None),
    charging_type: Optional[str] = Query(None),
    min_speed_kw: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    available_only: bool = Query(False),
    bbox: Optional[str] = Query(None), # min_lng,min_lat,max_lng,max_lat
    db: Session = Depends(get_db)
):
    query = db.query(ChargingStation)

    if city:
        query = query.filter(ChargingStation.city.ilike(f"%{city}%"))
    if operator and operator != "all":
        query = query.filter(ChargingStation.operator.ilike(f"%{operator}%"))
    if available_only:
        query = query.filter(ChargingStation.available_chargers > 0)
    if min_speed_kw is not None:
        query = query.filter(ChargingStation.max_charging_speed_kw >= min_speed_kw)
    if max_price is not None:
        query = query.filter(ChargingStation.price_per_kwh <= max_price)

    # Bounding Box Query for Map Performance
    if bbox:
        try:
            min_lng, min_lat, max_lng, max_lat = map(float, bbox.split(","))
            query = query.filter(
                ChargingStation.lat >= min_lat,
                ChargingStation.lat <= max_lat,
                ChargingStation.lng >= min_lng,
                ChargingStation.lng <= max_lng
            )
        except Exception:
            pass

    stations = query.all()

    # Filter by connector_type or charging_type via relational chargers
    if connector_type and connector_type != "all":
        filtered = []
        for st in stations:
            if any(c.connector_type.upper() == connector_type.upper() for c in st.chargers):
                filtered.append(st)
        stations = filtered

    if charging_type and charging_type != "all":
        filtered = []
        for st in stations:
            if any(c.charging_type.upper() == charging_type.upper() for c in st.chargers):
                filtered.append(st)
        stations = filtered

    return stations

@router.get("/nearby", response_model=List[StationOut])
def get_nearby_stations(
    lat: float = Query(...),
    lng: float = Query(...),
    radius_km: float = Query(10.0),
    db: Session = Depends(get_db)
):
    all_stations = db.query(ChargingStation).all()
    results = []
    
    for st in all_stations:
        dist_km = calculate_haversine_distance(lat, lng, st.lat, st.lng)
        if dist_km <= radius_km:
            st_out = StationOut.from_orm(st)
            st_out.reasons = [f"{dist_km:.1f} km away"]
            results.append((dist_km, st_out))

    # Sort by distance ascending
    results.sort(key=lambda x: x[0])
    return [r[1] for r in results]

@router.get("/operators", response_model=List[str])
def get_operators(db: Session = Depends(get_db)):
    operators = db.query(ChargingStation.operator).distinct().all()
    return [op[0] for op in operators if op[0]]

@router.get("/connectors", response_model=List[str])
def get_connectors(db: Session = Depends(get_db)):
    connectors = db.query(Charger.connector_type).distinct().all()
    return [c[0] for c in connectors if c[0]]

@router.get("/{station_id}", response_model=StationOut)
def get_station_by_id(station_id: int, db: Session = Depends(get_db)):
    station = db.query(ChargingStation).filter(ChargingStation.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Charging station not found")
    return station

@router.put("/{station_id}", response_model=StationOut)
def update_station(station_id: int, payload: StationUpdate, db: Session = Depends(get_db)):
    station = db.query(ChargingStation).filter(ChargingStation.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Charging station not found")

    if payload.available_chargers is not None:
        station.available_chargers = max(0, min(station.total_chargers, payload.available_chargers))
    if payload.price_per_kwh is not None:
        station.price_per_kwh = payload.price_per_kwh
    if payload.wait_time_mins is not None:
        station.wait_time_mins = payload.wait_time_mins
    if payload.status is not None:
        station.status = payload.status

    db.commit()
    db.refresh(station)
    return station

@router.post("/recommend", response_model=List[StationOut])
def recommend_stations(payload: RecommendationRequest, db: Session = Depends(get_db)):
    stations = db.query(ChargingStation).all()
    scored_stations = []
    
    for station in stations:
        score_res = score_charging_station(
            station=station,
            user_lat=payload.user_lat,
            user_lng=payload.user_lng,
            preference=payload.preference
        )
        station_out = StationOut.from_orm(station)
        station_out.score = score_res["score"]
        station_out.reasons = score_res["reasons"]
        scored_stations.append(station_out)

    scored_stations.sort(key=lambda s: s.score or 0.0, reverse=True)
    return scored_stations

@router.post("/reports", response_model=StationReportOut)
def report_station_issue(
    payload: StationReportCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    report = StationReport(
        station_id=payload.station_id,
        user_id=current_user.id if current_user else None,
        issue_type=payload.issue_type,
        comments=payload.comments,
        status="PENDING"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
