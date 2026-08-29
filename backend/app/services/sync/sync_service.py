"""Synchronization service — content manifest and versioning."""

from typing import List, Optional
from datetime import datetime
from app.schemas.sync import SyncItem
from app.models.content import SyncManifest, ContentItem
from sqlalchemy.orm import Session
from sqlalchemy import select


class SyncService:
    """Service for content synchronization between backend and mobile app."""

    def get_manifest(self, db: Session) -> List[SyncItem]:
        """Get the full sync manifest."""
        items = db.query(SyncManifest).all()
        return [
            SyncItem(
                content_id=str(i.content_id),
                version=i.version,
                updated_at=i.updated_at.isoformat() if i.updated_at else "",
                checksum=i.checksum or "",
            )
            for i in items
        ]

    def check_updates(self, db: Session, client_items: List[SyncItem]) -> List[SyncItem]:
        """Compare client manifest with server and return items that need updating."""
        server_manifest = self.get_manifest(db)
        server_dict = {i.content_id: i for i in server_manifest}

        updates = []
        for c_item in client_items:
            s_item = server_dict.get(c_item.content_id)
            if s_item and s_item.version > c_item.version:
                updates.append(s_item)

        # Also return new items not on client
        client_ids = {i.content_id for i in client_items}
        for s_item in server_manifest:
            if s_item.content_id not in client_ids:
                updates.append(s_item)

        return updates

    def get_content(self, db: Session, content_id: int) -> Optional[dict]:
        """Get content item by ID."""
        item = db.query(ContentItem).filter(ContentItem.id == content_id).first()
        if not item:
            return None
        return {
            "id": item.id,
            "title": item.title,
            "type": item.type,
            "grade": item.grade,
            "subject": item.subject,
            "topic": item.topic,
            "language": item.language,
            "version": item.version,
            "content_data": item.content_data,
            "file_path": item.file_path,
        }
