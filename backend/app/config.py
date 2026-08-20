import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "ChaloCharge EV API"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "chalocharge-super-secret-jwt-key-2025")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # SQLite fallback if PostgreSQL DATABASE_URL is not set
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./chalocharge.db")
    MAPBOX_ACCESS_TOKEN: str = os.getenv("VITE_MAPBOX_ACCESS_TOKEN", "")

settings = Settings()
