from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    matches = relationship("JobMatch", back_populates="user", cascade="all, delete-orphan")
    roadmaps = relationship("CareerRoadmap", back_populates="user", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="user", cascade="all, delete-orphan")
    coding_submissions = relationship("CodingSubmission", back_populates="user", cascade="all, delete-orphan")
    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    education = Column(String(150), nullable=True)
    degree = Column(String(150), nullable=True)
    experience_level = Column(String(50), default="Entry Level") # Entry, Mid, Senior
    current_role = Column(String(100), nullable=True)
    target_role = Column(String(100), default="AI Engineer")
    years_of_experience = Column(Float, default=0.0)
    skills = Column(JSON, default=list) # List of skill strings
    technical_interests = Column(JSON, default=list)
    preferred_locations = Column(JSON, default=list)
    preferred_industries = Column(JSON, default=list)
    bio = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    dark_mode = Column(Boolean, default=True)
    notification_email = Column(Boolean, default=True)
    weights_config = Column(JSON, default=lambda: {
        "skill_similarity": 0.40,
        "semantic_similarity": 0.25,
        "preference_match": 0.20,
        "experience_alignment": 0.15
    })

    user = relationship("User", back_populates="preferences")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    parsed_text = Column(Text, nullable=True)
    structured_data = Column(JSON, default=dict) # parsed sections: skills, exp, edu, etc.
    ats_score = Column(Float, default=0.0)
    ats_breakdown = Column(JSON, default=dict)
    improvement_suggestions = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    resume_skills = relationship("ResumeSkill", back_populates="resume", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(50), default="General") # Programming, AI/ML, Data, Backend, DevOps, Soft Skills
    description = Column(Text, nullable=True)


class ResumeSkill(Base):
    __tablename__ = "resume_skills"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    proficiency = Column(Float, default=0.7) # 0.0 to 1.0

    resume = relationship("Resume", back_populates="resume_skills")


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    company = Column(String(150), nullable=False)
    location = Column(String(100), default="Remote")
    description_text = Column(Text, nullable=False)
    required_skills = Column(JSON, default=list)
    preferred_skills = Column(JSON, default=list)
    experience_required = Column(String(50), default="0-2 years")
    education_required = Column(String(100), nullable=True)
    tools = Column(JSON, default=list)
    responsibilities = Column(JSON, default=list)
    domain = Column(String(100), default="AI/Tech")
    is_sample = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    job_skills = relationship("JobSkill", back_populates="job", cascade="all, delete-orphan")


class JobSkill(Base):
    __tablename__ = "job_skills"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job_descriptions.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    is_required = Column(Boolean, default=True)

    job = relationship("JobDescription", back_populates="job_skills")


class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_descriptions.id"), nullable=False)
    overall_score = Column(Float, nullable=False) # e.g. 82.5
    semantic_similarity = Column(Float, nullable=False)
    skill_coverage = Column(Float, nullable=False)
    experience_alignment = Column(Float, nullable=False)
    matched_skills = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="matches")
    job = relationship("JobDescription")


class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_role = Column(String(100), nullable=False)
    missing_skills = Column(JSON, default=list)
    priority_skills = Column(JSON, default=list) # List of dicts with name, priority, why_it_matters
    readiness_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)


class CareerRoadmap(Base):
    __tablename__ = "career_roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_role = Column(String(100), nullable=False)
    title = Column(String(150), nullable=False)
    duration_months = Column(Integer, default=6)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="roadmaps")
    items = relationship("RoadmapItem", back_populates="roadmap", cascade="all, delete-orphan")


class RoadmapItem(Base):
    __tablename__ = "roadmap_items"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("career_roadmaps.id"), nullable=False)
    month = Column(Integer, nullable=False) # 1 to 6
    skill = Column(String(100), nullable=False)
    why_it_matters = Column(Text, nullable=False)
    category = Column(String(50), default="Core Skill")
    project_idea = Column(Text, nullable=True)
    practice_task = Column(Text, nullable=True)
    status = Column(String(30), default="Not Started") # Not Started, In Progress, Completed

    roadmap = relationship("CareerRoadmap", back_populates="items")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String(50), nullable=False) # skill, project, practice, interview
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    target_skill = Column(String(100), nullable=True)
    score = Column(Float, default=0.8)
    created_at = Column(DateTime, default=datetime.utcnow)


class ProjectRecommendation(Base):
    __tablename__ = "project_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    target_role = Column(String(100), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(50), default="Intermediate")
    skills_demonstrated = Column(JSON, default=list)
    steps = Column(JSON, default=list)


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_role = Column(String(100), nullable=False)
    difficulty = Column(String(30), default="Intermediate") # Beginner, Intermediate, Advanced
    interview_type = Column(String(30), default="Technical") # Technical, HR, Mixed
    status = Column(String(30), default="In Progress") # In Progress, Completed
    overall_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="interviews")
    questions = relationship("InterviewQuestion", back_populates="interview", cascade="all, delete-orphan")
    evaluation = relationship("InterviewEvaluation", back_populates="interview", uselist=False, cascade="all, delete-orphan")


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"), nullable=False)
    question_order = Column(Integer, nullable=False)
    question_text = Column(Text, nullable=False)
    category = Column(String(50), default="Technical")
    expected_keywords = Column(JSON, default=list)

    interview = relationship("Interview", back_populates="questions")
    answer = relationship("InterviewAnswer", back_populates="question", uselist=False, cascade="all, delete-orphan")


class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("interview_questions.id"), nullable=False)
    user_answer = Column(Text, nullable=False)
    score = Column(Float, default=0.0)
    feedback = Column(Text, nullable=True)
    relevance_score = Column(Float, default=0.0)
    technical_depth = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    question = relationship("InterviewQuestion", back_populates="answer")


class InterviewEvaluation(Base):
    __tablename__ = "interview_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"), nullable=False)
    technical_score = Column(Float, default=0.0)
    answer_relevance = Column(Float, default=0.0)
    concept_coverage = Column(Float, default=0.0)
    communication_score = Column(Float, default=0.0)
    strong_areas = Column(JSON, default=list)
    weak_areas = Column(JSON, default=list)
    concepts_to_revise = Column(JSON, default=list)
    next_recommended_level = Column(String(50), default="Intermediate")

    interview = relationship("Interview", back_populates="evaluation")


class CodingChallenge(Base):
    __tablename__ = "coding_challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    category = Column(String(50), default="Python") # Python, SQL, DSA, Machine Learning, APIs
    difficulty = Column(String(30), default="Easy")
    problem_statement = Column(Text, nullable=False)
    starter_code = Column(Text, nullable=False)
    example_input = Column(Text, nullable=True)
    example_output = Column(Text, nullable=True)
    test_cases = Column(JSON, default=list) # [{input: "...", expected: "..."}]


class CodingSubmission(Base):
    __tablename__ = "coding_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(Integer, ForeignKey("coding_challenges.id"), nullable=False)
    code = Column(Text, nullable=False)
    status = Column(String(30), default="Passed") # Passed, Failed, Error
    passed_test_cases = Column(Integer, default=0)
    total_test_cases = Column(Integer, default=0)
    stdout = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="coding_submissions")
    challenge = relationship("CodingChallenge")


class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_descriptions.id"), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_jobs")
    job = relationship("JobDescription")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company = Column(String(150), nullable=False)
    role = Column(String(150), nullable=False)
    status = Column(String(50), default="Saved") # Saved, Applied, Assessment, Interview, Offer, Rejected
    applied_date = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
    job_url = Column(String(500), nullable=True)
    next_action = Column(String(200), nullable=True)

    user = relationship("User", back_populates="applications")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    messages = Column(JSON, default=list) # [{role: "user"|"assistant", content: "..."}]
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_type = Column(String(50), nullable=False) # recommendation, job_match, roadmap
    item_id = Column(String(100), nullable=False)
    is_positive = Column(Boolean, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="feedbacks")
