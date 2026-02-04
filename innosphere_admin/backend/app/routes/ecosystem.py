from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.business_logic import ResearchProject, Mentor, Seminar, TechPark
from typing import List

router = APIRouter()

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    # In a real app, these would be dynamic counts
    return [
        {"label": "Active R&D Projects", "value": db.query(ResearchProject).count(), "change": "+12%", "trend": "up", "icon": "FlaskConical", "color": "text-blue-600 bg-blue-50"},
        {"label": "Mentors Online", "value": db.query(Mentor).count(), "change": "+5%", "trend": "up", "icon": "Users", "color": "text-purple-600 bg-purple-50"},
        {"label": "Total Startups", "value": 312, "change": "-2%", "trend": "down", "icon": "TrendingUp", "color": "text-orange-600 bg-orange-50"},
        {"label": "Patents Pending", "value": 45, "change": "+8%", "trend": "up", "icon": "FileText", "color": "text-emerald-600 bg-emerald-50"},
    ]

@router.get("/research")
def get_research(db: Session = Depends(get_db)):
    return db.query(ResearchProject).all()

@router.get("/mentors")
def get_mentors(db: Session = Depends(get_db)):
    return db.query(Mentor).all()

@router.get("/seminars")
def get_seminars(db: Session = Depends(get_db)):
    return db.query(Seminar).all()

@router.get("/techparks")
def get_techparks(db: Session = Depends(get_db)):
    return db.query(TechPark).all()
