from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database.session import get_db
from backend.models.models import User, UserProfile, CareerRoadmap, RoadmapItem
from backend.schemas.schemas import RoadmapOut, RoadmapItemUpdate
from backend.services.auth_service import get_current_user
from backend.services.roadmap_service import generate_personalized_roadmap

router = APIRouter(prefix="/api/roadmap", tags=["Roadmap"])

@router.post("/generate", response_model=RoadmapOut)
def generate_roadmap(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    target_role = profile.target_role if profile and profile.target_role else "AI Engineer"
    u_skills = profile.skills if profile and profile.skills else ["Python", "Machine Learning"]

    gen_data = generate_personalized_roadmap(target_role, u_skills)

    # Save to DB
    roadmap = CareerRoadmap(
        user_id=current_user.id,
        target_role=target_role,
        title=gen_data["title"],
        duration_months=gen_data["duration_months"]
    )
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)

    for item in gen_data["items"]:
        r_item = RoadmapItem(
            roadmap_id=roadmap.id,
            month=item["month"],
            skill=item["skill"],
            why_it_matters=item["why_it_matters"],
            category=item["category"],
            project_idea=item["project_idea"],
            practice_task=item["practice_task"],
            status=item["status"]
        )
        db.add(r_item)
    db.commit()
    db.refresh(roadmap)

    return get_roadmap_by_id(roadmap.id, current_user, db)

@router.get("", response_model=RoadmapOut)
def get_user_latest_roadmap(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    roadmap = db.query(CareerRoadmap).filter(CareerRoadmap.user_id == current_user.id).order_by(CareerRoadmap.created_at.desc()).first()
    if not roadmap:
        # Generate automatically if none exists
        return generate_roadmap(current_user, db)
    return get_roadmap_by_id(roadmap.id, current_user, db)

@router.get("/{id}", response_model=RoadmapOut)
def get_roadmap_by_id(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    roadmap = db.query(CareerRoadmap).filter(CareerRoadmap.id == id, CareerRoadmap.user_id == current_user.id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    items_out = []
    for item in sorted(roadmap.items, key=lambda x: x.month):
        items_out.append({
            "id": item.id,
            "month": item.month,
            "skill": item.skill,
            "category": item.category,
            "why_it_matters": item.why_it_matters,
            "project_idea": item.project_idea,
            "practice_task": item.practice_task,
            "status": item.status
        })

    return {
        "id": roadmap.id,
        "target_role": roadmap.target_role,
        "title": roadmap.title,
        "duration_months": roadmap.duration_months,
        "items": items_out
    }

@router.put("/item/{item_id}")
def update_roadmap_item_status(
    item_id: int,
    req: RoadmapItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(RoadmapItem).filter(RoadmapItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Roadmap item not found")

    item.status = req.status
    db.commit()
    return {"message": "Status updated successfully", "status": item.status}
