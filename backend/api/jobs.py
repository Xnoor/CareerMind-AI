from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database.session import get_db
from backend.models.models import User, JobDescription, UserProfile
from backend.schemas.schemas import JobDescriptionCreate, JobDescriptionOut
from backend.services.auth_service import get_current_user
from backend.services.job_parser import parse_job_description
from backend.services.nlp_service import compute_cosine_similarity

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

@router.post("/analyze", response_model=JobDescriptionOut)
def analyze_job(req: JobDescriptionCreate, db: Session = Depends(get_db)):
    parsed = parse_job_description(req.title, req.company, req.description_text)
    
    job = JobDescription(
        title=parsed["title"],
        company=parsed["company"],
        location=req.location or "Remote",
        description_text=req.description_text,
        required_skills=parsed["required_skills"],
        preferred_skills=parsed["preferred_skills"],
        experience_required=parsed["experience_required"],
        tools=parsed["tools"],
        responsibilities=parsed["responsibilities"],
        domain="AI/Tech",
        is_sample=False
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.get("", response_model=List[JobDescriptionOut])
def get_jobs(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(JobDescription)
    if search:
        # Filter by semantic or text matching
        jobs = query.all()
        scored = []
        for j in jobs:
            sim = compute_cosine_similarity(search, f"{j.title} {j.description_text}")
            scored.append((j, sim))
        scored.sort(key=lambda x: x[1], reverse=True)
        return [item[0] for item in scored]
    return query.order_by(JobDescription.created_at.desc()).all()

@router.get("/{id}", response_model=JobDescriptionOut)
def get_job_by_id(id: int, db: Session = Depends(get_db)):
    job = db.query(JobDescription).filter(JobDescription.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found")
    return job

@router.post("/compare")
def compare_jobs(job_ids: List[int], db: Session = Depends(get_db)):
    if len(job_ids) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 job IDs to compare.")

    jobs = db.query(JobDescription).filter(JobDescription.id.in_(job_ids)).all()
    if len(jobs) < 2:
        raise HTTPException(status_code=404, detail="One or more specified jobs were not found.")

    comparison_results = []
    for j in jobs:
        comparison_results.append({
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "required_skills": j.required_skills,
            "experience_required": j.experience_required,
            "tools": j.tools,
            "responsibilities": j.responsibilities[:3]
        })

    return {
        "compared_jobs_count": len(jobs),
        "jobs": comparison_results,
        "note": "Factual comparative analysis of required skill sets and responsibilities."
    }
