from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.database.session import get_db
from backend.models.models import User, Resume, ResumeSkill, UserProfile
from backend.schemas.schemas import ResumeOut, ResumeImprovementRequest
from backend.services.auth_service import get_current_user
from backend.services.resume_parser import extract_text_from_file, parse_resume_structure, analyze_resume_ats_quality

router = APIRouter(prefix="/api/resumes", tags=["Resumes"])

ALLOWED_EXTENSIONS = {"pdf", "docx", "doc", "txt"}
MAX_FILE_SIZE = 10 * 1024 * 1024 # 10MB limit

@router.post("/upload", response_model=ResumeOut)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '.{ext}'. Upload PDF, DOCX, or TXT."
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds maximum 10MB limit.")

    parsed_text = extract_text_from_file(content, file.filename)
    structured_data = parse_resume_structure(parsed_text)
    ats_res = analyze_resume_ats_quality(structured_data, parsed_text)

    # Create Resume DB Object
    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        parsed_text=parsed_text,
        structured_data=structured_data,
        ats_score=ats_res["ats_score"],
        ats_breakdown=ats_res["ats_breakdown"],
        improvement_suggestions=ats_res["improvement_suggestions"]
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    # Sync skills to UserProfile if extracted
    extracted_skills = structured_data.get("skills", [])
    if extracted_skills:
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        if profile:
            # Merge unique skills
            merged = list(set(profile.skills + extracted_skills))
            profile.skills = merged
            db.commit()

        for s in extracted_skills:
            rs = ResumeSkill(resume_id=resume.id, skill_name=s, proficiency=0.8)
            db.add(rs)
        db.commit()

    return resume

@router.get("", response_model=List[ResumeOut])
def get_user_resumes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).all()

@router.get("/{id}", response_model=ResumeOut)
def get_resume_by_id(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.post("/improve")
def improve_resume_section(
    req: ResumeImprovementRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    skills = profile.skills if profile else ["Python", "FastAPI"]

    if req.section == "summary":
        improved_text = (
            f"Results-oriented {req.target_role} specializing in {', '.join(skills[:3])}. "
            f"Demonstrated ability to design RESTful microservices, optimize data pipelines, and deploy AI models into production environments."
        )
    elif req.section == "bullet":
        improved_text = (
            f"Engineered an async data extraction pipeline using Python and FastAPI, reducing API latency by 28% and handling 10,000+ daily requests."
        )
    else:
        improved_text = f"Key skills to highlight for {req.target_role}: {', '.join(skills[:5])}."

    return {
        "target_role": req.target_role,
        "section": req.section,
        "original_suggestion": "Your descriptions describe technologies but do not quantify outcomes.",
        "improved_text": improved_text,
        "action_verbs_used": ["Engineered", "Optimized", "Deployed", "Reduced"]
    }
