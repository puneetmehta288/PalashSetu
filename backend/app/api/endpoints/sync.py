"""Sync API endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.sync import SyncManifestResponse, SyncCheckRequest, SyncCheckResponse
from app.services.sync.sync_service import SyncService
from app.core.database import get_db

router = APIRouter()
sync_service = SyncService()


@router.get("/manifest", response_model=SyncManifestResponse)
def get_manifest(db: Session = Depends(get_db)):
    """Get the full content sync manifest."""
    items = sync_service.get_manifest(db)
    return SyncManifestResponse(items=items)


@router.post("/check", response_model=SyncCheckResponse)
def check_updates(request: SyncCheckRequest, db: Session = Depends(get_db)):
    """Check for content updates by comparing client manifest."""
    updates = sync_service.check_updates(db, request.client_manifest)
    return SyncCheckResponse(updates_needed=updates)


@router.get("/content/{content_id}")
def get_content(content_id: int, db: Session = Depends(get_db)):
    """Download a specific content item."""
    content = sync_service.get_content(db, content_id)
    if not content:
        return {"error": "Content not found"}
    return content
