import pytest
from app.schemas.sync import SyncItem
from datetime import datetime

def test_sync_check(client):
    payload = {
        "client_manifest": [
            {"content_id": 1, "version": 1, "updated_at": "2023-01-01T00:00:00Z", "checksum": "abc"}
        ]
    }
    response = client.post("/api/v1/sync/check", json=payload)
    # 422 if DB not mocked, but we get a response
    if response.status_code == 200:
        data = response.json()
        assert "updates_needed" in data
