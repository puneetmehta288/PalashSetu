"""Test configuration and fixtures for BhashaSetu backend tests."""

import os
import pytest
from fastapi.testclient import TestClient

# Set test database
os.environ["DATABASE_URL"] = "sqlite:///./test_bhashasetu.db"

from app.main import app
from app.core.database import Base, engine, init_db


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Create test database tables."""
    init_db()
    yield
    # Cleanup — dispose engine first to release file locks
    engine.dispose()
    try:
        if os.path.exists("test_bhashasetu.db"):
            os.remove("test_bhashasetu.db")
    except PermissionError:
        pass  # Windows may still hold the file


@pytest.fixture(scope="session")
def client():
    """Create a test client."""
    with TestClient(app) as c:
        yield c
