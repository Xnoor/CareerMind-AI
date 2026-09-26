import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.session import init_db, SessionLocal
from backend.database.seed import seed_database

from backend.api.auth import router as auth_router
from backend.api.profile import router as profile_router
from backend.api.resumes import router as resumes_router
from backend.api.jobs import router as jobs_router
from backend.api.matching import router as matching_router
from backend.api.skills import router as skills_router
from backend.api.roadmap import router as roadmap_router
from backend.api.recommendations import router as recommendations_router
from backend.api.interview import router as interview_router
from backend.api.assistant import router as assistant_router
from backend.api.applications import router as applications_router
from backend.api.analytics import router as analytics_router
from backend.api.health import router as health_router

app = FastAPI(
    title="CareerMind AI API",
    description="Intelligent AI/ML Career Operating System Backend",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(resumes_router)
app.include_router(jobs_router)
app.include_router(matching_router)
app.include_router(skills_router)
app.include_router(roadmap_router)
app.include_router(recommendations_router)
app.include_router(interview_router)
app.include_router(assistant_router)
app.include_router(applications_router)
app.include_router(analytics_router)

@app.on_event("startup")
def on_startup():
    init_db()
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
