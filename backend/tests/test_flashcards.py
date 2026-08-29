def test_flashcard_generation(client):
    response = client.post("/api/v1/flashcards/generate", json={"topic": "Counting 1-10"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10
    assert data[0]["hindi_text"] == "एक"
