from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db, get_current_user
from app.models.core import User, Watchlist, StartupProfile
from pydantic import BaseModel
import datetime

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])

class WatchlistAdd(BaseModel):
    startup_id: int

from typing import Optional
from app.models.core import Pitch

class WatchlistResponse(BaseModel):
    id: int
    startup_id: int
    startup_name: str
    industry: Optional[str] = None
    stage: Optional[str] = None
    added_at: datetime.datetime
    pitch_id: Optional[int] = None

@router.get("/", response_model=List[WatchlistResponse])
def get_watchlist(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(Watchlist).filter(Watchlist.user_id == current_user.id).all()
    
    results = []
    for item in items:
        # Fetch startup details
        startup = db.query(StartupProfile).filter(StartupProfile.id == item.startup_id).first()
        if startup:
            # Find associated pitch (prefer active)
            pitch = db.query(Pitch).filter(Pitch.startup_id == startup.id, Pitch.status == 'active').first()
            if not pitch:
                pitch = db.query(Pitch).filter(Pitch.startup_id == startup.id).order_by(Pitch.created_at.desc()).first()

            results.append({
                "id": item.id,
                "startup_id": item.startup_id,
                "startup_name": startup.company_name,
                "industry": startup.industry,
                "stage": startup.funding_stage,
                "added_at": item.created_at,
                "pitch_id": pitch.id if pitch else None
            })
    return results

@router.post("/add")
def add_to_watchlist(data: WatchlistAdd, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if exists
    existing = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.startup_id == data.startup_id
    ).first()
    
    if existing:
        return {"message": "Already in watchlist"}
        
    item = Watchlist(user_id=current_user.id, startup_id=data.startup_id)
    db.add(item)
    db.commit()
    return {"message": "Added to watchlist"}

@router.delete("/remove/{startup_id}")
def remove_from_watchlist(startup_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.startup_id == startup_id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    db.delete(item)
    db.commit()
    return {"message": "Removed from watchlist"}
