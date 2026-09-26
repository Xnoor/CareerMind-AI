import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database.base import Base

# Database URL from env, default to local SQLite for zero-config run
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./careermind.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from backend.models.models import (
        User, UserProfile, UserPreference, Resume, ResumeSkill,
        JobDescription, JobSkill, JobMatch, Skill, SkillGap,
        CareerRoadmap, RoadmapItem, Recommendation, Interview,
        InterviewQuestion, InterviewAnswer, InterviewEvaluation,
        CodingChallenge, CodingSubmission, SavedJob, Application,
        ProjectRecommendation, Conversation, Feedback
    )
    Base.metadata.create_all(bind=engine)
