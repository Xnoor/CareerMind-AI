# Testing Strategy & Verification - CAREERMIND AI

## 1. Backend Testing with Pytest
Run the backend test suite using:
```bash
python -m pytest backend/tests/test_api.py
```
Coverage includes:
* `test_health_endpoint`: API health and database connectivity.
* `test_auth_and_profile_flow`: Registration, JWT authentication, and profile updates.
* `test_career_dna_and_skill_gap`: Career DNA profile generation and skill gap calculations.
* `test_job_matching`: TF-IDF and embedding cosine similarity matching engine.

## 2. Frontend Build Verification
Verify React frontend compilation using:
```bash
cd frontend
npm run build
```

## 3. End-to-End Workflow Verification Checklist
1. User registration & login with JWT persistence.
2. Target role selection during onboarding (AI Engineer, ML Engineer, etc.).
3. Resume upload (PDF/DOCX/TXT) & NLP skill extraction.
4. ATS quality breakdown score generation.
5. Job description analysis & transparent job match calculation.
6. Skill gap priority ranking.
7. 6-Month career roadmap creation & status updates.
8. AI Mock Interview session question flow & answer evaluation.
9. Sandboxed Python coding challenge execution.
10. Application tracker CRUD operations.
11. RAG AI Assistant chat with knowledge citations.
12. Admin analytics dashboard.
