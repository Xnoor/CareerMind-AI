from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str
    email: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None

class ForgotPassword(BaseModel):
    email: str

# Profile Schemas
class UserProfileUpdate(BaseModel):
    education: Optional[str] = None
    degree: Optional[str] = None
    experience_level: Optional[str] = None
    current_role: Optional[str] = None
    target_role: Optional[str] = None
    years_of_experience: Optional[float] = None
    skills: Optional[List[str]] = None
    technical_interests: Optional[List[str]] = None
    preferred_locations: Optional[List[str]] = None
    preferred_industries: Optional[List[str]] = None
    bio: Optional[str] = None

class UserProfileOut(BaseModel):
    id: int
    user_id: int
    education: Optional[str] = None
    degree: Optional[str] = None
    experience_level: str
    current_role: Optional[str] = None
    target_role: str
    years_of_experience: float
    skills: List[str] = []
    technical_interests: List[str] = []
    preferred_locations: List[str] = []
    preferred_industries: List[str] = []
    bio: Optional[str] = None

    model_config = {"from_attributes": True}

# Resume Analysis Schemas
class ResumeOut(BaseModel):
    id: int
    filename: str
    ats_score: float
    structured_data: Dict[str, Any]
    ats_breakdown: Dict[str, Any]
    improvement_suggestions: List[str]
    created_at: datetime

    model_config = {"from_attributes": True}

class ResumeImprovementRequest(BaseModel):
    target_role: str
    section: Optional[str] = "summary" # summary, skills, experience, projects

# Job Description Schemas
class JobDescriptionCreate(BaseModel):
    title: str
    company: str
    location: Optional[str] = "Remote"
    description_text: str

class JobDescriptionOut(BaseModel):
    id: int
    title: str
    company: str
    location: str
    description_text: str
    required_skills: List[str]
    preferred_skills: List[str]
    experience_required: str
    education_required: Optional[str] = None
    tools: List[str]
    responsibilities: List[str]
    domain: str
    is_sample: bool

    model_config = {"from_attributes": True}

# Job Matching Schemas
class JobMatchRequest(BaseModel):
    job_description_id: Optional[int] = None
    raw_job_text: Optional[str] = None

class JobMatchOut(BaseModel):
    id: Optional[int] = None
    job_id: Optional[int] = None
    job_title: str
    company: str
    overall_score: float
    semantic_similarity: float
    skill_coverage: float
    experience_alignment: float
    matched_skills: List[str]
    missing_skills: List[str]
    explanation: str

# Career DNA & Skill Gap Schemas
class CareerDNAResponse(BaseModel):
    target_role: str
    current_skills: List[str]
    strong_areas: List[str]
    skill_gaps: List[str]
    experience_level: str
    career_readiness_stage: str
    readiness_score: float
    radar_data: List[Dict[str, Any]]

class SkillGapOut(BaseModel):
    target_role: str
    skills_you_have: List[str]
    skills_you_need: List[str]
    priority_skills: List[Dict[str, Any]]
    readiness_score: float

# Roadmap Schemas
class RoadmapItemUpdate(BaseModel):
    status: str # Not Started, In Progress, Completed

class RoadmapOut(BaseModel):
    id: int
    target_role: str
    title: str
    duration_months: int
    items: List[Dict[str, Any]]

    model_config = {"from_attributes": True}

# Mock Interview Schemas
class StartInterviewRequest(BaseModel):
    target_role: str
    difficulty: str = "Intermediate" # Beginner, Intermediate, Advanced
    interview_type: str = "Technical" # Technical, HR, Mixed

class SubmitAnswerRequest(BaseModel):
    question_id: int
    user_answer: str

class InterviewResultOut(BaseModel):
    interview_id: int
    target_role: str
    overall_score: float
    technical_score: float
    answer_relevance: float
    concept_coverage: float
    communication_score: float
    strong_areas: List[str]
    weak_areas: List[str]
    concepts_to_revise: List[str]
    next_recommended_level: str
    qna_list: List[Dict[str, Any]]

# Coding Challenge Schemas
class CodingChallengeOut(BaseModel):
    id: int
    title: str
    category: str
    difficulty: str
    problem_statement: str
    starter_code: str
    example_input: Optional[str] = None
    example_output: Optional[str] = None

class CodingSubmissionRequest(BaseModel):
    challenge_id: int
    code: str

class CodingSubmissionResult(BaseModel):
    status: str
    passed_test_cases: int
    total_test_cases: int
    stdout: str
    feedback: str

# Application Tracker Schemas
class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: str = "Saved"
    notes: Optional[str] = None
    job_url: Optional[str] = None
    next_action: Optional[str] = None

class ApplicationOut(BaseModel):
    id: int
    company: str
    role: str
    status: str
    applied_date: datetime
    notes: Optional[str] = None
    job_url: Optional[str] = None
    next_action: Optional[str] = None

    model_config = {"from_attributes": True}

# Chat & RAG Assistant Schemas
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    retrieved_sources: List[str] = []

# Recommendation Feedback Schema
class FeedbackCreate(BaseModel):
    item_type: str
    item_id: str
    is_positive: bool
    comment: Optional[str] = None
