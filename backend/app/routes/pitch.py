from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Body
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.dependencies import get_db, get_current_user, get_current_user_optional
from app.models.core import User, StartupProfile, Pitch, Investment
from app.schemas import PitchCreate, PitchResponse
import shutil
import os
import uuid
import datetime

router = APIRouter(prefix="/pitches", tags=["Pitch"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_pitch_deck(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    if current_user.role != "startup":
        raise HTTPException(status_code=403, detail="Only startups can upload pitch decks")
    
    allowed_types = [
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only PDF, PPT, and Word files are allowed")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": file_path}

@router.post("/", response_model=PitchResponse)
def create_pitch(
    pitch: PitchCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "startup":
        raise HTTPException(status_code=403, detail="Only startups can create pitches")
    
    if not current_user.startup_profile:
        raise HTTPException(status_code=400, detail="Please create a startup profile first")
    
    new_pitch = Pitch(
        **pitch.model_dump(),
        startup_id=current_user.startup_profile.id,
        status="active"
    )
    db.add(new_pitch)
    db.commit()
    db.refresh(new_pitch)
    return new_pitch

@router.get("/my", response_model=list[PitchResponse])
def get_my_pitches(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "startup":
        raise HTTPException(status_code=403, detail="Only startups can access this")
    
    if not current_user.startup_profile:
        return []
        
    return db.query(Pitch).filter(Pitch.startup_id == current_user.startup_profile.id).all()

from typing import Optional

@router.get("/feed", response_model=list[PitchResponse])
def get_pitch_feed(
    industry: str = None,
    stage: str = None,
    query: str = None,  # Search query
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db), 
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query_db = db.query(Pitch).join(StartupProfile)
    
    # 1. Search Logic
    if query:
        search_term = f"%{query}%"
        query_db = query_db.filter(
            or_(
                func.lower(StartupProfile.company_name).like(func.lower(search_term)),
                func.lower(Pitch.title).like(func.lower(search_term)),
                func.lower(Pitch.description).like(func.lower(search_term)),
                func.lower(StartupProfile.industry).like(func.lower(search_term)),
                func.lower(Pitch.tags).like(func.lower(search_term))
            )
        )

    # 2. Filters
    if industry and industry != "All":
        query_db = query_db.filter(func.lower(StartupProfile.industry) == industry.lower())
        
    if stage and stage != "All":
        query_db = query_db.filter(StartupProfile.funding_stage == stage)
        
    results = query_db.offset(skip).limit(limit).all()
    
    # Enrich response
    response_list = []
    
    # Pre-fetch connections if user is logged in
    connections_map = {}
    if current_user:
        from app.models.core import Connection
        
        # Batch query for connections
        my_connections = db.query(Connection).filter(
            or_(Connection.requester_id == current_user.id, Connection.receiver_id == current_user.id)
        ).all()
        
        for c in my_connections:
            other_id = c.receiver_id if c.requester_id == current_user.id else c.requester_id
            connections_map[other_id] = c.status

    for pitch in results:
        # Use simple mapping or model_validate
        # Construct response manually to ensure all fields are populated correctly logic
        resp = PitchResponse(
            id=pitch.id,
            startup_id=pitch.startup_id,
            title=pitch.title,
            description=pitch.description,
            pitch_file_url=pitch.pitch_file_url,
            status=pitch.status,
            raising_amount=pitch.raising_amount,
            equity_percentage=pitch.equity_percentage,
            created_at=pitch.created_at,
            company_name=pitch.startup.company_name,
            industry=pitch.startup.industry,
            logo=pitch.startup.user.email[0].upper() if pitch.startup.user and pitch.startup.user.email else "S",
            stage=pitch.startup.funding_stage,
            startup_user_id=pitch.startup.user_id,
            match_score=0 # Calculated below
        )
        
        # Set connection status
        if current_user:
            if pitch.startup.user_id == current_user.id:
                resp.connection_status = "self"
            else:
                resp.connection_status = connections_map.get(pitch.startup.user_id, "not_connected")
        else:
            resp.connection_status = "not_connected"

        # Mock match score for now
        import random
        resp.match_score = random.randint(75, 99) 
        response_list.append(resp)
        
    return response_list

@router.post("/{pitch_id}/decision")
def record_decision(
    pitch_id: int,
    decision: str = Body(..., embed=True), # Invest, Decline, In Review
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "investor":
         raise HTTPException(status_code=403, detail="Only investors can record decisions")

    pitch = db.query(Pitch).filter(Pitch.id == pitch_id).first()
    if not pitch:
         raise HTTPException(status_code=404, detail="Pitch not found")

    if decision == "Invest":
        pitch.status = "funded"
        
        # Create Investment Record
        if current_user.investor_profile:
            raw_amount = pitch.raising_amount or "0"
            clean_amount = raw_amount.replace('$', '').replace(',', '').strip()
            amount_val = 0.0
            try:
                if 'M' in clean_amount:
                    amount_val = float(clean_amount.replace('M', '')) * 1_000_000
                elif 'k' in clean_amount.lower():
                    amount_val = float(clean_amount.lower().replace('k', '')) * 1_000
                else:
                    amount_val = float(clean_amount)
            except ValueError:
                amount_val = 0.0

            investment = Investment(
                investor_id=current_user.investor_profile.id,
                startup_name=pitch.startup.company_name,
                amount=amount_val,
                date=datetime.datetime.now(),
                round=pitch.startup.funding_stage,
                notes=f"Invested in {pitch.title}",
                status="Active"
            )
            db.add(investment)
            
    elif decision == "Decline":
        pitch.status = "declined"
        
    elif decision == "In Review" or decision == "Review":
        pitch.status = "under_review"
        # Logic to 'backup' or save state could be adding to a specific list
        # But 'under_review' status on pitch is good state persistence.
        
    db.commit()
    return {"message": f"Decision {decision} recorded", "status": pitch.status}
