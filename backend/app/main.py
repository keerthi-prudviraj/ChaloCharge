from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import auth, vehicles, stations, routes, bookings, admin

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Smart EV Route Planning & Charging Optimization Platform API",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(stations.router)
app.include_router(routes.router)
app.include_router(bookings.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app_name": settings.APP_NAME,
        "docs_url": "/docs"
    }
