from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.models.core import User, StartupProfile, InvestorProfile, Pitch
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["Admin"])

class AdminStatsResponse(BaseModel):
    total_users: int
    total_startups: int
    total_investors: int
    total_pitches: int
    total_connections: int

class UserAdminResponse(BaseModel):
    id: int
    email: str
    role: str
    created_at: datetime
    is_active: bool = True # Mock field for now

    class Config:
        from_attributes = True

def get_current_admin(current_user: User = Depends(get_current_user)):
    # Simple check: In a real app, you'd have a 'role'='admin' or similar
    # For now, let's hardcode a specific email or just allow any authenticated user for DEMO purposes if we want
    # But strictly, let's say only a specific email is admin
    if current_user.email != "admin@ventureflow.com": 
         # Make one user admin for testing: investor@test.com
         if current_user.email != "investor@test.com":
            raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/stats", response_model=AdminStatsResponse)
def get_platform_stats(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    from app.models.core import Connection
    
    return {
        "total_users": db.query(User).count(),
        "total_startups": db.query(StartupProfile).count(),
        "total_investors": db.query(InvestorProfile).count(),
        "total_pitches": db.query(Pitch).count(),
        "total_connections": db.query(Connection).count()
    }

@router.get("/users", response_model=List[UserAdminResponse])
def get_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return db.query(User).offset(skip).limit(limit).all()

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Cascade delete is handled by DB relationship usually, or need manual cleanup
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}
