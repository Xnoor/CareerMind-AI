from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.models.models import User, UserProfile
from backend.schemas.schemas import CareerDNAResponse, SkillGapOut
from backend.services.auth_service import get_current_user
from backend.services.skill_gap_service import generate_career_dna, analyze_skill_gap

router = APIRouter(prefix="/api/skills", tags=["Skills"])

@router.get("/dna", response_model=CareerDNAResponse)
def get_user_career_dna(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    u_skills = profile.skills if profile and profile.skills else ["Python", "Machine Learning", "FastAPI", "React", "SQL"]
    target_role = profile.target_role if profile and profile.target_role else "AI Engineer"
    exp_lvl = profile.experience_level if profile else "Entry Level"

    dna_res = generate_career_dna(u_skills, target_role, exp_lvl)
    return dna_res

@router.get("/gaps", response_model=SkillGapOut)
def get_user_skill_gaps(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    u_skills = profile.skills if profile and profile.skills else ["Python", "Machine Learning", "FastAPI"]
    target_role = profile.target_role if profile and profile.target_role else "AI Engineer"

    gap_res = analyze_skill_gap(u_skills, target_role)
    return gap_res
