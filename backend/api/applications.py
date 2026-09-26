from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database.session import get_db
from backend.models.models import User, Application
from backend.schemas.schemas import ApplicationCreate, ApplicationOut
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/api/applications", tags=["Applications"])

@router.get("", response_model=List[ApplicationOut])
def get_user_applications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Application).filter(Application.user_id == current_user.id).order_by(Application.applied_date.desc()).all()

@router.post("", response_model=ApplicationOut)
def create_application(
    app_in: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app_obj = Application(
        user_id=current_user.id,
        company=app_in.company,
        role=app_in.role,
        status=app_in.status,
        notes=app_in.notes,
        job_url=app_in.job_url,
        next_action=app_in.next_action
    )
    db.add(app_obj)
    db.commit()
    db.refresh(app_obj)
    return app_obj

@router.put("/{id}", response_model=ApplicationOut)
def update_application_status(
    id: int,
    app_in: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app_obj = db.query(Application).filter(Application.id == id, Application.user_id == current_user.id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")

    app_obj.company = app_in.company
    app_obj.role = app_in.role
    app_obj.status = app_in.status
    app_obj.notes = app_in.notes
    app_obj.job_url = app_in.job_url
    app_obj.next_action = app_in.next_action

    db.commit()
    db.refresh(app_obj)
    return app_obj

@router.delete("/{id}")
def delete_application(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_obj = db.query(Application).filter(Application.id == id, Application.user_id == current_user.id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")
    
    db.delete(app_obj)
    db.commit()
    return {"message": "Application deleted successfully"}
