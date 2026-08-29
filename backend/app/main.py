"""
BhashaSetu — FastAPI Backend Application
==========================================

AI-powered teaching assistant for Hindi-medium primary-school teachers
teaching Santali-speaking children.

Start with: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
"""

import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.database import init_db

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown."""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")

    # Create database tables
    try:
        init_db()
        logger.info("Database initialized")
    except Exception as e:
        logger.warning(f"Database init warning: {e}")

    # Ensure data directories exist
    for d in [settings.CONTENT_DIR, settings.AUDIO_DIR, "data/content", "data/audio"]:
        os.makedirs(d, exist_ok=True)

    logger.info("BhashaSetu backend ready")
    yield
    logger.info("Shutting down BhashaSetu backend")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered Vernacular Pedagogy and Real-Time Translation Tool for Mother Tongue-Based Primary Education",
    lifespan=lifespan,
)

# CORS middleware — allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(api_router, prefix="/api/v1")


# Translation service singleton
_translation_service = None


def get_translation_service():
    """Get or create the translation service singleton."""
    global _translation_service
    if _translation_service is None:
        from app.services.translation.indictrans2_service import IndicTrans2Service
        _translation_service = IndicTrans2Service()
    return _translation_service


@app.get("/api/health")
async def health_check():
    """Health check endpoint — reports status of all services."""
    ts = get_translation_service()
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "services": {
            "api": "ok",
            "translation_model": ts.get_status(),
            "database": "ok",
            "storage": "ok",
        },
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/api/health",
    }
