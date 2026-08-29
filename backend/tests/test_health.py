"""Tests for health check endpoint."""


def test_health_check(client):
    """Test the health check endpoint returns OK."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "BhashaSetu"
    assert "services" in data
    assert data["services"]["api"] == "ok"


def test_root_endpoint(client):
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "BhashaSetu"
    assert "version" in data
