from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.models.models import User, UserProfile, Feedback
from backend.schemas.schemas import FeedbackCreate
from backend.services.auth_service import get_current_user
from backend.services.recommendation_engine import recommend_projects

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.get("/projects")
def get_project_recommendations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    target_role = profile.target_role if profile and profile.target_role else "AI Engineer"
    u_skills = profile.skills if profile and profile.skills else ["Python", "Machine Learning"]

    projs = recommend_projects(target_role, u_skills)
    return {
        "target_role": target_role,
        "recommendations": projs
    }

@router.post("/feedback")
def submit_feedback(
    fb: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    feedback_obj = Feedback(
        user_id=current_user.id,
        item_type=fb.item_type,
        item_id=fb.item_id,
        is_positive=fb.is_positive,
        comment=fb.comment
    )
    db.add(feedback_obj)
    db.commit()
    return {"message": "Thank you for your feedback! This will improve future recommendation rankings."}
