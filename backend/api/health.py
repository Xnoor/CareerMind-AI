from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.database.session import get_db

router = APIRouter(prefix="/api/health", tags=["Health"])

@router.get("")
def check_health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy",
        "service": "CareerMind AI Backend API",
        "database": db_status,
        "version": "1.0.0"
    }

