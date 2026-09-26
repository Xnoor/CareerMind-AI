from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.models.models import User, UserProfile
from backend.schemas.schemas import ChatRequest, ChatResponse
from backend.services.auth_service import get_current_user
from backend.services.llm_service import llm_service

router = APIRouter(prefix="/api/assistant", tags=["Assistant"])

@router.post("/chat", response_model=ChatResponse)
def chat_with_assistant(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    u_prof = {
        "target_role": profile.target_role if profile else "AI Engineer",
        "skills": profile.skills if profile else ["Python", "Machine Learning"]
    }

    res = llm_service.chat_career_assistant(req.message, u_prof)
    return res
