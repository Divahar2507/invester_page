from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.business_logic import Pitch
from typing import List, Any

router = APIRouter()

@router.get("/", response_model=List[Any])
def list_pitches(db: Session = Depends(get_db)):
    pitches = db.query(Pitch).all()
    return pitches

@router.post("/")
def create_pitch(pitch_data: dict, db: Session = Depends(get_db)):
    new_pitch = Pitch(**pitch_data)
    db.add(new_pitch)
    db.commit()
    db.refresh(new_pitch)
    return new_pitch

@router.get("/{pitch_id}")
def get_pitch(pitch_id: int, db: Session = Depends(get_db)):
    pitch = db.query(Pitch).filter(Pitch.id == pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")
    return pitch
