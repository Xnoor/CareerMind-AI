from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.models.models import User, UserProfile, UserPreference
from backend.schemas.schemas import UserProfileUpdate, UserProfileOut
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("", response_model=UserProfileOut)
def get_user_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("", response_model=UserProfileOut)
def update_user_profile(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)

    update_data = profile_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        if val is not None:
            setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return profile
