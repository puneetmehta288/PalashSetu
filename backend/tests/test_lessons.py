def test_lesson_generation(client):
    response = client.post("/api/v1/lessons/generate", json={"topic": "Counting 1-10"})
    assert response.status_code == 200
    data = response.json()
    assert "title_hin" in data
    assert "sections" in data
    assert len(data["sections"]) > 0
