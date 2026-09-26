import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database.session import init_db, SessionLocal
from backend.database.seed import seed_database

# Initialize DB for tests
init_db()
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data

def test_auth_and_profile_flow():
    # Register test user
    email = "testuser_pytest@careermind.ai"
    reg_payload = {
        "name": "Pytest User",
        "email": email,
        "password": "password123"
    }
    res_reg = client.post("/api/auth/register", json=reg_payload)
    if res_reg.status_code == 400: # Already registered
        res_log = client.post("/api/auth/login", json={"email": email, "password": "password123"})
        token = res_log.json()["access_token"]
    else:
        assert res_reg.status_code == 200
        token = res_reg.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # Get Me
    res_me = client.get("/api/auth/me", headers=headers)
    assert res_me.status_code == 200
    assert res_me.json()["email"] == email

    # Update Profile
    prof_payload = {
        "target_role": "AI Engineer",
        "skills": ["Python", "PyTorch", "FastAPI"]
    }
    res_prof = client.put("/api/profile", json=prof_payload, headers=headers)
    assert res_prof.status_code == 200
    assert res_prof.json()["target_role"] == "AI Engineer"

def test_career_dna_and_skill_gap():
    # Login as demo user
    res_log = client.post("/api/auth/login", json={"email": "alex@careermind.ai", "password": "password123"})
    token = res_log.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Career DNA
    res_dna = client.get("/api/skills/dna", headers=headers)
    assert res_dna.status_code == 200
    data = res_dna.json()
    assert "readiness_score" in data
    assert "radar_data" in data

    # Skill Gap
    res_gap = client.get("/api/skills/gaps", headers=headers)
    assert res_gap.status_code == 200
    assert "priority_skills" in res_gap.json()

def test_job_matching():
    res_log = client.post("/api/auth/login", json={"email": "alex@careermind.ai", "password": "password123"})
    token = res_log.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    match_payload = {
        "raw_job_text": "We need an AI Engineer proficient in Python, PyTorch, RAG, and FastAPI with 1 year experience."
    }
    res_match = client.post("/api/matching/analyze", json=match_payload, headers=headers)
    assert res_match.status_code == 200
    data = res_match.json()
    assert "overall_score" in data
    assert "matched_skills" in data
