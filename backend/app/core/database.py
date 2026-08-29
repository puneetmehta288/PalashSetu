"""
BhashaSetu — Database Configuration
=====================================

Uses SQLAlchemy with SQLite for data persistence.
Supports both sync and async operations.
"""

import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

# Ensure data directory exists
db_url = settings.DATABASE_URL
if db_url.startswith("sqlite"):
    # Extract path and ensure directory exists
    db_path = db_url.replace("sqlite:///", "").replace("sqlite+aiosqlite:///", "")
    os.makedirs(os.path.dirname(db_path) if os.path.dirname(db_path) else ".", exist_ok=True)

# Use sync SQLite engine for simplicity and compatibility
sync_url = db_url.replace("sqlite+aiosqlite:///", "sqlite:///")
engine = create_engine(sync_url, echo=False, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Get a database session. Use as a FastAPI dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize the database — create all tables."""
    Base.metadata.create_all(bind=engine)
