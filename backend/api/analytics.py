from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.models.models import User, Resume, JobDescription, Interview, Application, CareerRoadmap
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("")
def get_platform_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    resumes_analyzed = db.query(Resume).count()
    jobs_analyzed = db.query(JobDescription).count()
    interviews_completed = db.query(Interview).filter(Interview.status == "Completed").count()
    
    user_apps = db.query(Application).filter(Application.user_id == current_user.id).all()
    app_stats = {
        "applied": sum(1 for a in user_apps if a.status == "Applied"),
        "interviews": sum(1 for a in user_apps if a.status == "Interview"),
        "offers": sum(1 for a in user_apps if a.status == "Offer"),
        "total": len(user_apps)
    }

    return {
        "admin_stats": {
            "total_users": total_users,
            "resumes_analyzed": resumes_analyzed,
            "jobs_analyzed": jobs_analyzed,
            "interviews_completed": interviews_completed,
            "popular_target_roles": ["AI Engineer", "ML Engineer", "Data Scientist", "Python Developer"],
            "common_skill_gaps": ["PyTorch", "MLOps", "Docker", "RAG Architecture", "System Design"]
        },
        "user_stats": {
            "applications": app_stats,
            "resume_versions": db.query(Resume).filter(Resume.user_id == current_user.id).count(),
            "interviews_taken": db.query(Interview).filter(Interview.user_id == current_user.id).count()
        }
    }
