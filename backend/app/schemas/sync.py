"""Synchronization schemas."""

from pydantic import BaseModel
from typing import List, Optional


class SyncItem(BaseModel):
    """A single item in the sync manifest."""
    content_id: str
    version: int = 1
    updated_at: str = ""
    checksum: str = ""


class SyncManifestResponse(BaseModel):
    """Response containing the full sync manifest."""
    items: List[SyncItem]


class SyncCheckRequest(BaseModel):
    """Request to check for updates against client manifest."""
    client_manifest: List[SyncItem]


class SyncCheckResponse(BaseModel):
    """Response containing items that need updating."""
    updates_needed: List[SyncItem]
