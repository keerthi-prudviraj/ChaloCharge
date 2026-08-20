import datetime
from app.database import SessionLocal, Base, engine
from app.models import User, Vehicle
from app.routers.auth import get_password_hash
from scripts.import_charging_stations import import_verified_stations

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Create demo admin & user if not exists
    admin = db.query(User).filter(User.email == "admin@chalocharge.com").first()
    if not admin:
        admin = User(
            email="admin@chalocharge.com",
            hashed_password=get_password_hash("Admin123!"),
            full_name="ChaloCharge Admin",
            role="admin"
        )
        db.add(admin)

    demo_user = db.query(User).filter(User.email == "driver@chalocharge.com").first()
    if not demo_user:
        demo_user = User(
            email="driver@chalocharge.com",
            hashed_password=get_password_hash("Driver123!"),
            full_name="EV Driver Demo",
            role="user"
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

        # Seed default vehicle for demo user
        vehicle = Vehicle(
            user_id=demo_user.id,
            brand="Tata",
            model="Nexon EV Max",
            battery_capacity_kwh=40.5,
            real_world_range_km=260.0,
            connector_type="CCS2",
            max_ac_kw=7.2,
            max_dc_kw=50.0,
            current_battery_pct=75.0
        )
        db.add(vehicle)
        db.commit()

    db.close()
    print("Users & Vehicles seeded successfully!")

    # Import verified Hyderabad EV stations
    import_verified_stations()

if __name__ == "__main__":
    seed_db()
