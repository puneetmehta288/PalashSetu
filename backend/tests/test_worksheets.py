def test_worksheet_generation(client):
    response = client.post("/api/v1/worksheets/generate", json={"topic": "Counting 1-10", "num_questions": 3})
    assert response.status_code == 200
    data = response.json()
    assert len(data["questions"]) == 3
    assert data["questions"][0]["question_type"] == "counting"
