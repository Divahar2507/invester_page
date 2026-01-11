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
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db), 
    current_user: Optional[User] = Depends(get_current_user_optional) # To be defined or just remove logic
):
    query = db.query(Pitch).join(StartupProfile)
    # .filter(Pitch.status != "draft") # Show all for dev purposes as requested
    
    if industry and industry != "All":
        # Case insensitive partial match or exact match depending on requirement
        query = query.filter(func.lower(StartupProfile.industry) == industry.lower())
        
    if stage and stage != "All":
        query = query.filter(StartupProfile.funding_stage == stage)
        
    results = query.offset(skip).limit(limit).all()
    
    # Enrich response
    response_list = []
    
    # Pre-fetch connections if user is logged in
    connections_map = {}
    if current_user:
        from app.models.core import Connection
        from sqlalchemy import or_, and_
        
        # Get all connections for this user
        # This is optimization: fetch all connections where current_user is involved
        # Then map by other_user_id
        
        # Actually, simpler to just query generic connection
        # Since we are iterating pitches, we want connection status with pitch.startup.user_id
        
        # Batch query would be best but let's do loop for simplicity first, or better:
        # Fetch all connections involving current_user
        my_connections = db.query(Connection).filter(
            or_(Connection.requester_id == current_user.id, Connection.receiver_id == current_user.id)
        ).all()
        
        for c in my_connections:
            other_id = c.receiver_id if c.requester_id == current_user.id else c.requester_id
            # Determine status. 
            # If rejected, it's 'rejected'. 
            # If accepted, 'accepted'.
            # If pending:
            #  - checks if I sent it ("request_sent") or received it ("request_received")?
            #  - For simple status string: 'pending' is enough, frontend handles button state.
            # But wait, frontend needs to know if "Request Sent" (disabled) or "Accept" (action).
            # The UI shows "Request Sent" if pending. So 'pending' is fine.
            # If I am receiver and it is pending, I should see "Accept".
            # Let's just return 'pending'.
            connections_map[other_id] = c.status

    for pitch in results:
        resp = PitchResponse.model_validate(pitch)
        resp.company_name = pitch.startup.company_name
        resp.industry = pitch.startup.industry
        resp.stage = pitch.startup.funding_stage
        resp.startup_user_id = pitch.startup.user_id
        
        # Set connection status
        if current_user:
            if pitch.startup.user_id == current_user.id:
                resp.connection_status = "self"
            else:
                resp.connection_status = connections_map.get(pitch.startup.user_id, "not_connected")
        else:
            resp.connection_status = "not_connected"

        # Mock match score for now, real implementation would compare with investor preferences
        import random
        resp.match_score = random.randint(60, 99) 
        response_list.append(resp)
        
    return response_list

@router.post("/{pitch_id}/decision")
def record_decision(
    pitch_id: int,
    decision: str = Body(..., embed=True), # Invest, Decline, Archive
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
        
        # Also create an investment record implicitly for tracking?
        # Let's check if we have investor profile
        if current_user.investor_profile:
            # Check if already exists to avoid dupes?
            # Assuming not for now.
            
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
        
    db.commit()
    return {"message": f"Decision {decision} recorded", "status": pitch.status}
