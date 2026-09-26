from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.models.models import User, JobDescription, UserProfile, Resume, JobMatch
from backend.schemas.schemas import JobMatchRequest, JobMatchOut
from backend.services.auth_service import get_current_user
from backend.services.matching_service import compute_job_match
from backend.services.job_parser import parse_job_description

router = APIRouter(prefix="/api/matching", tags=["Matching"])

@router.post("/analyze", response_model=JobMatchOut)
def analyze_job_match(
    req: JobMatchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    u_skills = profile.skills if profile else ["Python", "Machine Learning", "FastAPI"]
    u_exp = profile.years_of_experience if profile else 0.5

    # Get latest user resume text
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).first()
    u_resume_text = resume.parsed_text if resume else " ".join(u_skills)

    job_title = "Target Role Job"
    company = "Tech Employer"
    job_text = ""
    req_skills = []
    job_id = None

    if req.job_description_id:
        job = db.query(JobDescription).filter(JobDescription.id == req.job_description_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        job_id = job.id
        job_title = job.title
        company = job.company
        job_text = job.description_text
        req_skills = job.required_skills
    elif req.raw_job_text:
        parsed = parse_job_description("Pasted Role", "Company", req.raw_job_text)
        job_text = req.raw_job_text
        req_skills = parsed["required_skills"]
    else:
        raise HTTPException(status_code=400, detail="Provide job_description_id or raw_job_text.")

    match_res = compute_job_match(
        user_skills=u_skills,
        user_resume_text=u_resume_text,
        job_required_skills=req_skills,
        job_text=job_text,
        user_experience_years=u_exp
    )

    # Save match record if job_id exists
    if job_id:
        jm = JobMatch(
            user_id=current_user.id,
            job_id=job_id,
            overall_score=match_res["overall_score"],
            semantic_similarity=match_res["semantic_similarity"],
            skill_coverage=match_res["skill_coverage"],
            experience_alignment=match_res["experience_alignment"],
            matched_skills=match_res["matched_skills"],
            missing_skills=match_res["missing_skills"],
            explanation=match_res["explanation"]
        )
        db.add(jm)
        db.commit()

    return {
        "job_id": job_id,
        "job_title": job_title,
        "company": company,
        "overall_score": match_res["overall_score"],
        "semantic_similarity": match_res["semantic_similarity"],
        "skill_coverage": match_res["skill_coverage"],
        "experience_alignment": match_res["experience_alignment"],
        "matched_skills": match_res["matched_skills"],
        "missing_skills": match_res["missing_skills"],
        "explanation": match_res["explanation"]
    }
