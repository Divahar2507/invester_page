from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Body
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.dependencies import get_db, get_current_user, get_current_user_optional
from app.models.core import User, StartupProfile, Pitch, Investment, PitchComment
from app.schemas import PitchCreate, PitchResponse, PitchCommentCreate, PitchCommentResponse
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

@router.get("/my", response_model=List[PitchResponse])
def get_my_pitches(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "startup":
        raise HTTPException(status_code=403, detail="Only startups can access this")
    
    if not current_user.startup_profile:
        return []
        
    return db.query(Pitch).filter(Pitch.startup_id == current_user.startup_profile.id).all()

@router.get("/feed", response_model=List[PitchResponse])
def get_pitch_feed(
    industry: str = None,
    stage: str = None,
    query: str = None,  # Search query
    skip: int = 0,
    limit: int = 50,
    status: str = None, # Filter by status
    sort_by: str = "newest", # newest, funding_high, funding_low
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

    if status:
        query_db = query_db.filter(Pitch.status == status)
        
    # 3. Sorting
    if sort_by == "funding_high":
        query_db = query_db.order_by(Pitch.amount_seeking.desc())
    elif sort_by == "funding_low":
        query_db = query_db.order_by(Pitch.amount_seeking.asc())
    else:
        query_db = query_db.order_by(Pitch.created_at.desc())

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
            match_score=0, # Calculated below
            location=pitch.location,
            tags=pitch.tags,
            valuation=pitch.valuation
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

    return response_list

@router.get("/{pitch_id}", response_model=PitchResponse)
def get_pitch(pitch_id: int, db: Session = Depends(get_db)):
    pitch = db.query(Pitch).filter(Pitch.id == pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")
    
    # Simple enrichment for response model (simplified compared to feed)
    resp = PitchResponse.model_validate(pitch)
    resp.company_name = pitch.startup.company_name
    resp.industry = pitch.startup.industry
    resp.stage = pitch.startup.funding_stage
    resp.startup_user_id = pitch.startup.user_id
    return resp

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

@router.post("/{pitch_id}/comments", response_model=PitchCommentResponse)
def post_comment(
    pitch_id: int,
    comment_data: PitchCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pitch = db.query(Pitch).filter(Pitch.id == pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")

    new_comment = PitchComment(
        pitch_id=pitch_id,
        user_id=current_user.id,
        comment=comment_data.comment,
        rating=comment_data.rating
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    # Enrich response
    resp = PitchCommentResponse.model_validate(new_comment)
    resp.user_name = current_user.email.split('@')[0] # Simple name fallback
    resp.user_role = current_user.role
    return resp

@router.get("/{pitch_id}/comments", response_model=List[PitchCommentResponse])
def get_comments(
    pitch_id: int,
    db: Session = Depends(get_db)
):
    comments = db.query(PitchComment).filter(PitchComment.pitch_id == pitch_id).order_by(PitchComment.created_at.desc()).all()
    
    response = []
    for c in comments:
        # Get user details
        user = db.query(User).filter(User.id == c.user_id).first()
        res = PitchCommentResponse.model_validate(c)
        if user:
            res.user_name = user.email.split('@')[0]
            res.user_role = user.role
        response.append(res)
        
    return response

@router.get("/{pitch_id}/data-room")
def get_data_room(pitch_id: int, db: Session = Depends(get_db)):
    pitch = db.query(Pitch).filter(Pitch.id == pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")

    docs = []
    if pitch.pitch_deck_url:
        docs.append({"type": "Pitch Deck", "filename": os.path.basename(pitch.pitch_deck_url), "download_url": pitch.pitch_deck_url})
    if pitch.financial_doc_url:
        docs.append({"type": "Financial Doc", "filename": os.path.basename(pitch.financial_doc_url), "download_url": pitch.financial_doc_url})
    if pitch.business_plan_url:
        docs.append({"type": "Business Plan", "filename": os.path.basename(pitch.business_plan_url), "download_url": pitch.business_plan_url})
    
    # Also include pitch_file_url if it exists and isn't one of the above
    if pitch.pitch_file_url and pitch.pitch_file_url not in [pitch.pitch_deck_url, pitch.financial_doc_url, pitch.business_plan_url]:
        docs.append({"type": "Other Document", "filename": os.path.basename(pitch.pitch_file_url), "download_url": pitch.pitch_file_url})

    return {"documents": docs}

@router.post("/{pitch_id}/upload-pitch-deck")
async def upload_specialized_deck(pitch_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pitch = db.query(Pitch).filter(Pitch.id == pitch_id).first()
    if not pitch: raise HTTPException(status_code=404, detail="Pitch not found")
    
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"pitch_{pitch_id}_{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    pitch.pitch_deck_url = file_path
    pitch.pitch_file_url = file_path # Sync legacy
    db.commit()
    return {"url": file_path}

@router.post("/{pitch_id}/upload-financial-doc")
async def upload_financial(pitch_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pitch = db.query(Pitch).filter(Pitch.id == pitch_id).first()
    if not pitch: raise HTTPException(status_code=404, detail="Pitch not found")
    
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"fin_{pitch_id}_{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    pitch.financial_doc_url = file_path
    db.commit()
    return {"url": file_path}

@router.post("/{pitch_id}/upload-business-plan")
async def upload_biz_plan(pitch_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pitch = db.query(Pitch).filter(Pitch.id == pitch_id).first()
    if not pitch: raise HTTPException(status_code=404, detail="Pitch not found")
    
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"plan_{pitch_id}_{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    pitch.business_plan_url = file_path
    db.commit()
    return {"url": file_path}

from typing import List
